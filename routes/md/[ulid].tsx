import markdownDocuments from "akvaplan_fresh/services/documents.json" with {
  type: "json",
};

import { Page } from "akvaplan_fresh/components/page.tsx";
import Article from "akvaplan_fresh/components/article/Article.tsx";
import { marky } from "https://deno.land/x/marky@v1.1.7/mod.ts";
import type { RouteConfig, RouteContext } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(document|dokument)/:slug",
};

const style = `
h2,p {
  margin-top: 1.5rem;
  margin-bottom: 0.2rem;
`;

export default async function MarkdownPage(req: Request, ctx: RouteContext) {
  const { slug } = ctx.params;
  const ulid = slug.split("-").at(-1) as string;

  const found = markdownDocuments.find(({ id }) => id === ulid);

  if (!found) {
    return ctx.renderNotFound();
  }
  const { href } = new URL(req.url);

  const url = new URL(found.source, href);
  const response = await fetch(url);
  if (!response?.ok) {
    throw `Failed fetch: ${url.href} (status: ${response.status})`;
  }
  const { headers, status } = response;
  const text = await response.text();
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
}
