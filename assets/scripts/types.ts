export type App = {
    id: string // id of this app
    name: string // name of this app set by author
    author: string // author of this app
    domain_custom: boolean // to use author or generated domain
    domain_generate: string // domain generated
    domain_set: string // domain set by author
    timeout: number // timeout for every function in seconds
    memory: number // amount of ram every function will have
}
