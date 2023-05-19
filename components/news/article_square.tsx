import { lang, t } from "../../text/mod.ts";
import { isodate } from "../../time/mod.ts";

export const ArticleSquare = (
  {
    title,
    name,
    published,
    duration,
    img,
    desc,
    href,
    hreflang,
    keywords,
    width,
    height,
    type,
  },
) => (
  <div
    class="halbum-image"
    style={{
      fontSize: "var(--font-size-fluid-0,1rem)",
      wordBreak: "break-word",
    }}
  >
    <a
      class="image-container"
      href={href}
      title={desc}
    >
      <img
        width={width}
        height={height}
        alt=""
        loading="lazy"
        src={img}
      />

      <p
        dangerouslySetInnerHTML={{ __html: title ?? name ?? "" }}
        style={{ textAlign: "left" }}
      />
    </a>
    <p>
      {duration ? duration : isodate(published)}{" "}
      {hreflang !== undefined && lang.value !== hreflang
        ? <span>({t(`lang.${hreflang}`)})</span>
        : null}
    </p>
  </div>
);

export const ArticleSq2 = (
  {
    title,
    name,
    published,
    img,
    desc,
    href,
    hreflang,
    keywords,
    width,
    height,
    type,
  },
) => (
  <div
    style={{
      fontSize: "var(--font-size-fluid-0,1rem)",
      wordBreak: "break-word",
    }}
  >
    <a
      class="image-container"
      href={href}
      title={desc}
    >
      <img
        width={width}
        height={height}
        alt=""
        loading="lazy"
        src={img}
      />

      <p
        dangerouslySetInnerHTML={{ __html: title ?? name ?? "" }}
        style={{ textAlign: "left" }}
      />
    </a>
    <p>
      {duration ? duration : isodate(published)}{" "}
      {hreflang !== undefined && lang.value !== hreflang
        ? <span>({t(`lang.${hreflang}`)})</span>
        : null}
    </p>
  </div>
);
