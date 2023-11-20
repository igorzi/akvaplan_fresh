import { searchMynewsdesk } from "akvaplan_fresh/services/mynewsdesk.ts";
import markdownDocuments from "./documents.json" with { type: "json" };

const toDocument = (d: MynewsdeskItem) => {
  const { document } = d;
  const cloudinary = document.split("/").at(-1);
  d.href = `/api/document/${cloudinary}`;

  d.published = new Date(d.published_at.datetime);
  d.title = d?.summary ?? d?.document_name;
  d.thumb = d.document_thumbnail;
  d.id = cloudinary;
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
