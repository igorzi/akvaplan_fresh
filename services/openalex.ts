const base = "https://api.openalex.org";
const path = "/works";
const mail = "info@akvaplan.niva.no";
const endpoint = `${base}${path}`;

const fetchJSON = async (url) => {
  const r = await fetch(url).catch(() => {});
  if (r?.ok) {
    return r.json();
  } else {
    console.warn(`GET ${url} failed (${r?.status})`);
  }
};

export const getOpenAlexWork = async ({ doi, mailto = mail } = {}) =>
  await fetchJSON(`${endpoint}/doi:${doi}?mailto=${mailto}`);

export const fetchOpenAlexCites = async ({
  doi,
  id,
  per_page = 100,
  page = 1,
  mailto = mail,
} = {}) => {
  if (!id) {
    const work = await getOpenAlexWork({ doi });
    id = work.id;
  }
  const url =
    `${endpoint}?filter=cites:${id}&per_page=${per_page}&page=${page}&mailto=${mailto}`;
  return fetchJSON(url);
};
