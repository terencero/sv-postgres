<script lang="ts">
// get a list of todos with due dates
// sort them by closest upcoming
// flag ones that should trigger an animation (default to on day for now)
  let { data } = $props();
</script>

<h2>Notifications</h2>
<ul>
  {#each data as todo (todo.id)}
    <li>Title: {todo.title}, Due Date: {todo.dueDate}</li>
  {/each}
</ul>
