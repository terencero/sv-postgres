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
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
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

	event.waitUntil(deleteOldCaches());
  event.waitUntil(self.registration?.navigationPreload.enable());
});

interface CacheFirst {
  event: FetchEvent,
  cache: Cache,
}

async function putInCache(request, response) {
  const cache = await caches.open(CACHE);
  await cache.put(request, response);
};

async function fetchFromCacheFirst({
  event,
  cache,
}: CacheFirst) {
  const { request, preloadResponse } = event;
  // try the cache first, but
  // fall back to the network
  try {
    const response = await cache.match(request);

    if (response) {
      return response;
    }

    // if there's no cache, then just error out
    // as there is nothing we can do to respond to this request
    throw new Error('Cache miss');
  } catch (err) {
    console.log(err);

    const preloadRes = await preloadResponse; 
    if (preloadRes) {
      console.log(`using preload response: ${preloadRes}`);

      event.waitUntil(putInCache(request, preloadRes.clone()));
      return preloadRes;
    }

    const response = await fetch(request);

    // if we're offline, fetch can return a value that is not a Response
    // instead of throwing - and we can't pass this non-Response to respondWith
    if (!(response instanceof Response)) {
      // TODO: return a fallback template and throw this error if fallback
      // can't be reached?
      // TODO: where did I get this throw error from? I think this needs to 
      // be a Response instance...
      throw new Error('invalid response from fetch');
    }

    if (response.status === 200) {
      cache.put(request, response.clone());
    }

    return response;
  }
}

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
      const response = await fetchFromCacheFirst({
        request: event.request,
        cache: cache,
        preloadResponsePromise: event.preloadResponse,
    });

      return response;
	}

	event.respondWith(respond());
});
