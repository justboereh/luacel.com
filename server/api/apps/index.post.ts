//import { createAvatar } from '@dicebear/core'
//import { shapes } from '@dicebear/collection'

import type { AppEvent, App, AppFunction } from '#types/app'
import { db } from '#utils/database'
import { BadRequest } from '#utils/responses'
import { serverSupabaseUser } from '#supabase/server'

type Result = {
    img?: string
    name: string
    event: any
    functions: any
}

const GetAppsQuery = 'select * from apps where `author` = ?'
// prettier-ignore
const GetEventsQuery = 'select text from events where `app` = ? order by date asc limit 1'
const GetFunctionsQuery = 'select * from functions where `app` = ?'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) return BadRequest(event)

    const { rows: apps } = await db.execute(GetAppsQuery, [user.id])

    const result: Result[] = []

    for (let i = 0; i < apps.length; i++) {
        const { id, name } = apps[i] as App
        // const img = await createAvatar(shapes, {
        //     radius: 0,
        //     seed: id,
        // }).toDataUri()

        const { rows: events } = await db.execute(GetEventsQuery, [id])

        const { rows: functions } = await db.execute(GetFunctionsQuery, [id])

        result[i] = {
            name,
            //img,
            event: events[0] || 'no events yet',
            functions: functions.length,
        }
    }

    return result
})

// import { createFunction } from '#utils/lambda'
// const res = await createFunction({ name, code, region, memory, timeout })
