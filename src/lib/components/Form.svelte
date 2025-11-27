<script lang="ts">
	import type { HTMLFormAttributes } from "svelte/elements";
  
  interface Field {
    label?: string;
    type: HTMLInputElement['type'];
    name: HTMLInputElement['name'];
    value?: HTMLInputElement['value'];
    el?: HTMLInputElement;
  }
  export interface FormFields {
    action: string;
    method: HTMLFormAttributes['method'];
    submitText: string;
    fields: Field[];
  }

  let formFields: FormFields = $props();
</script>

<form action={formFields.action} method={formFields.method}>
  {#each formFields.fields as { label, type, name, value = '', el = 'input' } (name)}
    {#if type === 'hidden'}
      <input {type} {name} {value} />
    {:else}
      <label>
        {label}
        <input {type} {name} {value} />
      </label>
    {/if}
  {/each}
  <button aria-label={formFields.submitText}>{formFields.submitText}</button>
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
