import { Card, Page } from "akvaplan_fresh/components/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
export {
  handler,
  type InternationalProps,
  style,
} from "akvaplan_fresh/utils/page/international_page.ts";

import { PageProps, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(documents|doc|dokument|dok)",
};

export default function Documents(
  { data: { title, lang, base, style } }: PageProps<InternationalProps>,
) {
  return (
    <Page title={title} base={base} lang={lang}>
      <h1>
        <a href=".">{title}</a> [{t(`lang.${lang}`)}]
      </h1>

      <section style={style.section}>
        <h1 style={style.header}>{t("about.Policies")}</h1>
        <Card>
          <menu>
            <li>
              <a
                hreflang="no"
                href={t("policy.data.url")}
                target="_blank"
              >
                {t("policy.data")}
              </a>
            </li>
            <li>
              <a
                href={t("policy.quality.url")}
                target="_blank"
              >
                {t("policy.quality")}
              </a>
            </li>
            <li>
              <a href={t("policy.terms.url")} target="_blank">
                {t("policy.terms")}
              </a>
            </li>
            <li>
              <a
                href={t("policy.equality.url")}
                target="_blank"
              >
                {t("policy.equality")}
              </a>
            </li>
            <li>
              <a
                href={t("policy.gender.url")}
                target="_blank"
              >
                {t("policy.gender")}
              </a>
            </li>
          </menu>
        </Card>
      </section>

      Den første redegjørelsen for Akvaplan-nivas aktsomhetsvurderinger vil bli
      tilgjengelig her på virksomhetens nettsider innen 30. juni 2023
    </Page>
  );
}
