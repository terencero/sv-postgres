<script lang="ts">
	import { page } from "$app/state";
	import Form, { type FormFields } from "$lib/components/Form.svelte";
	import type { HTMLFormAttributes } from "svelte/elements";

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
</script>

<h1>Todos</h1>

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
