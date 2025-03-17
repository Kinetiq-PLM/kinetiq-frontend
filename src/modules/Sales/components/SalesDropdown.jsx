"use client";

import { useState, useRef, useEffect } from "react";

const SalesDropdown = ({
  label,
  options = [],
  placeholder = "Select an option",
  width = "100%",
  disabled = false,
}) => {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Update selected option when value prop changes
    if (value !== undefined) {
      setSelectedOption(value);
    }
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
    if (disabled) return;

    alert(option);
    // setSelectedOption(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (disabled) return;

    setIsOpen(!isOpen);
  };

  return (
    <div className="relative font-sans" style={{ width }}>
      {label && <div className="text-base mb-2 text-gray-900">{label}</div>}
      <div ref={dropdownRef} className="relative">
        <div
          className={`flex justify-between items-center px-4 py-3 bg-white border rounded-md h-12 box-border ${
            disabled
              ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-70"
              : "border-gray-200 cursor-pointer"
          }`}
          onClick={toggleDropdown}
          aria-disabled={disabled}
        >
          <div className={`${disabled ? "text-gray-400" : "text-gray-600"}`}>
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
              className={`${disabled ? "text-gray-400" : "text-gray-500"}`}
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
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 max-h-48 overflow-y-auto z-10 shadow-lg">
            {options.map((option, index) => (
              <div
                key={index}
                className="px-4 py-3 cursor-pointer transition-colors hover:bg-gray-100 text-gray-600"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesDropdown;
