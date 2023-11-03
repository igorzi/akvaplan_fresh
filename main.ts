/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { getLangFromURL } from "./text/mod.ts";
import {
  InnerRenderFunction,
  RenderContext,
  RenderFunction,
  start,
} from "$fresh/server.ts";
import { base, mynewsdesk_key as key, path } from "./services/mynewsdesk.ts";
import { syncMynewsdesk } from "./kv/jobs/sync_mynewsdesk.ts";
import manifest from "./fresh.gen.ts";

const render: RenderFunction = (
  ctx: RenderContext,
  freshRender: InnerRenderFunction,
) => {
  // Set `lang` in render context -> reflects into html[lang]
  const lang = getLangFromURL(ctx.url);
  if (lang) {
    ctx.lang = lang;
  }
  freshRender();
};
//Deno.cron("sync mynewsdesk", `*/5 * * * *`, syncMynewsdesk);
setInterval(syncMynewsdesk, 300_000, { key, base });

await start(manifest, { render, /*, plugins: [],*/ port: 7777 });
