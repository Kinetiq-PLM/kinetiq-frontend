import { useState, useEffect } from "react";

const InputField = ({
  label,
  value = "",
  setValue = () => {},
  validation = () => {
    return "";
  },
  isValidationVisible = false,
}) => {
  const [error, setError] = useState("");

  useEffect(() => {
    setError(validation());
  }, [value]);

  return (
    <div className="flex-1">
      <p className="text-sm">
        {label}
        <span className="text-red-900 ml-1">*</span>
      </p>
      <div className="mt-2">
        <input
          className="bg-[#F9FAFA] w-full py-2 px-3 rounded"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        {isValidationVisible ? (
          <p className="text-xs text-red-900 font-light mt-1">{error}</p>
        ) : null}
      </div>
    </div>
  );
};

export default InputField;
