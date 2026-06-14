<script lang="ts">
	import { page } from '$app/state';
	import Form from '$lib/components/Form.svelte';
	import MappedPetItems from '$lib/components/MappedPetItems.svelte';
	import { type PetSitters } from '$lib/server/db/schema.js';
	import { SvelteSet } from 'svelte/reactivity';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let showCreateForm = $state(false);
	let showUpdateForm = new SvelteSet<number>();

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

<article>
	<h1>Pet Sitting</h1>
	<article>
		<h2>Scheduled Sitters</h2>
		<button></button>

<button onclick={() => (showCreateForm = !showCreateForm)}>
	{#if showCreateForm}
		Hide Form
	{:else}
		Add a Sitter
	{/if}
</button>

		{#if !data.pets || !data.petSitters.length}
			'No Pets Have a Pet Sitter Reserved Yet.'
		{:else}
			<MappedPetItems pets={data.pets || []} items={data.petSitters || []} {card} />

			{#snippet card(pet: string, petSitters: PetSitters[] | [])}
				{#each petSitters as sitter (sitter?.id)}
					<article class="sitter-card">
						{pet}
						<h3>Sitter Details</h3>
						<div>
							<h4>Sitter Dates:</h4>
							<p>{sitter?.sitterStartDate || '05/05'} - {sitter.sitterEndDate || '05/10'}</p>
						</div>
						<div>
							<h4>Name:</h4>
							<p>{sitter.sitterName || 'sally'}</p>
						</div>
						<div>
							<h4>Phone Number:</h4>
							<p>123-456-7089</p>
						</div>
						<div>
							<h4>Address:</h4>
							<p>123 street street</p>
						</div>
						<div>
							<h4>email:</h4>
							<p>some-email@test.com</p>
						</div>
					</article>
				{/each}
			{/snippet}
		{/if}
	</article>
	<Form action={`${page.route.id}?/addNewPetSitter`} method="POST" {formCallback}>
		<label>
      Sitter Dates
      <input type='date' name='sitterDates' />
      </label>
		<label>
      Sitter Name
      <input type='text' name='sitterName' />
      </label>
		<label>
      Sitter Phone Number
      <input type='tel' name='sitterTel' />
      </label>
		<label>
      Pet Sitting Location
      <input type='text' name='petSittingLocation' />
      </label>
		<label>
      Sitter Email
      <input type='email' name='sitterEmail' />
      </label>
    <label>
      For:
      <select name="petName">
        {#each (data.pets || []).map(({ name }) => name || '') as option (option)}
          <option>{option}</option>
        {/each}
      </select>
    </label>
    <button>Add Sitter</button>
	</Form>
</article>

<style>
	.sitter-card {
		border: 0.2rem solid blue;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
		padding: 1.5rem;
		p {
			display: flex;
			gap: 1rem;
		}
	}
</style>
