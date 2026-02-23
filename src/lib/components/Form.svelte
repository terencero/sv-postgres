<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ServiceWorkerBackgroundSync } from "$lib/extended-types/extended-types";
	import type { Supplies, Todos } from "$lib/server/db/schema";
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

  type FormData = Todos | Supplies;
  type FormProps = FormFields & { data?: FormData, formCallback?: () => void };
  let formData: FormProps = $props();

  const submitFormLater = async () => {
    const registration: ServiceWorkerBackgroundSync = await navigator.serviceWorker.ready;
    try {
      if (!registration.sync) {
        throw new Error('Background Sync API not supported')
      }

      registration.sync.register('add-todo-or-supply');
    } catch (error) {
      console.warn(`Background Sync API failed: ${error}`);

      // TODO: fallback option: use indexedDb to manually transact data to be fetched later 
    }
  } 
</script>

<form action={formData.action} method={formData.method} use:enhance={() => (
  async ({ update }) => {
    if (!navigator.onLine) {
      await submitFormLater();
      return;
    }
    await update();
    formData.formCallback?.();
  }
)}>
  {#each formData.fields as { label, type, name, value = formData.data?.[name as keyof (Todos | Supplies)] || '', selectOptions = [''] } (name)}
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
