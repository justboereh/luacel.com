export type QueryLogsResult = Array<{ field: string; value: string }>

export type DataResult = {
    name: string
    invocations: Record<string, any>
    memory: QueryLogsResult[]
    duration: Record<string, any>
    errors: Record<string, any>
}
