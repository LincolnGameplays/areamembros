// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDoq88aWj4mv3nUVjHmSCnfrWGISuUBuXA",
    authDomain: "protocolo-dark.firebaseapp.com",
    projectId: "protocolo-dark",
    storageBucket: "protocolo-dark.firebasestorage.app",
    messagingSenderId: "158863484926",
    appId: "1:158863484926:web:4e34677bb4fcc78ecd02af",
    measurementId: "G-4FJ6NFLF5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication, Firestore, and Functions
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Connect to Functions Emulator in development
if (window.location.hostname === "localhost") {
    connectFunctionsEmulator(functions, "localhost", 5001);
    console.log("🔧 Connected to Functions Emulator at localhost:5001");
}

// Export app for other uses
export { app, analytics };