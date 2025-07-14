import { getMessaging, getToken } from "firebase/messaging";
import { app } from "@/lib/firebase";

// Request FCM token from the browser
export const requestFcmToken = async (): Promise<string | null> => {
  try {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);
    if (permission !== "granted") {
      console.warn("Notification permission not granted.");
      return null;
    }
    console.log("Requesting FCM token...");
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    console.log("FCM token received:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

// Send FCM token to backend API
export const saveFcmToken = async (fcmToken: string): Promise<any> => {
  console.log("Saving FCM token to backend:", fcmToken);
  const token = localStorage.getItem("token");
  console.log("Auth token from localStorage:", token);
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

  console.log("API response status:", response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to save FCM token. Response:", errorText);
    throw new Error("Failed to save FCM token");
  }
  const data = await response.json();
  console.log("API response data:", data);
  return data;
};
