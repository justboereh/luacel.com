import type { App } from '#types/app'

// prettier-ignore
const GetAppQuery = 'select * from apps where `author` = ? and `id` = ?'

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) return BadRequest(event)

    const appid = getRouterParam(event, 'appid')
    if (!appid) return BadRequest(event)

    const { rows } = await db.execute(GetAppQuery, [user.id, appid])

    if (rows.length < 1) return BadRequest(event)

    return rows[0] as App
})
