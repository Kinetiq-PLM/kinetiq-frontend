import { useState, useEffect } from "react";

const NumberInputField = ({
  label,
  value = "",
  setValue = () => {},
  validation = () => "",
  isValidationVisible = false,
  isPercent = false,
}) => {
  const [error, setError] = useState("");

  useEffect(() => {
    setError(validation());
  }, [value]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e) => {
    let inputValue = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and dots
    if (isPercent && parseFloat(inputValue) > 100) {
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
          className="bg-[#F7F7F7] w-full py-2 px-3 rounded pr-6"
          type="text"
          value={
            value !== ""
              ? isPercent
                ? `${formatNumber(value)}%`
                : formatNumber(value)
              : ""
          }
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
