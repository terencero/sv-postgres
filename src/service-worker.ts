// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Ensures that the `$service-worker` import has proper type definitions
/// <reference types="@sveltejs/kit" />

// Only necessary if you have an import from `$env/static/public`
/// <reference types="../.svelte-kit/ambient.d.ts" />

import { build, files, version } from '$service-worker';

// This gives `self` the correct types
const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files  // everything in `static`
];

self.addEventListener('install', (event) => {
  console.log('installing sw')
	// Create a new cache and add all files to it
	async function addFilesToCache() {
    try {
      const cache = await caches.open(CACHE);
      await cache.addAll(ASSETS);
      console.log(`assets: ${ASSETS}\n build: ${build}\n files: ${files}\n version: ${version}`);
    } catch(e) {
      console.error(`cache open or addall failure: ${e}`)
    }
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

  event.waitUntil(enableNavigationPreloadIfAvailable());
	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);

			if (response) {
				return response;
			}
		}

    // for everything else, try the network first, but
    // fall back to the cache if we're offline
    try {
      // try preload response first to run the network in parallel while the
      // service worker boots up
      const preloadResponse = await Promise.resolve(event.preloadResponse);
      if (preloadResponse) {
        await putInCache(event.request, preloadResponse.clone());
        return preloadResponse;
      }

      const response = await fetch(event.request);

      // if we're offline, fetch can return a value that is not a Response
      // instead of throwing - and we can't pass this non-Response to respondWith
      if (!(response instanceof Response)) {
        throw new Error('invalid response from fetch');
      }

      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch (err) {
      const response = await cache.match(event.request);

      if (response) {
        return response;
      }
      // if there's no cache, then just error out
      // as there is nothing we can do to respond to this request
      throw err;
    }
  }

	event.respondWith(respond());
});

// INFO: keeping this interface here because 'extended-types.d.ts'
// in the lib dir doesn't have access to it there
interface BackgroundSyncEvent extends ExtendableEvent {
  tag: string;
  lastChance: boolean;
}

// @ts-expect-error background sync isn't typed in sveltekit?
self.addEventListener('sync', (event: BackgroundSyncEvent) => {
  if (event.tag && event.tag === 'add-todo-or-supply') {
    // TODO: forward to fetch? will backgroundSync just handle the network
    // connectivity?
    // event.waitUntil(fetch())
  }

  if (event.lastChance) {
    // TODO: store in indexedDb or alert user to retry?
    // import the indexedDb logic from the background sync branch
  }

  async function sendMessage(message: Record<string, string>) {
    const clients = await self.clients.matchAll();

    clients.forEach(client => client.postMessage(message));
  }
});

async function enableNavigationPreloadIfAvailable() {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
}

async function putInCache(request, response) {
  console.log('putting in cache')
  const cache = await caches.open(CACHE);
  await cache.put(request, response);
};
