const DeleteUserQuery = 'delete from users where id = ?'
const DeleteAppQuery = 'delete from apps where author = ? and id = ?'

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) return BadRequest(event)

    deleteCookie(event, 'luacel-access')

    const { rows: apps } = await GetAppsFromDB({ userid: user.id })

    for (const app of apps) {
        const { rows: functions } = await GetFunctionsFromDB({
            appid: app.id,
            userid: user.id,
        })

        for (const func of functions) {
            DeleteFunction({ name: func.arn, region: app.region })
            DeleteFunctionFromDB({
                appid: app.id,
                fnname: func.name,
                userid: user.id,
            })
        }

        db.execute(DeleteAppQuery, [user.id, app.id])
    }

    db.execute(DeleteUserQuery, [user.id])

    return 'Ok'
})
