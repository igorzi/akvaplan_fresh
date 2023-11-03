export const actionPath = (action: string, unique_key = mynewsdesk_key) =>
  `/services/pressroom/${action}/${unique_key}`;

export const syncMynewsdesk = ({ key, base }): void => {
  const deployId = Deno.env.get("DENO_DEPLOYMENT_ID");
  const time = new Date();
  const url = new URL(actionPath("list", key), base);
  const { href } = url;
  console.warn({ time, deployId, href });

  //const r = await fetch(url);
};
