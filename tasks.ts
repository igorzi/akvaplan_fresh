import {
  fetchIcon,
  icons as materialsymbols,
  processIcon,
  svgMapFromStaticDir,
} from "akvaplan_fresh/utils/materialsymbols/mod.ts";

const iconDir = "static/icon";

const iconPath = (name: string) => `${iconDir}/${name}.svg`;

const fetchAndSaveMaterialSymbolIcons = async (list: Set<string>) => {
  for (const name of list) {
    const text = await fetchIcon(name);
    const path = iconPath(name);
    Deno.writeTextFile(path, processIcon(text, name));
    console.log({ path });
  }
};

const taskIcons = async (_args: string[] = []) => {
  await fetchAndSaveMaterialSymbolIcons(materialsymbols);

  const hamburger_menu_right = await Deno.readTextFile(
    new URL(import.meta.resolve("./static/icon/hamburger_menu_right.svg")),
  );
  const map = await svgMapFromStaticDir();
  map.set("hamburger_menu_right", hamburger_menu_right);
  // for (const name of materialsymbols) {
  //   const _svg = await Deno.readTextFile(
  //     new URL(import.meta.resolve(`./static/icon/${name}.svg`)),
  //   );
  //   const svg = processIcon(_svg, name);
  //   entries.push([name, svg]);
  // }
  Deno.writeTextFile("components/icons.json", JSON.stringify([...map]));
};

const tasks = new Map([
  ["icons", taskIcons],
]);

if (import.meta.main) {
  const [task] = Deno.args;
  if (tasks.has(task)) {
    await tasks.get(task)!(Deno.args.slice(1));
  }
}
