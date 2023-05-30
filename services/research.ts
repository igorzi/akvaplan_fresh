import { researchTopicURL } from "./nav.ts";
import { shuffle } from "akvaplan_fresh/grouping/mod.ts";

type Research = Record<string, string | umber | string[]>;

const getResearch = async () => {
  const r = await fetch("https://research.deno.dev/").catch(() => {});
  if (r?.ok) {
    return r.json();
  }
};

// export const searchResearch = async ({ q, lang, sort, filter } = {}) => {
//   const research = await fetchResearch({ sort, filter });
//   if (research?.map) {
//     return research.map((
//       { details, detaljer, en, no, topic, tema, ...s },
//     ) => ({
//       ...s,
//       lang,
//       name: lang === "en" ? en : no,
//       href: routes(lang).get("research") +
//         `/${(lang === "en"
//           ? `topic/${encodeURIComponent(topic)}`
//           : `tema/${encodeURIComponent(tema)}`)}`,
//       desc: lang === "en" ? details : detaljer,
//     }));
//   }
// };

const buildLevelFilter = (n: Number) => ({ level }: Svc) => level === n;

export const getResearchLevel0 = async (lang: string) => {
  const r0 = (await getResearch() ?? [])?.filter(buildLevelFilter(0));
  const en0 = r0.map((
    { topic, en, no, details, detaljer, img, ...s }: Svc,
  ) => ({
    ...s,
    topic,
    name: en ?? no,
    img: img?.replace("/preview_big/", "/preview/"),
    desc: details ?? detaljer,
    lang: "en",
    href: researchTopicURL({ lang: "en", topic }),
  }));

  const no0 = r0.map((
    { no, en, tema, details, detaljer, img, ...s }: Svc,
  ) => ({
    ...s,
    name: no ?? en,
    img: img?.replace("/preview_big/", "/preview/"),
    desc: detaljer ?? details,
    topic: tema,
    lang: "no",
    href: researchTopicURL({ lang: "no", topic: tema }),
  }));

  const research0 = lang === "en" ? en0 : no0;
  return shuffle(research0);
};
