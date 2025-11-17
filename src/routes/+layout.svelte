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
  <a href={resolve("/about")}>About</a>
  <a href={resolve("/pet-profiles")}>My Pet(s)</a>
  <a href={resolve("/supplies")}>Pet Supplies</a>
</nav>
<main>
 {@render children()}
</main>

<style>
  nav {
    margin: 2rem 2rem 1rem;
    gap: 2rem;
  }
  main {
    padding: 5rem;
  }
</style>
