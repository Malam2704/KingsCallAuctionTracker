// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
    sendEmailVerification,
    applyActionCode,
    confirmPasswordReset,
    verifyPasswordResetCode
} from "firebase/auth";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Export a function to call your Cloud Function directly (if needed)
export const callAuctionEndFunction = httpsCallable(functions, 'yourFunctionName');

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

// Send verification email
export const sendVerificationEmail = async (user) => {
    try {
        await sendEmailVerification(user);
        return true;
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
};

// Verify email with code
export const verifyEmail = async (actionCode) => {
    try {
        await applyActionCode(auth, actionCode);
        return true;
    } catch (error) {
        console.error("Error verifying email:", error);
        throw error;
    }
};

// Store user data in Firestore
export const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;

    try {
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            emailVerified: user.emailVerified,
            createdAt: new Date(),
            ...additionalData
        }, { merge: true });
        return true;
    } catch (error) {
        console.error("Error creating user document:", error);
        throw error;
    }
};

// Update the registerUser function
export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send verification email
        await sendVerificationEmail(user);

        // Store minimal user data initially
        await createUserDocument(user, { verificationPending: true });

        return user;
    } catch (error) {
        throw error;
    }
};

export { auth, db, onAuthStateChanged };