import { connect, ExecutedQuery } from '@planetscale/database'
import { App } from '#types/app'

export const db = connect({
    url: process.env.DATABASE_URL,
})

type GetAppsFromDBArgs = {
    userid: string
}
// prettier-ignore
const GetAppsQuery = 'select * from apps where author = ?'

type GetAppsFromDBReturn = ExecutedQuery & {
    rows: App[]
}

export function GetAppsFromDB(args: GetAppsFromDBArgs) {
    return db.execute(GetAppsQuery, [
        args.userid,
    ]) as Promise<GetAppsFromDBReturn>
}

type GetAppFromDBArgs = {
    appid: string
    userid: string
}

type GetAppFromDBReturn = ExecutedQuery & {
    rows: App[]
}

// prettier-ignore
const GetAppQuery = 'select * from apps where author = ? and id = ?'

export function GetAppFromDB(args: GetAppFromDBArgs) {
    return db.execute(GetAppQuery, [
        args.userid,
        args.appid,
    ]) as Promise<GetAppFromDBReturn>
}

type GetFunctionsFromDBArgs = {
    appid: string
    userid: string
}

type GetFunctionsFromDBReturn = ExecutedQuery & {
    rows: {
        arn: string
        name: string
        region: string
        id: string
    }[]
}

// prettier-ignore
const GetFunctionsQuery = 'select functions.arn, functions.name, apps.region, apps.id from apps, functions where apps.id = ? and apps.author = ? and functions.app = apps.id'

export function GetFunctionsFromDB(args: GetFunctionsFromDBArgs) {
    return db.execute(GetFunctionsQuery, [
        args.appid,
        args.userid,
    ]) as Promise<GetFunctionsFromDBReturn>
}

type DeleteFunctionFromDBArgs = {
    appid: string
    userid: string
    fnname: string
}

type DeleteFunctionFromDBReturn = ExecutedQuery

// prettier-ignore
const DeleteFunctionQuery = 'delete from functions where app = ? and app = (select id from apps where id = ? and author = ?) and functions.name = ?'

export function DeleteFunctionFromDB(args: DeleteFunctionFromDBArgs) {
    return db.execute(DeleteFunctionQuery, [
        args.appid,
        args.appid,
        args.userid,
        args.fnname,
    ]) as Promise<DeleteFunctionFromDBReturn>
}
