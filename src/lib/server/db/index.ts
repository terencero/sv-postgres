import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = neon(env.DATABASE_URL);

export const db = drizzle(client, { schema });

export async function addPet(params: schema.InsertPetProfiles) {
  await db.insert(schema.petProfiles).values(params);
}

export async function getPets() {
  return await db.select().from(schema.petProfiles);
}
