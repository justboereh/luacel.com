export type DataProps = {
    timestamps: Date[]
    values: number[]
}

export type DataResult = {
    name: string
    invocations: DataProps | null
    duration: DataProps | null
    avgduration: DataProps | null
    errors: DataProps | null
}
