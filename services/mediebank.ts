// Albums for / are statically imported for performance
import _home0 from "https://mediebank.deno.dev/albums/505?limit=6" assert {
  type: "json",
};
import _home1 from "https://mediebank.deno.dev/albums/501?limit=7" assert {
  type: "json",
};
import _home2 from "https://mediebank.deno.dev/albums/527?limit=5" assert {
  type: "json",
};

const base = "https://mediebank.deno.dev";

const simplify512 = ({ previews, ...image }) => {
  const preview512 = previews.find(({ width }) => 512 === width) ??
    previews.at(0);
  return ({
    ...image,
    previews: [preview512],
  });
};

//const a505 = "fieldwork";
//const a440 = "glider";
// search:
// https://mediebank.deno.dev/api/v1/apps/assets?query=${query}&limit=
const _albums = [_home0, _home1, _home2].map(({ data }) =>
  data.map(simplify512).filter((_, i) => i < 12)
);

export const homeAlbums = () => new Map(_albums.map((a, i) => [`alb.${i}`, a]));

export const albums = new Map<string, unknown>([
  ["services", _albums[0]],
]);

export const thumbnail = (id: number) => new URL(`/thumbnail_big/${id}`, base);

export const preview = (id: number) => new URL(`/preview/${id}`, base);
