export const icons = new Set([
  "android",
  "arrow_back_ios_new",
  "arrow_forward_ios",
  "cell_tower",
  "close",
  "contact_mail",
  "mail",
  "exit_to_app",
  "language",
  "phone_in_talk",
  "west",
  "search",
  "sms_failed",
]);
export const iconurl = (name: string) =>
  `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${name}/wght300/48px.svg`;

export const processIcon = (text, name) =>
  text.replace(/(width|height)="[0-9]+"/g, "")
    .replace(
      'xmlns="http://www.w3.org/2000/svg"',
      `id="materialsymbols_${name}" fill="currentColor"`,
    )
    .replace(
      /\s{2,}/g,
      " ",
    );

export const fetchIcon = async (name: string) => {
  const url = iconurl(name);
  const r = await fetch(url);
  if (r.ok) {
    return await r.text();
  }
};

export const iconDir = () => new URL("../../static/icon", import.meta.url);

export const svgMapFromStaticDir = async (
  dir = iconDir(),
) => {
  const svg = new Map<string, string>();
  for await (
    const { name, isFile } of Deno.readDir(dir)
  ) {
    if (isFile && /\.svg$/.test(name)) {
      const r = await fetch([dir, name].join("/"));
      if (r.ok) {
        svg.set(name.replace(".svg", ""), await r.text());
      }
    }
  }
  return svg;
};
