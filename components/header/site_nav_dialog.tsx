import { ApnLogo, Icon, SiteNav } from "akvaplan_fresh/components/mod.ts";

import { t } from "akvaplan_fresh/text/mod.ts";

export const SiteNavDialog = ({ lang }) => (
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
        <button>
          <Icon name="close" width="1.5rem" height="1.5rem" />
          {t("menu.close")}
        </button>
      </form>
    </footer>
  </dialog>
);
