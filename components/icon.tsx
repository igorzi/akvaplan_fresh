// Icon component, currently bound to in-memory [Material Symbols](https://developers.google.com/fonts/docs/material_symbols#use_in_web) in SVG format, see also: https://github.com/google/material-design-icons

// Add icons (to /static/icon/*.svg) by extending this set and run "deno task icons"
const icons = new Set([
  "android",
  "arrow_back_ios_new",
  "arrow_forward_ios",
  "cell_tower",
  "contact_mail",
  "mail",
  "exit_to_app",
  "language",
  "phone_in_talk",
  "west",
  "search",
]);

const iconpath = (name: string) => `static/icon/${name}.svg`;

const iconurl = (name: string) =>
  `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${name}/wght300/48px.svg`;

const svgs = new Map();

for (const name of icons) {
  try {
    const path = iconpath(name);
    await Deno.stat(path);
    const svg = await Deno.readTextFile(path);
    svgs.set(name, svg);
  } catch (e) {
    console.error(e);
  }
}

export const Icon = ({ name, ...props } = {}) => {
  if (!icons.has(name)) {
    console.error(`Missing icon: "${name}"`);
  }
  return (
    <span
      {...props ?? {}}
      dangerouslySetInnerHTML={{ __html: svgs.get(name) }}
      class="icon"
    >
    </span>
  );
};

const fetchAndSaveIcons = async () => {
  for (const name of icons) {
    const url = iconurl(name);
    const r = await fetch(url);
    if (r.ok) {
      const path = iconpath(name);
      Deno.writeTextFile(path, await r.text());
      console.log({ path });
    }
  }
};

if (import.meta.main) {
  // deno task icons
  //console.log("@todo Icon, deno task icons must save to TSX, not SVG");
  fetchAndSaveIcons();
}
