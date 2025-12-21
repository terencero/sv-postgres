<script lang="ts">
  import Form, { type FormFields } from "$lib/components/Form.svelte";
  import { page } from "$app/state";
	import type { Supplies } from "$lib/server/db/schema";
	import MappedPetItems from "$lib/components/MappedPetItems.svelte";
	import { enhance } from "$app/forms";
	import { SvelteSet } from "svelte/reactivity";

  let { data, form } = $props();
  let showCreateForm = $state(false);
  let showUpdateForm = new SvelteSet<number>();

  const FormTypes = {
    create: {
      method: 'POST',
      action: `${page.route.id}?/addNewSupply`,
    },
    update: {
      method: 'POST',
      action: `${page.route.id}?/updateSupply`,
    }
  } as const

  let formFields: FormFields['fields'] = [
      { label: 'What kind of supply? ex: food or litter', type: 'text', name: 'supplyType' },
      { label: 'How many or much?', type: 'number', name: 'inventory' },
      { label: 'Description ex: jrand', type: 'text', name: 'description' },
      { label: 'Supply for:', type: 'select', name: 'petName', selectOptions: (data.pets || []).map(({ name }) => name || '') },
    ];

  const handleEditClick = (supplyId: number) => {
    if (showUpdateForm.has(supplyId)) {
      showUpdateForm.delete(supplyId);
    } else {
      showUpdateForm.add(supplyId);
    }
  }

  const formCallback = () => {
    if (form?.success) {
      if (form.actionType === 'updateSupply') {
        showUpdateForm.delete(form.supplyId);
      } else if (form.actionType === 'addSupply') {
        showCreateForm = !showCreateForm;
      }
    }
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
        <form action="?/deleteSupply" method="POST" use:enhance>
          <input type="hidden" name="id" value={supply.id}>

          <p><b>Supply Type:</b> {supply.supplyType}</p>
          <p><b>Inventory:</b> {supply.inventory}</p>
          <p><b>Description:</b> {supply.description}</p>

          <button aria-label="Delete Supply">Delete Supply</button>
        </form>
        <button onclick={() => handleEditClick(supply.id)}>
          {showUpdateForm.has(supply.id) ? 'hide' : 'edit'}
        </button>
        {#if showUpdateForm.has(supply.id)}
          <Form
            data={supply}
            {...FormTypes.update}
            fields={[{ label: 'id', type: 'hidden', name: 'id', value: String(supply.id) }, ...formFields]}
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
    Add a supply
  {/if}
</button>
{#if showCreateForm}
  <Form
    fields={formFields}
    {...FormTypes.create}
    submitText='Add a supply'
    {formCallback}
  />
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
