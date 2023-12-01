import { seed } from "./kv/jobs/seed.ts";
Deno.cron("sync external data to kv", "*/30 * * * *", () => seed());
