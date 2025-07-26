import { getMessaging, getToken } from "firebase/messaging";
import { app } from "@/lib/firebase";

// Request FCM token from the browser
export const requestFcmToken = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);
    if (permission !== "granted") {
      console.warn("Notification permission not granted.");
      return null;
    }
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

// Send FCM token to backend API
export const saveFcmToken = async (fcmToken: string): Promise<any> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/users/save-fcmtoken`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fcmToken }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to save FCM token. Response:", errorText);
    throw new Error("Failed to save FCM token");
  }
  const data = await response.json();
  return data;
};
