import { useState, useEffect } from "react";

const InputField = ({
  label,
  value = "",
  setValue = () => {},
  validation = () => {
    return "";
  },
  isValidationVisible = false,
  isDisabled = false,
}) => {
  const [error, setError] = useState("");

  useEffect(() => {
    setError(validation());
  }, [value]);

  return (
    <div className="flex-1">
      <p className="text-sm">
        {label}
        {isDisabled ? null : <span className="text-red-900 ml-1">*</span>}
      </p>
      <div className="mt-2">
        <input
          className={`w-full py-2 px-3 rounded text-sm bg-[#F7F7F7] !mb-0 ${
            isDisabled
              ? "outline-none focus:outline-none focus:ring-0 focus:border-transparent"
              : "focus:outline focus:ring-2 focus:ring-blue-500"
          }`}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isDisabled}
        />

        {isValidationVisible ? (
          <p className="text-xs text-red-900 font-light mt-1">{error}</p>
        ) : null}
      </div>
    </div>
  );
};

export default InputField;
