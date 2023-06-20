import {
  fetchIcon,
  icons,
  processIcon,
} from "akvaplan_fresh/utils/materialsymbols/mod.ts";

const iconPath = (name: string) => `static/icon/${name}.svg`;

// const fetchAndSaveIcons = async (_args: string[]) => {
//   for (const name of icons) {
//     const text = await fetchIcon(name);
//     const path = iconPath(name);
//     Deno.writeTextFile(path, processIcon(text, name));
//     console.log({ path });
//   }
// };

const hamburger_menu_right =
  `<svg id="hamburger_menu_right" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z" /></svg>`;

const fetchAndSaveIconTSX = async (_args: string[]) => {
  const entries = [["hamburger_menu_right", hamburger_menu_right]];
  for (const name of icons) {
    const _text = await fetchIcon(name);
    const text = processIcon(_text, name);
    entries.push([name, text]);
  }
  Deno.writeTextFile("components/icons.json", JSON.stringify(entries));
};

const tasks = new Map([
  //["icons-save", fetchAndSaveIcons], // Add icons (to /static/icon/*.svg) by expanding the `icons` set and run "deno task icons"
  ["icons", fetchAndSaveIconTSX],
]);

if (import.meta.main) {
  const [task] = Deno.args;
  if (tasks.has(task)) {
    await tasks.get(task)!(Deno.args.slice(1));
  }
}
