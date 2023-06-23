import { t } from "akvaplan_fresh/text/mod.ts";
import { JSX } from "preact";
import IconButton from "../components/button/icon_button.tsx";

// Here t breaks down (always translates to NO (at first ok, presumably on server, but after browser load it fails ?:/)
// aria-label={props.label ?? t("menu.open_menu")}
// title={props.label ?? t("menu.open_menu")}
const handleClick = (e: MouseEvent) => {
  const query = e?.target?.dataset?.for ?? "dialog";
  const dialog = e.target?.ownerDocument?.querySelector(query);
  if (dialog) {
    const { open } = dialog;
    if (open) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }
};

export default ({ children, ...props }: JSX.HTMLAttributes<HTMLElement>) => (
  <IconButton
    onClick={handleClick}
    icon="hamburger_menu_right"
    iconHeight="1.5rem"
    iconWidth="1.5rem"
  ></IconButton>
);
