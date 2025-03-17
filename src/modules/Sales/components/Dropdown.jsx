"use client";

import { useState, useRef, useEffect } from "react";

const Dropdown = ({
  label,
  options = [],
  placeholder = "Select an option",
  onChange,
  value,
  width = "100%",
}) => {
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
    <div className="dropdown-container" style={{ width }}>
      {label && <div className="dropdown-label">{label}</div>}
      <div ref={dropdownRef} className="dropdown-wrapper">
        <div className="dropdown-header" onClick={toggleDropdown}>
          <div className="dropdown-selected-value">
            {selectedOption || placeholder}
          </div>
          <div className={`dropdown-arrow ${isOpen ? "open" : ""}`}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="#6B7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        {isOpen && (
          <div className="dropdown-options">
            {options.map((option, index) => (
              <div
                key={index}
                className="dropdown-option"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        .dropdown-container {
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
        }

        .dropdown-label {
          font-size: 16px;
          margin-bottom: 8px;
          color: #111827;
        }

        .dropdown-wrapper {
          position: relative;
        }

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          cursor: pointer;
          user-select: none;
          height: 48px;
          box-sizing: border-box;
        }

        .dropdown-selected-value {
          color: #4b5563;
        }

        .dropdown-arrow {
          transition: transform 0.2s ease;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .dropdown-options {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          margin-top: 4px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 10;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .dropdown-option {
          padding: 12px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
          color: #4b5563;
        }

        .dropdown-option:hover {
          background-color: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default Dropdown;
