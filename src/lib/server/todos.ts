import { desc, sql } from "drizzle-orm";
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

export async function getTodosByUpcoming() {
  try {
    return await db.query.todos.findMany({
      where: (todos, { lt }) => lt(todos.dueDate.getSQL(), new Date(2025, 10, 22)),
      orderBy: (todos, { asc }) => asc(todos.dueDate),
    });
  } catch(e) {
    console.error(`failed to get todosByUpcoming: ${e}`);
  }
}
