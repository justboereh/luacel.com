import type { AppFunction, App } from '#types/app'
import { serverSupabaseUser } from '#supabase/server'

type Row = {
    arn: string
    region: string
}

const GetAppRegionQuery = 'select region from apps where id = ? and author = ?'
// prettier-ignore
const DeleteFunctionQuery = 'delete from functions where app = ? and app = (select id from apps where id = ? and author = ?) and functions.name = ?'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) return BadRequest(event)

    const body = await readBody<{ id: string }>(event)
    const fnname = getRouterParam(event, 'fnname')

    console.log(body, fnname)
    if (!fnname) return BadRequest(event)
    if (!body.id) return BadRequest(event)

    // prettier-ignore
    await db.execute(DeleteFunctionQuery, [body.id, body.id, user.id, fnname])
    // prettier-ignore
    const { rows } = await db.execute(GetAppRegionQuery, [body.id, user.id])

    console.log(rows)

    if (rows.length < 1) return BadRequest(event)

    const { region } = rows[0] as Row

    await DeleteFunction({
        region,
        name: `${body.id}--${fnname}`,
    })

    return 'Ok'
})
