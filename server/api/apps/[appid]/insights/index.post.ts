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

    for (const func of rows as QueryResponse[]) {
        const responses = await Promise.all([
            QueryMetrics({
                ...func,
                query: `SELECT COUNT(Invocations) FROM SCHEMA("AWS/Lambda", FunctionName) WHERE FunctionName = '${func.funcid}'`,
            }),
            QueryLogs({
                ...func,
                query: 'filter @type = "REPORT"\n| fields @timestamp as timestamp, @maxMemoryUsed/1000000 as memory',
            }),
            QueryMetrics({
                ...func,
                query: `SELECT AVG(Duration) FROM SCHEMA("AWS/Lambda", FunctionName) WHERE FunctionName = '${func.funcid}'`,
            }),
            QueryMetrics({
                ...func,
                query: `SELECT COUNT(Errors) FROM SCHEMA("AWS/Lambda", FunctionName) WHERE FunctionName = '${func.funcid}'`,
            }),
        ])


        result.push({
            name: func.name,
            invocations: responses[0],
            memory: responses[1],
            duration: responses[2],
            errors: responses[3],
        })
    }

    return result
})
