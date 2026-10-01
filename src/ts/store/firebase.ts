import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCdkoux4Sb8Lwep_DkU24P7tn-YlfF7xoI",
  authDomain: "gg-doctor-dashboard.firebaseapp.com",
  projectId: "gg-doctor-dashboard",
  storageBucket: "gg-doctor-dashboard.firebasestorage.app",
  messagingSenderId: "460198837780",
  appId: "1:460198837780:web:ac956026c2ae37ddc13101"
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

    async addLog(collectionPath: string, data: any) {
        try {
            const docRef = await addDoc(collection(db, collectionPath), {
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
    }
};
