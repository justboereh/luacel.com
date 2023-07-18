import {
    CloudWatchClient,
    GetMetricDataCommand,
} from '@aws-sdk/client-cloudwatch'
import dayjs from 'dayjs'

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

export function QueryMetrics(args: QueryMetricsArgs) {
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

    return client.send(command)
}
