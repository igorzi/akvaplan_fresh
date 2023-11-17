// For possible future automatic propagation of state, see:
// https://github.com/denoland/fresh/issues/1128

// https://github.com/denoland/fresh/issues/586#issuecomment-1630175078
import {
  acceptsNordic,
  getLangFromURL,
  setSiteLang,
} from "akvaplan_fresh/text/mod.ts";

import {
  legacyHosts,
  legacyRoutes,
  response307,
  response307XRobotsTagNoIndex,
} from "akvaplan_fresh/services/mod.ts";

import { parse } from "accept-language-parser";

import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { projectURL } from "akvaplan_fresh/services/nav.ts";

export function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<Record<string, unknown>>,
) {
  const url = new URL(req.url);
  const { pathname, hostname } = url;
  const requestHeaderAcceptLanguages = parse(
    req.headers.get("accept-language") ?? "",
  );
  const acceptLanguages = requestHeaderAcceptLanguages.map(({ code }) => code);
  const lang = acceptsNordic(acceptLanguages) ? "no" : "en";

  if (pathname.startsWith("/events/")) {
    const slug = pathname.split("/events/").at(1); //?.replace(/-[0-9]+$/, "");
    const location = new URL(projectURL({ lang, title: slug }), url);
    return response307XRobotsTagNoIndex(location.href);
  }
  // events is in this list, since projects are defined as events in mynewsdesk

  if (ctx.destination === "route") {
    if (legacyHosts.includes(hostname)) {
      const fresh = req.url.replace("www.", "").replace(
        "akvaplan.niva.",
        "akvaplan.",
      );
      return Response.redirect(fresh, 301);
    }

    if (legacyRoutes.has(pathname)) {
      const Location = new URL(legacyRoutes.get(pathname), url);
      return response307XRobotsTagNoIndex(Location);
    }

    // Force /en on .com?
    // const internationalHosts = new Map([["akvaplan.com", "/en"]]);
    // if ([...internationalHosts.keys()].includes(hostname)) {
    // }

    if ("/" === pathname && req.headers.has("accept-language") && lang) {
      // Special case for root path /
      // Redirect from accept-language header, if present

      return response307(`/${lang}`);
    } else {
      const lang = getLangFromURL(url);
      if (lang) {
        setSiteLang(lang);
      }
    }
  }
  return ctx.next();
}
