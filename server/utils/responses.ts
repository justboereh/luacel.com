import { H3Event } from 'h3'

export function BadRequest(event: H3Event, msg?: string) {
    setResponseStatus(event, 400)

    return msg || 'Bad request'
}

export function Unauthorized(event: H3Event, msg?: string) {
    setResponseStatus(event, 401)

    return msg || 'Unauthorized'
}

export function Forbidden(event: H3Event, msg?: string) {
    setResponseStatus(event, 403)

    return msg || 'Forbidden'
}

export function NotFound(event: H3Event, msg?: string) {
    setResponseStatus(event, 404)

    return msg || 'Not Found'
}
