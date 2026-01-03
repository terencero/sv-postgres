import { addTodo, deleteTodo, getTodos, getTodosByUpcoming, updateTodo } from "$lib/server/todos";
import { getPet, getPets } from "$lib/server/pets";
import type { InsertTodos } from "$lib/server/db/schema"
import { error, fail } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function load() {
  const todos = await getTodos();

  if (!todos.length) {
    error(404, {
      message: 'Todos not found',
    });
  }
  
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
      dueTime: String(data.get('dueTime')) || null,
      complete: Boolean(data.get('complete') ?? false),
      repeats: String(data.get('repeats')),
      label: String(data.get('label')),
      notes: String(data.get('notes')),
      petName: String(data.get('petName')).toLowerCase(),
    };

    try {
      const [ { id: petId } ] = await getPet(formFieldValues.petName);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { petName, ...rest } = formFieldValues;
      console.log(`pet id: ${petId}`)
      const params: NewTodo = {
        petId,
        ...rest,
      };

      const [newTodo] = await addTodo(params);

      return {
        success: true,
        actionType: 'addTodo',
        todoId: newTodo.id,
      };
    } catch (e) {
      console.error(`addTodo failed: ${e}`);

      if (e instanceof Error) {
        return fail(422, {
          description: `not sure what this is ${e}`,
          error: e.message,
        });
      }

      throw e;
    }
  },
  updateTodo: async ({ request }: RequestEvent) => {
    type UpdatedTodo = InsertTodos;

    const data = await request.formData();
    const formFieldValues = {
      title: String(data.get('title')),
      dueDate: String(data.get('dueDate')),
      dueTime: String(data.get('dueTime')) || null,
      complete: Boolean(data.get('complete') ?? false),
      repeats: String(data.get('repeats')),
      label: String(data.get('label')),
      notes: String(data.get('notes')),
      petName: String(data.get('petName')).toLowerCase(),
      id: Number(data.get('id')),
    };

    try {
      const params: UpdatedTodo = {
        ...formFieldValues,
      };
      const [updatedTodo] = await updateTodo(params);

      return {
        success: true,
        todoId: updatedTodo.id,
        actionType: 'updateTodo',
      };
    } catch (e) {
      console.error(`updateTodo failed: ${e}`);

      if (e instanceof Error) {
        return fail(422, {
          description: `not sure what this is ${e}`,
          error: e.message,
        });
      }
      
      throw e;
    }
  },
  completeTodo: async ({ request }: RequestEvent) => {
    const data = await request.formData();
    
    const formFieldValues = {
      complete: Boolean(data.get('complete')),
      id: Number(data.get('id')),
    };

    try {
      await updateTodo(formFieldValues);
    } catch(e) {
      console.error(`completeTodo 'aka updateTodo' failed: ${e}`);

      if (e instanceof Error) {
        return fail(422, {
          description: `not sure what this is ${e}`,
          error: e.message,
        });
      }
      
      throw e;
    }
  },
  deleteTodo: async ({ request }: { request: Request }) => {
    try {
      const data = await request.formData();

      await deleteTodo(Number(data.get('id')));
    } catch(e) {
      console.error(`deleteTodo failed: ${e}`);

      if (e instanceof Error) {
        return fail(422, {
          description: `not sure what this is ${e}`,
          error: e.message,
        });
      }
      
      throw e;
    }
  },
  setNotificationsDateRangePicker: async ({ request, locals }: RequestEvent) => {
    try {
      if (!locals.user) {
        return fail(422, {
          description: 'failed to set notification range.',
          error: 'user not signed in.'
        });
      }

      const pets = await getPets(locals.user?.id);
      const data = await request.formData();
      const notificationRange = String(data.get('notification-range'));
      const dateRange = Number(data.get('after'));

      let range;
      const now = new Date();

      switch (notificationRange) {
        case 'days': {
          range = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dateRange);

          break;
        }
        case 'weeks': {
          range = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dateRange  * 7);
          break;
        }
        case 'custom': {
          const future = new Date(dateRange);

          if (now > future) {
            console.warn('date range is less than today');
            break;
          }

          range = future;
          break;
        }
        default:
          console.warn('no date range was set');
      }

      if (range === undefined) {
        return fail(422, {
          description: 'cannot set the notification range.',
          error: 'date range cannot be undefined.'
        })
      }

      // not working because both hooks and layout.server run before this nested page.server...
      // in that order.
      // and locals lives on the request object so it's state is based on each request and 
      // therefore, not persisted...
      const todosByUpcoming = await getTodosByUpcoming(pets.map(pet => pet.id), range);

      return { todosByUpcoming };
    } catch (e) {
      console.error(`setting todo notification range failed: ${e}`);

      if (e instanceof Error) {
        return fail(422, {
          description: `not sure what this is ${e}`,
          error: e.message,
        });
      }
      
      throw e;
    }
  },
  setReminder() {
    // TODO:reminders
 }
}
