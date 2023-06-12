import {
  fetchIcon,
  iconDir,
  icons,
  processIcon,
} from "akvaplan_fresh/utils/materialsymbols/mod.ts";

const iconPath = (name: string) => `static/icon/${name}.svg`;

const fetchAndSaveIcons = async (_args: string[]) => {
  for (const name of icons) {
    const text = await fetchIcon(name);
    const path = iconPath(name);
    Deno.writeTextFile(path, processIcon(text, name));
    console.log({ path });
  }
};

const tasks = new Map([
  ["icons", fetchAndSaveIcons], // Add icons (to /static/icon/*.svg) by expanding the `icons` set and run "deno task icons"
]);

if (import.meta.main) {
  const [task] = Deno.args;
  if (tasks.has(task)) {
    await tasks.get(task)!(Deno.args.slice(1));
  }
}
