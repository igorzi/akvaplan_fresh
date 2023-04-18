import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import { SignalLike, StringSignal } from "akvaplan_fresh/@interfaces/signal.ts";
import { computed } from "@preact/signals-core";
export const siteNav: SignalLike<Array> = computed(() =>
  buildNav(langSignal.value)
);

const En = new Map([
  ["search", "/en/_"],
  ["news", "/en/news"],
  ["service", "/en/services"],
  ["services", "/en/services"],
  ["research", "/en/research"],
  ["settings", "/en/settings"],
  ["pubs", "/en/pubs"],
  ["dcat", "/en/dcat"],
  ["documents", "/en/documents"],
  ["akvaplanists", "/en/people"],
  ["people", "/en/people"],
  ["about", "/en/company"],
]);
const No = new Map([
  ["search", "/no/_"],
  ["news", "/no/nyheter"],
  ["service", "/no/tjenester"],
  ["services", "/no/tjenester"],
  ["research", "/no/forskning"],
  ["settings", "/no/innstillinger"],
  ["pubs", "/no/pubs"],
  ["dcat", "/no/dcat"],
  ["documents", "/no/dokumenter"],
  ["akvaplanists", "/no/folk"],
  ["people", "/no/folk"],
  ["about", "/no/om-oss"],
]);

export const routes = (lang: string | StringSignal) =>
  lang === "en" || lang?.value === "en" ? En : No;

const _tr = routes;

routes;
export const buildNav = (lang: string | StringSignal) => [
  { href: _tr(lang).get("news"), text: t("nav.News") },
  { href: _tr(lang).get("services"), text: t("nav.Services") },
  { href: _tr(lang).get("research"), text: t("nav.Research") },
  { href: _tr(lang).get("pubs"), text: t("nav.Publications") },
  //{ href: _tr(lang).get("dcat"), text: t("Datasets") },

  //{ href: _tr(lang).get("documents"), text: t("Documents") },
  { href: _tr(lang).get("akvaplanists"), text: t("nav.People") },
  { href: _tr(lang).get("about"), text: t("nav.About") },
  //{ href: _tr(lang).get("settings"), text: t("Settings") },
];

export const buildMobileNav = (lang: string | StringSignal) =>
  buildNav(lang).slice(1, 3);

// export const newsURL = ({ slug, isodate, lang }) =>
//   id
//     ? `${routes(lang).get("akvaplanists")}/id/${id}/${family}/${given}`
//     : `${routes(lang).get("akvaplanists")}/name/${family}/${given}`;

export const personURL = ({ id, given, family, email, lang }) =>
  id
    ? `${routes(lang).get("akvaplanists")}/id/${id}/${family}/${given}`
    : `${routes(lang).get("akvaplanists")}/name/${family}/${given}`;

export const researchTopicURL = ({ topic, lang }) =>
  `${routes(lang).get("research")}/${
    lang === "en" || lang?.value == "en" ? "topic" : "tema"
  }/${topic}`;

export const serviceGroupURL = ({ topic, lang }) =>
  `${routes(lang).get("services")}/${
    lang === "en" || lang?.value == "en" ? "topic" : "tema"
  }/${topic}`;

export const pubURL = ({ doi, lang }) => `${routes(lang).get("pubs")}/${doi}`;
