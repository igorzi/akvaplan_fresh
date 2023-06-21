import { ApnLogo, Icon, SiteNav } from "akvaplan_fresh/components/mod.ts";
import ThemeSwitcher from "akvaplan_fresh/islands/theme_switcher.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";

export default ({ lang }) => (
  <dialog
    id="menu"
    color-scheme
    style={{
      border: "0",
      background: "var(--surface1) 0.2",
      color: "var(--text1)",
    }}
  >
    <header>
      <a
        href="/"
        aria-label={t("nav.go_home")}
        style={{ marginTop: "1rem" }}
      >
        <ApnLogo />
      </a>
    </header>

    <menu
      style={{
        margin: 0,
        marginBlockStart: "1rem",
        marginBlockEnd: "1rem",
        display: "grid",
        placeItems: "center",
        color: "var(--text1)",
      }}
    >
      <SiteNav />
    </menu>
    <footer
      style={{
        display: "grid",
        placeItems: "center",
      }}
    >
      <form method="dialog">
        <button
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            margin: 0,
            padding: "0.5rem",
            border: 0,
          }}
          aria-label={t("menu.close")}
          title={t("menu.close")}
        >
          <Icon name="close" width="1.5rem" height="1.5rem" />
        </button>
      </form>
      <ThemeSwitcher mini />
    </footer>
  </dialog>
);
