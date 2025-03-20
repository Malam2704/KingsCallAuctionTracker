// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace these values with your own Firebase project config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
console.log(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};

// Firestore data functions
export const saveBids = async (userId, bids) => {
    try {
        await setDoc(doc(db, "users", userId), {
            currentBids: bids,
        }, { merge: true });
    } catch (error) {
        console.error("Error saving bids: ", error);
        throw error;
    }
};

export const saveWatchlist = async (userId, watchlist) => {
    try {
        await setDoc(doc(db, "users", userId), {
            watchlist: watchlist,
        }, { merge: true });
    } catch (error) {
        console.error("Error saving watchlist: ", error);
        throw error;
    }
};

export const saveFutureCards = async (userId, futureCards) => {
    try {
        await setDoc(doc(db, "users", userId), {
            futureCards: futureCards,
        }, { merge: true });
    } catch (error) {
        console.error("Error saving future cards: ", error);
        throw error;
    }
};

export const getUserData = async (userId) => {
    try {
        const docSnap = await getDoc(doc(db, "users", userId));
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // Initialize with empty arrays if document doesn't exist
            return {
                currentBids: [],
                watchlist: [],
                futureCards: []
            };
        }
    } catch (error) {
        console.error("Error getting user data: ", error);
        throw error;
    }
};

export { auth, db, onAuthStateChanged };