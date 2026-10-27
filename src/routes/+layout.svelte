<script lang="ts">
	import './layout.css';
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="rounded-full border border-white bg-sky-500/20 shadow-lg backdrop-blur-[1.5px]">
	<a href={resolve('/')}>Home</a>
	<a href={resolve('/todos')}>Todos</a>
	<a href={resolve('/pet-profiles')}>My Pet(s)</a>
	<a href={resolve('/supplies')}>Pet Supplies</a>
	<a href={resolve('/pet-sitting')}>Pet Sitting</a>
</nav>

<main>
	{@render children()}
</main>

<style>
	:global {
		body,
		p,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			margin: 0;
		}
	}
	nav {
		display: flex;
		margin: 2rem 0 0;
		padding: 0.5rem 0;
		justify-content: space-evenly;
	}
	main {
		padding: 1rem;
	}

	@media (max-width: 768px) {
		:global(body) {
			display: flex;
			flex-direction: column;
			min-height: 100vh;
		}
		nav {
			display: flex;
			position: sticky;
			order: 2;
			bottom: 0;
			justify-content: space-between;
			a {
				flex: 1;
				text-align: center;
			}
		}
		main {
			flex: 1;
			order: 1;
			padding: 1rem;
		}
	}

	@media (display-mode: browser) {
		/* conditionally show installation invitation */
	}
</style>
