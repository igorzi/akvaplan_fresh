import { Article, Page } from "akvaplan_fresh/components/mod.ts";

import { marky } from "https://deno.land/x/marky@v1.1.7/mod.ts";

import type { RouteConfig, RouteContext } from "$fresh/server.ts";
import { findMarkdownDocument } from "akvaplan_fresh/services/documents.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(document|dokument)/:slug",
};

const style = `h2 {
  margin-top: 1.5rem;
  margin-bottom: 0.2rem;
}
p {
  margin-top: 1rem;
  margin-bottom: 0.2rem;
}`;

export const cloudinaryProxy = async (req: Request, ctx: RouteContext) => {
  const { slug } = ctx.params;
  const id = slug.split("-").at(-1) as string;
  const url = new URL(
    `https://resources.mynewsdesk.com/image/upload/${id}`,
  );
  const { body, headers, status, ok } = await fetch(url);
  if (!ok) {
    return ctx.renderNotFound();
  }
  return new Response(body, { status, headers });
};

export default async function MarkdownPage(req: Request, ctx: RouteContext) {
  const { slug } = ctx.params;
  const ulid = slug.split("-").at(-1) as string;
  const found = findMarkdownDocument(ulid);
  const { href } = new URL(req.url);

  if (found) {
    const url = new URL(import.meta.resolve(
      "../../static" + found.source,
    ));
    const text = await Deno.readTextFile(url);

    return (
      <Page>
        <style dangerouslySetInnerHTML={{ __html: style }} />
        <Article>
          <div
            style={{ maxWidth: "1440px" }}
            dangerouslySetInnerHTML={{ __html: marky(text) }}
          />
        </Article>
      </Page>
    );
  } else {
    return cloudinaryProxy(req, ctx);
  }
}
