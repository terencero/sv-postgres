<script lang="ts">
	import type { SelectPetProfiles, SelectTodos } from "$lib/server/db/schema";

// flag ones that should trigger an animation (default to on day for now)
  type TodosWithPet = SelectTodos & { pet: SelectPetProfiles | null };
  interface Props {
    todos: TodosWithPet[];
  }
  let { todos }: Props = $props();

  const calendarOptions = ['days', 'weeks', 'months', 'years'];

  let after: number | undefined = $state();
  let selectedOption: string = $state('days');

</script>

<h2>Notifications</h2>

<div>
    Date range picker
  <form method="POST" action="">
    <select
      name="notification-range"
      bind:value={selectedOption}
    >
      {#each calendarOptions as option (option)}
        <option value={option}>{option}</option>
      {/each}
    </select>
    <input type="number" name="after" bind:value={after}> 
  </form>
  date range: after {after}
</div>

{#each todos as todo (todo.id)}
  <div>
    <a href={`/todos#${todo.id}-${todo.title}`}>
      Title: {todo.title}, Due Date: {todo.dueDate}, For Pet: {todo.pet?.name}
    </a>
  </div>
{/each}

<style>
  div:first-of-type {
    margin-bottom: 2rem;
  }
</style>
