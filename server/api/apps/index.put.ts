import { rword } from 'rword'
import { nanoid } from 'nanoid'

import { db } from '#utils/database'
import { App } from '#types/app'
import { auth } from '#utils/firebase'
import { BadRequest, Forbidden } from '#utils/responses'

type Body = {
    name: string
    subdomain?: string
    customSubdomain: boolean
    region: string
    memory: number
    timeout: number
}

const GetAppsQuery = 'select * from apps where author = ? and name = ?'
// prettier-ignore
const GetAppSameDomain = 'select * from apps where domain_generated = ? and domain_set = ?'
// prettier-ignore
const InsertApp = 'insert into apps (memory, timeout, name, domain_custom, domain_generated, domain_set, region, author, id) values (?, ?, ?, ?, ?, ?, ?, ?, ?)'

export default defineEventHandler(async (event) => {
    const token = getHeader(event, 'token')
    if (!token) return Forbidden(event, 'Forbidden')

    const body = await readBody<Body>(event)
    if (!body.name) return BadRequest(event, 'Invalid request')
    if (!body.region) return BadRequest(event, 'Invalid request')

    try {
        const { uid, email_verified } = await auth.verifyIdToken(token, true)

        if (!email_verified) return BadRequest(event, 'Unverified email')

        const { rows: apps } = await db.execute(GetAppsQuery, [uid, name])

        if (apps.length > 0)
            return BadRequest(event, 'App exists or invalid user')

        const data = {
            memory: 128,
            timeout: 1,
            name: body.name,
            domain_custom: false,
            domain_generated: '',
            domain_set: '',
            region: body.region,
            author: uid,
            id: nanoid(),
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
    } catch (error) {
        return BadRequest(event, 'Unknown Error')
    }
})
