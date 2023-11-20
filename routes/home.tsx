import { getServicesLevel0 } from "akvaplan_fresh/services/svc.ts";
import { getResearchLevel0 } from "akvaplan_fresh/services/research.ts";
import { latestNews } from "akvaplan_fresh/services/news.ts";
import {
  latestProjects,
  newsFromProjects,
} from "akvaplan_fresh/services/projects.ts";
import { routesForLang } from "akvaplan_fresh/services/nav.ts";
import { getLangFromURL, lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  AlbumHeader,
  ArticleSquare,
  HScroll,
  MoreNews,
  NewsFilmStrip,
  Page,
  //WhyUs,
} from "akvaplan_fresh/components/mod.ts";

import { Handlers, RouteConfig } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import NewsArticle from "./article/[slug].tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

const level0 = ({ level }) => level === 0;

const _section = {
  marginTop: "2rem",
  marginBottom: "3rem",
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const sitelang = getLangFromURL(req.url);
    lang.value = sitelang;

    const limit = 64;
    const q = "";

    const news = await latestNews({ q, lang: sitelang, limit });

    const services = await getServicesLevel0(sitelang);

    const topics = await getResearchLevel0(sitelang);

    //projects

    const maxNumNews = 32;
    const articles = news.filter(({ type, hreflang, title }) =>
      ["news", "pressrelease", "blog_post"].includes(type) &&
      hreflang === sitelang &&
      !/stillingsannonse/i.test(title)
    ).slice(
      0,
      maxNumNews,
    );
    const articlesNotInSiteLang = news.filter(({ type, hreflang, title }) =>
      ["news", "pressrelease"].includes(type) &&
      hreflang !== sitelang &&
      !/stillingsannonse/i.test(title)
    ).slice(
      0,
      maxNumNews,
    );

    const researchArticles = news.filter(({ type }) =>
      ["journal-article"].includes(type)
    )
      .slice(
        0,
        16, //maxNumNews,
      );

    const projects = (await latestProjects()).map((myn) =>
      newsFromProjects({ lang: sitelang })(myn)
    );

    return ctx.render({
      news,
      services,
      topics,
      lang,
      articles,
      articlesNotInSiteLang,
      //researchArticles,
      projects,
    });
  },
};
// console.log(
//   "@todo Home & other routes: use asset() for all references css files",
// );
export default function Home(
  {
    data: {
      news,
      topics,
      lang,
      services,
      articles,
      articlesNotInSiteLang,
      //researchArticles,
      projects,
    },
  },
) {
  const maxVisNews = 5.5;
  const maxVisResearchServices = 6.5;

  return (
    <Page>
      <Head>
        <link rel="stylesheet" href={asset("/css/mini-news.css")} />
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/hscroll-dynamic.css")} />
        <link rel="stylesheet" href={asset("/css/article.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>

      <NewsFilmStrip news={news} lang={lang.value} />

      <section style={_section}>
        <AlbumHeader
          text={t(`home.section.${lang}.articles`)}
          href={routesForLang(lang).get("news")}
        />
        <HScroll scrollerId="hscroll-articles" maxVisibleChildren={maxVisNews}>
          {articles.map(ArticleSquare)}
        </HScroll>
      </section>

      <section style={_section}>
        <AlbumHeader
          text={t("home.section.articles_not_in_site_lang")}
          href={routesForLang(lang).get("news")}
          _lang="en|no"
        />
        {
          /* <span style={{ fontSize: "1rem" }}>
          {t(`news.Only_in_alt_lang`)} {t(`lang.alt.${lang}`)}
        </span> */
        }
        <HScroll
          scrollerId="hscroll-articles-no-sitemap"
          maxVisibleChildren={maxVisNews}
        >
          {articlesNotInSiteLang.map(ArticleSquare)}
        </HScroll>
      </section>

      {
        /* <section style={_section}>
        <AlbumHeader
          text={t("pubs.Latest_peer_reviewed_research_articles")}
          href={routes(lang).get("pubs") + "?q=journal-article"}
        />
        <HScroll maxVisibleChildren={maxVisNews}>
          {researchArticles.map(ArticleSquare)}
        </HScroll>
      </section> */
      }

      <section style={_section}>
        <AlbumHeader
          text={t("home.section.services")}
          href={routesForLang(lang).get("services")}
        />
        <HScroll
          scrollerId="hscroll-services"
          maxVisibleChildren={Math.min(
            services?.length,
            maxVisResearchServices,
          )}
        >
          {services.map(ArticleSquare)}
        </HScroll>
      </section>

      <section style={_section}>
        <AlbumHeader
          text={t("home.section.research")}
          href={routesForLang(lang).get("research")}
        />
        <HScroll
          scrollerId="hscroll-topics"
          maxVisibleChildren={Math.min(topics?.length, maxVisResearchServices)}
        >
          {topics?.map(ArticleSquare)}
        </HScroll>
      </section>

      {
        /* <section style={_section}>
        <AlbumHeader
          text={t(`home.section.projects`)}
          href={routes(lang).get("projects")}
        />
        <HScroll scrollerId="hscroll-articles" maxVisibleChildren={maxVisNews}>
          {projects.map(ArticleSquare)}
        </HScroll>
      </section> */
      }

      {
        /* <AlbumHeader
        text={t("home.section.projects")}
        href={routes(lang).get("projects")}
      />
        */
      }

      {/* Research facilities (Fisk Loise) Sensor platforms */}
    </Page>
  );
}
