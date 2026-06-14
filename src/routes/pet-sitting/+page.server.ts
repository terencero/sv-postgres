import type { InsertPetSitters } from '$lib/server/db/schema';
import { getPet } from '$lib/server/pets';
import { addPetSitter, getPetSitters, updatePetSitter } from '$lib/server/sitters';
import { error, fail } from '@sveltejs/kit';
import type { RequestEvent } from '../$types';

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
	addPetSitter: async ({ request }: { request: Request }) => {
		type NewPetSitter = InsertPetSitters;

		const data = await request.formData();
		const formFieldValues = {
			sitterStartDate: String(data.get('sitterStartDate')),
			sitterEndDate: String(data.get('sitterEndDate')),
			sitterName: String(data.get('sitterName')),
			sitterTel: String(data.get('sitterTel')),
			petSittingLocation: String(data.get('petSittingLocation')),
			sitterEmail: String(data.get('sitterEmail')),
			petName: String(data.get('petName')).toLowerCase(),
		};

		try {
			const [{ id: petId }] = await getPet(formFieldValues.petName);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { petName, ...rest } = formFieldValues;
			const params: NewPetSitter = {
				petId,
				...rest,
			};
			const [newPetSitter] = await addPetSitter(params);

			return {
				success: true,
				petSitterId: newPetSitter.id,
				actionType: 'addPetSitter',
			};
		} catch (e) {
			if (e instanceof Error) {
				return fail(422, {
					description: 'failure creating a new pet sitter card',
					error: e.message,
				});
			}
		}
	},

	updatePetSitter: async ({ request }: RequestEvent) => {
		const data = await request.formData();
		const formFields = {
			id: Number(data.get('id')),
			sitterStartDate: String(data.get('sitterStartDate')),
			sitterEndDate: String(data.get('sitterEndDate')),
			sitterName: String(data.get('sitterName')),
			sitterTel: String(data.get('sitterTel')),
			petSittingLocation: String(data.get('petSittingLocation')),
			sitterEmail: String(data.get('sitterEmail')),
			petName: String(data.get('petName')).toLowerCase(),
		};

		try {
			const [updatedPetSitter] = await updatePetSitter(formFields);

			return {
				success: true,
				petSitterId: updatedPetSitter.id,
				actionType: 'updatePetSitter',
			};
		} catch (e) {
			if (e instanceof Error) {
				return fail(422, {
					description: 'update pet sitter failure',
					error: e.message,
				});
			}
		}
	},
};
