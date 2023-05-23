import { href } from "./mynewsdesk.ts";
import { projectURL } from "./nav.ts";
import {
  MynewsdeskItem,
  News,
  NewsMapper,
} from "akvaplan_fresh/@interfaces/mod.ts";

const extractID = (url: string) => url.split("/").at(-1);

const thumbURL = (id: string, { w = 128, h = 96 } = {}) =>
  `https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,h_${h},q_auto:good,w_${w}/${id}`;
export const newsFromMynewsdesk = ({ lang }: NewsMapper) =>
(
  {
    language,
    id,
    image_caption,
    header,
    published_at,
    image,
    type_of_media,
    rels,
    ...item
  }: MynewsdeskItem,
): News => ({
  id,
  title: header,
  published: published_at.datetime,
  href: href({ header, language, published_at, type_of_media }, lang),
  hreflang: language,
  img: image,
  caption: image_caption ?? header,
  thumb: thumbURL(extractID(image ?? "")),
  type: type_of_media,
  rels,
});

const year = ({ datetime }) => new Date(datetime).getFullYear();
export const projectYears = (start_at, end_at) =>
  `${year(start_at)} – ${year(end_at)}`;

// lookup acronym from url?
export const projectFromMynewsdesk = ({ lang }: NewsMapper) =>
(
  {
    language,
    id,
    url,
    image_caption,
    header,
    start_at,
    end_at,
    published_at,
    image,
    type_of_media,
    rels,
    ...item
  }: MynewsdeskItem,
): News => ({
  id,
  title: header,
  published: published_at.datetime,
  duration: projectYears(start_at, end_at),
  href: projectURL({ lang, title: header }),
  hreflang: language,
  img: image,
  caption: image_caption ?? header,
  thumb: thumbURL(extractID(image ?? "")),
  type: type_of_media,
  rels,
  mynewsdesk: item,
});
