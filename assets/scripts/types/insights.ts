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

export type QueryResponse = {
    name: string
    queryId: string
    logName: string
}

export type ResultsInvocation = {
    [k: string]: string
    timestamp: string
    duration: string
    memory: string
}

export type ResultsResponse = {
    name: string
    queryId?: string
    logName?: string
    invocations?: ResultsInvocation[]
}
