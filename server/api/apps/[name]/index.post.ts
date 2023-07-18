import type { App, AppFunction } from '#types/app'
import { serverSupabaseUser } from '#supabase/server'

// prettier-ignore
const GetAppQuery = 'select * from apps where `author` = ? and `name` = ?'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) return BadRequest(event)

    const name = event.context.params?.name
    if (!name) return BadRequest(event)

    const { rows } = await db.execute(GetAppQuery, [user.id, name])

    if (rows.length < 1) return BadRequest(event)

    return rows[0]
})
