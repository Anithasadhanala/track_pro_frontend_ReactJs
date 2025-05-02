// src/firebaseMessaging.js
import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";

export const requestPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "YOUR_PUBLIC_VAPID_KEY_HERE", // Replace with your actual VAPID key from Firebase Console
    });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    } else {
      console.warn("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (error) {
    console.error("Error while getting FCM token", error);
    return null;
  }
};
