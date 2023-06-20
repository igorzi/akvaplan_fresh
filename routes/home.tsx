import { homeAlbums } from "akvaplan_fresh/services/mediebank.ts";
import { getServicesLevel0 } from "akvaplan_fresh/services/svc.ts";
import { getResearchLevel0 } from "akvaplan_fresh/services/research.ts";
import { latestNews } from "akvaplan_fresh/services/news.ts";
import { routes } from "akvaplan_fresh/services/nav.ts";
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

    const services = await getServicesLevel0(sitelang);

    const news = await latestNews({ q, lang: sitelang, limit });

    const topics = await getResearchLevel0(sitelang);

    const maxNumNews = 32;
    const articles = news.filter(({ type, hreflang, title }) =>
      ["news", "pressrelease"].includes(type) && hreflang === sitelang &&
      !/stillingsannonse/i.test(title)
    ).slice(
      0,
      maxNumNews,
    );
    const articlesNotInSiteLang = news.filter(({ type, hreflang, title }) =>
      ["news"].includes(type) &&
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

    return ctx.render({
      news,
      services,
      topics,
      lang,
      articles,
      articlesNotInSiteLang,
      researchArticles,
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
      researchArticles,
    },
  },
) {
  const maxVisNews = 4.5; //5.5;
  const maxVisResearchServices = 4.5; //6.5;

  return (
    <Page>
      <Head>
        <link rel="stylesheet" href={asset("/css/mini-news.css")} />
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/hscroll-dynamic.css")} />
        <link rel="stylesheet" href={asset("/css/article.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>

      <NewsFilmStrip news={news} lang={lang.value} BeforeAfter={MoreNews} />

      <section style={_section}>
        <AlbumHeader
          text={t(`home.album.${lang}.articles`)}
          href={routes(lang).get("news")}
        />
        <HScroll maxVisibleChildren={maxVisNews}>
          {articles.map(ArticleSquare)}
        </HScroll>
      </section>

      <section style={_section}>
        <AlbumHeader
          text={t("home.album.articles_not_in_site_lang")}
          href={routes(lang).get("news")}
          _lang="en|no"
        />
        {
          /* <span style={{ fontSize: "1rem" }}>
          {t(`news.Only_in_alt_lang`)} {t(`lang.alt.${lang}`)}
        </span> */
        }
        <HScroll maxVisibleChildren={maxVisNews}>
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
          text={t("home.album.services")}
          href={routes(lang).get("services")}
        />
        <HScroll
          maxVisibleChildren={Math.min(services?.length, 6.5)}
        >
          {services.map(ArticleSquare)}
        </HScroll>
      </section>

      <section style={_section}>
        <AlbumHeader
          text={t("home.album.research")}
          href={routes(lang).get("research")}
        />
        <HScroll maxVisibleChildren={Math.min(topics?.length, 6.5)}>
          {topics?.map(ArticleSquare)}
        </HScroll>
      </section>

      {
        /* <AlbumHeader
        text={t("home.album.projects")}
        href={routes(lang).get("projects")}
      />
        */
      }

      {/* Research facilities (Fisk Loise) Sensor platforms */}
    </Page>
  );
}
