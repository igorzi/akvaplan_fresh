import { serviceGroupURL } from "./nav.ts";

import { shuffle } from "akvaplan_fresh/grouping/mod.ts";

type Svc = Record<string, string | number | string[]>;

const _services = [];

const getServices = async () => {
  const r = await fetch("https://svc.deno.dev/").catch(() => {});
  if (r?.ok) {
    return r.json();
  }
};

const servicesLevelFilter = (n: number) => ({ level }: Svc) => level === n;

export const getServicesLevel0 = async (lang: string) => {
  const svc0 = (await getServices() ?? [])?.filter(servicesLevelFilter(0));

  const en0 = svc0.map((
    { topic, en, no, details, detaljer, img, ...s }: Svc,
  ) => ({
    ...s,
    topic,
    img: img?.replace("/preview_big/", "/preview/"),
    name: en ?? no,
    desc: details ?? detaljer,
    lang: "en",
    href: serviceGroupURL({ lang: "en", topic }),
  }));

  const no0 = svc0.map((
    { no, en, tema, details, detaljer, img, ...s }: Svc,
  ) => ({
    ...s,
    name: no ?? en,
    img: img?.replace("/preview_big/", "/thumbnail_big/"),
    desc: detaljer ?? details,
    topic: tema,
    lang: "no",
    href: serviceGroupURL({ lang: "no", topic: tema }),
  }));

  const svc = lang === "en" ? en0 : no0;
  return shuffle(svc);
};
