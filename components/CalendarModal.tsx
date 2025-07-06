import React, { useEffect, useState } from "react";

import { X } from "lucide-react";
import { addDays, isBefore, format, differenceInDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { Button } from "@/components/ui/button";

import { motion, AnimatePresence } from "framer-motion";
 const CalendarModal = ({
  isOpen,
  onClose,
  selectedRentalDays,
  rentFromDate,
  rentToDate,
  onDaySelect,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedRentalDays: number | null;
  rentFromDate: Date | null;
  rentToDate: Date | null;
  onDaySelect: (day: Date | undefined) => void;
  onConfirm: () => void;
}) => {
  const minSelectableDate = addDays(new Date(), 2);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select Rental Dates</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedRentalDays && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected Duration:</strong> {selectedRentalDays} days
                </p>
              </div>
            )}

            <div className="border rounded-lg p-4">
              <DayPicker
                mode="single"
                selected={rentFromDate ?? undefined}
                onSelect={onDaySelect}
                disabled={{ before: minSelectableDate }}
                modifiers={{
                  rentalRange:
                    rentFromDate && rentToDate
                      ? { from: rentFromDate, to: rentToDate }
                      : undefined,
                }}
                modifiersClassNames={{
                  rentalRange: "bg-emerald-200 text-emerald-900",
                }}
                className="w-full"
              />
            </div>

            {rentFromDate && rentToDate && (
              <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-800 text-center">
                  <strong>Rental Period:</strong>
                  <br />
                  {format(rentFromDate, "MMM dd, yyyy")} →{" "}
                  {format(rentToDate, "MMM dd, yyyy")}
                  <br />
                  <span className="text-xs">
                    ({differenceInDays(rentToDate, rentFromDate)} days)
                  </span>
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                disabled={!rentFromDate || !rentToDate}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Confirm Dates
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default CalendarModal;