// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAjmZ4vCoj42uLvvuxLtT7fvKUvAc500Ko",
  authDomain: "track-pro-push-notification.firebaseapp.com",
  projectId: "track-pro-push-notification",
  storageBucket: "track-pro-push-notification.firebasestorage.app",
  messagingSenderId: "987968390738",
  appId: "1:987968390738:web:ff9f8dbf0cb74b3a1d418b",
  measurementId: "G-5R8DGEH31W",
};

// Initialize Firebase
 export const firebaseApp = initializeApp(firebaseConfig);

// Export messaging instance
export const messaging = getMessaging(firebaseApp);
