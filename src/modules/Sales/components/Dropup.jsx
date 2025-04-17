"use client";

import { useState, useRef, useEffect } from "react";

const Dropup = ({
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
    if (value !== undefined) {
      setSelectedOption(value);
    }
    setError(validation());
  }, [value]);

  useEffect(() => {
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
    <div className="relative" style={{ width }}>
      {label && <div className="text-sm mb-2 text-gray-900">{label}</div>}
      <div ref={dropdownRef} className="relative">
        <div
          className="flex justify-between items-center py-2 px-3 bg-white border border-gray-200 rounded-md cursor-pointer select-none box-border"
          onClick={toggleDropdown}
        >
          <div className={"text-gray-600 text-sm"}>
            {selectedOption || placeholder}
          </div>
          <div
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={"text-gray-500"}
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
          <div
            className={`absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-md mb-1 max-h-48 overflow-y-auto z-10 shadow-lg transition-all duration-300 transform ${
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {options.map((option, index) => (
              <div
                key={index}
                className="px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-gray-100 text-gray-600"
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

export default Dropup;
