// @ts-nocheck
// js/store.js

/**
 * Gestation Guardian - Data Layer
 * Handles localStorage abstraction, data structures, and exports
 */

// No more Firebase imports? Just kidding, we are adding it back!
import { FirebaseDB, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

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

    userId: '',
    pairingPin: '',

    initUserId() {
        // Generate a 4-digit pin for UI purposes only if it doesn't exist
        let pin = localStorage.getItem('gg_pairing_pin');
        if (!pin) {
            const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
            pin = `GG-${randomPart}`;
            localStorage.setItem('gg_pairing_pin', pin);
        }
        this.pairingPin = pin;

        // Firebase Auth listener for the real secure UID
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.userId = user.uid;
                console.log("Firebase Auth UID acquired:", this.userId);
            }
        });
    },

    // --- Offline Sync Engine ---
    isSyncing: false,

    getSyncQueue() {
        try {
            const q = localStorage.getItem('gg_sync_queue');
            return q ? JSON.parse(q) : [];
        } catch (e) {
            console.error("Error parsing sync queue", e);
            return [];
        }
    },

    saveSyncQueue(q: any[]) {
        try {
            localStorage.setItem('gg_sync_queue', JSON.stringify(q));
        } catch (e) {
            console.error("Error saving sync queue", e);
        }
    },

    async processSyncQueue() {
        if (!navigator.onLine || this.isSyncing) return;
        
        this.isSyncing = true;
        try {
            const q = this.getSyncQueue();
            if (q.length === 0) return;

            console.log(`Processing sync queue of ${q.length} items...`);
            // Clear queue temporarily to prevent concurrent modifications duplicating sync
            this.saveSyncQueue([]);

            const remainingQ: any[] = [];

            for (const item of q) {
                let success = false;
                try {
                    if (item.type === 'profile') {
                        success = await FirebaseDB.saveDocument('users', this.userId, item.data);
                    } else if (item.type === 'log') {
                        // Route all logs into the Polyglot telemetry subcollection
                        const docId = await FirebaseDB.addLog(`users/${this.userId}/telemetry`, item.data);
                        success = !!docId;
                    }
                } catch (e) {
                    console.error("Sync error for item:", item, e);
                }
                if (!success) remainingQ.push(item);
            }

            if (remainingQ.length > 0) {
                // Merge remaining with any new items added while processing
                const currentQ = this.getSyncQueue();
                this.saveSyncQueue([...remainingQ, ...currentQ]);
            }
        } finally {
            this.isSyncing = false;
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
        // Try getting from Firebase first if online, else fallback to local
        // For simplicity and speed, we read locally and sync in background
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
        // Save locally
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Error saving ${key} to local storage:`, e);
        }
    },

    _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Profile Methods
    async getProfile() {
        return await this._get(this.KEYS.PROFILE);
    },

    async saveProfile(profileData: any) {
        // 1. Save locally for instant UI updates (keep raw booleans for mobile app logic)
        await this._set(this.KEYS.PROFILE, profileData);
        
        // BUG-005 Fix: Transform boolean flags to dashboard-compatible medicalHistory object
        const conditions = [];
        if (profileData.chronicHTN) conditions.push("Chronic Hypertension");
        if (profileData.priorPE) conditions.push("Prior Preeclampsia");
        if (profileData.diabetes && profileData.diabetes !== 'none') conditions.push(profileData.diabetes === 'gestational' ? 'Gestational Diabetes' : 'Diabetes');
        if (profileData.isFirstPregnancy) conditions.push("First Pregnancy");
        if (profileData.multipleGestation) conditions.push("Multiple Gestation (Twins+)");
        if (profileData.familyHistory) conditions.push("Family History of PE");

        const payload = { 
            ...profileData, 
            pairingPin: this.pairingPin,
            medicalHistory: {
                conditions: conditions.join(', '),
                medications: profileData.medications || "",
                symptoms: [] // Symptoms are generated via telemetry
            }
        };

        // 2. Queue for Firebase Sync
        const q = this.getSyncQueue();
        q.push({ type: 'profile', data: payload, timestamp: Date.now() });
        this.saveSyncQueue(q);
        
        // 3. Trigger sync
        if (navigator.onLine) this.processSyncQueue();
    },

    // Generic log methods
    async getLogs(key: string) {
        // Read local logs for immediate UI
        const data = await this._get(key, []);
        return Array.isArray(data) ? data : [];
    },

    async addLog(key: string, data: any) {
        const logs = await this.getLogs(key);
        const entry = {
            id: this._generateId(),
            timestamp: new Date().toISOString(),
            ...data
        };
        logs.unshift(entry); // Add to beginning (newest first)
        await this._set(key, logs);
        
        // Map local keys to Firebase collections
        const collectionMap: Record<string, string> = {
            'gg_bp_logs': 'blood_pressure',
            'gg_vitals_logs': 'vitals',
            'gg_glucose_logs': 'glucose',
            'gg_urine_logs': 'urine',
            'gg_kick_sessions': 'kick_counts',
            'gg_contractions': 'contractions',
            'gg_symptoms': 'symptoms'
        };

        const fbCollection = collectionMap[key] || 'misc_logs';

        // 1. Strict LOINC FHIR Generation
        let fhirObservation: any = {
            resourceType: "Observation",
            status: "final",
            subject: { reference: `Patient/${this.userId}` },
            effectiveDateTime: entry.timestamp
        };

        if (key === 'gg_bp_logs') {
            fhirObservation.category = [{"coding": [{"system": "http://terminology.hl7.org/CodeSystem/observation-category", "code": "vital-signs"}]}];
            fhirObservation.code = {"coding": [{"system": "http://loinc.org", "code": "85354-9", "display": "Blood pressure panel"}]};
            fhirObservation.component = [
                {"code": {"coding": [{"system": "http://loinc.org", "code": "8480-6", "display": "Systolic blood pressure"}]}, "valueQuantity": {"value": Number(data.bpSys), "unit": "mmHg", "system": "http://unitsofmeasure.org", "code": "mm[Hg]"}},
                {"code": {"coding": [{"system": "http://loinc.org", "code": "8462-4", "display": "Diastolic blood pressure"}]}, "valueQuantity": {"value": Number(data.bpDia), "unit": "mmHg", "system": "http://unitsofmeasure.org", "code": "mm[Hg]"}}
            ];
            // BUG-003 Fix: Include maternalHR inside the FHIR BP Panel if it exists
            if (data.maternalHR) {
                fhirObservation.component.push(
                    {"code": {"coding": [{"system": "http://loinc.org", "code": "8867-4", "display": "Heart rate"}]}, "valueQuantity": {"value": Number(data.maternalHR), "unit": "beats/minute", "system": "http://unitsofmeasure.org", "code": "/min"}}
                );
            }
        } else if (key === 'gg_vitals_logs') {
            // BUG-002 Fix: Map all vitals correctly instead of blindly throwing away non-HR data
            fhirObservation.category = [{"coding": [{"system": "http://terminology.hl7.org/CodeSystem/observation-category", "code": "vital-signs"}]}];
            fhirObservation.code = {"coding": [{"system": "http://loinc.org", "code": "8716-3", "display": "Vital signs"}]};
            fhirObservation.component = [];
            
            if (data.weight) fhirObservation.component.push({"code": {"coding": [{"system": "http://loinc.org", "code": "29463-7", "display": "Body Weight"}]}, "valueQuantity": {"value": Number(data.weight), "unit": "kg"}});
            if (data.temperature) fhirObservation.component.push({"code": {"coding": [{"system": "http://loinc.org", "code": "8310-5", "display": "Body temperature"}]}, "valueQuantity": {"value": Number(data.temperature), "unit": "Cel"}});
            if (data.glucose) fhirObservation.component.push({"code": {"coding": [{"system": "http://loinc.org", "code": "2339-0", "display": "Glucose"}]}, "valueQuantity": {"value": Number(data.glucose), "unit": "mg/dL"}});
            
            // Add raw unstructured keys as well
            Object.keys(data).forEach(k => {
                if (!['weight', 'temperature', 'glucose'].includes(k)) {
                    fhirObservation.component.push({ "code": { "text": k }, "valueString": String(data[k]) });
                }
            });
        } else {
            // Generic pseudo-FHIR fallback for other types
            fhirObservation.code = { text: fbCollection };
            fhirObservation.component = Object.keys(data || {}).map(k => ({
                code: { text: k },
                valueString: String(data[k])
            }));
        }

        // Queue for Firebase sync (collection property is mostly ignored now as processSyncQueue hardcodes telemetry)
        const q = this.getSyncQueue();
        q.push({ type: 'log', collection: 'telemetry', data: fhirObservation, timestamp: Date.now() });
        this.saveSyncQueue(q);
        
        if (navigator.onLine) this.processSyncQueue();

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
        if (isNaN(lmpDate.getTime())) return 0;
        
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lmpDate.getTime());
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
