<script lang="ts">
	import { resolve } from '$app/paths';
  import { pwaInfo } from 'virtual:pwa-info';
  import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

  let webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
	let { children } = $props();

  onMount(async () => {
    if (pwaInfo) {
      const { registerSW } = await import('virtual:pwa-register');
      registerSW({
        immediate: true,
        onRegistered(r) {
          console.log(`sw registered: ${r}`);
        },
      });
    }
  })
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
  {webManifestLink}
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
