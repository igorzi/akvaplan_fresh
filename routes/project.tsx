import {
  defaultImage,
  fetchItem,
  fetchItemBySlug,
  multiSearchMynewsdesk,
  newsFromMynewsdesk,
  projectMap,
  projectYears,
} from "akvaplan_fresh/services/mod.ts";

import { isodate, normalize } from "akvaplan_fresh/utils/mod.ts";
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import { akvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";

import { MynewsdeskItem } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

import {
  Article,
  ArticleContact,
  ArticleHeader,
  ArticleSquare,
  Card,
  HScroll,
  Page,
} from "akvaplan_fresh/components/mod.ts";

import { PeopleCard as PersonCard } from "akvaplan_fresh/components/mod.ts";
import { routes } from "../services/nav.ts";

import { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(project|prosjekt)/:slug",
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const { slug, lang, type } = ctx.params;
    langSignal.value = lang;

    const item = await fetchItemBySlug(slug, "event");
    if (!item) {
      return ctx.renderNotFound();
    }
    if (["project", "prosjekt"].includes(type) && "no" === lang) {
      item.header = t(`project.${slug}.title`);
    }
    const relcontact = item.related_items.find(({ type_of_media }) =>
      type_of_media === "contact_person"
    );

    let { searchwords, logo } = projectMap.get(slug) ?? {};
    searchwords = [...new Set([...searchwords ?? [], slug].map(normalize))];
    const regex = searchwords.join("|");
    //console.debug({ regex });
    const needle = new RegExp(normalize(regex), "ui");

    const _news = await multiSearchMynewsdesk(
      searchwords,
      ["news", "pressrelease"],
      { limit: 64 },
    ) ?? [];
    const _matching = _news.filter((news) =>
      needle.test(normalize(JSON.stringify(news)))
    );
    const news = _matching?.map(newsFromMynewsdesk({ lang }));

    if (relcontact) {
      const { item_id } = relcontact;
      const contact_person = await fetchItem(item_id, "contact_person");
      const { email } = contact_person;
      const contact = email?.split("@")?.at(0);
      return ctx.render({ item, lang, logo, news, contact, contact_person });
    } else {
      return ctx.render({ item, lang, logo, news, contact: null });
    }
  },
};

const OnlyIn = ({ language, lang }) => {
  return <div lang={lang}>{t(`lang.Only.${String(language)}`)}</div>;
};

interface ArticleProps {
  item: MynewsdeskItem;
  lang: string;
}

export default function ProjectHome(
  { data: { item, lang, news, contact, contact_person, logo } }: PageProps<
    ArticleProps
  >,
) {
  const {
    header,
    image,
    // image_small,
    // image_medium,
    image_thumbnail_large,
    // image_thumbnail_medium,
    // image_thumbnail_small,
    contact_people,
    image_caption,
    related_items,
    type_of_media,
    published_at,
    updated_at,
    created_at,
    links,
    summary,
    tags,
    url,
    language,
    body,
    start_at,
    end_at,
    ...mynewsdeskItem
  } = item;

  //https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio
  const img = image; //?.replace(",w_1782", ",w_1600,ar_16:9") ?? defaultImage;

  const published = isodate(published_at.datetime);

  const __html = body ?? summary;

  const _caption = {
    fontSize: "0.75rem",
  };

  const title = (
    <span>
      <a href={routes(lang).get("projects")}>{t(`nav.Projects`)}</a>: {header}
      {" "}
      ({projectYears(start_at, end_at)})
    </span>
  );

  return (
    <Page title={header}>
      <Head>
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/article.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>{" "}
      <h1>
        {title}
      </h1>
      <p>
        <img
          alt="project logo"
          width="350"
          height="auto"
          src={logo}
        />
      </p>

      <HScroll maxVisibleChildren={5.5}>
        {news.map(ArticleSquare)}
      </HScroll>
      <Article language={language}>
        {
          /* <section style={_caption}>
          <em style={{ color: "var(--text2)" }}>
            {lang !== language ? OnlyIn({ lang, language }) : null}
          </em>
        </section> */
        }

        <figure style={_caption}>
          <figcaption>{image_caption}</figcaption>
        </figure>

        <section
          class="article-content"
          dangerouslySetInnerHTML={{ __html }}
        >
        </section>

        {(links && links?.length > 0) &&
          (
            <section class="article-content">
              {links?.map(({ url }) => (
                <Card>
                  <a href={url} class="ellipsis">{url}</a>
                </Card>
              ))}
            </section>
          )}

        {contact && (
          <section class="article-content">
            <PersonCard id={contact} person={contact_person} />
          </section>
        )}
      </Article>
    </Page>
  );
}
