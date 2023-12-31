import { DeleteFunctionFromDB, GetAppsFromDB } from "#utils/database";
import {
  CloudWatchLogsClient,
  DeleteLogGroupCommand,
} from "@aws-sdk/client-cloudwatch-logs";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);
  if (!user) return BadRequest(event);

  const appid = getRouterParam(event, "appid");
  const fnname = getRouterParam(event, "fnname");

  if (!appid || !fnname) return BadRequest(event);

  const [{ rows: apps }, { rows: functions }] = await Promise.all([
    GetAppsFromDB({ userid: user.id }),
    GetFunctionsFromDB({
      appid,
      userid: user.id,
    }),
  ]);

  if (apps.length < 1) return BadRequest(event);
  if (functions.length < 1) return BadRequest(event);

  await DeleteFunctionFromDB({ appid, userid: user.id, fnname });
  await DeleteFunction({
    region: apps[0].region,
    name: functions[0].arn,
  });

  const client = new CloudWatchLogsClient({
    region: apps[0].region,
  });

  await client.send(
    new DeleteLogGroupCommand({
      logGroupName: `/aws/lambda/${functions[0].name}`,
    })
  );

  return "Ok";
});
