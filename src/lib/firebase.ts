import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAZlFZI2B6akCqP5m3MXDxYkbeeEG5RcQ",
  authDomain: "market-e2aa1.firebaseapp.com",
  projectId: "market-e2aa1",
  storageBucket: "market-e2aa1.firebasestorage.app",
  messagingSenderId: "403621033764",
  appId: "1:403621033764:web:390d85c1b9620af6a1a5b1"
};

// Initialize Firebase (SSR/Next.js hot reload friendly)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
