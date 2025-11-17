import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { sql } from 'drizzle-orm';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = neon(env.DATABASE_URL);

export const db = drizzle(client, { schema });

export async function addPet(params: schema.InsertPetProfiles) {
  await db.insert(schema.petProfiles).values(params);
}

export async function getPets() {
  return await db.select().from(schema.petProfiles);
}

export async function getPet(petName: string) {
  try {
    return await db.select().from(schema.petProfiles).where(sql`lower(${schema.petProfiles.name}) = ${petName}`);
  } catch (e) {
    console.error(`wtf: ${e}`);
    throw new Error('getPet failed');
  }
}

export async function addSupply(params: schema.InsertSupplies) {
  try {
    return await db.insert(schema.supplies).values(params);
  } catch (e) {
    console.error(`wtf: ${e}`);
    throw new Error('addSupply failed');
  }
}
