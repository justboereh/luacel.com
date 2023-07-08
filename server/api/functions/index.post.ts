import type { AppFunction, App } from '#types/app'
import { db } from '#utils/database'
import { auth } from '#utils/firebase'
import { BadRequest } from '#utils/responses'
import { GetFunction } from '#utils/lambda'

type Rows = Array<{
    name: string
    domain_custom: string
    domain_set: string
    domain_generated: string
}>

// prettier-ignore
const GetFunctionQuery = 'select functions.name, apps.domain_set, apps.domain_generated, apps.domain_custom from apps, functions where apps.id = ? and apps.author = ? and functions.app = ?'

export default defineEventHandler(async (event) => {
    const token = getHeader(event, 'token')
    if (!token) return BadRequest(event)

    const body = await readBody<{ id: string }>(event)
    if (!body.id) return BadRequest(event)

    try {
        const { uid } = await auth.verifyIdToken(token, true)

        const { rows } = await db.execute(GetFunctionQuery, [
            body.id,
            uid,
            body.id,
        ])

        return (rows as Rows).map(
            ({ name, domain_custom, domain_set, domain_generated }) => {
                const domain = domain_custom ? domain_set : domain_generated

                return {
                    name,
                    path: `https://${domain}.luacel.app/${name}`,
                }
            }
        )
    } catch (error) {
        console.log(error)

        return BadRequest(event)
    }
})
