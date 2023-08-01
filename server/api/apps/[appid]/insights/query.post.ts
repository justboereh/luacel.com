import type { QueryResponse } from '#types/insights'
import {
    CloudWatchLogsClient,
    StartQueryCommand,
} from '@aws-sdk/client-cloudwatch-logs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

type DBQueryResponse = {
    name: string
    region: string
    id: string
}

// prettier-ignore
const GetFunctionQuery = 'select functions.name, functions.id, apps.region from apps, functions where apps.id = ? and apps.author = ? and functions.app = apps.id'

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) return BadRequest(event)

    const appid = getRouterParam(event, 'appid')
    if (!appid) return BadRequest(event)

    const { rows } = await db.execute(GetFunctionQuery, [appid, user.id])

    const result: QueryResponse[] = []

    for (const { id, name, region } of rows as DBQueryResponse[]) {
        const client = new CloudWatchLogsClient({
            region: region,
        })

        const logName = `/aws/lambda/${id}`

        const { queryId } = await client.send(
            new StartQueryCommand({
                logGroupName: logName,
                queryString: `filter @type = "REPORT" | fields @timestamp as timestamp, @maxMemoryUsed/1000000 as memory, @duration as duration  | sort @timestamp asc`,
                startTime: Math.floor(
                    dayjs.utc().subtract(3, 'hour').valueOf() / 1000
                ),
                endTime: Math.floor(Date.now() / 1000),
            })
        )

        if (!queryId) continue

        result.push({
            name,
            queryId,
            logName,
        })
    }

    return result
})
