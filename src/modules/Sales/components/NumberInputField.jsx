import { useState, useEffect } from "react";

const NumberInputField = ({
  label,
  value = "",
  setValue = () => {},
  validation = () => "",
  isValidationVisible = false,
  isPercent = false,
  max = true,
}) => {
  const [error, setError] = useState("");

  useEffect(() => {
    setError(validation());
  }, [value]);

  const handleChange = (e) => {
    let inputValue = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and dots

    // Prevent multiple dots
    const parts = inputValue.split(".");
    if (parts.length > 2) {
      inputValue = parts[0] + "." + parts[1]; // Keep only the first dot and part after it
    }

    // Cap the percentage to 100 if isPercent is true and max is true
    if (max && isPercent && parseFloat(inputValue) > 100) {
      inputValue = "100"; // Prevent values above 100 if percentage
    }

    setValue(inputValue);
  };

  return (
    <div className="flex-1">
      <p className="text-sm">
        {label}
        <span className="text-red-900 ml-1">*</span>
      </p>
      <div className="mt-2 relative">
        <input
          className="bg-[#F7F7F7] w-full py-2 px-3 rounded pr-6 !mb-0"
          type="text"
          value={value !== "" ? (isPercent ? `${value}%` : value) : ""}
          onChange={handleChange}
          required
        />
        {isValidationVisible && error && (
          <p className="text-xs text-red-900 font-light mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};

export default NumberInputField;
