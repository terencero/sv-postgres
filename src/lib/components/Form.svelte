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
    /* 
      The basic pattern that IndexedDB encourages is the following:

      1. Open a database.
      2. Create an object store in the database.
      3. Start a transaction and make a request to do some database operation, like adding or retrieving data.
      4. Wait for the operation to complete by listening to the right kind of DOM event.
      5. Do something with the results (which can be found on the request object). 
    */

    const localDbRequest = indexedDB.open('formSubmissions', 1)
    let localDb: IDBDatabase;
    localDbRequest.onerror = (event) => console.error('error opening db', event);
    localDbRequest.onsuccess = (event) =>  {
      console.log(`Database initialized. event: ${event}`);

      localDb = localDbRequest.result;
      // if the indexedDB is being created for the first time or version number changes,
      // the "onupgradeneeded" event will fire first where the objectStores are
      // created/deleted/updated, then the indexedDB open request "onsuccess" event will fire;
      // otherwise, the "onsuccess" will fire immediately if the indexedDB version already exists.
      const transaction = localDb.transaction(['pendingSubmissions'], 'readwrite');
      const tx = transaction.objectStore('pendingSubmissions');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { formCallback, ...data } = formData;
      const formDataSnapshot = $state.snapshot(data);
      tx.add(formDataSnapshot);

      transaction.oncomplete = (event) => {
        console.log(`transaction complete: ${event}`);
      }

      transaction.onerror = (event) => {
        console.error(`transaction failure, not sure what to do yet...: ${event}`);
      }
    }
    // onupgradeneeded is the only place where you can alter the structure of the database.
    // In it, you can create and delete object stores and build and remove indices.
    // The event is only dispatched on creation of a new indexedDB or a db version change.
    localDbRequest.onupgradeneeded = (event) => {
      console.log(`in onUpgradeNeeded: ${event}`);
      // @ts-expect-error TODO: create a custom type
      event.target.result.createObjectStore('pendingSubmissions', { autoIncrement: true });
    }


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
