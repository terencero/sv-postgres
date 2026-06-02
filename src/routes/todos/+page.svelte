<script lang="ts">
	import { page } from '$app/state';
	import Form from '$lib/components/Form.svelte';
	import type { Todos } from '$lib/server/db/schema';
	import roundCheck from '$lib/assets/roundCheck.svg';
	import roundX from '$lib/assets/roundX.svg';
	import type { PageProps } from './$types';
	import MappedPetItems from '$lib/components/MappedPetItems.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { enhance } from '$app/forms';

	let { data, form }: PageProps = $props();
	let showCreateForm = $state(false);
	let showEnableNotification = $state(false);
	let showUpdateForm = new SvelteSet<number>();

	const handleEditClick = (todoId: number) => {
		if (showUpdateForm.has(todoId)) {
			showUpdateForm.delete(todoId);
		} else {
			showUpdateForm.add(todoId);
		}
	};

	const handleReminder = async (data: { title: string | null; dueDate: string | null }) => {
		// TODO: check for permissions to send notifications
		// show or hide a notification enable button depening on the permissions request promise
		// send the notification data to sw. Let sw handle showing notification in background
		console.log('handle the reminder');
		const notificationPermission = await Notification.requestPermission();
		if (notificationPermission === 'granted') {
			showEnableNotification = false;

			const registration = await navigator.serviceWorker.ready;
		} else {
			// TODO: show the button to request permissions
			showEnableNotification = true;
		}
	};

	const formCallback = () => {
		if (form?.success) {
			if (form.actionType === 'updateTodo') {
				showUpdateForm.delete(form.todoId);
			} else if (form.actionType === 'addTodo') {
				showCreateForm = !showCreateForm;
			}
		}
	};
</script>

<h1>Todos</h1>

<span>message from form data: {form?.description}</span>

<button class={{ showEnableNotification }}>Enable Notifications</button>

<button onclick={() => (showCreateForm = !showCreateForm)}>
	{#if showCreateForm}
		Hide Form
	{:else}
		Add a Todo
	{/if}
</button>

{#if showCreateForm}
	<Form action={`${page.route.id}?/addNewTodo`} method="POST" {formCallback}>
		{@render formContent()}
		<button> Add a Todo </button>
	</Form>
{/if}

<MappedPetItems pets={data.pets || []} items={data.todos || []} {card} />

{#snippet formContent(todo?: Todos)}
	{#if todo}
		<input type="hidden" name="id" value={todo.id} />
	{/if}

	<label>
		Todo Title:
		<input type="text" name="title" value={todo?.title || ''} />
	</label>
	<label>
		Due Date:
		<input type="date" name="dueDate" value={todo?.dueDate} />
	</label>
	<label>
		Due Time:
		<input type="time" name="dueTime" value={todo?.dueTime} />
	</label>
	<label>
		Done:
		<input type="checkbox" name="complete" value={todo?.complete} />
	</label>
	<label>
		Repeats:
		<select name="repeats" value={todo?.repeats}>
			{#each ['daily', 'weekly', 'monthly', 'yearly'] as cadence (cadence)}
				<option value={cadence}>
					{cadence}
				</option>
			{/each}
		</select>
	</label>
	<label
		>Label:
		<input type="text" name="label" value={todo?.label} />
	</label>
	<label
		>Notes:
		<input type="textarea" name="notes" value={todo?.notes} />
	</label>

	{#if !todo}
		<label>
			For my pet:
			<select name="petName">
				{#each (data.pets || []).map(({ name }) => name || '') as option (option)}
					<option>{option}</option>
				{/each}
			</select>
		</label>
	{/if}
{/snippet}

{#snippet card(pet: string, todos: Todos[])}
	<div>
		{pet}
		{#each todos as todo (todo.id)}
			<div id={`${String(todo.id)}-${todo.title}`}>
				<form method="POST" action="?/completeTodo" use:enhance>
					<input type="hidden" name="id" value={todo.id} />

					<p><b>Title: </b>{todo.title}</p>
					<p><b>Due Date: </b>{todo.dueDate} at {todo.dueTime}</p>
					<p>
						<b>Done: </b>
						<input type="hidden" name="complete" value={!todo.complete} />
						{#if todo.complete}
							<img src={roundCheck} alt="round checkmark" />
						{:else}
							<img src={roundX} alt="round x mark" />
						{/if}
					</p>
					<p><b>Repeats: </b>{todo.repeats || 'once'}</p>
					<p><b>Label: </b>{todo.label}</p>
					<p><b>Notes: </b>{todo.notes}</p>

					<button aria-label="Mark Complete">Mark Complete</button>
					<button onclick={() => handleReminder({ title: todo.title, dueDate: todo.dueDate })}
						>remind me</button
					>
				</form>

				<form method="POST" action="?/deleteTodo" use:enhance>
					<input type="hidden" name="id" value={todo.id} />
					<button aria-label="Delete">Delete</button>
				</form>

				<button onclick={() => handleEditClick(todo.id)}>
					{showUpdateForm.has(todo.id) ? 'hide' : 'edit'}
				</button>

				{#if showUpdateForm.has(todo.id)}
					<Form action={`${page.route.id}?/updateTodo`} method="POST" {formCallback}>
						{@render formContent(todo)}
						<button aria-label="edit">edit</button>
					</Form>
				{/if}
			</div>
		{/each}
	</div>
{/snippet}

<style>
	div {
		border: 0.2rem solid blue;
		border-radius: 1.5%;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		margin-bottom: 1rem;
		padding: 1.5rem;
		p {
			display: flex;
			gap: 1rem;
			align-items: center;
			margin: 0;
		}
	}
	img {
		width: 1.5rem;
		height: 1.5rem;
	}
</style>
