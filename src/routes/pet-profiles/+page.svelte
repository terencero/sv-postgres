<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Form from '$lib/components/Form.svelte';

	// not sure why i can't just put the string directly in the formFields obj.
	// somehow svelte knows that this one is a Constant when typed like this.
	let { data } = $props();
	let showForm = $state(false);
</script>

<h1>Pet Profiles</h1>

{#if data.user}
	{#each data.pets as { id, name, petType, weight, dob, age } (id)}
		<div>
			<p>{name}</p>
			<p>{petType}</p>
			<p>Weight: {weight}</p>
			<p>Date of Birth: {dob}</p>
			<p>age: {age}</p>
		</div>
	{/each}

	<button onclick={() => (showForm = !showForm)}>
		{#if showForm}
			Hide Form
		{:else}
			Add a Pet
		{/if}
	</button>

	{#if showForm}
		<Form action={`${page.route.id}?/createPetProfile`} method="POST">
			<input type="hidden" name="userName" value={data.user} />
			<label
				>name your pet
				<input type="text" name="pet" />
			</label>
			<label
				>What type of animal?
				<input type="text" name="petType" />
			</label>
			<label
				>pet age
				<input type="text" name="age" />
			</label>
			<label
				>date of birth
				<input type="date" name="dob" />
			</label>
			<label
				>weight
				<input type="number" name="weight" />
			</label>
			<button aria-label="create pet profile"> create pet profile </button>
		</Form>
	{/if}
{:else}
	<p><a href={resolve('/')}>Login or Register</a> to create and see your pet(s)!</p>
{/if}

<style>
	div {
		border: 0.2rem solid blue;
		border-radius: 1em;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
		padding: 1.5rem;

		p {
			margin: 0;
		}
	}
</style>
