import { AddPermission, CreateFunction, CreateFunctionUrl } from '#utils/lambda'
import { BadRequest } from '#utils/responses'
import type { AppFunction, App } from '#types/app'

// const res = await CreateFunction({ name, code, region, memory, timeout })

type Body = {
    code: number[]
    name: string
    app: string
}

export default defineEventHandler(async (event) => {
    const token = getHeader(event, 'token')
    if (!token) return BadRequest(event)

    const body = await readBody<Body>(event)
    if (!body.code) return BadRequest(event, 'Invalid data')
    if (!body.name) return BadRequest(event, 'Invalid data')
    if (!body.app) return BadRequest(event, 'Invalid data')

    try {
        const { uid } = await auth.verifyIdToken(token, true)

        let Apps = await Knex<App>('apps')
            .select('*')
            .where('author', uid)
            .where('id', body.app)
            .then()

        if (!Apps[0]) return BadRequest(event, 'Invalid App')

        let Functions = await Knex<AppFunction>('functions')
            .select('*')
            .where('app', body.app)
            .where('name', body.name)
            .then()

        if (Functions[0]) return BadRequest(event, 'Name exists')

        const res = await CreateFunction({
            name: `${Apps[0].id}-${body.name}`,
            code: Uint8Array.from(body.code),
            region: Apps[0].region,
            memory: Apps[0].memory,
            timeout: Apps[0].timeout,
        })

        await AddPermission({
            arn: res.FunctionArn as string,
            region: Apps[0].region,
        })

        const fnURL = await CreateFunctionUrl({
            arn: res.FunctionArn as string,
            region: Apps[0].region,
        })

        await Knex<AppFunction>('functions').insert({
            name: body.name,
            arn: res.FunctionArn,
            app: body.app,
            path: fnURL.FunctionUrl,
        })

        return 'Ok'
    } catch (error) {
        return BadRequest(event)
    }
})
