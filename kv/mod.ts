/// <reference lib="deno.unstable" />
export const db = globalThis?.Deno && Deno.env.has("deno_kv_database")
  ? Deno.env.get("deno_kv_database")
  : undefined;

export const openKv = async (path = db) => {
  if (path) {
    console.warn("Opening KV", db);
  }
  return await Deno.openKv(path);
};
