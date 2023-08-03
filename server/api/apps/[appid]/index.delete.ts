// prettier-ignore
const DeleteAppQuery = 'delete from apps where author = ? and id = ?'

export default defineEventHandler(async (event) => {
  const user = await getUser(event);
  if (!user) return BadRequest(event);

  const appid = getRouterParam(event, "appid");
  if (!appid) return BadRequest(event);

  const { rows: apps } = await GetAppFromDB({ appid, userid: user.id });
  if (!apps[0]) return BadRequest(event);

  const { rows: functions } = await GetFunctionsFromDB({
    appid: appid,
    userid: user.id,
  });

  for (const func of functions) {
    await DeleteFunction({ name: func.arn, region: apps[0].region });
    await DeleteFunctionFromDB({
      appid: appid,
      fnname: func.name,
      userid: user.id,
    });
  }

  await db.execute(DeleteAppQuery, [user.id, appid]);

  return "Ok";
});
