import { ApnLogo } from "akvaplan_fresh/components/mod.ts";
import { lang as langSignal } from "akvaplan_fresh/text/mod.ts";
import { SiteMenu } from "./site_menu.tsx";
export function CleanHeader(
  {
    href = "/",
    lang = langSignal.value,
    Logo = ApnLogo,
  },
) {
  return (
    <header
      id="top"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        color: "var(--text1)",
      }}
    >
      <a href={href} style={{ margin: "1rem", padding: "0rem" }}>
        <Logo />
      </a>
      <SiteMenu lang={lang} />
    </header>
  );
}
