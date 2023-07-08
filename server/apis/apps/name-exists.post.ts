import { NameExists } from '../../utils/database'
import { auth } from '../../utils/firebase'
import { BadRequest } from '../../utils/responses'

type Body = {
    name: string
}

export default defineEventHandler(async (event) => {
    const token = getHeader(event, 'token')
    if (!token) return BadRequest(event)

    const body = await readBody<Body>(event)
    if (!body.name) return BadRequest(event)

    try {
        const { uid } = await auth.verifyIdToken(token, true)

        return await Knex('apps')
            .select('name', 'id')
            .where('author', uid)
            .where('author', body.name)
    } catch (error) {
        return BadRequest(event)
    }
})
