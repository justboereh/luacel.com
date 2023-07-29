const DeleteUserQuery = 'delete from users where id = ?'

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) return BadRequest(event)

    deleteCookie(event, 'luacel-access')

    const { rows: apps } = await GetAppsFromDB({ userid: user.id })

    for (const app of apps) {
        await event.$fetch(`/api/apps/${app.id}`, { method: 'POST' })
    }

    await db.execute(DeleteUserQuery, [user.id])

    return 'Ok'
})
