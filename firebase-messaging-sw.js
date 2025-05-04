// Import Firebase scripts to initialize messaging service
importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js");

// Initialize Firebase with your project's config
firebase.initializeApp({
  apiKey: "AIzaSyAjmZ4vCoj42uLvvuxLtT7fvKUvAc500Ko",
  authDomain: "track-pro-push-notification.firebaseapp.com",
  projectId: "track-pro-push-notification",
  storageBucket: "track-pro-push-notification.firebasestorage.app",
  messagingSenderId: "987968390738",
  appId: "1:987968390738:web:ff9f8dbf0cb74b3a1d418b",
  measurementId: "G-5R8DGEH31W",
});

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages when the app is not in the foreground
messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
   
    const notificationTitle = payload.notification?.title || "New Notification";
    const notificationOptions = {
        body: payload.notification?.body || "You have a new message.",
        icon: "./logo.png",  // Use a valid path for your logo
        tag: 'firebase-notification'  // Tag for the notification
    };

    // Show the notification
    self.registration.showNotification(notificationTitle, notificationOptions);
});

