import { Rules } from '#rules/user'

type Body = {
    username: string
}

const UpdateUserQuery = 'update users set username = ? where id = ?'

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) return BadRequest(event)

    const { username } = await readBody<Body>(event)
    if (!username) return BadRequest(event)

    try {
        for (const { validator } of Rules.username) {
            if (!validator) continue

            await validator({}, username, () => {})
        }
    } catch (error) {
        return BadRequest(event)
    }

    await db.execute(UpdateUserQuery, [username, user.id])

    return 'Ok'
})
