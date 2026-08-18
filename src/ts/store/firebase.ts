import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper functions
export const FirebaseDB = {
    async saveDocument(collectionName: string, docId: string, data: any) {
        try {
            await setDoc(doc(db, collectionName, docId), data, { merge: true });
            return true;
        } catch (e) {
            console.error("Error saving document: ", e);
            return false;
        }
    },

    async getDocument(collectionName: string, docId: string) {
        try {
            const docSnap = await getDoc(doc(db, collectionName, docId));
            if (docSnap.exists()) {
                return docSnap.data();
            }
            return null;
        } catch (e) {
            console.error("Error getting document: ", e);
            return null;
        }
    },

    async addLog(collectionName: string, userId: string, data: any) {
        try {
            const docRef = await addDoc(collection(db, collectionName), {
                userId,
                ...data,
                serverTimestamp: new Date().toISOString()
            });
            return docRef.id;
        } catch (e) {
            console.error("Error adding document: ", e);
            return null;
        }
    },

    async getUserLogs(collectionName: string, userId: string) {
        try {
            // NOTE: Firestore requires an index for multiple fields ordering. 
            // In a real app, we might need a composite index. 
            // We'll just fetch by user and sort locally if needed, or rely on simple queries.
            const q = query(collection(db, collectionName), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            const logs: any[] = [];
            querySnapshot.forEach((doc) => {
                logs.push({ id: doc.id, ...doc.data() });
            });
            // Sort locally to avoid index requirements
            return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        } catch (e) {
            console.error("Error getting user logs: ", e);
            return [];
        }
    }
};
