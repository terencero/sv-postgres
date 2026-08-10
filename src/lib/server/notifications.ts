import { db } from "./db";

export async function saveSubscription(subParams) {
  // TODO: update db table with subscription fields
  await db.insert().values(subParams);
}
