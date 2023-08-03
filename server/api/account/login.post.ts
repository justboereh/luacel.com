import { Rules } from '#rules/user'
import { DatabaseUser, Session } from '#types/auth'
import { getUser } from '#utils/account'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import { sha256 } from 'ohash'

type Body = {
    username: string
    password: string
}
const UserPasswordQuery = 'select password, id from users where username = ?'
const InsertSessionQuery =
    'insert into sessions(id, expire, userid) values(?, ?, ?,)'

export default defineEventHandler(async (event) => {
    const user = await getUser(event)

    if (!!user) return BadRequest(event)

    const { username, password } = await readBody<Body>(event)
    if (!username || !password) return BadRequest(event)

    try {
        const body: Record<string, string> = { username, password }

        for (const key of ['username', 'password']) {
            for (const { validator } of Rules[key]) {
                if (!validator) continue

                await validator({}, body[key], () => {})
            }
        }
    } catch (error) {
        return BadRequest(event)
    }

    const { rows } = await db.execute(UserPasswordQuery, [username])
    const dbUser = rows[0] as DatabaseUser

    console.log(dbUser)

    if (!dbUser) return BadRequest(event)

    const hashed = sha256(password)
    if (dbUser.password.length !== hashed.length) return BadRequest(event)

    const session: Session = {
        id: nanoid(),
        expire: dayjs().add(7, 'days').toDate(),
        userid: dbUser.id,
    }

    setCookie(event, 'luacel-access', encodeJWT(session), {
        expires: session.expire,
    })

    return 'Ok'
})
