import { Auth } from 'firebase/auth'
import { FirebaseApp } from 'firebase/app'

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_KEY: string
            AWS_ROLE_ARN: string
            AWS_LAYER_ARN: string

            DATABASE_DATABASE: string
            DATABASE_USERNAME: string
            DATABASE_HOST: string
            DATABASE_PASSWORD: string

            DATABASE_URL: string
        }
    }
}

declare module '#app' {
    interface NuxtApp {
        $app: FirebaseApp
        $auth: Auth
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $app: FirebaseApp
        $auth: Auth
    }
}

export {}
