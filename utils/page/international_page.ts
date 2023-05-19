import { lang, t } from "akvaplan_fresh/text/mod.ts";

import { type HandlerContext, type Handlers } from "$fresh/server.ts";

export const style = {
  section: {
    marginTop: "2rem",
    marginBottom: "3rem",
  },
  header: { marginBlockStart: "1rem", marginBlockEnd: "0.5rem" },
};
export interface InternationalProps {
  lang: string;
  base: string;
  title: string;
}

export const extractRenderProps = (req: Request, ctx: HandlerContext) => {
  const { params } = ctx;
  const { pathname } = new URL(req.url);
  lang.value = params.lang;
  const title = t(pathname);
  const base = `/${params.lang}/${params.page}/`;
  return { lang, title, base, style };
};

export const handler: Handlers = {
  GET(req: Request, ctx: HandlerContext) {
    const props = extractRenderProps(req, ctx);
    return ctx.render(props);
  },
};
