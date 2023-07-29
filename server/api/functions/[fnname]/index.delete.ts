import { DeleteFunctionFromDB, GetAppsFromDB } from '#utils/database'

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) return BadRequest(event)

    const body = await readBody<{ id: string }>(event)
    const fnname = getRouterParam(event, 'fnname')

    if (!fnname) return BadRequest(event)
    if (!body.id) return BadRequest(event)

    await DeleteFunctionFromDB({ appid: body.id, userid: user.id, fnname })
    const { rows } = await GetAppsFromDB({ userid: user.id })

    if (rows.length < 1) return BadRequest(event)

    await DeleteFunction({
        region: rows[0].region,
        name: `${body.id}--${fnname}`,
    })

    return 'Ok'
})
