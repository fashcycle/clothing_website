import React from "react";
import { motion } from "framer-motion";

const rajasthaniPoshakSizeData = [
  {
    size: "XS",
    bust: '32"',
    waist: '26"',
    hip: '34"',
    length: '38"',
    shoulder: '13"',
    sleeve: '90"',
  },
  {
    size: "S",
    bust: '34"',
    waist: '28"',
    hip: '36"',
    length: '39"',
    shoulder: '14"',
    sleeve: '95"',
  },
  {
    size: "M",
    bust: '36"',
    waist: '30"',
    hip: '38"',
    length: '40"',
    shoulder: '15"',
    sleeve: '100"',
  },
  {
    size: "L",
    bust: '38"',
    waist: '32"',
    hip: '40"',
    length: '41"',
    shoulder: '16"',
    sleeve: '105"',
  },
  {
    size: "XL",
    bust: '40"',
    waist: '34"',
    hip: '42"',
    length: '42"',
    shoulder: '17"',
    sleeve: '110"',
  },
  {
    size: "XXL",
    bust: '42"',
    waist: '36"',
    hip: '44"',
    length: '43"',
    shoulder: '18"',
    sleeve: '115"',
  },
];

export default function RajasthaniPoshakSizeChart({
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
          <h2 className="text-xl font-semibold">Rajasthani Poshak Size Chart</h2>
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
                  Measure from the shoulder to the desired length of the poshak.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-16">Shoulder:</span>
                <span>
                  Measure from the edge of one shoulder to the other across your
                  back.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-16">Sleeve:</span>
                <span>
                  Measure from the shoulder point to the desired sleeve length.
                </span>
              </li>
            </ul>
          </motion.div>
        )}

        <p className="text-sm text-gray-500 mb-4">
          Select your size by ticking the checkbox.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50">
              <tr >
                <th className="p-3 border border-gray-200 text-center ">
                  Select
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Size
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Bust <br/> (Choli)
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Waist <br/>(Ghaghra)
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Hip<br/> (Ghaghra)
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Ghaghra Length
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Choli Length
                </th>
                <th className="p-3 border border-gray-200 text-center ">
                  Odni Length
                </th>
              </tr>
            </thead>
            <tbody>
              {rajasthaniPoshakSizeData.map((row, idx) => (
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
                  <td className="p-3 border text-center">{row.length}</td>
                  <td className="p-3 border text-center">{row.shoulder}</td>
                  <td className="p-3  border text-center">{row.sleeve}</td>
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
