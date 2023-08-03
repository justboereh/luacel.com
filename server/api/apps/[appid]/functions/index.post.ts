import type { AppFunction, App } from "#types/app";

type Rows = Array<{
  name: string;
  domain_custom: string;
  domain_set: string;
  domain_generated: string;
}>;

// prettier-ignore
const GetFunctionQuery = 'select functions.name, apps.domain_set, apps.domain_generated, apps.domain_custom, functions.arn, apps.region from apps, functions where apps.id = ? and apps.author = ? and functions.app = ?'

export default defineEventHandler(async (event) => {
  const user = await getUser(event);
  if (!user) return BadRequest(event);

  const id = getRouterParam(event, "appid");
  if (!id) return BadRequest(event);

  const { rows } = await db.execute(GetFunctionQuery, [id, user.id, id]);

  return (rows as Rows).map(
    ({ name, domain_custom, domain_set, domain_generated }) => {
      const domain = domain_custom ? domain_set : domain_generated;

      return {
        name,
        path: `https://${domain}.luacel.app/${name}`,
      };
    }
  );
});
