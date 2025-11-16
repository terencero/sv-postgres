<script lang="ts">
	import PetProfileForm from '$lib/components/PetProfileForm.svelte';

  let { data } = $props();
  let showForm = $state(false);
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
  <PetProfileForm />
{/if}
<style>
</style>
