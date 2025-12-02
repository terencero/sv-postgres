import { getPets } from "$lib/server/pets";
import { getTodosByUpcoming } from "$lib/server/todos";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  if (locals.user) {
    try {
      const pets = await getPets(locals.user.id);
      const todosByUpcoming = await getTodosByUpcoming(pets.map((pet) => pet.id));
      return {
        pets,
        user: locals.user.username,
        todosByUpcoming,
      };
    } catch(e) {
      console.error(`failed in layoutServerLoad: ${e}`);
    }
  }
  return {};
}
