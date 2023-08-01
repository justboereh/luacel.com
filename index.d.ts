declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_KEY: string
            AWS_ROLE_ARN: string
            AWS_LAYER_ARN: string
            AWS_ACCOUNT_ID: string

            DATABASE_URL: string
            CLERK_PK: string
        }
    }
}

export {}
