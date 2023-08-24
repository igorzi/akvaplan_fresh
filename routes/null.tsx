import { Page } from "akvaplan_fresh/components/page.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";
import type {
  InternationalProps,
} from "akvaplan_fresh/utils/page/international_page.ts";

import { PageProps, RouteConfig } from "$fresh/server.ts";
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(null|0)",
};

export default function N0ll(props: InternationalProps) {
  const { title, lang, base } = props;
  return (
    <Page title={title} base={base}>
      <h1>
        <a href=".">{title}</a> [{t(`lang.${lang}`)}]
      </h1>
    </Page>
  );
}
