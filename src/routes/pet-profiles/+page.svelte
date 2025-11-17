<script lang="ts">
	import Form from '$lib/components/Form.svelte';

  let { data } = $props();
  let showForm = $state(false);
  const formFields = {
    action: 'createPetProfile',
    method: 'POST',
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
{#each data.pets as { id, name, petType, weight, dob, age } (id)}
  <p>{name}</p>
  <p>{petType}</p>
  <p>Weight: {weight}</p>
  <p>Date of Birth: {dob}</p>
  <p>age: {age}</p>
{/each}


<button onclick={() => showForm = !showForm}>
  {#if showForm}
    Hide Form
  {:else}
    Add a Pet
  {/if}
</button>
{#if showForm}
  <Form {formFields} />
{/if}
<style>
</style>
