//import { createAvatar } from '@dicebear/core'
//import { shapes } from '@dicebear/collection'

import type { AppEvent, App, AppFunction } from '#types/app'
import { serverSupabaseUser } from '#supabase/server'

type Result = {
    id: string
    name: string
    event: { text: string }
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
            id,
            name,
            event: (events[0] as { text: string }) || { text: 'no events yet' },
            functions: functions.length,
        }
    }

    return result
})

// import { createFunction } from '#utils/lambda'
// const res = await createFunction({ name, code, region, memory, timeout })
