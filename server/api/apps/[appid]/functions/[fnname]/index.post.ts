import type { AppFunction, App } from '#types/app'
import JSZip from 'jszip'

type Row = {
    arn: string
    region: string
}
// prettier-ignore
const GetFunctionQuery = 'select functions.arn, apps.region from apps, functions where apps.id = ? and apps.author = ? and functions.name = ?'

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) return BadRequest(event)

    const id = getRouterParam(event, 'appid')
    const fnname = getRouterParam(event, 'fnname')

    if (!fnname || !id) return BadRequest(event)

    const { rows } = await db.execute(GetFunctionQuery, [id, user.id, fnname])

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
