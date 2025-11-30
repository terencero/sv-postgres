<script lang="ts">
	import type { SelectTodos } from "$lib/server/db/schema";

// get a list of todos with due dates
// sort them by closest upcoming
// flag ones that should trigger an animation (default to on day for now)
  interface Props {
    data: SelectTodos[];
  }
  let { data }: Props = $props();
</script>

<h2>Notifications</h2>

<!-- <form action="?/"> -->
<!--    -->
<!-- </form> -->
<ul>
  {#each data as todo (todo.id)}
    <li>Title: {todo.title}, Due Date: {todo.dueDate}</li>
  {/each}
</ul>
