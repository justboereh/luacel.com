import { Rules } from '#rules/user'
import { getUser } from '#utils/account'

type Body = {
    username: string
}

const UsernameExistsQuery = 'select username from users where username = ?'

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!!user) return BadRequest(event)

    const { username } = await readBody<Body>(event)
    if (!username) return BadRequest(event)

    try {
        const unValidtor = Rules.username[0].validator

        if (!unValidtor) return BadRequest(event)

        await unValidtor({}, username, () => {})
    } catch (error) {
        return BadRequest(event)
    }

    const { rows } = await db.execute(UsernameExistsQuery, [username])
    if (rows.length > 0) return BadRequest(event)

    return 'Ok'
})
