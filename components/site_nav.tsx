import { siteNav } from "akvaplan_fresh/services/nav.ts";
import { SiteLangLinks } from "akvaplan_fresh/components/mod.ts";
import { Handlers, PageProps } from "$fresh/server.ts";

export function SiteNav() {
  return (
    <nav>
      <ol style={{ display: "grid", gridTemplateColumns: "1fr" }}>
        
        {siteNav.value.map(({ href, text }) => (
          <li>
            <a class="target" href={href} style={{ color: "var(--text2)" }}>
              {text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
