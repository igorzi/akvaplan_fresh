import { ApnLogo } from "akvaplan_fresh/components/mod.ts";
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import borders from "open-props/src/props.borders.js";
import { SiteMenu } from "./site_menu.tsx";
export function CleanHeader(
  {
    href = "/",
    lang = langSignal.value,
    Logo = ApnLogo,
    Right = SiteMenu,
    Left = () => <div />,
  },
) {
  return (
    <header
      id="top"
      style={{
        margin: 0,
        padding: borders["--border-size-3"],
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "1fr auto 1fr",
        color: "var(--text1)",
        placeItems: "end",
      }}
    >
      <Left lang={lang} />
      <a href={href}>
        <Logo />
      </a>
      <Right lang={lang} />
    </header>
  );
}
