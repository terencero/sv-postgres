<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Form, { type FormFields } from '$lib/components/Form.svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';

  // not sure why i can't just put the string directly in the formFields obj.
  // somehow svelte knows that this one is a Constant when typed like this.
  let { data } = $props();
  let showForm = $state(false);

  const method: HTMLFormAttributes['method'] = 'POST';
  const action = `${page.route.id}?/createPetProfile`
  const formFields: FormFields = {
    action,
    method,
    submitText: 'create pet profile',
    fields: [
      { label: 'name your pet', type: 'text', name: 'pet' },
      { label: 'What type of animal?', type: 'text', name: 'petType' },
      { label: 'pet age', type: 'text', name: 'age' },
      { label: 'date of birth', type: 'date', name: 'dob' },
      { label: 'weight', type: 'number', name: 'weight' },
    ],
  }
</script>

<h1>Pet Profiles</h1>

{#if data.user }
  {#each data.pets as { id, name, petType, weight, dob, age } (id)}
    <div>
      <p>{name}</p>
      <p>{petType}</p>
      <p>Weight: {weight}</p>
      <p>Date of Birth: {dob}</p>
      <p>age: {age}</p>
    </div>
  {/each}


  <button onclick={() => showForm = !showForm}>
    {#if showForm}
      Hide Form
    {:else}
      Add a Pet
    {/if}
  </button>

  {#if showForm}
    <Form userName={data.user} {...formFields} />
  {/if}
  {:else}
  <p><a href={resolve('/')}>Login or Register</a> to create and see your pet(s)!</p>
{/if}


<style>
  div {
    border: .2rem solid blue;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1.5rem;
  }
</style>
