import { detectDOIs } from "akvaplan_fresh/text/doi.ts";

import { MynewsdeskItem } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { slug as _slug } from "https://deno.land/x/slug/mod.ts";

const sortPublishedLatest = (a, b) =>
  b.published_at.datetime.localeCompare(a.published_at.datetime);

// https://www.mynewsdesk.com/docs/webservice_pressroom#services_view
const base = "https://www.mynewsdesk.com";

const mynewsdesk_key: string = globalThis.Deno && Deno.env.has("mynewsdesk_key")
  ? Deno.env.get("mynewsdesk_key") ?? ""
  : "";

const path = (action: string, unique_key = mynewsdesk_key) =>
  `/services/pressroom/${action}/${unique_key}`;

// GET https://www.mynewsdesk.com/services/pressroom/search/unique_key?
//   query=query&
//   type_of_media=[pressrelease|news|blog_post|event|image|video|document|contact_person]&
//   limit=limit&
//   page=page&
//   strict=[true|false]&
//   callback=callback&
//   pressroom=pressroom&
//   tags=category1,category2,category3
export const searchURL = (query, type_of_media, { limit = 10 } = {}) =>
  new URL(
    path("search") +
      `?format=json&type_of_media=${type_of_media}&strict=true&limit=${limit}&query=${query}`,
    base,
  );

// GET https://www.mynewsdesk.com/services/pressroom/view/unique_key?
//     format=xml|rss|json&
//     item_id=id&
//     type_of_media=[pressrelease|news|blog_post|event|image|video|document|contact_person]&
//     strict=true|false&
//     callback=callback
export const itemURL = (
  id: string,
  type_of_media: string,
  key: string = mynewsdesk_key,
) =>
  `https://www.mynewsdesk.com/services/pressroom/view/${key}?format=json&item_id=${id}&type_of_media=${type_of_media}&strict=true`;

export const fetchItemBySlug = async (
  slug: string,
  type_of_media = "news",
) => {
  const url = searchURL(slug, type_of_media);
  //console.debug(url.href);

  const r = await fetch(url.href);
  if (r.ok) {
    const { search_result } = await r.json();

    const { id } = search_result?.items?.find(({ url }) =>
      url.includes(slug)
    ) ??
      {};

    if (id) {
      return fetchItem(id, type_of_media);
    } else if (!id && search_result?.items.length === 1) {
      return fetchItem(search_result?.items.at(0).id, type_of_media);
    }
  }
};

export const fetchItem = async (
  id: string,
  type_of_media: string,
): Promise<MynewsdeskItem | undefined> => {
  const r = await fetch(itemURL(id, type_of_media));
  if (r.ok) {
    const { item: [item] } = await r.json();
    return item;
  }
};

const preprocess = (s) =>
  s.replaceAll("<em>", "").replaceAll("</em>", "")
    .replaceAll('"', "").replaceAll("å", "a").replaceAll("/", "-");

const postprocess = (s) => s.replaceAll("-aa-", "-a-").replace(/[-]{2,}/g, "-");

// export const href = ({ header }) =>
//   "/mynewsdesk-articles/" +
//   postprocess(_slug(preprocess(header)));

export const searchMynewsdesk = async (
  { q = "", type_of_media = "news", limit = 100 } = {},
) => {
  const url = searchURL(q, type_of_media, { limit });

  const response = await fetch(url);
  if (response.ok) {
    const { search_result: { items }, ...rest } = await response.json();
    const withDOIs = items.map((item) => {
      const dois = detectDOIs(item);
      if (dois) {
        const doi = dois.map((d) => "10." + d.split("10.").at(1));
        item.rels = { doi };
      }
      return item;
    });
    return { ...rest, items: withDOIs };
  }
  //throw `Mynewsdesk search failed`;
};

export const slug = ({ header }) => postprocess(_slug(preprocess(header)));

// Get localized application URL for a news article
//console.log("@todo Decide news URL structure for news vs press releases");
export const href = (
  { header, type_of_media, language, published_at: { datetime } }:
    MynewsdeskItem, // language -> article language
  lang = language, // lang -> site language
) => {
  const isodate = new Date(datetime).toJSON().split("T").at(0);
  let page = lang === "en" ? "news" : "nyhet";
  if ("pressrelease" === type_of_media) {
    page = lang === "en" ? "pressrelease" : "pressemelding";
  }
  return `/${lang}/${page}/${isodate}/${slug({ header })}`;
};

export const defaultThumbnail =
  "https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,h_96,q_auto:good,w_128/lkxumpqth4dstepfhple";

export const defaultImage =
  "https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1782,ar_16:9/lkxumpqth4dstepfhple";

// Generic bubbles
//https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1782,ar_16:9/awdzhbjdkc1hz2dbfqaj

// jobAdRegexes = [/stillingsannonse/i, /ledig stilling/i]
// getJobAdverts

export const multiSearchMynewsdesk = async (
  queries: string[],
  types: string[],
  opts: Record<string, string>,
) => {
  const result = new Map<string, unknown>();
  const limit = opts?.limit ?? 64;
  const sort = opts.search ?? sortPublishedLatest;

  for await (const q of new Set([...queries])) {
    for await (const type_of_media of new Set([...types])) {
      const { items } = await searchMynewsdesk({ q, type_of_media, limit }) ??
        {};
      if (items) {
        for (const n of items) {
          result.set(n.id, n);
        }
      }
    }
  }
  return [...result.values()].sort(sort);
};
