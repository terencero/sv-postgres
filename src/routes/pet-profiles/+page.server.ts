import { addPet, getPets } from "$lib/server/db";
import type { InsertPetProfile } from "$lib/server/db/schema";
import { fail } from "@sveltejs/kit";

export async function load() {
  const pets = await getPets();
  return {
    pets,
  }
}

export const actions = {
  createPetProfile: async ({ request }: { request: Request }) => {
    type NewPet = InsertPetProfile;
    const data = await request.formData();
    const params: NewPet = {
        name: data.get('pet')?.toString(),
        petType: data.get('petType')?.toString(),
        age: Number(data.get('age')?.toString()),
        dob: data.get('dob')?.toString(),
        weight: Number(data.get('weight')?.toString()),
    }
    try {
      await addPet(params);
    } catch (e) {
      return fail(422, {

      })
      console.error(`failed to create new pet profile: ${e}`);
    }
  }
};
