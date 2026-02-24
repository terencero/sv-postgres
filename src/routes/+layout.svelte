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
    margin: 2rem 2rem 0;
    padding: .5rem 0;
    justify-content: space-evenly;
    background-color: deepskyblue;
  }

  @media (max-width: 768px) {
    :global(body) {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      margin-bottom: 0;
    }
    nav {
      position: sticky;
      order: 2;
      bottom: 0;
    }
    main {
      flex: 1;
      order: 1;
      padding: 1rem;
    }
  }
</style>
