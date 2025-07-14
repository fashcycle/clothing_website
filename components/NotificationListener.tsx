"use client";

import * as Toast from "@radix-ui/react-toast";
import { useEffect, useState } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";

export default function NotificationListener() {
  const [open, setOpen] = useState(false);
  const [toastData, setToastData] = useState({
    title: "",
    body: "",
  });

  useEffect(() => {
    if (
      !(
        "Notification" in window &&
        "serviceWorker" in navigator &&
        "PushManager" in window
      )
    ) {
      console.warn("FCM not supported in this browser");
      return;
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      const { title, body } = payload.notification ?? {};
      setToastData({
        title: title ?? "Notification",
        body: body ?? "You have a new message.",
      });
      setOpen(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        duration={5000}
        className="w-96 bg-white border border-gray-200 shadow-xl rounded-xl p-4 animate-in fade-in slide-in-from-bottom-6"
      >
        <div className="flex items-start gap-3">
          <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
            {/* Icon (you can replace this with anything) */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 6.253A6.002 6.002 0 0011 18a6.002 6.002 0 001-11.747z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <Toast.Title className="font-semibold text-gray-900">
              {toastData.title}
            </Toast.Title>
            <Toast.Description className="text-sm text-gray-700 mt-1">
              {toastData.body}
            </Toast.Description>
          </div>
          <Toast.Close className="text-gray-500 hover:text-gray-700">
            &times;
          </Toast.Close>
        </div>
      </Toast.Root>

      <Toast.Viewport className="fixed bottom-4 right-4 z-[9999] space-y-2" />
    </Toast.Provider>
  );
}
