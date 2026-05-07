import { db } from './db';
import { petSitters } from './db/schema';

export async function getPetSitters() {
	try {
		return await db.select().from(petSitters).orderBy(petSitters.petId);
	} catch (e) {
		console.error(`failed to select sitter: ${e}`);
		throw new Error(`get pet sitters failed`);
	}
}
