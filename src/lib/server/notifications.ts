import { db } from "./db";

export async function saveSubscription(sub) {
  // TODO: update db table with subscription fields
  await db.insert().values(sub);
}
