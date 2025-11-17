<script lang="ts">
  import Form, { type FormFields } from "$lib/components/Form.svelte";
  import type { HTMLFormAttributes } from "svelte/elements";
  import { page } from "$app/state";
	import type { SelectSupplies } from "$lib/server/db/schema";

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
      { label: 'Supply for:', type: 'text', name: 'petName' },
    ],
  }
  type Supplies = Omit<SelectSupplies, "created_at" | "deleted_at" | "updated_at">;
  interface PetSupplyMapping {
    [idx: string]: Supplies[]; 
  }
  const petSupplyMapping = data.pets.reduce((acc: PetSupplyMapping, pet) => {
    if (pet.name && !acc[pet.name]) {
      acc[pet.name] = data.supplies.filter((supply) => supply.petId === pet.id);
      
      return acc;
    }
    
    return acc;
  }, {});
</script>

<h1>Pet Supplies</h1>
{#each data.supplies as { id, supplyType, inventory, description } (id) }
  <div>
    <p><b>Type:</b> {supplyType}</p>
    <p><b>Inventory:</b> {inventory}</p>
    <p><b>Description:</b> {description}</p>
  </div>
{/each}

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
