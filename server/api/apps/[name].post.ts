import { db } from '#utils/database'
import type { App, AppFunction } from '#types/app'
import { auth } from '#utils/firebase'
import { BadRequest } from '#utils/responses'

// prettier-ignore
const GetAppQuery = 'select * from apps where author = ? and name = ?'

export default defineEventHandler(async (event) => {
    const token = getHeader(event, 'token')
    if (!token) return BadRequest(event)

    const name = event.context.params?.name
    if (!name) return BadRequest(event)

    try {
        const { uid } = await auth.verifyIdToken(token, true)

        const { rows } = await db.execute(GetAppQuery, [uid, name])

        if (rows.length < 1) return BadRequest(event)

        return rows[0]
    } catch (error) {
        return BadRequest(event)
    }
})
