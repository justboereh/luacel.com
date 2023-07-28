import { Rules } from '#rules/user'
import { getUser } from '#utils/account'
import { nanoid } from 'nanoid'

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
        const unValidtor = Rules.username[0].validator
        const pwValidtor = Rules.password[0].validator

        if (!unValidtor || !pwValidtor) return BadRequest(event)

        await unValidtor({}, username, () => {})
        await unValidtor({}, password, () => {})
    } catch (error) {
        return BadRequest(event)
    }

    const { rows } = await db.execute(UsernameExistsQuery, [username])
    if (rows.length > 0) return BadRequest(event)

    await db.execute(InsertUserQuery, [
        nanoid(),
        username,
        encodeJWT(password),
        new Date().toUTCString(),
    ])

    return 'Ok'
})
