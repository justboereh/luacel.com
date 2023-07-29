import type { App } from '#types/app'
import type { DataResult } from '#types/insights'
import { QueryMetrics, QueryLogs } from '#utils/cloudwatch'

type QueryResponse = {
    arn: string
    name: string
    region: string
    appid: string
    funcid: string
}

// prettier-ignore
const GetFunctionQuery = 'select functions.arn, functions.name, functions.id as funcid, apps.region, apps.id as appid from apps, functions where apps.id = ? and apps.author = ? and functions.app = apps.id'

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) return BadRequest(event)

    const id = getRouterParam(event, 'appid')
    if (!id) return BadRequest(event)

    const { rows } = await db.execute(GetFunctionQuery, [id, user.id])

    const result: DataResult[] = []

    for (const app of rows as QueryResponse[]) {
        const fnname = `${app.appid}--${app.name}`

        const responses = await Promise.all([
            QueryMetrics({
                ...app,
                query: `SELECT COUNT(Invocations) FROM SCHEMA("AWS/Lambda", FunctionName) WHERE FunctionName = '${fnname}'`,
            }),
            QueryLogs({
                ...app,
                query: 'filter @type = "REPORT"\n| fields @timestamp as timestamp, @maxMemoryUsed/1000000 as memory',
            }),
            QueryMetrics({
                ...app,
                query: `SELECT SUM(Duration) FROM SCHEMA("AWS/Lambda", FunctionName) WHERE FunctionName = '${fnname}'`,
            }),
            QueryMetrics({
                ...app,
                query: `SELECT COUNT(Errors) FROM SCHEMA("AWS/Lambda", FunctionName) WHERE FunctionName = '${fnname}'`,
            }),
        ])

        result.push({
            name: app.name,
            invocations: responses[0],
            memory: responses[1],
            duration: responses[2],
            errors: responses[3],
        })
    }

    return result
})
