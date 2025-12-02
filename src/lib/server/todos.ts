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

export async function getTodosByUpcoming(petId: number[], limit = new Date()) {
  try {
    return await db.query.todos.findMany({
      where: (todos, { gte, and, inArray }) => and(
        gte(todos.dueDate.getSQL(), limit),
        inArray(todos.petId, petId)
      ),
      orderBy: (todos, { asc }) => asc(todos.dueDate),
    });
  } catch(e) {
    console.error(`failed to get todosByUpcoming: ${e}`);
  }
}
