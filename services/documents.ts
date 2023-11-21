import { searchMynewsdesk } from "akvaplan_fresh/services/mynewsdesk.ts";
import markdownDocuments from "./documents.json" with { type: "json" };
import { slug as slugify } from "https://deno.land/x/slug@v1.1.0/mod.ts";

const matchIdOrSlug = (md: { id: string; slug: string }, idOrSlug: string) =>
  md.id === idOrSlug || slugify(md.slug) === slugify(idOrSlug);

export const findMarkdownDocument = (idOrSlug: string) =>
  markdownDocuments.find((md) => matchIdOrSlug(md, idOrSlug));

const toDocument = (d: MynewsdeskItem) => {
  const { document } = d;
  const id = document.split("/").at(-1);
  d.href = `/api/document/${id}`;
  d.published = new Date(d.published_at.datetime);
  d.title = d?.summary ?? d?.document_name;
  d.thumb = d.document_thumbnail;
  d.id = id;
  return d;
};

export const searchDocuments = async ({ q = "", filter = () => true }) => {
  const _docs = await searchMynewsdeskDocuments({
    q,
  }) ?? [];

  const docs = _docs.filter(filter).map(toDocument);
  return [...markdownDocuments, ...docs];
};

export const searchMynewsdeskDocuments = async (params) => {
  const { items } = await searchMynewsdesk({
    q: "",
    sort: "created",
    limit: 100,
    type_of_media: "documents",
    ...params,
  }) ?? [];

  return items;
};
