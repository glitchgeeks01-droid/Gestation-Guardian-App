// @ts-nocheck
// js/store.js

/**
 * Gestation Guardian - Data Layer
 * Handles localStorage abstraction, data structures, and exports
 */

// No more Firebase imports

// Helper for API endpoint mapping (Android emulator maps 10.0.2.2 to localhost)
const API_BASE = window.location.protocol === 'file:' ? 'http://10.0.2.2:3000/api' : '/api';

export const Store = {
    // Keys matching the schema in the implementation plan
    KEYS: {
        PROFILE: 'gg_profile',
        BP_LOGS: 'gg_bp_logs',
        VITALS_LOGS: 'gg_vitals_logs',
        GLUCOSE_LOGS: 'gg_glucose_logs',
        URINE_LOGS: 'gg_urine_logs',
        HB_LOGS: 'gg_hb_logs',
        KICKS: 'gg_kick_sessions',
        CONTRACTIONS: 'gg_contractions',
        SYMPTOMS: 'gg_symptoms',
        HISTORY: 'gg_medical_history',
        REMINDERS: 'gg_reminders',
        SETTINGS: 'gg_settings'
    },

    // Assume single user for now until Auth is implemented
    userId: 'default_user_123',

    // --- Offline Sync Engine ---
    getSyncQueue() {
        const q = localStorage.getItem('gg_sync_queue');
        return q ? JSON.parse(q) : [];
    },

    saveSyncQueue(q: any[]) {
        localStorage.setItem('gg_sync_queue', JSON.stringify(q));
    },

    async processSyncQueue() {
        if (!navigator.onLine) return;
        
        const q = this.getSyncQueue();
        if (q.length === 0) return;

        console.log(`Processing ${q.length} queued operations...`);
        try {
            const res = await fetch(`${API_BASE}/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ operations: q })
            });
            
            if (res.ok) {
                console.log('Sync successful, clearing queue.');
                this.saveSyncQueue([]);
            }
        } catch (e) {
            console.error('Sync failed, will retry later.', e);
        }
    },

    initSyncEngine() {
        window.addEventListener('online', () => {
            console.log('Back online. Triggering sync...');
            this.processSyncQueue();
        });
        
        // Initial sync attempt
        setTimeout(() => this.processSyncQueue(), 2000);
    },
    // ----------------------------

    // Base methods - Asynchronous
    async _get(key: string, defaultValue: any = null) {
        // Try network first if online
        if (navigator.onLine) {
            try {
                const res = await fetch(`${API_BASE}/users/${this.userId}/collections/${key}`);
                if (res.ok) {
                    const data = await res.json();
                    // Update local cache
                    localStorage.setItem(key, JSON.stringify(data));
                    return data;
                }
            } catch (e) {
                console.warn(`Network fetch failed for ${key}, falling back to local:`, e);
            }
        }
        
        // Fallback to local storage (Offline Cache)
        try {
            const item = localStorage.getItem(key);
            if (!item) return defaultValue;
            try {
                return JSON.parse(item);
            } catch (e) {
                return JSON.parse(atob(item));
            }
        } catch (e) {
            console.error(`Error reading ${key} from storage:`, e);
            return defaultValue;
        }
    },

    async _set(key: string, value: any) {
        // Always save locally first for instant feedback (Optimistic UI)
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Error saving ${key} to local storage:`, e);
        }

        // Push to network
        if (navigator.onLine) {
            try {
                const res = await fetch(`${API_BASE}/users/${this.userId}/collections/${key}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(value)
                });
                if (res.ok) return;
            } catch (e) {
                console.warn(`Network write failed for ${key}, queuing for offline sync:`, e);
            }
        }

        // If offline or network failed, queue the operation
        const q = this.getSyncQueue();
        // Remove older operations for the same key to avoid redundant updates
        const filteredQ = q.filter(op => op.key !== key);
        filteredQ.push({ userId: this.userId, key, data: value, timestamp: Date.now() });
        this.saveSyncQueue(filteredQ);
    },

    _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Profile Methods
    async getProfile() {
        return await this._get(this.KEYS.PROFILE);
    },

    async saveProfile(profileData) {
        await this._set(this.KEYS.PROFILE, profileData);
    },

    // Generic log methods
    async getLogs(key: string) {
        const data = await this._get(key, []);
        if (!data || Object.keys(data).length === 0) return [];
        return data;
    },

    async addLog(key, data) {
        const logs = await this.getLogs(key);
        const entry = {
            id: this._generateId(),
            timestamp: new Date().toISOString(),
            ...data
        };
        logs.unshift(entry); // Add to beginning (newest first)
        await this._set(key, logs);
        return entry;
    },

    // Specific log getters
    async getLatestBP() {
        const logs = await this.getLogs(this.KEYS.BP_LOGS);
        return logs.length > 0 ? logs[0] : null;
    },

    async getLatestUrine() {
        const logs = await this.getLogs(this.KEYS.URINE_LOGS);
        return logs.length > 0 ? logs[0] : null;
    },
    
    async getTodaySymptoms() {
        const logs = await this.getLogs(this.KEYS.SYMPTOMS);
        const today = new Date().toDateString();
        return logs.filter(log => new Date(log.timestamp).toDateString() === today);
    },

    // Trimester Math (Keep synchronous since it operates on passed data or cached profile)
    // For simplicity, we'll fetch profile async
    async getCurrentGestationalWeek() {
        const profile = await this.getProfile();
        if (!profile || !profile.lmp) return 0;
        
        const lmpDate = new Date(profile.lmp);
        const today = new Date();
        const diffTime = Math.abs(today - lmpDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const week = Math.floor(diffDays / 7);
        
        return Math.min(Math.max(week, 0), 42);
    },

    async getCurrentTrimester() {
        const week = await this.getCurrentGestationalWeek();
        if (week < 13) return 1;
        if (week < 27) return 2;
        return 3;
    },
    
    async clearAll() {
        Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    }
};

(window as any).Store = Store;
