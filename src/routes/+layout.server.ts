import { getPets } from "$lib/server/pets";

export async function load() {
  const pets = await getPets();
  return {
    pets,
  }
}
