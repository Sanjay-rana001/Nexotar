import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUfcROQXIjyHZG-DGZOUDApKABOi5_EmE",
  authDomain: "nexotar-interaction-analytics.firebaseapp.com",
  projectId: "nexotar-interaction-analytics",
  storageBucket: "nexotar-interaction-analytics.firebasestorage.app",
  messagingSenderId: "546619606512",
  appId: "1:546619606512:web:ca9fc606f9fbd519554935",
  measurementId: "G-ZWGE91NLKD"
};

// Initialize Firebase (prevent re-initialization in Next.js dev mode)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
