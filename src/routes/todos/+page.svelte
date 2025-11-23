<script lang="ts">
	import { page } from "$app/state";
	import Form, { type FormFields } from "$lib/components/Form.svelte";
	import type { SelectTodos } from "$lib/server/db/schema";
	import type { HTMLFormAttributes } from "svelte/elements";
  import roundCheck from "$lib/assets/roundCheck.svg";
  import roundX from "$lib/assets/roundX.svg";
	import type { PageProps } from "./$types";
  
  let { data, form }: PageProps = $props();
  let showForm = $state(false);

  const method: HTMLFormAttributes['method'] = 'POST';
  const action = `${page.route.id}?/addNewTodo`;
  const formFields: FormFields = {
    action,
    method,
    submitText: 'Add a Todo',
    fields: [
      { label: 'Todo Title: ', type: 'text', name: 'title' },
      { label: 'Due Date: ', type: 'date', name: 'dueDate' },
      { label: 'Due Time: ', type: 'time', name: 'dueTime' },
      { label: 'Done: ', type: 'checkbox', name: 'complete' },
      { label: 'Repeats: ', type: 'checkbox', name: 'recurring' },
      { label: 'Label: ', type: 'text', name: 'label' },
      { label: 'Notes: ', type: 'text', name: 'notes' },
      { label: 'For my pet: ', type: 'text', name: 'petName' },
    ],
  };

  type Todos = Omit<SelectTodos, "created_at" | "deleted_at" | "update_at">;
  interface PetTodoMapping {
    [pet: string]: Todos[]
  }
// TODO: extract this to a reusable function (supplies and todos)
  const petTodoMapping = (data.pets || []).reduce((acc: PetTodoMapping, pet) => {
    if (pet.name && !acc[pet.name]) {
      acc[pet.name] = data.todos.filter((todo) => todo.petId === pet.id);

      return acc;
    }

    return acc;
  }, {});
</script>

<h1>Todos</h1>
<span>message from form data: {form?.description}</span>
{#each Object.entries(petTodoMapping) as [pet, todos] (pet) }
  <div>
    {pet}
    {#each todos as todo (todo.id) }
      <div>
        <p><b>Title: </b>{todo.title}</p>
        <p><b>Due Date: </b>{todo.dueDate} at {todo.dueTime}</p>
        <p><b>Done: </b>
          {#if todo.complete}
            <img src={roundCheck} alt="round checkmark">
          {:else}
            <img src={roundX} alt="round x mark">
          {/if}
        </p>
        <p><b>Repeats: </b>
          {#if todo.recurring}
            <img src={roundCheck} alt="round checkmark" />
          {:else}
            <img src={roundX} alt="round x mark" />
          {/if}
        </p>
        <p><b>Label: </b>{todo.label}</p>
        <p><b>Notes: </b>{todo.notes}</p>
      </div>
    {/each}
  </div>
{/each}

<button onclick={() => showForm = !showForm}>
  {#if showForm}
    Hide Form
  {:else}
    Add a Todo
  {/if}
</button>

{#if showForm}
  <Form {...formFields} />
{/if}
<style>
  div {
    border: .2rem solid blue;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1.5rem;
    p {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
  }
  img {
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
