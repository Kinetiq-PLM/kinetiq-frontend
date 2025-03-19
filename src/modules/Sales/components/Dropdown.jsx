"use client";

import { useState, useRef, useEffect } from "react";

const Dropdown = ({
  label,
  options = [],
  placeholder = "Select an option",
  onChange,
  value,
  width = "100%",
  validation = () => {
    return "";
  },
  isValidationVisible = false,
}) => {
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Update selected option when value prop changes
    if (value !== undefined) {
      setSelectedOption(value);
    }
    setError(validation());
  }, [value]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex-1 text-sm" style={{ width }}>
      {label && (
        <div className="mb-2 text-gray-900">
          {label} <span className="text-red-900 ml-1">*</span>{" "}
        </div>
      )}
      <div ref={dropdownRef} className="relative">
        <div
          className="flex justify-between items-center py-2 px-3 bg-white border border-gray-200 rounded-md cursor-pointer select-none box-border"
          onClick={toggleDropdown}
        >
          <div className="text-gray-600">{selectedOption || placeholder}</div>
          <div
            className={`transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-500"
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 max-h-[200px] overflow-y-auto z-10 shadow-md">
            {options.map((option, index) => (
              <div
                key={index}
                className="px-4 py-3 cursor-pointer transition-colors duration-200 text-gray-600 hover:bg-gray-100"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
        {isValidationVisible ? (
          <p className="text-xs text-red-900 font-light mt-1">{error}</p>
        ) : null}
      </div>
    </div>
  );
};

export default Dropdown;
