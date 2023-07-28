import { User } from '#types/auth'
import { getUser } from '#utils/account'

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) return BadRequest(event)

    return {
        username: user.username,
        id: user.id,
        created: new Date(user.created),
    } as User
})
