import { db } from './db';
import { petSitters, type InsertPetSitters } from './db/schema';

export async function getPetSitters() {
	try {
		return await db.select().from(petSitters).orderBy(petSitters.petId);
	} catch (e) {
		console.error(`failed to select sitter: ${e}`);
		throw new Error(`get pet sitters failed`);
	}
}

export async function addPetSitter(params: InsertPetSitters) {
	try {
		return await db.insert(petSitters).values(params).returning();
	} catch (e) {
		console.error(`error adding sitter: ${e}`);
		throw new Error(`add pet sitter failed`);
	}
}
