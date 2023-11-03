// Redirect [email URLs](https://www.mynewsdesk.com/docs/webservice_pressroom#tips_align_urls): /:type_of_media/id
// Redirect legacy URLs: /mynewsdesk-articles/:slug (from previous Wordpress site in production until 2023-05)
// Redirect mynewsdesk URLs
//
// Legacy URL examples:
// - https://www.akvaplan.niva.no/mynewsdesk-articles/torskeoppdrett-behovet-for-areal => https://akvaplan.no/no/nyhet/2022-05-30/torskeoppdrett-behovet-for-areal
//
// Mynewsdesk legacy URL examples (notice: always /no) before 2023-11-03
// - https://www.mynewsdesk.com/no/akvaplan-niva/news/nye-forskningsmidler-til-oppdrettstorsk-449890
// - https://www.mynewsdesk.com/no/akvaplan-niva/news/even-the-coldest-of-svalbard-fjords-show-effects-of-climate-change-468974
//
// Notice on 2023-11-03, Mynewsdesk was reconfigured to to use akvaplan.no, examples:
// - https://akvaplan.no/news/nye-forskningsmidler-til-oppdrettstorsk-449890
import { fetchItem, fetchItemBySlug, href } from "../../services/mynewsdesk.ts";
import { Handlers, RouteConfig } from "$fresh/server.ts";
export const config: RouteConfig = {
  routeOverride: "/:type(news|pressreleases|mynewsdesk-articles)/:slug",
};
export const handler: Handlers = {
  async GET(req, ctx) {
    let pr;
    const { slug, type, ignore } = ctx.params;

    const numid = ["news", "pressreleases"].includes(type)
      ? Number(slug?.split("-").at(-1))
      : undefined;

    const newsitem = (Number(numid) > 0)
      ? await fetchItem(numid!, "news")
      : await fetchItemBySlug(slug, "news");

    if (!newsitem) {
      pr = (Number(numid) > 0)
        ? await fetchItem(numid!, "pressrelease")
        : await fetchItemBySlug(slug, "pressrelease");
    }

    const item = newsitem ?? pr;

    console.warn(slug, numid, item?.id);

    if (!item) {
      return ctx.renderNotFound();
    }

    const {
      language,
      header,
      id,
      url,
      type_of_media,
      published_at: { datetime },
    } = item;

    // Cannot trust mynewsdesk language, often wrong
    const lang = ["en", "no"].includes(language!) ? language : "no";

    const isodate = new Date(datetime).toJSON().split("T").at(0);

    const { pathname } = new URL(url);

    // Cannot use slug from mynewsdesk since it may differ from akvaplan.no slugs!
    const location = href(item);
    //const location = `/${lang}/${type_of_media}/${id}`;

    return new Response("", {
      status: 301,
      headers: { location },
    });
  },
};
