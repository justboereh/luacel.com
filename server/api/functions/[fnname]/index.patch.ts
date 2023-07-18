import JSZip from 'jszip'
import type { App } from '#types/app'
import { serverSupabaseUser } from '#supabase/server'

// const res = await CreateFunction({ name, code, region, memory, timeout })

type Body = {
    code: number[]
    app: string
}

const GetAppQuery = 'select * from apps where `author` = ? and `id` = ?'
const GetFunctionsQuery =
    'select * from functions where `app` = ? and `name` = ?'
// prettier-ignore
const InsertFunctionQuery = 'insert into functions (`name`, `arn`, `app`, `path`) values (?, ?, ?, ?)'
// prettier-ignore
const InsertEventQuery = 'insert into events (app, text, date) values (?, ?, ?)'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) return BadRequest(event)

    const fnname = getRouterParam(event, 'fnname')
    const body = await readBody<Body>(event)

    //prettier-ignore
    if (!fnname || !body.code || !body.app) return BadRequest(event, 'Invalid data')

    const { rows: apps } = await db.execute(GetAppQuery, [user.id, body.app])
    if (apps.length < 1) return BadRequest(event, 'Invalid App')

    const { rows: functions } = await db.execute(GetFunctionsQuery, [
        body.app,
        fnname,
    ])
    if (functions.length > 0) return BadRequest(event, 'Name exists')

    const app = apps[0] as App

    const res = await CreateFunction({
        name: `${app.id}--${fnname}`,
        code: Uint8Array.from(body.code),
        region: app.region,
        memory: app.memory,
        timeout: app.timeout,
    })

    await AddPermission({
        arn: res.FunctionArn as string,
        region: app.region,
    })

    const fnURL = await CreateFunctionUrl({
        arn: res.FunctionArn as string,
        region: app.region,
    })

    await db.execute(InsertFunctionQuery, [
        fnname,
        res.FunctionArn,
        body.app,
        fnURL.FunctionUrl,
    ])

    await db.execute(InsertEventQuery, [
        app.id,
        `Added function, ${fnname}`,
        Date.now(),
    ])

    return 'Ok'
})
