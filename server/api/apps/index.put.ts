import { rword } from 'rword'
import { v4 } from 'uuid'

import { App } from '#types/app'
import { serverSupabaseUser } from '#supabase/server'

type Body = {
    name: string
    subdomain?: string
    customSubdomain: boolean
    region: string
    memory: number
    timeout: number
}

const GetAppsQuery = 'select * from apps where `author` = ? and `name` = ?'
// prettier-ignore
const GetAppSameDomain = 'select * from apps where `domain_generated` = ? and `domain_set` = ?'
// prettier-ignore
const InsertApp = 'insert into apps (`memory`, `timeout`, `name`, `domain_custom`, `domain_generated`, `domain_set`, `region`, `author`, `id`, `created`) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) return BadRequest(event)

    const body = await readBody<Body>(event)
    if (!body.name) return BadRequest(event, 'Invalid request')
    if (!body.region) return BadRequest(event, 'Invalid request')

    if (!user.email_confirmed_at) return BadRequest(event, 'Unverified email')

    const { rows: apps } = await db.execute(GetAppsQuery, [user.id, body.name])

    if (apps.length > 0) return BadRequest(event, 'App exists or invalid user')

    const data = {
        memory: 128,
        timeout: 1,
        name: body.name,
        domain_custom: false,
        domain_generated: '',
        domain_set: '',
        region: body.region,
        author: user.id,
        id: v4(),
        created: Math.floor(Date.now()),
    }

    while (true) {
        data.domain_generated = rword.generate(2).join('-')

        const { rows } = await db.execute(GetAppSameDomain, [
            data.domain_generated,
            data.domain_generated,
        ])

        if (rows.length < 1) break
    }

    await db.execute(InsertApp, Object.values(data))

    return 'Ok'
})
