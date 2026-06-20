<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import MappedPetItems from '$lib/components/MappedPetItems.svelte';
	import { type PetSitters } from '$lib/server/db/schema.js';
	import { SvelteSet } from 'svelte/reactivity';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let showCreateForm = $state(false);
	let showUpdateForm = new SvelteSet<number>();

	const handleEditClick = (sitterId: number): void => {
		if (showUpdateForm.has(sitterId)) {
			showUpdateForm.delete(sitterId);
		} else {
			showUpdateForm.add(sitterId);
		}
	};

	const formCallback = (): void => {
		if (form?.success) {
			if (form.actionType === 'updatePetSitter') {
				showUpdateForm.delete(form.petSitterId);
			} else if (form.actionType === 'addPetSitter') {
				showCreateForm = !showCreateForm;
			}
		}
	};
</script>

<article>
	<h1>Pet Sitting</h1>
	<h2>Scheduled Sitters</h2>

	<button onclick={() => (showCreateForm = !showCreateForm)}>
		{#if showCreateForm}
			Hide Form
		{:else}
			Add a Sitter
		{/if}
	</button>

	{#snippet formContents(petSitter?: PetSitters)}
		{#if petSitter}
			<input type="hidden" name="id" value={petSitter.id} />
		{/if}
		<fieldset>
			<legend>Sitter Dates</legend>
			<label>
				Sitter Start Date
				<input type="date" name="sitterStartDate" value={petSitter?.sitterStartDate} />
			</label>

			<label
				>Sitter End Date
				<input type="date" name="sitterEndDate" value={petSitter?.sitterEndDate} />
			</label>
		</fieldset>
		<label>
			Sitter Name
			<input type="text" name="sitterName" value={petSitter?.sitterName} />
		</label>
		<label>
			Sitter Phone Number
			<input type="tel" name="sitterTel" value={petSitter?.sitterTel} />
		</label>
		<label>
			Pet Sitting Location
			<input type="text" name="petSittingLocation" value={petSitter?.sittingLocation} />
		</label>
		<label>
			Sitter Email
			<input type="email" name="sitterEmail" value={petSitter?.sitterEmail} />
		</label>
		<label>
			For:
			<select name="petName">
				{#each (data.pets || []).map(({ name }) => name || '') as option (option)}
					<option>{option}</option>
				{/each}
			</select>
		</label>
	{/snippet}

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
						<p>{sitter.sitterTel}</p>
					</div>
					<div>
						<h4>Address:</h4>
						<p>{sitter.sittingLocation}</p>
					</div>
					<div>
						<h4>email:</h4>
						<p>{sitter.sitterEmail}</p>
					</div>

					<button onclick={() => handleEditClick(sitter.id)}>
						{showUpdateForm.has(sitter.id) ? 'hide' : 'edit'}
					</button>
					{#if showUpdateForm.has(sitter.id)}
						<Form action="?/updatePetSitter" method="POST" {formCallback}>
							{@render formContents(sitter)}
							<button aria-label="edit">edit</button>
						</Form>
					{/if}
				</article>
			{/each}
		{/snippet}
	{/if}

	<Form action="?/addPetSitter" method="POST" {formCallback}>
		{@render formContents()}
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
