declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_KEY: string
            DATABASE_URL: string
        }
    }
}

export {}
