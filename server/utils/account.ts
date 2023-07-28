import { H3Event } from 'h3'
import { decodeJWT } from '#utils/jwt'
import { Session, DatabaseUser } from '#types/auth'

const GetUserQuery = 'select * from users where id = ?'

export const getUser = async (event: H3Event) => {
    const access = getCookie(event, 'luacel-access')
    if (!access) return null

    try {
        const session = decodeJWT<Session>(access)
        const expire = new Date(session.expire).valueOf()
        
        if (expire < Date.now()) {
            deleteCookie(event, 'luacel-access')

            return null
        }

        const { rows } = await db.execute(GetUserQuery, [session.userid])
        if (rows.length < 1) return null

        return rows[0] as DatabaseUser
    } catch (error) {
        return null
    }
}
