<script lang="ts">
	import { page } from "$app/state";
	import Form, { type FormFields } from "$lib/components/Form.svelte";
	import type { Todos } from "$lib/server/db/schema";
	import roundCheck from "$lib/assets/roundCheck.svg";
  import roundX from "$lib/assets/roundX.svg";
	import type { PageProps } from "./$types";
	import MappedPetItems from "$lib/components/MappedPetItems.svelte";
	import { SvelteSet } from "svelte/reactivity";
	import { enhance } from "$app/forms";
  
  const FormTypes = {
    create: {
      method: 'POST',
      action: `${page.route.id}?/addNewTodo`,
    },
    update: {
      method: 'POST',
      action: `${page.route.id}?/updateTodo`,
    }
  } as const

  let { data, form }: PageProps = $props();
  let showCreateForm = $state(false);
  let showUpdateForm = new SvelteSet<number>();

  const formFields: FormFields['fields'] = [
      { label: 'Todo Title: ', type: 'text', name: 'title' },
      { label: 'Due Date: ', type: 'date', name: 'dueDate' },
      { label: 'Due Time: ', type: 'time', name: 'dueTime' },
      { label: 'Done: ', type: 'checkbox', name: 'complete' },
      { label: 'Repeats: ', type: 'select', name: 'repeats', selectOptions: ['daily', 'weekly', 'monthly', 'yearly'] },
      { label: 'Label: ', type: 'text', name: 'label' },
      { label: 'Notes: ', type: 'textarea', name: 'notes' },
      { label: 'For my pet: ', type: 'text', name: 'petName' },
    ];

  const handleEditClick = (todoId: number) => {
    if (showUpdateForm.has(todoId)) {
      showUpdateForm.delete(todoId);
    } else {
      showUpdateForm.add(todoId);
    }
  }

  const formCallback = () => {
    if (form?.success) {
      if (form.actionType === 'updateTodo') {
        showUpdateForm.delete(form.todoId);
      } else if (form.actionType === 'addTodo') {
        showCreateForm = !showCreateForm;
      }
    }
  }
</script>

<h1>Todos</h1>

<span>message from form data: {form?.description}</span>

<MappedPetItems
  pets={data.pets || []}
  items={data.todos || []}
  {card}
/>

{#snippet card(pet: string, todos: Todos[])}
  <div>
    {pet}
    {#each todos as todo (todo.id)}
      <div id={`${String(todo.id)}-${todo.title}`}>
        <form method="POST" action="?/completeTodo" use:enhance>
          <input type="hidden" name="id" value={todo.id} />
          <p><b>Title: </b>{todo.title}</p>
          <p><b>Due Date: </b>{todo.dueDate} at {todo.dueTime}</p>
          <p><b>Done: </b>
            <input type="hidden" name="complete" value={!todo.complete} />
            {#if todo.complete}
              <img src={roundCheck} alt="round checkmark">
            {:else}
              <img src={roundX} alt="round x mark">
            {/if}
          </p>
          <p><b>Repeats: </b>{todo.repeats || "once"}</p>
          <p><b>Label: </b>{todo.label}</p>
          <p><b>Notes: </b>{todo.notes}</p>
          <button aria-label="Mark Complete">Mark Complete</button>
        </form>
        <form method="POST" action="?/deleteTodo" use:enhance>
          <input type="hidden" name="id" value={todo.id} />
          <button aria-label="Delete">Delete</button>
        </form>
        <button onclick={() => handleEditClick(todo.id)}>
          {showUpdateForm.has(todo.id) ? 'hide' : 'edit'}
        </button>
        {#if showUpdateForm.has(todo.id)}
          <Form
            data={todo}
            {...FormTypes.update}
            fields={[{ label: 'id: ', type: 'hidden', name: 'id', value: String(todo.id) }, ...formFields]}
            submitText='edit'
            {formCallback}
          />
        {/if}
      </div>
    {/each}
  </div>
{/snippet}

<button onclick={() => showCreateForm = !showCreateForm}>
  {#if showCreateForm}
    Hide Form
  {:else}
    Add a Todo
  {/if}
</button>

{#if showCreateForm}
  <Form
    {...FormTypes.create}
    fields={formFields}
    submitText='Add a Todo'
    {formCallback}
  />
{/if}

<style>
  div {
    border: .2rem solid blue;
    border-radius: 1.5%;
    display: flex;
    flex-direction: column;
    gap: .2rem;
    margin-bottom: 1rem;
    padding: 1.5rem;
    p {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin: 0;
    }
  }
  img {
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
