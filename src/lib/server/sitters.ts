import { eq } from 'drizzle-orm';
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

export async function updatePetSitter(params: InsertPetSitters) {
	try {
		if (params.id === undefined || typeof params.id !== 'number') {
			throw new Error('pet sitter id missing or incorrect type');
		}

		return await db.update(petSitters).set(params).where(eq(petSitters.id, params.id)).returning();
	} catch (e) {
		console.error(`error updating pet sitter: ${e}`);
		throw new Error(`update pet sitter failed`);
	}
}
