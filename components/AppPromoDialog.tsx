"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function AppPromoDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-full h-full p-5 bg-transparent flex items-center justify-center">
        <div className="bg-white max-w-4xl rounded-lg shadow-2xl relative ">
          <DialogClose className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <X className="h-5 w-5" />
          </DialogClose>

          <div className="p-6 sm:p-10">
            <DialogHeader className="text-center mb-8">
              <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">
                Download Our Mobile App
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-lg">
                Get the best experience with our mobile app. List your clothes,
                browse collections, and manage your rentals on the go!
              </DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-8 items-center justify-items-center">
              <div className="flex flex-col items-center">
                <p className="mb-2">Play Store</p>
                <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 bg-white rounded-lg shadow-md mx-auto mb-4 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">QR Code</span>
                    </div>
                    <p className="text-sm text-gray-600">Scan to download</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <p className="mb-2">App Store</p>
                <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 bg-white rounded-lg shadow-md mx-auto mb-4 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">QR Code</span>
                    </div>
                    <p className="text-sm text-gray-600">Scan to download</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center mt-6 text-gray-500 text-sm">
              Scan the QR code with your phone camera to download the app
              directly.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
