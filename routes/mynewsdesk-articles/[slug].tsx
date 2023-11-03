// Redirect [email URLs](https://www.mynewsdesk.com/docs/webservice_pressroom#tips_align_urls): /:type_of_media/id
// Redirect legacy URLs: /mynewsdesk-articles/:slug (from previous Wordpress site in production until 2023-05)
// Redirect mynewsdesk URLs
//
// Legacy URL examples:
// - https://www.akvaplan.niva.no/mynewsdesk-articles/torskeoppdrett-behovet-for-areal
// Mynewsdesk URL examples:
// - https://www.mynewsdesk.com/no/akvaplan-niva/news/nye-forskningsmidler-til-oppdrettstorsk-449890
// - https://www.mynewsdesk.com/no/akvaplan-niva/news/even-the-coldest-of-svalbard-fjords-show-effects-of-climate-change-468974
import { fetchItem, fetchItemBySlug } from "../../services/mynewsdesk.ts";
import { Handlers, RouteConfig } from "$fresh/server.ts";
export const config: RouteConfig = {
  routeOverride:
    "{/no/akvaplan-niva}?/:type(news|pressrelease|mynewsdesk-articles)/:slug",
};
export const handler: Handlers = {
  async GET(req, ctx) {
    let pr;
    const { slug, type, ignore } = ctx.params;

    const numid = ["news", "pressrelease"].includes(type)
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

    if (!item) {
      return ctx.renderNotFound();
    }

    const { language, id, url, type_of_media, published_at: { datetime } } =
      item;

    // Cannot trust mynewsdesk language, often wrong
    const lang = ["en", "no"].includes(language!) ? language : "no";

    const isodate = new Date(datetime).toJSON().split("T").at(0);

    const { pathname } = url && URL.canParse(url) ? new URL(url) : new URL(
      `/${lang}/${type_of_media}/${isodate}/${slug}`,
      "https://akvaplan.no",
    );

    const location = pathname.replace(
      /^\/(no|en)\/akvaplan-niva\//,
      `/${lang}/`,
    );

    return new Response("", {
      status: 301,
      headers: { location },
    });
  },
};
