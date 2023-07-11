import type { AppFunction, App } from '#types/app'
import { db } from '#utils/database'
import { BadRequest } from '#utils/responses'
import { GetFunction } from '#utils/lambda'
import { serverSupabaseUser } from '#supabase/server'

import JSZip from 'jszip'

type Row = {
    arn: string
    region: string
}
// prettier-ignore
const GetFunctionQuery = 'select functions.arn, apps.region from apps, functions where apps.id = ? and apps.author = ? and functions.name = ?'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) return BadRequest(event)

    const body = await readBody<{ id: string; name: string }>(event)
    const fnname = getRouterParam(event, 'fnname')

    if (!fnname) return BadRequest(event)
    if (!body.id) return BadRequest(event)

    const { rows } = await db.execute(GetFunctionQuery, [
        body.id,
        user.id,
        fnname,
    ])

    if (rows.length < 1) return BadRequest(event)

    const { region, arn: name } = rows[0] as Row

    const fn_data = await GetFunction({
        region,
        name,
    })

    const res = await $fetch<Blob>(fn_data.Code?.Location as string)
    const arr = new Uint8Array(await res.arrayBuffer())
    const data = []

    for (let index = 0; index < arr.length; index++) {
        data.push(arr.at(index))
    }

    return data
})