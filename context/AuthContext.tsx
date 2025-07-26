import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getFirebaseToken } from "@/lib/firebase";
import axios from "axios";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // or { role: 'admin' } etc.
  const router = useRouter();

  useEffect(() => {
    // Example: check localStorage or fetch from API
    const token = localStorage.getItem("token");
    if (token) {
      // Decode token if needed (e.g., jwt-decode)
      setUser(localStorage.getItem("user-info")); // mock data
    }
  }, []);
  const requestNotificationPermissionAndSaveToken = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const fcmToken = await getFirebaseToken();

        if (fcmToken) {
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE}/users/save-fcmtoken`,
            { fcmToken },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        }
      } else {
        console.warn("Notification permission not granted.");
      }
    } catch (error) {
      console.error("Error setting up notifications:", error);
    }
  };
  const login = async (token) => {
    localStorage.setItem("token", token);
    setUser(localStorage.getItem("user-info"));
    await requestNotificationPermissionAndSaveToken();
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
