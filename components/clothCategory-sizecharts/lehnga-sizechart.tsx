import React from "react";

const sizeData = [
  {
    size: "XS",
    blouseBust: "32 in",
    blouseWaist: "26 in",
    lehengaWaist: "26 in",
    lehengaLength: "38 in",
  },
  {
    size: "S",
    blouseBust: "34 in",
    blouseWaist: "28 in",
    lehengaWaist: "28 in",
    lehengaLength: "39 in",
  },
  {
    size: "M",
    blouseBust: "36 in",
    blouseWaist: "30 in",
    lehengaWaist: "30 in",
    lehengaLength: "40 in",
  },
  {
    size: "L",
    blouseBust: "38 in",
    blouseWaist: "32 in",
    lehengaWaist: "32 in",
    lehengaLength: "41 in",
  },
  {
    size: "XL",
    blouseBust: "40 in",
    blouseWaist: "34 in",
    lehengaWaist: "34 in",
    lehengaLength: "42 in",
  },
  {
    size: "XXL",
    blouseBust: "42 in",
    blouseWaist: "36 in",
    lehengaWaist: "36 in",
    lehengaLength: "43 in",
  },
];

export default function LehengaSizeChart({
  onSizeSelect,
}: {
  onSizeSelect: (size: string) => void;
}) {
  const [selectedSize, setSelectedSize] = React.useState<string>("");

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
    <div className="overflow-x-auto p-4">
      <h2 className="text-xl font-semibold mb-2">
        Indian Women Lehenga Size Chart
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Select your size by ticking the checkbox in the row.
      </p>
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Select</th>
            <th className="p-2 border">Size</th>
            <th className="p-2 border">Blouse Bust</th>
            <th className="p-2 border">Blouse Waist</th>
            <th className="p-2 border">Lehenga Waist</th>
            <th className="p-2 border">Lehenga Length</th>
          </tr>
        </thead>
        <tbody>
          {sizeData.map((row, idx) => (
            <tr
              key={idx}
              className={`text-center transition-all duration-200 ${
                row.size === selectedSize
                  ? "bg-primary/10"
                  : "hover:bg-muted/50"
              }`}
            >
              <td className="p-2 border text-center">
                <input
                  type="checkbox"
                  checked={selectedSize === row.size}
                  onChange={() => handleCheckboxChange(row.size)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
              </td>
              <td className="p-2 border font-medium">{row.size}</td>
              <td className="p-2 border">{row.blouseBust}</td>
              <td className="p-2 border">{row.blouseWaist}</td>
              <td className="p-2 border">{row.lehengaWaist}</td>
              <td className="p-2 border">{row.lehengaLength}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
