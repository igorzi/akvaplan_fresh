import { Icon } from "akvaplan_fresh/components/icon.tsx";

export const AlbumHeader = ({ text, href, icon = "arrow_forward_ios" }) => (
  <span style={{ marginBlockStart: "0.25rem", fontSize: "var(--font-size-4)" }}>
    <a
      href={href}
      style={{ color: "var(--text1)" }}
    >
      {text} {/* <Icon name={icon} /> */}
    </a>
  </span>
);
