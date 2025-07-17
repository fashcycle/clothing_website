"use client";

import * as Toast from "@radix-ui/react-toast";
import { useEffect, useState } from "react";
import { getFirebaseToken, listenToMessages } from "@/lib/firebase-messaging";

export default function NotificationListener() {
  const [open, setOpen] = useState(false);
  const [toastData, setToastData] = useState({
    title: "",
    body: "",
    clickAction: "",
  });

  useEffect(() => {
    const setupMessaging = async () => {
      await listenToMessages((payload: any) => {
        const { title, body } = payload.notification ?? {};
        // click_action is usually in data for FCM web push
        const actionUrl = payload.data?.click_action || "";
        setToastData({
          title: title ?? "Notification",
          body: body ?? "You have a new message.",
          clickAction: actionUrl,
        });
        setOpen(true);
      });
    };

    let unsubscribe: any;

    setupMessaging().then((fn) => {
      unsubscribe = fn;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleView = () => {
    if (toastData.clickAction) {
      window.open(toastData.clickAction, "_blank");
    }
    setOpen(false);
  };

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        duration={7000}
        className="w-96 bg-white border border-gray-200 shadow-xl rounded-xl p-4 animate-in fade-in slide-in-from-bottom-6"
      >
        <div className="flex items-start gap-3">
          <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
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
            <div className="flex gap-2 mt-3">
              {toastData.clickAction && (
                <button
                  onClick={handleView}
                  className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
                >
                  View
                </button>
              )}
              <Toast.Close asChild>
                <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm">
                  Dismiss
                </button>
              </Toast.Close>
            </div>
          </div>
          <Toast.Close className="text-gray-500 hover:text-gray-700 text-2xl ml-2">
            &times;
          </Toast.Close>
        </div>
      </Toast.Root>

      <Toast.Viewport className="fixed bottom-4 right-4 z-[9999] space-y-2" />
    </Toast.Provider>
  );
}
