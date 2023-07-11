import type { AppFunction, App } from '#types/app'
import { serverSupabaseUser } from '#supabase/server'

type Rows = Array<{
    name: string
    domain_custom: string
    domain_set: string
    domain_generated: string
}>

// prettier-ignore
const GetFunctionQuery = 'select functions.name, apps.domain_set, apps.domain_generated, apps.domain_custom, functions.arn, apps.region from apps, functions where apps.id = ? and apps.author = ? and functions.app = ?'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) return BadRequest(event)

    const body = await readBody<{ id: string }>(event)

    if (!body.id) return BadRequest(event)

    const { rows } = await db.execute(GetFunctionQuery, [
        body.id,
        user.id,
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
})
