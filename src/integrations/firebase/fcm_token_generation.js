// src/firebaseMessaging.js
import { messaging } from "./initialize";
import { getToken } from "firebase/messaging";

const sendFcmTokenToBackend = async (fcmToken) => {
  
  const token = localStorage.getItem('authToken');
  await fetch("http://127.0.0.1:8000/store-fcm-token", {
    method: "PUT",
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ fcm_token: fcmToken }),
  });
};

export const handlePermissionGrantedForFcmToken = async () => {
  console.log("#############################################################")
  try {
    const token = await getToken(messaging, {
      vapidKey: "BHnqNmoweY9Ul6pq4zgb1n4VSq96kEnh7163ilGix-v5_rKIRSNpnFk7uFoCqJCzLGkMjS6KGnUMxkxqdYPHC7I",
    });

    if (token) {
      console.log("FCM Token:", token);
      sendFcmTokenToBackend(token)
    }
  } catch (error) {
    console.error("Error while getting FCM token", error);
  }
};
