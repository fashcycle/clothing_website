import React from "react";
import { motion } from "framer-motion";

const anarkaliSizeData = [
  {
    size: "XS",
    bust: "32-33 in",
    waist: "26-27 in",
    hip: "35-36 in",
    length: "54-55 in",
    sleeve: "22-23 in",
    shoulder: "13-13.5 in",
  },
  {
    size: "S",
    bust: "34-35 in",
    waist: "28-29 in",
    hip: "37-38 in",
    length: "55-56 in",
    sleeve: "23-24 in",
    shoulder: "13.5-14 in",
  },
  {
    size: "M",
    bust: "36-37 in",
    waist: "30-31 in",
    hip: "39-40 in",
    length: "56-57 in",
    sleeve: "24-25 in",
    shoulder: "14-14.5 in",
  },
  {
    size: "L",
    bust: "38-39 in",
    waist: "32-33 in",
    hip: "41-42 in",
    length: "57-58 in",
    sleeve: "25-26 in",
    shoulder: "14.5-15 in",
  },
  {
    size: "XL",
    bust: "40-41 in",
    waist: "34-35 in",
    hip: "43-44 in",
    length: "58-59 in",
    sleeve: "26-27 in",
    shoulder: "15-15.5 in",
  },
  {
    size: "XXL",
    bust: "42-43 in",
    waist: "36-37 in",
    hip: "45-46 in",
    length: "59-60 in",
    sleeve: "27-28 in",
    shoulder: "15.5-16 in",
  },
];

export default function AnarkaliSizeChart({
  onSizeSelect,
}: {
  onSizeSelect: (size: string) => void;
}) {
  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [showMeasurementGuide, setShowMeasurementGuide] =
    React.useState<boolean>(false);
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Women's Anarkali Size Chart</h2>
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
                  Measure around the fullest part of your bust, keeping the tape
                  parallel to the floor.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-16">Waist:</span>
                <span>
                  Measure around your natural waistline, where your body bends.
                  Keep the tape snug but not tight.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-16">Hip:</span>
                <span>
                  Measure around the fullest part of your hips, about 7-9 inches
                  below your waist.
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
                <span className="font-semibold min-w-16">Sleeve:</span>
                <span>
                  {" "}
                  Measure from the top of your shoulder down to your wrist.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-16">Shoulder:</span>
                <span>
                  Measure from the edge of one shoulder to the edge of the
                  other, across your upper back.
                </span>
              </li>
            </ul>
          </motion.div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3  border border-gray-200 text-center">
                  Select
                </th>
                <th className="p-3  border border-gray-200 text-center ">
                  Size
                </th>
                <th className="p-3  border border-gray-200 text-center ">
                  Bust
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Waist
                </th>
                <th className="p-3 border border-gray-200 text-center ">Hip</th>
                <th className="p-3 border border-gray-200 text-center ">
                  Length
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Sleeve
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Shoulder
                </th>
              </tr>
            </thead>
            <tbody>
              {anarkaliSizeData.map((row, idx) => (
                <tr
                  key={idx}
                  className="text-center border hover:bg-muted/50 transition"
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedSize === row.size}
                      onChange={() => handleCheckboxChange(row.size)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                  </td>
                  <td className="p-3 border text-left font-medium">
                    {row.size}
                  </td>
                  <td className="p-3 border">{row.bust}</td>
                  <td className="p-3 border">{row.waist}</td>
                  <td className="p-3 border ">{row.hip}</td>
                  <td className="p-3 border">{row.length}</td>
                  <td className="p-3 border">{row.sleeve}</td>
                  <td className="p-3 border">{row.shoulder}</td>
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
