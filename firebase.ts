// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAQEYhU2S7FLdiKQpXojwXy7aB4VblCt5w",
    authDomain: "qwyzex4.firebaseapp.com",
    projectId: "qwyzex4",
    storageBucket: "qwyzex4.appspot.com",
    messagingSenderId: "802630819314",
    appId: "1:802630819314:web:28c2a7356027d73a901f6b",
    measurementId: "G-C0SBRWEL1H",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
