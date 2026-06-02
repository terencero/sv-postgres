import type { InsertPetSitters } from '$lib/server/db/schema';
import { getPet } from '$lib/server/pets';
import { getPetSitters } from '$lib/server/sitters';
import { error, fail } from '@sveltejs/kit';

export async function load() {
	try {
		const petSitters = await getPetSitters();

		if (!petSitters.length) {
			return { petSitters: [] };
		}

		return {
			petSitters,
		};
	} catch (e) {
		error(404, {
			message: `${e}`,
		});
	}
}

export const actions = {
  addNewPetSitter: async ({ request }: { request: Request }) =>{
    type NewPetSitter = InsertPetSitters;

    const data = await request.formData();
    const formFieldValues = {
      sitterDates: String(data.get('sitterDates')),
      sitterName: String(data.get('sitterName')),
      sitterTel: String(data.get('sitterTel')),
      petSittingLocation: String(data.get('petSittingLocation')),
      sitterEmail: String(data.get('sitterEmail')),
      petName: String(data.get('petName')),
    };

    try {
      const [{ id: petId }] = await getPet(formFieldValues.petName);
    } catch (e) {
      if (e instanceof Error) {
        return fail(422, {
          description: 'failure creating a new pet sitter card',
          error: e.message,
        });
      }

    }
  }
};
