"use client";
import * as Toast from "@radix-ui/react-toast";
import { useEffect, useState } from "react";
import { getFirebaseToken, listenToMessages } from "@/lib/firebase-messaging";
import logo from "@/public/fashCycleLogoFavicon.png";
import Image from "next/image";
import { Button } from "./ui/button";
import { notificationAvailablity } from "@/app/api/api";
import { toast } from "sonner";

export default function NotificationListener() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toastData, setToastData] = useState({
    title: "",
    body: "",
    data: "",
    messageId: "",
  });
  useEffect(() => {
    const setupMessaging = async () => {
      await listenToMessages((payload: any) => {
        const { title, body } = payload.notification || {};
        setToastData({
          title: title || "Notification",
          body: body || "You have a new message.",
          data: payload.data,
          messageId: payload.messageId,
        });
        setOpen(true);
      });
    };

    let unsubscribe;
    setupMessaging().then((fn) => {
      unsubscribe = fn;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleAvailablity = async (action: "CONFIRM" | "REJECT") => {
    const productId = toastData?.data?.productId;
    if (!productId) return;

    try {
      setLoading(true);
      const res = await notificationAvailablity(productId, action);
      toast.success(res.message);
    } catch (err) {
      console.error("API Error:", err);
      toast.error(err.message || "Failed to update availability.");
    } finally {
      setLoading(false);
    }
  };
  // const handleView = () => {
  //   if (toastData.clickAction) {
  //     window.open(toastData.clickAction, "_blank");
  //   }
  //   setOpen(false);
  // };

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        duration={150000}
        className="w-96 bg-white border border-gray-200 shadow-xl rounded-xl p-4 animate-in fade-in slide-in-from-bottom-6"
      >
        <div className="flex items-start justify-center gap-3">
          <div className="bg-emerald-100 text-emerald-600 p-2 object-fit-cover rounded-full flex items-center justify-center">
            <Image src={logo} width={40} height={40} alt="FASHCYCLE_FAVICON" />
          </div>
          <div className="flex-1">
            <Toast.Title className="font-semibold text-gray-900">
              {toastData.title}
            </Toast.Title>
            <Toast.Description className="text-sm text-gray-700 mt-1">
              {toastData.body}
            </Toast.Description>
            <div className="flex gap-2 mt-3">
              <Toast.Close asChild>
                <Button
                  variant="ghost"
                  onClick={() => handleAvailablity("CONFIRM")}
                >
                  Is Available?
                </Button>
              </Toast.Close>
              <Toast.Close asChild>
                <Button
                  variant="ghost"
                  onClick={() => handleAvailablity("REJECT")}
                >
                  Not Available!
                </Button>
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
