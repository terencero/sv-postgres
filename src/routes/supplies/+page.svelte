<script lang="ts">
	import Form, { type FormFields } from "$lib/components/Form.svelte";
	import type { HTMLFormAttributes } from "svelte/elements";
  import { page } from "$app/state";


let showForm = $state(false);
  const method: HTMLFormAttributes['method'] = 'POST';
  // for some reason, defining this directly in the formFields obj always adds a trailing
  // slash after route id and before "?"
  const action = `${page.route.id}?/addNewSupply`;
  let formFields: FormFields = {
    action,
    method,
    submitText: 'Add a Supply',
    fields: [
      { label: 'What kind of supply? ex: food or litter', type: 'text', name: 'supplyType' },
      { label: 'How many or much?', type: 'number', name: 'inventory' },
      { label: 'Description ex: brand', type: 'text', name: 'description' },
      { label: 'Supply for:', type: 'text', name: 'petName' },
    ],
  }
</script>

<h1>Pet Supplies</h1>

<button onclick={() => showForm = !showForm}>
  {#if showForm}
    Hide Form
  {:else}
    Add a supply
  {/if}
</button>
{#if showForm}
  <Form {...formFields} />
{/if}
