// FIXME pressreleases add media
// FIXME Compare /en/press/2958380 with https://www.mynewsdesk.com/no/akvaplan-niva/pressreleases/ny-rapport-evaluering-av-nye-oppdrettsarter-2958380
import {
  defaultImage,
  fetchContacts,
  fetchItem,
  fetchItemBySlug,
} from "akvaplan_fresh/services/mynewsdesk.ts";
import { isodate } from "akvaplan_fresh/time/mod.ts";
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import { akvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";

import {
  AlsoInNative,
  Article,
  ArticleContact,
  ArticleHeader,
  OnlyIn,
} from "akvaplan_fresh/components/mod.ts";

//import { YouTube } from "akvaplan_fresh/components/video/youtube.tsx";

import { MynewsdeskItem } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

import { Card, Page } from "akvaplan_fresh/components/mod.ts";
import { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import { PeopleCard as PersonCard } from "../../components/mod.ts";

export const config: RouteConfig = {
  routeOverride:
    "{/:lang(no|en)}?/:type(news|nyhet|pressrelease|pressemelding|press){/:isodate}?/:slug",
};

//console.log("@todo News article: auto-fetch related contacts");

const typeOfMedia = (type: string) => {
  return type.startsWith("press") ? "pressrelease" : "news";
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const { slug, lang, type } = ctx.params;
    langSignal.value = lang;
    const type_of_media = typeOfMedia(type);

    const item = (Number(slug) > 0)
      ? await fetchItem(slug, type_of_media)
      : await fetchItemBySlug(slug, type_of_media);
    if (!item) {
      return ctx.renderNotFound();
    }

    const href = item.links?.find(({ text }) => "alternate" === text)?.url;
    const hreflang = href ? new URL(href)?.pathname.substring(1, 3) : null;
    const alternate = href ? { href, hreflang } : null;

    item.links = item.links?.filter(({ text }) => "alternate" !== text);
    const contacts = await fetchContacts(item);
    return ctx.render({ item, lang, contacts, alternate });
  },
};

interface ArticleProps {
  item: MynewsdeskItem;
  lang: string;
}

//console.log("@todo News article needs bullet points for <li> elements");

export default function NewsArticle(
  { data: { item, lang, contacts, contact_person, alternate } }: PageProps<
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
    ...mynewsdeskItem
  } = item;

  //https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio
  const img = image?.replace(",w_1782", ",w_1600,ar_16:9") ?? defaultImage;

  const published = isodate(published_at.datetime);

  const __html = body ?? summary;

  const _caption = {
    fontSize: "0.75rem",
  };

  return (
    <Page title={header}>
      <Article language={language}>
        <section style={_caption}>
          <em style={{ color: "var(--text2)" }}>
            {alternate && lang !== language
              ? (
                <AlsoInNative
                  href={alternate.href}
                  hreflang={alternate.hreflang}
                  lang={alternate.hreflang}
                />
              )
              : null}
            {!alternate && lang !== language && OnlyIn({ lang, language })}
          </em>
        </section>
        <ArticleHeader
          header={header}
          image={img}
          imageCaption={image_caption}
        />

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

        <li style="display:grid;grid-template-columns:repeat(auto-fit, minmax(440px, 1fr));grid-gap:1rem;">
          {contacts && contacts.map(
            (contact) => (
              <section class="article-content">
                <PersonCard id={contact} icons={false} />
              </section>
            ),
          )}
        </li>
        {alternate && (
          <p style={_caption}>
            <AlsoInNative
              href={alternate.href}
              hreflang={alternate.hreflang}
              lang={alternate.hreflang}
            />
          </p>
        )}
        <p style={_caption}>
          {t(`type.${type_of_media}`)} {t("ui.published")} {published}
        </p>
      </Article>
    </Page>
  );
}
