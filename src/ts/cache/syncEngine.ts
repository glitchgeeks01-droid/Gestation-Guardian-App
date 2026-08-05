
// Offline sync queue management (abstracted from store.ts)
export class SyncEngine {
    static getQueue() { return JSON.parse(localStorage.getItem('gg_sync_queue') || '[]'); }
    static setQueue(q: any[]) { localStorage.setItem('gg_sync_queue', JSON.stringify(q)); }
}
