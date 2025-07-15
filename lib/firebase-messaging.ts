// lib/firebase-messaging.ts
"use client";

import {
  getMessaging,
  isSupported,
  getToken,
  onMessage,
} from "firebase/messaging";
import { app } from "./firebase";

const getFirebaseToken = async () => {
  const supported = await isSupported();
  if (!supported) {
    console.warn("Browser does not support Firebase messaging.");
    return null;
  }

  try {
    const messaging = getMessaging(app);
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (currentToken) {
      return currentToken;
    } else {
      console.warn("No registration token available.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving token: ", error);
    return null;
  }
};

const listenToMessages = async (callback: (payload: any) => void) => {
  const supported = await isSupported();
  if (!supported) return;

  const messaging = getMessaging(app);
  onMessage(messaging, callback);
};
export { getFirebaseToken, listenToMessages };
