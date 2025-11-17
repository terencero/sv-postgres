import { getPets } from "$lib/server/db";

export async function load() {
  const pets = await getPets();
  return {
    pets,
  }
}
