import { AddPermission, CreateFunction, CreateFunctionUrl } from '#utils/lambda'
import { BadRequest } from '#utils/responses'
import type { App } from '#types/app'
import { db } from '#utils/database'
import { serverSupabaseUser } from '#supabase/server'

// const res = await CreateFunction({ name, code, region, memory, timeout })

type Body = {
    code: number[]
    name: string
    app: string
}

const GetAppQuery = 'select * from apps where `author` = ? and `id` = ?'
const GetFunctionsQuery = 'select * from functions where `app` = ? and `name` = ?'
// prettier-ignore
const InsertFunctionQuery = 'insert into functions (`name`, `arn`, `app`, `path`) values (?, ?, ?, ?)'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) return BadRequest(event)

    const body = await readBody<Body>(event)
    if (!body.code) return BadRequest(event, 'Invalid data')
    if (!body.name) return BadRequest(event, 'Invalid data')
    if (!body.app) return BadRequest(event, 'Invalid data')

    const { rows: apps } = await db.execute(GetAppQuery, [user.id, body.app])
    if (apps.length < 1) return BadRequest(event, 'Invalid App')

    const { rows: functions } = await db.execute(GetFunctionsQuery, [
        body.app,
        body.name,
    ])
    if (functions.length > 0) return BadRequest(event, 'Name exists')

    const app = apps[0] as App

    console.log(app)

    const res = await CreateFunction({
        name: `${app.id}-${body.name}`,
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
        body.name,
        res.FunctionArn,
        body.app,
        fnURL.FunctionUrl,
    ])

    return 'Ok'
})
