import React from "react";
import { motion } from "framer-motion";

// Gown size data based on standard Indian women's measurements
// References from popular fashion retailers like Myntra and Ajio
const gownSizeData = [
  {
    size: "XS",
    bust: "32-33 in",
    waist: "25-26 in",
    hip: "35-36 in",
    length: "52-54 in",
    shoulder: "14 in"
  },
  {
    size: "S",
    bust: "34-35 in",
    waist: "27-28 in",
    hip: "37-38 in",
    length: "54-56 in",
    shoulder: "14.5 in"
  },
  {
    size: "M",
    bust: "36-37 in",
    waist: "29-30 in",
    hip: "39-40 in",
    length: "56-58 in",
    shoulder: "15 in"
  },
  {
    size: "L",
    bust: "38-39 in",
    waist: "31-32 in",
    hip: "41-42 in",
    length: "58-60 in",
    shoulder: "15.5 in"
  },
  {
    size: "XL",
    bust: "40-41 in",
    waist: "33-34 in",
    hip: "43-44 in",
    length: "60-62 in",
    shoulder: "16 in"
  },
  {
    size: "XXL",
    bust: "42-43 in",
    waist: "35-36 in",
    hip: "45-46 in",
    length: "62-64 in",
    shoulder: "16.5 in"
  },
];

export default function GownSizeChart({ onSizeSelect }: { onSizeSelect: (size: string) => void }) {
  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [showMeasurementGuide, setShowMeasurementGuide] = React.useState<boolean>(false);
 const handleCheckboxChange = (size: string) => {
    // If the same size is clicked again, deselect it
    if (selectedSize === size) {
      setSelectedSize("");
      onSizeSelect("");
    } else {
      setSelectedSize(size);
      onSizeSelect(size);
    }
  };
  // Animation variants
  const tableRowVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.3
      }
    }),
    hover: { 
      backgroundColor: "rgba(var(--primary-rgb), 0.05)",
      transition: { duration: 0.2 }
    },
    selected: {
      backgroundColor: "rgba(var(--primary-rgb), 0.15)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Women's Gown Size Chart</h2>
          <button
            onClick={() => setShowMeasurementGuide(!showMeasurementGuide)}
            className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h.01a1 1 0 000-2H9z"
                clipRule="evenodd"
              />
            </svg>
            How to measure
          </button>
        </div>

        {showMeasurementGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-lg p-4 mb-6"
          >
            <h3 className="text-sm font-medium mb-2">
              How to Take Your Measurements
            </h3>
            <ul className="text-xs text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-16">Bust:</span>
                <span>
                  Measure around the fullest part of your bust while wearing a
                  non-padded bra.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-16">Waist:</span>
                <span>
                  Measure around your natural waistline (the smallest part of
                  your torso).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-16">Hip:</span>
                <span>
                  Measure around the fullest part of your hips and buttocks.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-16">Length:</span>
                <span>
                  Measure from the highest point of your shoulder to where you
                  want the gown to end.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-16">Shoulder:</span>
                <span>
                  Measure from the edge of one shoulder to the other across your
                  back.
                </span>
              </li>
            </ul>
          </motion.div>
        )}

        <p className="text-sm text-gray-500 mb-4">
          Select your size by ticking the checkbox in the row.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border border-gray-200 text-center ">
                  Select
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Size
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Bust
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Waist
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Hip
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Length
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Shoulder
                </th>
              </tr>
            </thead>
            <tbody>
              {gownSizeData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`text-center transition-all duration-200 ${
                    row.size === selectedSize
                      ? "bg-primary/10"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <td className="p-3 border text-center">
                    <input
                      type="checkbox"
                      checked={selectedSize === row.size}
                      onChange={() => handleCheckboxChange(row.size)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                  </td>
                  <td className="p-3 border font-medium text-left">{row.size}</td>
                  <td className="p-3 border">{row.bust}</td>
                  <td className="p-3 border">{row.waist}</td>
                  <td className="p-3 border">{row.hip}</td>
                  <td className="p-3 border">{row.length}</td>
                  <td className="p-3 border">{row.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p className="mb-2">
            * Measurements are in inches and are approximations. For the best
            fit, we recommend checking your measurements against the size chart.
          </p>
          <p>
            * If you're between sizes, we recommend choosing the larger size for
            a more comfortable fit.
          </p>
        </div>

        {selectedSize && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg"
          >
            <p className="text-sm flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-primary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <span className="font-medium">Size {selectedSize}</span>{" "}
                selected. You can now proceed with your order.
              </span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}