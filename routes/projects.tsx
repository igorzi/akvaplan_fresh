import {
  projectFromMynewsdesk,
  projectURL,
  projectYears,
  searchMynewsdesk,
} from "akvaplan_fresh/services/mod.ts";

import { groupIntoMap } from "akvaplan_fresh/grouping/mod.ts";

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
import { asset, Head } from "$fresh/runtime.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(projects|project|prosjekter|prosjekt)",
};

// const GroupedProjects = (
//   { grouped, group },
// ) => (
//   <div>
//     {[...grouped].filter(([grpkey]) => undefined !== grpkey).map((
//       [grpkey, grpmembers],
//     ) => (
//       <div>
//         <h2>
//           <a href={`${group}/${grpkey.toLowerCase()}`}>
//             {group === "unit" ? t(`unit.${grpkey}`) : grpkey}
//           </a>
//         </h2>

//         <HScroll scrollerId="news-scroll">
//           {grpmembers.map((person) => (
//             <PeopleCard
//               id={person.id}
//               person={person}
//               key={person.id}
//               icons={false}
//             />
//           ))}
//         </HScroll>
//       </div>
//     ))}
//   </div>
// );

export const handler: Handlers = {
  async GET(req: Request, ctx: HandlerContext) {
    const props = extractRenderProps(req, ctx);
    const { lang } = props;
    const { items } = await searchMynewsdesk({
      q: "",
      type_of_media: "event",
    }) ?? {};

    const projects = items
      ?.map(projectFromMynewsdesk({ lang }))
      .sort((a, b) => b.start.localeCompare(a.start));
    projectYears;
    const grouped = groupIntoMap(
      projects,
      ({ start }) => start.substring(0, 4) ?? "????",
    );

    return ctx.render({ ...props, projects, grouped });
  },
};

export default function Projects(
  { data: { title, lang, base, projects, grouped } }: PageProps<
    InternationalProps
  >,
) {
  return (
    <Page title={title} base={base}>
      <Head>
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>

      <h1>
        {t(`nav.Projects`)}
      </h1>

      <section>
        {[...grouped].map(([k, v]) => (
          <section style={style.section}>
            <AlbumHeader
              text={`${t("ui.From")} ${k}`}
              href=""
            />
            <HScroll maxVisibleChildren={5.5}>
              {v?.map(ArticleSquare)}
            </HScroll>
          </section>
        ))}
      </section>
    </Page>
  );
}
