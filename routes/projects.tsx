import {
  projectFromMynewsdesk,
  projectURL,
  searchMynewsdesk,
} from "akvaplan_fresh/services/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import {
  extractRenderProps,
  type InternationalProps,
  style,
} from "akvaplan_fresh/utils/page/international_page.ts";
import {
  AlbumHeader,
  ArticleSquare,
  HScroll,
  Page,
} from "akvaplan_fresh/components/mod.ts";

import {
  HandlerContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(projects|project|prosjekter|prosjekt)",
};

const GroupedProjects = (
  { grouped, group },
) => (
  <div>
    {[...grouped].filter(([grpkey]) => undefined !== grpkey).map((
      [grpkey, grpmembers],
    ) => (
      <div>
        <h2>
          <a href={`${group}/${grpkey.toLowerCase()}`}>
            {group === "unit" ? t(`unit.${grpkey}`) : grpkey}
          </a>
        </h2>

        <HScroll scrollerId="news-scroll">
          {grpmembers.map((person) => (
            <PeopleCard
              id={person.id}
              person={person}
              key={person.id}
              icons={false}
            />
          ))}
        </HScroll>
      </div>
    ))}
  </div>
);

export const handler: Handlers = {
  async GET(req: Request, ctx: HandlerContext) {
    const props = extractRenderProps(req, ctx);
    const { lang } = props;
    const { items } = await searchMynewsdesk({
      q: "",
      type_of_media: "event",
    }) ?? {};

    const projects = items?.map(projectFromMynewsdesk({ lang }));
    return ctx.render({ ...props, projects });
  },
};

export default function Projects(
  { data: { title, lang, base, projects } }: PageProps<InternationalProps>,
) {
  return (
    <Page title={title} base={base}>
      {
        /* <h1>
        <a href=".">{title}</a> [{t(`lang.${lang}`)}]
      </h1> */
      }
      <section style={style.section}>
        <AlbumHeader
          text={t(`nav.Projects`)}
          href=""
        />
        <HScroll maxVisibleChildren={4.5}>
          {projects?.map(ArticleSquare)}
        </HScroll>
      </section>
    </Page>
  );
}
