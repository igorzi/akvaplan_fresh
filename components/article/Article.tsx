import { PropsWithChildren } from "preact";
import { asset, Head } from "$fresh/runtime.ts";

type ArticleProps = PropsWithChildren & {
  language: string;
};

export default function Article({ language, children }: ArticleProps) {
  return (
    <article class="article" lang={language}>
      <Head>
        <link rel="stylesheet" href={asset("/css/article.css")} />
      </Head>
      {children}
    </article>
  );
}
