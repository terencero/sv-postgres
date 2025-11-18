<script lang="ts">
	import { page } from "$app/state";
	import Form, { type FormFields } from "$lib/components/Form.svelte";
	import type { HTMLFormAttributes } from "svelte/elements";

  let showForm = $state(false);

  const method: HTMLFormAttributes['method'] = 'POST';
  // TODO: create a server action
  const action = `${page.route.id}?`;
  const formFields: FormFields = {
    action,
    method,
    submitText: 'Add a Todo',
    fields: [],
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
