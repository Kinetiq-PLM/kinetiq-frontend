import React, { useRef, useEffect } from "react";
import SearchBar from "../../../shared/components/SearchBar";

const ControlledSearchBar = ({ placeholder, value, onChange }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const inputElement = wrapperRef.current?.querySelector("input");
    if (inputElement) {
      inputElement.oninput = (e) => onChange(e);
      if (inputElement.value !== value) {
        inputElement.value = value;
      }
    }
  }, [value, onChange]);

  return (
    <div ref={wrapperRef}>
      <SearchBar placeholder={placeholder} />
    </div>
  );
};

const InvNav = ({ activeTab, onTabChange, searchTerm, onSearchChange }) => {
  const tabs = ["Products", "Assets", "Raw Materials"];

  return (
    <nav className="md:flex md:flex-wrap justify-between items-center p-2 w-full">
      <div className="flex flex-1 h-8.5 justify-start md:flex-row-reverse md:order-2">
        <ControlledSearchBar
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value.slice(0, 1))}
        />
      </div>
      <div className="invNav flex border-b border-gray-300 mt-1 space-x-8 min-w-xs md:w-auto mt-3 mb-1 md:order-1">
        {tabs.map((tab) => (
          <span
            key={tab}
            className={`cursor-pointer text-xs md:text-lg font-semibold transition-colors ${
              activeTab === tab
                ? "text-cyan-600 border-b-2 border-cyan-600"
                : "text-gray-500"
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </span>
        ))}
      </div>
    </nav>
  );
};

export default InvNav;
