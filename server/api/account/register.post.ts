import { Rules } from '#rules/user'
import { serverSupabaseServiceRole } from '#supabase/server'

type Body = {
    email: string
    password: string
    name: string
}

export default defineEventHandler(async (event) => {
    const auth = serverSupabaseServiceRole(event).auth
    const body = await readBody<Body>(event)

    if (!body.email) return BadRequest(event)
    if (!body.password) return BadRequest(event)
    if (!body.name) return BadRequest(event)

    try {
        if (!Rules.email[0].validator) return BadRequest(event)
        await Rules.email[0]?.validator({}, body.email, () => {})

        if (!Rules.password[0].validator) return BadRequest(event)
        await Rules.password[0]?.validator({}, body.password, () => {})

        if (!Rules.name[0].validator) return BadRequest(event)
        await Rules.name[0]?.validator({}, body.name, () => {})
    } catch (error) {
        return BadRequest(event)
    }

    const { error } = await auth.admin.createUser({
        email: body.email,
        email_confirm: true,
        password: body.password,
        user_metadata: {
            name: body.name,
        },
    })

    if (error) return BadRequest(event)

    return 'Ok'
})
