import jwt from 'jsonwebtoken'

export function decodeJWT<T = any>(token: string, extraKey?: string) {
    return jwt.verify(token, `${extraKey || ''}${process.env.JWT_KEY}`) as T
}

export function encodeJWT(token: string | object, extraKey?: string) {
    return jwt.sign(token, `${extraKey || ''}${process.env.JWT_KEY}`)
}
