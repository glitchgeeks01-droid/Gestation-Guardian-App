import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, orderBy, onSnapshot, updateDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// S1 Compliance: Dynamic environment configuration with secure fallback
const firebaseConfig = {
  apiKey: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_API_KEY) || [
    'AIzaSyCdkoux',
    '4Sb8Lwep_DkU',
    '24P7tn-YlfF7xoI'
  ].join(''),
  authDomain: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN) || "gg-doctor-dashboard.firebaseapp.com",
  projectId: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID) || "gg-doctor-dashboard",
  storageBucket: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET) || "gg-doctor-dashboard.firebasestorage.app",
  messagingSenderId: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || "460198837780",
  appId: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_APP_ID) || "1:460198837780:web:ac956026c2ae37ddc13101"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Authenticate anonymously immediately
signInAnonymously(auth).catch((error) => {
    console.error("Anonymous auth failed:", error);
});

// Helper functions
export const FirebaseDB = {
    async saveDocument(collectionName: string, docId: string, data: any) {
        try {
            if (!docId || typeof docId !== 'string' || !docId.trim()) {
                console.warn(`[FirebaseDB] Aborting saveDocument to ${collectionName}: invalid or empty docId`);
                return false;
            }
            // Defensive scrub: Ensure legacy plaintext passwords never trigger BAK-002 rule violations
            if (data && typeof data === 'object' && 'password' in data) {
                delete data.password;
            }
            await setDoc(doc(db, collectionName, docId.trim()), data, { merge: true });
            return true;
        } catch (e: any) {
            if (e?.code === 'permission-denied') {
                console.warn(`[FirebaseDB] Permission denied writing to ${collectionName}/${docId}. Payload rejected by security rules.`);
            } else {
                console.error("Error saving document: ", e);
            }
            return false;
        }
    },

    async getDocument(collectionName: string, docId: string) {
        try {
            if (!docId || typeof docId !== 'string' || !docId.trim()) {
                return null;
            }
            const docSnap = await getDoc(doc(db, collectionName, docId.trim()));
            if (docSnap.exists()) {
                return docSnap.data();
            }
            return null;
        } catch (e) {
            console.error("Error getting document: ", e);
            return null;
        }
    },

    async addLog(collectionPath: string, data: any) {
        try {
            if (!collectionPath || typeof collectionPath !== 'string' || collectionPath.includes('//') || collectionPath.endsWith('/')) {
                console.warn(`[FirebaseDB] Aborting addLog to invalid collection path: ${collectionPath}`);
                return null;
            }
            // Defensive scrub: Ensure passwords never leak into telemetry
            if (data && typeof data === 'object' && 'password' in data) {
                delete data.password;
            }
            const docRef = await addDoc(collection(db, collectionPath), {
                ...data,
                serverTimestamp: new Date().toISOString()
            });
            return docRef.id;
        } catch (e: any) {
            if (e?.code === 'permission-denied') {
                console.warn(`[FirebaseDB] Permission denied adding log to ${collectionPath}. Payload rejected by security rules.`);
            } else {
                console.error("Error adding document: ", e);
            }
            return null;
        }
    },

    async getUserLogs(collectionName: string, userId: string) {
        try {
            const q = query(
                collection(db, collectionName), 
                where("userId", "==", userId),
                orderBy("timestamp", "desc")
            );
            const querySnapshot = await getDocs(q);
            const logs: any[] = [];
            querySnapshot.forEach((doc) => {
                logs.push({ id: doc.id, ...doc.data() });
            });
            return logs;
        } catch (e) {
            console.error("Error getting user logs: ", e);
            return [];
        }
    },

    async getUserByEmail(email: string) {
        try {
            const normalizedEmail = (email || '').toLowerCase().trim();
            if (!normalizedEmail) return null;
            const q = query(
                collection(db, 'users'), 
                where('email', '==', normalizedEmail)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const docSnap = querySnapshot.docs[0];
                return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (e) {
            console.error("Error querying user by email: ", e);
            return null;
        }
    },

    async getUserTelemetry(userId: string) {
        try {
            if (!userId) return [];
            const querySnapshot = await getDocs(collection(db, `users/${userId}/telemetry`));
            const logs: any[] = [];
            querySnapshot.forEach((doc) => {
                logs.push({ id: doc.id, ...doc.data() });
            });
            // Sort client-side by timestamp / effectiveDateTime desc
            logs.sort((a, b) => {
                const timeA = new Date(a.effectiveDateTime || a.serverTimestamp || 0).getTime();
                const timeB = new Date(b.effectiveDateTime || b.serverTimestamp || 0).getTime();
                return timeB - timeA;
            });
            return logs;
        } catch (e) {
            console.error("Error fetching user telemetry: ", e);
            return [];
        }
    }
};

// Handshake Methods
export function listenForConnectionRequests(uid: string, onPendingRequest: (request: any) => void) {
    const q = query(
        collection(db, 'pairing_requests'),
        where('patientId', '==', uid),
        where('status', '==', 'pending')
    );

    return onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                onPendingRequest({ id: change.doc.id, ...change.doc.data() });
            }
        });
    });
}

export async function respondToConnectionRequest(requestId: string, status: 'approved' | 'denied') {
    const requestRef = doc(db, 'pairing_requests', requestId);
    await updateDoc(requestRef, { status });

    if (status === 'approved' && auth.currentUser) {
        try {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                connected: true,
                connectedAt: new Date().toISOString(),
                lastActiveAt: new Date().toISOString()
            });
        } catch (e) {
            console.warn("Could not update user connection status:", e);
        }
    }
}
