import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) return BadRequest(event)

    const client = serverSupabaseClient(event)

    await client.auth.admin.deleteUser(user.id)

    return 'Ok'
})
