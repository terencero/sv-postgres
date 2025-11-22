import { addPet } from "$lib/server/pets";
import type { InsertPetProfiles } from "$lib/server/db/schema";
import { fail, type RequestEvent } from "@sveltejs/kit";


export const actions = {
  createPetProfile: async ({ request }: RequestEvent) => {
    type NewPet = InsertPetProfiles;
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
        message: `failed to create new pet profile: ${e}`,
      })
    }
  }
};
