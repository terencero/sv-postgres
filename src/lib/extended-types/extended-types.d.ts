// HACK: backgroundSync not widely available and not included in svelteKit 
// service worker types... check on this periodically

export interface ServiceWorkerBackgroundSync extends ServiceWorkerRegistration {
  sync?: SyncManager;
}

interface SyncManager {
  register(tag: string): Promise<undefined>;
  getTags(): Promise<string[]>;
}
