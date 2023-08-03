import { Rules } from '#rules/user'
import { getUser } from '#utils/account'
import { nanoid } from 'nanoid'
import { sha256 } from 'ohash'

type Body = {
    username: string
    password: string
}
const UsernameExistsQuery = 'select username from users where username = ?'
const InsertUserQuery =
    'insert into users(id, username, password, created) values(?, ?, ?, ?)'

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

    const { rows } = await db.execute(UsernameExistsQuery, [username])
    if (rows.length > 0) return BadRequest(event)

    await db.execute(InsertUserQuery, [
        nanoid(),
        username,
        sha256(password),
        new Date().toUTCString(),
    ])

    return 'Ok'
})
