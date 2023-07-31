export type QueryLogsResult = Array<{ field: string; value: string }>

export type QueryMetricsResult = {
    timestamp: string
    value: number
}

export type DataResult = {
    name: string
    invocations: QueryMetricsResult[]
    memory: QueryLogsResult[]
    duration: QueryMetricsResult[]
    errors: QueryMetricsResult[]
}
