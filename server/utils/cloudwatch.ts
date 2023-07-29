import {
    CloudWatchClient,
    GetMetricDataCommand,
} from '@aws-sdk/client-cloudwatch'
import {
    CloudWatchLogsClient,
    StartQueryCommand,
    StopQueryCommand,
    GetQueryResultsCommand,
} from '@aws-sdk/client-cloudwatch-logs'
import dayjs from 'dayjs'
import { QueryLogsResult } from '#types/insights'

export type MetricsArgs = {
    region: string
    name: string
    id: string
}

export function GetFunctionInvocations(args: MetricsArgs) {
    const client = new CloudWatchClient({
        region: args.region,
    })

    const fnname = `${args.id}--${args.name}`
    const Expression = `SELECT COUNT(Invocations) FROM SCHEMA("AWS/Lambda", FunctionName) WHERE FunctionName = '${fnname}'`

    const command = new GetMetricDataCommand({
        MetricDataQueries: [
            {
                Id: 'count',
                Label: fnname,
                Period: 60,
                Expression,
            },
        ],
        StartTime: dayjs().subtract(3, 'hours').toDate(),
        EndTime: new Date(),
    })

    return client.send(command)
}

export function GetFunctionDuration(args: MetricsArgs) {
    const client = new CloudWatchClient({
        region: args.region,
    })

    const fnname = `${args.id}--${args.name}`

    const command = new GetMetricDataCommand({
        MetricDataQueries: [
            {
                Id: 'total',
                Label: fnname,
                Expression: `SELECT SUM(Duration) FROM SCHEMA("AWS/Lambda", FunctionName) WHERE FunctionName = '${fnname}'`,
                Period: 60,
            },
        ],
        StartTime: dayjs().subtract(3, 'hours').toDate(),
        EndTime: new Date(),
    })

    return client.send(command)
}

export function GetFunctionAverageDuration(args: MetricsArgs) {
    const client = new CloudWatchClient({
        region: args.region,
    })

    const fnname = `${args.id}--${args.name}`

    const command = new GetMetricDataCommand({
        MetricDataQueries: [
            {
                Id: 'average',
                Label: fnname,
                Expression: `SELECT AVG(Duration) FROM SCHEMA("AWS/Lambda", FunctionName) WHERE FunctionName = '${fnname}'`,
                Period: 60,
            },
        ],
        StartTime: dayjs().subtract(3, 'hours').toDate(),
        EndTime: new Date(),
    })

    return client.send(command)
}

export type QueryMetricsArgs = {
    region: string
    query: string
}

export async function QueryMetrics(args: QueryMetricsArgs) {
    const client = new CloudWatchClient({
        region: args.region,
    })

    const command = new GetMetricDataCommand({
        MetricDataQueries: [
            {
                Id: 'query',
                Expression: args.query,
                Period: 60,
            },
        ],
        StartTime: dayjs().subtract(3, 'hours').toDate(),
        EndTime: new Date(),
    })

    const response = await client.send(command)
    const result: Record<string, any> = {}

    if (!response.MetricDataResults) return result
    const DataResult = response.MetricDataResults[0]

    if (!DataResult) return result
    if (!DataResult.Timestamps || !DataResult.Values) return result

    for (let index = 0; index < DataResult.Timestamps.length; index++) {
        const timestamp = DataResult.Timestamps[index].toUTCString()
        const value = DataResult.Values[index]

        result[timestamp] = value
    }

    return result
}

export type QueryLogsArgs = {
    region: string
    query: string
    funcid: string
}

export async function QueryLogs(args: QueryLogsArgs) {
    const client = new CloudWatchLogsClient({
        region: args.region,
    })

    const startResponse = await client.send(
        new StartQueryCommand({
            logGroupNames: [`/aws/lambda/${args.funcid}`],
            queryString: args.query,
            startTime: Math.floor(
                dayjs().subtract(3, 'hours').valueOf() / 1000
            ),
            endTime: Math.floor(Date.now() / 1000),
        })
    )

    if (!startResponse.queryId) return []

    const getResponse = await client.send(
        new GetQueryResultsCommand({
            queryId: startResponse.queryId,
        })
    )

    console.log({
        logGroupNames: [`/aws/lambda/${args.funcid}`],
        queryString: args.query,
        startTime: Math.floor(dayjs().subtract(3, 'hours').valueOf() / 1000),
        endTime: Math.floor(Date.now() / 1000),
    })

    await client.send(
        new StopQueryCommand({
            queryId: startResponse.queryId,
        })
    )

    return (getResponse.results || []) as QueryLogsResult[]
}
