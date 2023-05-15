import { Page } from "akvaplan_fresh/components/page.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";
export {
  handler,
  type InternationalProps,
} from "akvaplan_fresh/utils/page/international_page.ts";

import { PageProps, RouteConfig } from "$fresh/server.ts";
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(projects|prosjekt)",
};
export default function Projects(
  { data: { title, lang, base } }: PageProps<InternationalProps>,
) {
  return (
    <Page title={title} base={base}>
      <h1>
        <a href=".">{title}</a> [{t(`lang.${lang}`)}]
      </h1>
    </Page>
  );
}
