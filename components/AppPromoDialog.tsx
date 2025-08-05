"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import PlayStoreQR from "@/public/PlayStoreQR.png";
import AppleStoreQR from "@/public/AppleStoreQR.png";

export default function AppPromoDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-6 md:p-10 rounded-xl">
        <DialogHeader className="text-center space-y-2 mb-6">
          <DialogTitle className="text-3xl font-bold text-gray-900">
            Download Our Mobile App
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-lg">
            Get the best experience with our mobile app. List your clothes,
            browse collections, and manage your rentals on the go!
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 items-start justify-center">
          {[
            { store: "Play Store", image: PlayStoreQR },
            { store: "App Store", image: AppleStoreQR },
          ].map((platform, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center rounded"
            >
              <p className="text-lg font-medium mb-3">{platform.store}</p>
              <div className="relative w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center shadow-inner shadow-md overflow-hidden">
                <Image
                  src={platform.image}
                  alt={`${platform.store} QR Code`}
                  fill
                  className="object-contain p-2 rounded-xl"
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Scan the QR code with your phone camera to download the app directly.
        </p>
      </DialogContent>
    </Dialog>
  );
}
