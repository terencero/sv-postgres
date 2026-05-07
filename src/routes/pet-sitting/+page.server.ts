import { getPetSitters } from '$lib/server/sitters';
import { error } from '@sveltejs/kit';

export async function load() {
	const petSitters = await getPetSitters();

	if (!petSitters.length) {
		error(404, {
			message: 'Pet sitters not found',
		});
	}

	return {
		petSitters,
	};
}
