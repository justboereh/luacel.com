import jwt from 'jsonwebtoken'

export function decodeJWT<T = any>(token: string) {
    return jwt.verify(token, process.env.JWT_KEY) as T
}

export function encodeJWT(token: any) {
    return jwt.sign(token, process.env.JWT_KEY)
}
