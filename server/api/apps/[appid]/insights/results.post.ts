import type { App } from '#types/app'
import type {
    ResultsResponse,
    QueryResponse,
    ResultsInvocation,
} from '#types/insights'
import {
    CloudWatchLogsClient,
    StopQueryCommand,
    GetQueryResultsCommand,
    DescribeQueriesCommand,
} from '@aws-sdk/client-cloudwatch-logs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

// prettier-ignore
const GetFunctionQuery = 'select apps.region from apps, functions where apps.id = ? and apps.author = ? and functions.app = apps.id'

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) return BadRequest(event)

    const appid = getRouterParam(event, 'appid')
    const { name, logName, queryId } = await readBody<QueryResponse>(event)
    if (!appid || !name || !queryId || !logName) return BadRequest(event)

    const { rows } = await db.execute(GetFunctionQuery, [appid, user.id])
    const app = rows[0] as App

    if (!app) return BadRequest(event)

    const client = new CloudWatchLogsClient({
        region: app.region,
    })

    const { queries } = await client.send(
        new DescribeQueriesCommand({
            logGroupName: logName,
            status: 'Complete',
        })
    )

    const requestBody = { name, logName, queryId }

    if (!queries) return requestBody

    for (const query of queries) {
        if (query.queryId !== queryId) continue

        const response: ResultsResponse & { invocations: ResultsInvocation[] } =
            {
                name,
                invocations: [],
            }

        const results = await client.send(
            new GetQueryResultsCommand({
                queryId,
            })
        )

        for (const result of results.results || []) {
            const invocation: ResultsInvocation = {
                timestamp: '',
                memory: 0,
                duration: 0,
            }

            for (const { field, value } of result) {
                if (!field || !value) continue

                invocation[field] = value
            }

            if (Object.keys(invocation).length < 1) continue

            response.invocations.push(invocation)
        }

        return response
    }

    return requestBody
})
