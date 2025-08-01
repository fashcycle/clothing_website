import React from "react";
import { X } from "lucide-react";
import { addDays, format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const CalendarModal = ({
  isOpen,
  onClose,
  selectedRentalDays,
  rentFromDate,
  onDaySelect,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedRentalDays: number | null;
  rentFromDate: Date | null;
  onDaySelect: (day: Date | undefined) => void;
  onConfirm: () => void;
}) => {
  const minSelectableDate = addDays(new Date(), 2);
  const handleDaySelect = (day: Date) => {
    if (day) {
      onDaySelect(day);
    }
  };
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto"
        >
          <style>
            {`
              .bg-emerald-200 {
                background-color: #a7f3d0 !important;
              }
              .text-emerald-900 {
                color: #064e3b !important;
              }
              .rdp {
                --rdp-cell-size: 2rem;
                --rdp-caption-font-size: 1rem;
              }
              .rdp-months {
                justify-content: center;
            }
            `}
          </style>
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Select Rental Dates</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedRentalDays && (
              <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Selected Duration:</strong> {selectedRentalDays} days
                </p>
              </div>
            )}

            <div className="border rounded-lg p-2 mb-3">
              <DayPicker
                mode="range"
                selected={
                  rentFromDate && selectedRentalDays
                    ? {
                        from: rentFromDate,
                        to: addDays(rentFromDate, selectedRentalDays),
                      }
                    : undefined
                }
                onSelect={() => {}}
                disabled={{ before: minSelectableDate }}
                modifiers={{
                  selectedRange:
                    rentFromDate && selectedRentalDays
                      ? {
                          from: rentFromDate,
                          to: addDays(rentFromDate, selectedRentalDays),
                        }
                      : undefined,
                }}
                modifiersClassNames={{
                  selectedRange: "bg-emerald-200 text-emerald-900",
                }}
                className="w-full"
                onDayClick={handleDaySelect}
              />
            </div>

            {rentFromDate && selectedRentalDays && (
              <div className="mb-3 p-2 bg-emerald-50 rounded-lg">
                <p className="text-xs text-emerald-800 text-center">
                  <strong>Rental Period:</strong>
                  <br />
                  {format(rentFromDate, "MMM dd, yyyy")} →{" "}
                  {format(
                    addDays(rentFromDate, selectedRentalDays),
                    "MMM dd, yyyy"
                  )}
                  <br />
                  <span className="text-xs">({selectedRentalDays} days)</span>
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 text-xs p-2"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                disabled={!rentFromDate || !selectedRentalDays}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-xs p-2"
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
