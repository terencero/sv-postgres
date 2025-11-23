import { eq } from "drizzle-orm";
import { db } from "./db";
import { user } from "./db/schema";

export async function getUserId(userName: string): Promise<{ id: string; }[]> {
  return await db.select({ id: user.id }).from(user).where(eq(user.username, userName));
}
