import React from "react";
import { motion } from "framer-motion";

const shararaSizeData = [
  {
    size: "XS",
    bust: "32-33 in",
     waist: "24-26 in",
    hip: "35-36 in",
    topLength: "38-39 in",
    bottomLength: "38-39 in",
    bottomWaist: "26-27 in",
  },
  {
    size: "S",
    bust: "34-35 in",
    waist: "28-29 in",
    hip: "37-38 in",
    topLength: "39-40 in",
    bottomLength: "39-40 in",
    bottomWaist: "28-29 in",
  },
  {
    size: "M",
    bust: "36-37 in",
    waist: "30-31 in",
    hip: "39-40 in",
    topLength: "40-41 in",
    bottomLength: "40-41 in",
    bottomWaist: "30-31 in",
  },
  {
    size: "L",
    bust: "38-39 in",
    waist: "32-33 in",
    hip: "41-42 in",
    topLength: "41-42 in",
    bottomLength: "41-42 in",
    bottomWaist: "32-33 in",
  },
  {
    size: "XL",
    bust: "40-41 in",
    waist: "34-35 in",
    hip: "43-44 in",
    topLength: "42-43 in",
    bottomLength: "42-43 in",
    bottomWaist: "34-35 in",
  },
  {
    size: "XXL",
    bust: "42-43 in",
    waist: "36-37 in",
    hip: "45-46 in",
    topLength: "43-44 in",
    bottomLength: "43-44 in",
    bottomWaist: "36-37 in",
  },
];

export default function ShararaSizeChart({
  onSizeSelect,
}: {
  onSizeSelect: (size: string) => void;
}) {
  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [showMeasurementGuide, setShowMeasurementGuide] =
    React.useState<boolean>(false);

  const handleCheckboxChange = (size: string) => {
    if (selectedSize === size) {
      setSelectedSize("");
      onSizeSelect("");
    } else {
      setSelectedSize(size);
      onSizeSelect(size);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sharara Set Size Chart</h2>
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
                <span>Measure around the fullest part of your hips.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-16">Top Length:</span>
                <span>Measure from shoulder to desired length of the top.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-16">Bottom:</span>
                <span>Measure from waist to ankle for the sharara length.</span>
              </li>
            </ul>
          </motion.div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 ">
              <tr >
                <th className="p-3 border border-gray-200 text-center font-medium">
                  Select
                </th>
                <th className="p-3 border border-gray-200 text-center font-medium">
                  Size
                </th>
                <th className="p-3 border border-gray-200 text-center font-medium">
                  Bust
                </th>
                <th className="p-3 border border-gray-200 text-center font-medium">
                  Top Waist
                </th>
                <th className="p-3 border border-gray-200 text-center font-medium">
                  Hip
                </th>
                <th className="p-3 border border-gray-200 text-center font-medium">
                  Top Length
                </th>
                <th className="p-3 border border-gray-200 text-center font-medium">
                  Bottom Length
                </th>
                <th className="p-3 border border-gray-200 text-center font-medium">
                  Bottom Waist
                </th>
              </tr>
            </thead>
            <tbody>
              {shararaSizeData.map((row, idx) => (
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
                  <td className="p-3 border font-medium text-center">{row.size}</td>
                  <td className="p-3 border text-center">{row.bust}</td>
                  <td className="p-3 border text-center">{row.waist}</td>
                  <td className="p-3 border text-center">{row.hip}</td>
                  <td className="p-3 border text-center">{row.topLength}</td>
                  <td className="p-3 border text-center">{row.bottomLength}</td>
                  <td className="p-3 border text-center">{row.bottomWaist}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <span className="font-medium">Size {selectedSize}</span> selected.
                You can now proceed with your order.
              </span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
