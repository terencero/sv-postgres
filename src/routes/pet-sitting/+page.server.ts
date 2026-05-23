import { getPetSitters } from '$lib/server/sitters';
import { error } from '@sveltejs/kit';

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

export const actions = {};
