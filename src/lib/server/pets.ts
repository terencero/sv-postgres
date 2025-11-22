import { sql } from "drizzle-orm";
import { db } from "./db";
import { petProfiles, type InsertPetProfiles } from "./db/schema";

export async function addPet(params: InsertPetProfiles) {
  await db.insert(petProfiles).values(params);
}

export async function getPets() {
  return await db.select().from(petProfiles);
}

export async function getPet(petName: string) {
  try {
    return await db.select().from(petProfiles).where(sql`lower(${petProfiles.name}) = ${petName}`);
  } catch (e) {
    console.error(`wtf: ${e}`);
    throw new Error('getPet failed');
  }
}
