import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcQABnTXHWqbW8xMAvZFmvUnu3junU4-Q",
  authDomain: "portafolio-danicode.firebaseapp.com",
  projectId: "portafolio-danicode",
  storageBucket: "portafolio-danicode.firebasestorage.app",
  messagingSenderId: "1064673782458",
  appId: "1:1064673782458:web:fd1b5285ce4a7a23ecb083"
};

// Initialize Firebase (SSR/Next.js hot reload friendly)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
