import { nanoid } from 'nanoid'
import type { App } from '#types/app'

type Body = {
    code: number[]
    name: string
}

const GetAppQuery = 'select * from apps where `author` = ? and `id` = ?'
// prettier-ignore
const GetFunctionsQuery = 'select * from functions where `app` = ? and `name` = ?'
// prettier-ignore
const InsertFunctionQuery = 'insert into functions (`name`, `arn`, `app`, `path`, `created`, `updated`, `id`) values (?, ?, ?, ?, ?, ?, ?)'
// prettier-ignore
const InsertEventQuery = 'insert into events (app, text, date) values (?, ?, ?)'

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) return BadRequest(event)

    const id = getRouterParam(event, 'appid')
    const body = await readBody<Body>(event)
    //prettier-ignore
    if (!body.name || !body.code || !id) return BadRequest(event, 'Invalid data')

    const { rows: apps } = await db.execute(GetAppQuery, [user.id, id])
    if (apps.length < 1) return BadRequest(event, 'Invalid App')

    const { rows: functions } = await db.execute(GetFunctionsQuery, [
        id,
        body.name,
    ])
    if (functions.length > 0) return BadRequest(event, 'Name exists')

    const app = apps[0] as App
    const funcid = nanoid()

    const res = await CreateFunction({
        name: funcid,
        code: Uint8Array.from(body.code),
        region: app.region,
        memory: Number(app.memory),
        timeout: Number(app.timeout),
    })

    await AddPermission({
        arn: res.FunctionArn as string,
        region: app.region,
    })

    let fnURL = await CreateFunctionUrl({
        arn: res.FunctionArn as string,
        region: app.region,
    })

    await db.execute(InsertFunctionQuery, [
        body.name,
        res.FunctionArn,
        id,
        fnURL ? fnURL.FunctionUrl : '',
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000),
        funcid,
    ])

    await db.execute(InsertEventQuery, [
        app.id,
        `added function, ${body.name}`,
        Math.floor(Date.now()),
    ])

    return 'Ok'
})
