export type User = {
    username: string
    id: string
    created: Date
}

export type DatabaseUser = {
    username: string
    password: string
    id: string
    created: Date
}

export type Session = {
    expire: Date
    id: string
    userid: string
}
