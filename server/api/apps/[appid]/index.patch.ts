import type { App } from '#types/app'

// prettier-ignore
const GetAppQuery = 'select * from apps where `author` = ? and `id` = ?'
// prettier-ignore
const UpdateAppQuery = 'update apps set name = ? and domain_custom = ? and domain_set = ? and timeout = ? and memory = ? where author = ? and id = ?'

type Body = {
    name: string
    domain_custom: boolean
    domain_set: string
    timeout: string
    memory: string
}

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) return BadRequest(event)

    const appid = getRouterParam(event, 'appid')
    const body = await readBody<Body>(event)
    if (!appid) return BadRequest(event)

    const { rows } = await db.execute(GetAppQuery, [user.id, appid])
    const app = rows[0] as App

    if (!app) return BadRequest(event)

    console.log(body)

    await db.execute(UpdateAppQuery, [
        body.name || app.name,
        !!body.domain_set || app.domain_custom,
        body.domain_set || app.domain_set,
        Number(body.timeout) || Number(app.timeout),
        Number(body.memory) || Number(app.memory),
        user.id,
        appid,
    ])

    return 'Ok'
})
