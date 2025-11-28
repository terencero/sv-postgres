<script lang="ts">
  import Form, { type FormFields } from "$lib/components/Form.svelte";
  import type { HTMLFormAttributes } from "svelte/elements";
  import { page } from "$app/state";
	import type { Supplies } from "$lib/server/db/schema";
	import MappedPetItems from "$lib/components/MappedPetItems.svelte";

  let { data } = $props();
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
      { label: 'Supply for:', type: 'select', name: 'petName', selectOptions: (data.pets || []).map(({ name }) => name || '') },
    ],
  }
</script>

<h1>Pet Supplies</h1>

<MappedPetItems
  pets={data.pets || []}
  items={data.supplies || []}
  {card}
/>

{#snippet card(pet: string, supplies: Supplies[])}
  <div>
    {pet}
    {#each supplies as supply (supply.id)}
      <div>
        <p><b>Supply Type:</b> {supply.supplyType}</p>
        <p><b>Inventory:</b> {supply.inventory}</p>
        <p><b>Description:</b> {supply.description}</p>
      </div>
    {/each}
  </div>
{/snippet}

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

<style>
  div {
    border: .2rem solid blue;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1.5rem;
    p {
      gap: 1rem;
    }
  }
</style>
