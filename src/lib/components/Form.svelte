<script lang="ts">
	import { enhance } from "$app/forms";
	import type { Todos } from "$lib/server/db/schema";
	import type { HTMLFormAttributes } from "svelte/elements";
  
  interface Field {
    label?: string;
    type: HTMLInputElement['type'];
    name: HTMLInputElement['name'];
    value?: HTMLInputElement['value'];
    selectOptions?: string[];
  }
  export interface FormFields {
    action: string;
    method: HTMLFormAttributes['method'];
    submitText: string;
    fields: Field[];
  }

  type FormProps = FormFields & { data?: Todos };
  let formData: FormProps = $props();
</script>

<form action={formData.action} method={formData.method} use:enhance>
  {#each formData.fields as { label, type, name, value = formData.data?.[name as keyof Todos] || '', selectOptions = [''] } (name)}
    {#if type === 'hidden'}
      <input {type} {name} {value} />
    {:else}
      <label>
        {label}
        {#if type === 'select'}
          <select {name} {value}>
            {#each selectOptions as option (option)}
              <option value={option}>{option}</option>
            {/each}
          </select>
        {:else if type === 'textarea'}
          <textarea {name}>
            {value}
          </textarea>
        {:else}
          <input {type} {name} {value} />
        {/if}
      </label>
    {/if}
  {/each}
  <button aria-label={formData.submitText}>{formData.submitText}</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 35vh;
    label {
      border: 1.5px solid blue;
      input {
        width: 80%;
      }
    }
  }

  button {
    width: 50%;
  }
</style>
