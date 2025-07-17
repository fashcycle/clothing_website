// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyADuC--0ZncJ2v65o0G_yJ9_vcPNnVFs0s",
  authDomain: "fashcycle-backend.firebaseapp.com",
  projectId: "fashcycle-backend",
  storageBucket: "fashcycle-backend.firebasestorage.app",
  messagingSenderId: "988054016188",
  appId: "1:988054016188:web:990b3d83d081f3ef4d00b9",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./fashCycleLogoFavicon.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
