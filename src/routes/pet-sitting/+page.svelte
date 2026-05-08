<script lang="ts">
	import { page } from '$app/state';
	import Form from '$lib/components/Form.svelte';
	import type { FormFields } from '$lib/components/Form.svelte';
	import MappedPetItems from '$lib/components/MappedPetItems.svelte';
	import { type PetSitters } from '$lib/server/db/schema.js';
	import { SvelteSet } from 'svelte/reactivity';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let showCreateForm = $state(false);
	let showUpdateForm = new SvelteSet<number>();

	const FormTypes = {
		create: {
			method: 'POST',
			action: `${page.route.id}?/addSitter`,
		},
		update: {
			method: 'POST',
			action: `${page.route.id}?/updateSitter`,
		},
	} as const;
	let formFields: FormFields['fields'] = [
		{ label: 'Sitter Dates', type: 'date', name: 'sitterDates' },
		{ label: 'Sitter Name', type: 'text', name: 'sitterName' },
		{ label: 'Sitter Phone Number', type: 'tel', name: 'sitterTel' },
		{ label: 'Pet Sitting Location', type: 'text', name: 'petSittingLocation' },
		{ label: 'Sitter Email', type: 'email', name: 'sitterEmail' },
	];
	const formCallback = () => {};
</script>

<article>
	<h1>Pet Sitting</h1>
	<article>
		<h2>Scheduled Sitters</h2>
		<button>Add a Sitter</button>

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
	<Form fields={formFields} {...FormTypes.create} submitText="Add Sitter" {formCallback} />
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
