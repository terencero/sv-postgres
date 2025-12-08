<script lang="ts">
import type { PageProps } from "./$types";
import { enhance } from '$app/forms';
import Notifications from "$lib/components/Notifications.svelte";

let { form, data }: PageProps = $props();
</script>

<h1>Pet Dashboard</h1>

{#if data.user }
  <h2>Welcome {data.user}!</h2>
  <form method="post" action="?/logout" use:enhance>
    <button>Sign out</button>
  </form>
{:else}
  <h1>Login/Register</h1>
  <form method="post" action="?/login" use:enhance>
    <label>
      Username
      <input name="username" />
    </label>
    <label>
      Password
      <input type="password" name="password" />
    </label>
    <button>Login</button>
    <button formaction="?/register">Register</button>
  </form>
  <p style="color: red">{form?.message ?? ''}</p>
{/if}

<h2>Upcoming:</h2>
<Notifications data={data.todosByUpcoming || []} />
