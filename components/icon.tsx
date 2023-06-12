// Icon component
//
// Run "deno task icons" to fetch icons here into static/icon/*.svg
// Icons are from Google's [Material Symbols](https://developers.google.com/fonts/docs/material_symbols#use_in_web)
import {
  fetchIcon,
  icons,
  svgMapFromStaticDir,
} from "akvaplan_fresh/utils/materialsymbols/mod.ts";

const svg = await svgMapFromStaticDir();

export const Icon = (
  { name = "", usehref, width = 44, height = 44, ...props } = {},
) =>
  usehref
    ? (
      // Referencing icon via <use href="…"/> requires pre-injecting SVG into the current page,
      // eg. using <HiddenIcons />
      <svg class="icon" width={width} height={height} {...props}>
        <use href={`#materialsymbols_${name}`} />
      </svg>
    )
    : (
      <svg
        width={width}
        height={height}
        class="icon"
        {...props}
        dangerouslySetInnerHTML={{ __html: svg.get(name) ?? "" }}
      />
    );

export const HiddenIcons = () => (
  <div
    hidden
    dangerouslySetInnerHTML={{ __html: [...svg.values()].join("") }}
  />
);
