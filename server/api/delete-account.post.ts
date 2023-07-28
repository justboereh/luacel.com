import { serverSupabaseUser, serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) return BadRequest(event)

    const client = serverSupabaseServiceRole(event)

    const res = await client.auth.admin.deleteUser(user.id)

    console.log(res)

    return 'Ok'
})
