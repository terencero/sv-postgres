import { db } from "./db";
import { todos, type InsertTodos } from "./db/schema";

export async function addTodo(params: InsertTodos) {
  try {
    await db.insert(todos).values(params);
  } catch(e){
    console.error(`addTodo failed: ${e}`);
    throw new Error('addTodo failed');
  }
}

export async function getTodos() {
  try {
    return await db.select().from(todos).orderBy(todos.petId);
  } catch (e) {
    console.error(`wtf: ${e}`);
    throw new Error('getTodos failed');
  }
}

export async function getTodosByUpcoming(limit = new Date()) {
  try {
    return await db.query.todos.findMany({
      where: (todos, { gte }) => gte(todos.dueDate.getSQL(), limit),
      orderBy: (todos, { asc }) => asc(todos.dueDate),
    });
  } catch(e) {
    console.error(`failed to get todosByUpcoming: ${e}`);
  }
}
