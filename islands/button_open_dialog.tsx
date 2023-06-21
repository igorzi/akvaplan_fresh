import { Icon } from "akvaplan_fresh/components/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { JSX } from "preact";

// Here t breaks down (always translates to NO (at first ok, presumably on server, but after browser load it fails ?:/)
// aria-label={props.label ?? t("menu.open_menu")}
// title={props.label ?? t("menu.open_menu")}
const handleClick = (e: MouseEvent) => {
  const query = e?.target?.dataset?.for ?? "dialog";
  const dialog = e.target?.ownerDocument?.querySelector(query);
  if (dialog) {
    const { open } = dialog;
    if (open) {
      //
    } else {
      dialog.showModal();
    }
  }
};

export default (
  { children, ...props }: JSX.HTMLAttributes<HTMLElement>,
) => (
  <button
    onClick={handleClick}
    style={{ fontSize: "var(--font-size-1)", color: "var(--text2)" }}
    {...props}
  >
    {children}
    <Icon name="hamburger_menu_right" height="1.5rem" width="1.5rem" />
    <span style="display: none">{props.lang === "no" ? "meny" : "menu"}</span>
  </button>
);
