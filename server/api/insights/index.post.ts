import type { App } from '#types/app'
import type { DataResult } from '#types/insights'
import { QueryMetrics } from '#utils/cloudwatch'

type Body = {
    id: string
}

type QueryResponse = {
    arn: string
    name: string
    region: string
    id: string
}

// prettier-ignore
const GetFunctionQuery = 'select functions.arn, functions.name, apps.region, apps.id from apps, functions where apps.id = ? and apps.author = ? and functions.app = apps.id'
const GetInvocationsQuery = ``

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) return BadRequest(event)

    const { id } = await readBody<Body>(event)
    if (!id) return BadRequest(event)

    const { rows } = await db.execute(GetFunctionQuery, [id, user.id])

    const result: DataResult[] = []

    for (const app of rows as QueryResponse[]) {
        const fnname = `${app.id}--${app.name}`

        const InvocationsQuery = `SELECT COUNT(Invocations) FROM SCHEMA("AWS/Lambda", FunctionName) WHERE FunctionName = '${fnname}'`
        const DurationQuery = `SELECT SUM(Duration) FROM SCHEMA("AWS/Lambda", FunctionName) WHERE FunctionName = '${fnname}'`
        const AverageDurationQuery = `SELECT AVG(Duration) FROM SCHEMA("AWS/Lambda", FunctionName) WHERE FunctionName = '${fnname}'`
        const ErrorsQuery = `SELECT COUNT(Errors) FROM SCHEMA("AWS/Lambda", FunctionName) WHERE FunctionName = '${fnname}'`

        const responses = await Promise.all([
            QueryMetrics({ ...app, query: InvocationsQuery }),
            QueryMetrics({ ...app, query: DurationQuery }),
            QueryMetrics({ ...app, query: AverageDurationQuery }),
            QueryMetrics({ ...app, query: ErrorsQuery }),
        ])

        const invocations = (responses[0].MetricDataResults || [])[0]
        const duration = (responses[1].MetricDataResults || [])[0]
        const avgduration = (responses[2].MetricDataResults || [])[0]
        const errors = (responses[3].MetricDataResults || [])[0]

        result.push({
            name: app.name,
            invocations: {
                timestamps: invocations.Timestamps?.reverse() || [],
                values: invocations.Values?.reverse() || [],
            },
            duration: {
                timestamps: duration.Timestamps?.reverse() || [],
                values: duration.Values?.reverse() || [],
            },
            avgduration: {
                timestamps: avgduration.Timestamps?.reverse() || [],
                values: avgduration.Values?.reverse() || [],
            },
            errors: {
                timestamps: errors.Timestamps?.reverse() || [],
                values: errors.Values?.reverse() || [],
            },
        })
    }

    return result
})
