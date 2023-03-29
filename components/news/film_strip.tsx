import { HScroll } from "akvaplan_fresh/components/hscroll/HScroll.tsx";
import { MiniNews } from "./mini_news.tsx";
import { News } from "akvaplan_fresh/services/news.ts";

type NewsFilmStripProps = {
  news: News[];
};

export function NewsFilmStrip({ news }: NewsFilmStripProps) {
  return (
    <HScroll>
      {news.map(({ title, href, caption, published, thumb }) => (
        <MiniNews
          img={thumb}
          href={href}
          title={title}
          caption={caption}
          published={published}
        />
      ))}
    </HScroll>
  );
}