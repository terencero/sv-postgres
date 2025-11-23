import { addPet } from "$lib/server/pets";
import type { InsertPetProfiles } from "$lib/server/db/schema";
import { fail, type RequestEvent } from "@sveltejs/kit";
import { getUserId } from "$lib/server/users";


export const actions = {
  createPetProfile: async ({ request }: RequestEvent) => {
    type NewPet = InsertPetProfiles;
    const data = await request.formData();
    const userName = String(data.get('userName'));
    const userId = await getUserId(userName);
    console.log(`what is userId ${userName}`)

    if (userId.length > 1) {
      throw new Error('duplicate usernames...');
    }

    const params: NewPet = {
        name: data.get('pet')?.toString(),
        petType: data.get('petType')?.toString(),
        age: Number(data.get('age')?.toString()),
        dob: data.get('dob')?.toString(),
        weight: Number(data.get('weight')?.toString()),
        userId: userId[0].id,
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
