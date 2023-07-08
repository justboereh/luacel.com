import { createFunction } from '../../utils/lambda'
import { DB } from '../../utils/database'
import { auth } from '../../utils/firebase'
import { BadRequest } from '../../utils/responses'

const query = 'SELECT `id`, `name`, `img` FROM apps WHERE name = ? AND  '

export default defineEventHandler(async (event) => {
    const token = getHeader(event, 'token')
    if (!token) return BadRequest(event)

    try {
        const { uid } = await auth.verifyIdToken(token, true)

        return await DB
    } catch (error) {
        return BadRequest(event)
    }
})

// const res = await createFunction({ name, code, region, memory, timeout })
