import { getPets } from "$lib/server/pets";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  if (locals.user) {
    const pets = await getPets();
    return {
      pets,
      user: locals.user.username,
    };
  }
  return {};
}
