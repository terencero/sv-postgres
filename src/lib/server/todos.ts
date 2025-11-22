import { db } from "./db";
import { todos, type InsertTodos } from "./db/schema";

export async function addTodo(params: InsertTodos) {
  await db.insert(todos).values(params);
}

export async function getTodos() {
  try {
    return await db.select().from(todos).orderBy(todos.petId);
  } catch (e) {
    console.error(`wtf: ${e}`);
    throw new Error('getTodos failed');
  }
}
