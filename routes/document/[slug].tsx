import { AltLangInfo, Article, Page } from "akvaplan_fresh/components/mod.ts";

import { marky } from "https://deno.land/x/marky@v1.1.7/mod.ts";

import type { RouteConfig, RouteContext } from "$fresh/server.ts";
import { findMarkdownDocument } from "akvaplan_fresh/services/documents.ts";
import { documentHref } from "akvaplan_fresh/services/nav.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(document|dokument)/:slug",
};
function extractId(str: string) {
  const regex = /[\/-](?<id>\w+)$/;
  const match = regex.exec(str);
  if (match && match?.groups?.id) {
    return match.groups.id;
  }
}

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

export const MarkdownArticlePage = (
  { text, meta, lang }: { text: string; lang: string; meta: DocumentMeta },
) => {
  // Find alternate lang version (if markdown language (`meta.lang`) differs from present site `lang`)
  const alt = meta.lang !== lang && meta.alt &&
    findMarkdownDocument({ id: meta.alt });

  const alternate = alt && {
    ...alt,
    href: documentHref({
      id: alt.id,
      lang: alt.lang,
      title: alt.title,
    }),
  };

  const style = `h2 {
    margin-top: 1.5rem;
    margin-bottom: 0.2rem;
  }
  p {
    margin-top: 1rem;
    margin-bottom: 0.2rem;
  }`;
  return (
    <Page>
      <style dangerouslySetInnerHTML={{ __html: style }} />
      <Article>
        {alt && (
          <AltLangInfo
            alternate={alternate}
            lang={lang}
            language={meta.lang}
          />
        )}
        <div
          style={{ maxWidth: "1440px" }}
          dangerouslySetInnerHTML={{ __html: marky(text) }}
        />
      </Article>
    </Page>
  );
};

export default async function Document(req: Request, ctx: RouteContext) {
  const { slug, lang } = ctx.params;
  const id = extractId(slug) ?? slug;
  const meta = findMarkdownDocument({ id, slug });

  if (meta) {
    // @todo support non-static/external markdown URLs
    const url = new URL(import.meta.resolve(
      "../../static" + meta.source,
    ));
    const text = await Deno.readTextFile(url);

    return MarkdownArticlePage({ text, meta, lang });
  } else {
    console.warn({ id, slug });
    return cloudinaryProxy(req, ctx);
  }
}
