import { addTodo, getPet, getTodos } from "$lib/server/db";
import type { InsertTodos } from "$lib/server/db/schema"
import { fail } from "@sveltejs/kit";

export async function load() {
  const todos = await getTodos();
  return {
    todos,
  };
}

export const actions = {
  addNewTodo: async ({ request }: { request: Request }) => {
    type NewTodo = InsertTodos;

    const data = await request.formData();
    const formFieldValues = {
      title: String(data.get('title')),
      dueDate: String(data.get('dueDate')),
      dueTime: String(data.get('dueTime')),
      complete: Boolean(data.get('complete') ?? false),
      recurring: Boolean(data.get('recurring') ?? false),
      label: String(data.get('label')),
      notes: String(data.get('notes')),
      petName: String(data.get('petName')).toLowerCase(),
    };

    try {
      const [ { id: petId } ] = await getPet(formFieldValues.petName);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { petName, ...rest } = formFieldValues;
      const params: NewTodo = {
        petId,
        ...rest,
      };

      await addTodo(params);
    } catch (e) {
      return fail(422, {
        description: `not sure what this is ${e}`,
        error: e.message,
      });
    }
  }
}
