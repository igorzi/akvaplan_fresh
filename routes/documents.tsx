import { searchMynewsdesk } from "akvaplan_fresh/services/mod.ts";
import { groupIntoMap } from "akvaplan_fresh/grouping/mod.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";
import { isodate } from "../time/mod.ts";

import {
  ArticleSquare,
  Card,
  MiniNewsCard,
  Page,
} from "akvaplan_fresh/components/mod.ts";

import { type InternationalProps } from "akvaplan_fresh/utils/page/international_page.ts";

interface DocumentsProps extends InternationalProps {
  style: StyleProps;
  docs: MynewsdeskItem[];
}
interface StyleProps {
  section: string;
  header: string;
}

const itemstyle = {
  display: "grid",
  padding: "var(--size-1)",

  "font-size": "var(--font-size-1)",
  gap: "var(--size-2)",
  "place-items": "center",
  "grid-template-columns": "128px auto",
};

import {
  type HandlerContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";
import { MynewsdeskItem } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(documents|document|dokumenter|dokument)",
};

export const handler: Handlers<DocumentsProps> = {
  async GET(req: Request, ctx: HandlerContext) {
    const { params } = ctx;
    lang.value = params.lang;
    const base = `/${params.lang}/${params.page}/`;
    const title = t("nav.Documents");

    const { searchParams } = new URL(req.url);
    const _q = searchParams.get("q") ?? "";
    const q = _q.toLocaleLowerCase();

    const { items } = await searchMynewsdesk({
      q,
      sort: "created",
      limit: 480,
      type_of_media: "documents",
    }) ?? [];

    // const news = groupIntoMap(
    //   _news,
    //   ({ published }) => published.substring(0, 7),
    // );
    const docs = q?.length > 1
      ? items
      : items.filter(({ summary, document_format }: MynewsdeskItem) =>
        summary?.length > 0 && /pdf/.test(document_format)
      );

    return ctx.render({ title, base, docs, lang });
  },
};

const style: StyleProps = { section: "", header: "" };

export default function Documents(
  { data: { title, lang, base, docs } }: PageProps<DocumentsProps>,
) {
  return (
    <Page title={title} base={base} lang={lang}>
      <h1 style={style.header}>{title}</h1>

      <section
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(390px, 1fr))",
        }}
      >
        {docs.map((
          {
            id,
            document,
            document_thumbnail,
            document_name,
            document_size,
            document_format,
            published_at,
            created_at,
            updated_at,
            url,
            summary,
            tags,
            ...more
          },
        ) => (
          <>
            <ArticleSquare
              title={summary ?? document_name}
              img={document_thumbnail}
              published={new Date(published_at.datetime)}
              _type={t(document_format.replace(".", ""))}
              href={document}
              target="_blank"
            />
          </>
        ))}
      </section>
    </Page>
  );
}
