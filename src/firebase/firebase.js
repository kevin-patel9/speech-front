// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBVqyZyrxcejXSb8XlLZM6963-G6QPIfrw",
    authDomain: "listen2-lt.firebaseapp.com",
    projectId: "listen2-lt",
    storageBucket: "listen2-lt.appspot.com",
    messagingSenderId: "285191480761",
    appId: "1:285191480761:web:513f5483596edb32a08268",
    measurementId: "G-51NTW6S7T2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, doc, setDoc };
