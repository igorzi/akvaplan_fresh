import { Icon, SiteNavDialog } from "akvaplan_fresh/components/mod.ts";
import ButtonOpenDialog from "akvaplan_fresh/islands/button_open_dialog.tsx";

export const SiteMenu = ({ lang }) => (
  <span
    class="header-end"
    style={{
      display: "grid",
      justifyContent: "end",
    }}
  >
    <nav>
      <ButtonOpenDialog for="dialog#menu" lang={lang} />
    </nav>
    <SiteNavDialog lang={lang} />
  </span>
);
// Note: regular translations using t in ButtonOpenDialog text gives circularity issues
