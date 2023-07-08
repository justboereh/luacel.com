import type { App } from 'firebase-admin/app'
import type { Auth } from 'firebase-admin/auth'
import type { NodeIncomingMessage } from 'h3'

declare module 'h3' {
    interface CompatibilityEvent extends NodeIncomingMessage, H3Event {
        context: {
            [key: string]: any
            app: App
            auth: Auth
            BadRequest: (msg?: string) => string
            Unauthorized: (msg?: string) => string
            Forbidden: (msg?: string) => string
            NotFound: (msg?: string) => string
            Deta: typeof Deta
            Apps: typeof Apps
            Function: typeof Functions
        }
    }
}
