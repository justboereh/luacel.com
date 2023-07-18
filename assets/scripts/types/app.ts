export type App = {
    id: string // id of this app
    name: string // name of this app set by author
    author: string // author of this app
    region: string //
    domain_custom: boolean // to use author or generated domain
    domain_generated: string // domain generated
    domain_set: string // domain set by author
    timeout: number // timeout for every function in seconds
    memory: number // amount of ram every function will have
    created: number
}

export type AppEvent = {
    app: string // app id
    text: string // text of event
    date: number // epoch time in ms
}

export type AppFunction = {
    name: string // function name
    app: string // app id
    arn: string // arn of app
    path: string // lambda path
    created: number
}
