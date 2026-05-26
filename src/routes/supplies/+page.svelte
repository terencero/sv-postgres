<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import { page } from '$app/state';
	import type { Supplies } from '$lib/server/db/schema';
	import MappedPetItems from '$lib/components/MappedPetItems.svelte';
	import { enhance } from '$app/forms';
	import { SvelteSet } from 'svelte/reactivity';

	let { data, form } = $props();
	let showCreateForm = $state(false);
	let showUpdateForm = new SvelteSet<number>();

	const handleEditClick = (supplyId: number) => {
		if (showUpdateForm.has(supplyId)) {
			showUpdateForm.delete(supplyId);
		} else {
			showUpdateForm.add(supplyId);
		}
	};

	const formCallback = () => {
		if (form?.success) {
			if (form.actionType === 'updateSupply') {
				showUpdateForm.delete(form.supplyId);
			} else if (form.actionType === 'addSupply') {
				showCreateForm = !showCreateForm;
			}
		}
	};
</script>

<h1>Pet Supplies</h1>

<button onclick={() => (showCreateForm = !showCreateForm)}>
	{#if showCreateForm}
		Hide Form
	{:else}
		Add a supply
	{/if}
</button>

{#if showCreateForm}
	<Form action={`${page.route.id}?/addNewSupply`} method="POST" {formCallback}>
		{@render formContents()}
		<button aria-label="add supply">Add Supply</button>
	</Form>
{/if}

<MappedPetItems pets={data.pets || []} items={data.supplies || []} {card} />

{#snippet formContents(supply?: Supplies)}
  {#if supply}
    <input type="text" hidden value={supply.id}>
  {/if}
	<label>
		'What kind of supply? ex: food or litter'
		<input type="text" name="supplyType" value={supply?.supplyType || ''} />
	</label>
	<label>
		How many or much?
		<input type="number" name="inventory" value={supply?.inventory || ''} />
	</label>
	<label>
		Description ex: brand
		<input type="text" name="description" value={supply?.description || ''} />
	</label>
	{#if !supply}
		<label>
			Supply for:
			<select name="petName">
				{#each (data.pets || []).map(({ name }) => name || '') as option (option)}
					<option>{option}</option>
				{/each}
			</select>
		</label>
	{/if}
{/snippet}

{#snippet card(pet: string, supplies: Supplies[])}
	<div>
		{pet}
		{#each supplies as supply (supply.id)}
			<div>
				<form action="?/deleteSupply" method="POST" use:enhance>
					<input type="hidden" name="id" value={supply.id} />

					<p><b>Supply Type:</b> {supply.supplyType}</p>
					<p><b>Inventory:</b> {supply.inventory}</p>
					<p><b>Description:</b> {supply.description}</p>

					<button aria-label="Delete Supply">Delete Supply</button>
				</form>
				<button onclick={() => handleEditClick(supply.id)}>
					{showUpdateForm.has(supply.id) ? 'hide' : 'edit'}
				</button>
				{#if showUpdateForm.has(supply.id)}
					<Form action={`${page.route.id}?/updateSupply`} method="POST" {formCallback}>
            {@render formContents(supply)}
            <button aria-label="edit">edit</button>
          </Form>
				{/if}
			</div>
		{/each}
	</div>
{/snippet}

<style>
	div {
		border: 0.2rem solid blue;
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
