export {
  handler as _handler,
  type InternationalProps,
  style,
} from "akvaplan_fresh/utils/page/international_page.ts";

import {
  //buildoiNewsMap,
  doiImage,
  findAkvaplanist,
  findPriorAkvaplanist,
  getOpenAlexWork,
  getSlimPublication,
  personURL,
  pubsURL,
} from "akvaplan_fresh/services/mod.ts";

import { ApnSym, Card, Icon, Page } from "akvaplan_fresh/components/mod.ts";

import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";

import { SlimPublication } from "akvaplan_fresh/@interfaces/slim_publication.ts";

import {
  HandlerContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";

//import { Akvaplanist } from "../@interfaces/akvaplanist.ts";

//import { Head } from "$fresh/runtime.ts";

export const config: RouteConfig = {
  routeOverride: "{/:lang(en|no)}?/doi/:prefix/:suffix0/:extra*",
};

const doiFromParams = (params: Record<string, string>) => {
  const { suffix0, extra, prefix } = params;
  const suffix = !extra ? suffix0 : `${suffix0}/${extra}`;
  return `${prefix}/${suffix}`;
};

export const handler: Handlers<SlimPublication> = {
  async GET(request: Request, ctx: HandlerContext) {
    const { params } = ctx;
    const lang = params.lang;

    langSignal.value = lang;
    const doi = doiFromParams(params);
    const slim = await getSlimPublication(doi);

    if (slim) {
      //const news = await buildoiNewsMap() ?? {};
      const openalex = await getOpenAlexWork({ doi }) ?? {};
      const image = await doiImage.get(doi);
      let i = 0;
      let current = 0;
      let priors = 0;
      for await (const person of (slim.authors ?? [])) {
        const { given, family, name } = person;
        person.name = name ?? `${given} ${family}`;
        const { id } = await findAkvaplanist({ given, family }) ?? {};
        if (id) {
          current++;
          person.id = id;
        } else {
          const prior = await findPriorAkvaplanist({ given, family });

          if (prior) {
            priors++;
            person.prior = true;
            //console.debug({ prior, given, family });
            if (prior.id) {
              person.id = prior.id;
            }
          }
        }
        slim.authors[i++] = person;
      }

      return ctx.render({ slim, openalex, lang, image, current, priors });
    } else {
      return ctx.renderNotFound();
    }
  },
};

export default function DoiPublication(
  { params, data: { slim, openalex, lang, image, current, priors } }: PageProps<
    { slim: SlimPublication; image: string }
  >,
) {
  const {
    title,
    type,
    license,
    printed,
    published,
    container,
    authors,
    doi,
    cites,
    ...rest
  } = slim;
  const {
    open_access: {
      is_retracted,
      is_paratext,
      is_oa,
      oa_status,
      oa_url,
      any_repository_has_fulltext,
    },
  } = openalex || {};
  const oa = license && /cc/i.test(license) ? true : oa_status;
  const pdf = slim?.pdf || oa_url;
  const href = `https://doi.org/${doi}`;

  return (
    <Page title={title}>
      <article>
        <Card>
          <h1
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p>
            <em dangerouslySetInnerHTML={{ __html: container || "?" }} />{" "}
            (<time>{printed ?? published}</time>)
          </p>
          <p>
            <a
              target="_blank"
              href={`https://doi.org/${doi}`}
            >
              https://doi.org/{doi}
            </a>
          </p>
          {oa === true ? t("pubs.oa") : t("pubs.restricted")}
          {oa_status}
          <p>
            {license && image && (
              <img src={image} alt={t("")} width="400" height="225" />
            )}
          </p>
        </Card>
        <div style={{ marginTop: "2rem" }} />
        <Card>
          <h2 style={{ color: "var(--accent)" }}>
            {authors.length > 1 ? t("pubs.Authors") : t("pubs.Author")}
          </h2>
          {current > 0 && (
            <p style={{ fontSize: "1rem" }}>
              <ApnSym width="1rem" height="1rem" /> {current > 0 && current}
              {" "}
              Akvaplan-niva ({t("people.akvaplanist(now)")})
            </p>
          )}
          {priors > 0 && (
            <p style={{ fontSize: "1rem" }}>
              <ApnSym
                width="1rem"
                height="1rem"
                style="filter: grayscale(1)"
              />{" "}
              {priors > 0 && priors}{" "}
              Akvaplan-niva ({t("people.akvaplanist(prior)")})
            </p>
          )}
          <dl style={{ fontSize: "1rem" }}>
            {authors.map(({ name, given, family, id, prior }, n) => (
              <>
                <dt>
                  {id || prior
                    ? (
                      <span>
                        <a href={personURL({ id, given, family, lang })}>
                          {name}
                        </a>{" "}
                        <ApnSym
                          width="1rem"
                          height="1rem"
                          style={prior ? { filter: "grayscale(1)" } : {}}
                        />
                      </span>
                    )
                    : <span>{name}</span>}
                </dt>

                {openalex.authorships.at(n)?.institutions.map((
                  { display_name, id, ror, country_code, type, ...r },
                ) => <dd lang="en">{display_name}</dd>)}
              </>
            ))}
          </dl>
        </Card>
        <div style={{ marginTop: "2rem" }} />
        <Card>
          <h2 style={{ color: "var(--accent)" }}>
            Metadata
          </h2>
          <dl style={{ fontSize: "1rem" }}>
            <dt>type</dt>
            <dd>{t(`type.${type}`)}</dd>

            <dt>{t("pubs.license")}</dt>
            <dd>
              {license ? license.toUpperCase() : t("license.None_or_unknown")}
            </dd>

            <dt>OpenAlex</dt>
            <dd>
              <a
                target="_blank"
                href={openalex.id}
              >
                {openalex.id}
              </a>
            </dd>

            {pdf && (
              <>
                <dt>pdf/{t("pubs.fulltext")}</dt>
                <dd>
                  <a download href={pdf}>{pdf}</a>
                </dd>
              </>
            )}
          </dl>
        </Card>
        <nav>
          {t("nav.Back_to")} <Icon name="west" hidden />
          <a href={pubsURL()}>{t("nav.Pubs")}</a>
        </nav>
      </article>
    </Page>
  );
}

// FIXME: DOI from hell: /no/doi/10.1577/1548-8659(1994)123%3C0385:spbpac%3E2.3.co;2
