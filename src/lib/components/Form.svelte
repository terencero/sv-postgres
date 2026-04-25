<svelte:window ononline={handleResync} />
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

  type FormDataTypes = { data: Todos | Supplies };
  type FormProps = FormFields & FormDataTypes & { formCallback?: () => void };
  let formProps: FormProps = $props();

  const handleResync = () => {
    console.log(`resyncing`);

    const localDbRequest = indexedDB.open('formSubmissions', 1);
    let localDb: IDBDatabase;
    localDbRequest.onerror = (event) => console.error('error opening db', event);
    localDbRequest.onsuccess = (event) => {
      console.log(`Database initialized in resync. event: ${event}`);
      localDb = localDbRequest.result;

      const objectStore = localDb.transaction(['pendingSubmissions'], 'readwrite').objectStore('pendingSubmissions');
      objectStore.openCursor().onsuccess = (event) => {
        // @ts-expect-error TODO: create a custom type
        const cursor = event.target.result;
        if (cursor) {
          console.log(`found record: ${cursor}`);
          // TODO: try submitting form straight from svelte
          navigator.serviceWorker.ready.then(registration => {
            const messageBody = { id: cursor.key, value: cursor.value }
            registration.active?.postMessage(messageBody);
          });
          cursor.continue();
        } else {
          console.log('no more entries.');
        }
      }
    }
  }

  const submitFormLater = async (formData: FormData) => {
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
    localDbRequest.onsuccess = (event) => {
      console.log(`Database initialized. event: ${event}`);

      localDb = localDbRequest.result;
      // if the indexedDB is being created for the first time or version number changes,
      // the "onupgradeneeded" event will fire first where the objectStores are
      // created/deleted/updated, then the indexedDB open request "onsuccess" event will fire;
      // otherwise, the "onsuccess" will fire immediately if the indexedDB version already exists.
      const transaction = localDb.transaction(['pendingSubmissions'], 'readwrite');
      const tx = transaction.objectStore('pendingSubmissions');

      const formAttributes = {
        action: formProps.action,
        method: formProps.method,
        // sending in POJO because transactions need clonable objects
        data: formData.entries().reduce((acc, [k, v]) => ({ [k]: v, ...acc }), {}),
      };
      tx.add(formAttributes);

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

<form action={formProps.action} method={formProps.method} use:enhance={() => (
  async ({ update, formData }) => {
    if (!navigator.onLine) {
      await submitFormLater(formData);
      return;
    }
    await update();
    formProps.formCallback?.();
  }
)}>
  <!--
    destructure all of the form fields from component prop then use the name field,
    which matches the data fields loaded from the server "i.e. Todos or Supplies" and passed
    into the component props under "data", use the the data values to prepopulate edit forms,
    else default to an empty string
  -->
  {#each formProps.fields as { label, type, name, value = formProps.data?.[name as keyof (Todos | Supplies) || ''], selectOptions = [''] } (name)}
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
  <button aria-label={formProps.submitText}>{formProps.submitText}</button>
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
