<script lang="ts">
	import { resolve } from '$app/paths';
import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
  <a href={resolve("/")}>Home</a>
  <a href={resolve("/todos")}>Todos</a>
  <a href={resolve("/pet-profiles")}>My Pet(s)</a>
  <a href={resolve("/supplies")}>Pet Supplies</a>
</nav>
<main>
 {@render children()}
</main>

<style>
  nav {
    display: flex;
    margin: 2rem 2rem 1rem;
    justify-content: space-evenly;
  }
  main {
    padding: 5rem;
  }
</style>
