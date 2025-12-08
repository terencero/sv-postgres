<script lang="ts">
	import type { SelectPetProfiles, SelectTodos } from "$lib/server/db/schema";

// get a list of todos with due dates
// sort them by closest upcoming
// flag ones that should trigger an animation (default to on day for now)
  type TodosWithPet = SelectTodos & { pet: SelectPetProfiles };
  interface Props {
    data: TodosWithPet[];
  }
  let { data }: Props = $props();
</script>

<h2>Notifications</h2>

{#each data as todo (todo.id)}
  <div>
      Title: {todo.title}, Due Date: {todo.dueDate}, For Pet: {todo.pet.name}
  </div>
{/each}
