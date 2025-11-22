import { db } from "./db";
import { supplies, type InsertSupplies } from "./db/schema";

export async function addSupply(params: InsertSupplies) {
  try {
    return await db.insert(supplies).values(params);
  } catch (e) {
    console.error(`wtf: ${e}`);
    throw new Error('addSupply failed');
  }
}

export async function getSupplies() {
  try {
    return await db.select().from(supplies).orderBy(supplies.petId);
  } catch (e) {
    console.error(`wtf: ${e}`);
    throw new Error('getSupplies failed');
  }
}

