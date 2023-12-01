import { seedMynewsdesk } from "./seed_mynewsdesk.ts";

export const seed = async () => {
  await seedMynewsdesk();
};

if (import.meta.main) {
  await seed();
}
