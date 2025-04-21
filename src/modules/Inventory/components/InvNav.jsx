import React, { useRef, useEffect } from "react";
import SearchBar from "../components/InvSearchBar";

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
    <div ref={wrapperRef} className="w-full  md:w-[200px] lg:min-w-[300px]">
      <SearchBar placeholder={placeholder} />
    </div>
  );
};

const InvNav = ({ activeTab, onTabChange, searchTerm, onSearchChange }) => {
  const tabs = ["Products", "Assets", "Raw Materials"];

  return (
    <nav className="md:flex justify-between items-center md:p-2 p-4 w-full">

      {/* Search Bar */}
      <div className="flex flex-1 h-8.5 justify-start md:flex-row-reverse sm:order-2">
        <ControlledSearchBar
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value.slice(0, 1))}
        />
      </div>

      {/* Category */}
      <div className="flex justify-between md:flex border-b border-gray-300 md:space-x-8  mt-3 mb-1 md:order-1">
        {tabs.map((tab) => (
          <span
            key={tab}
            className={`cursor-pointer text-center text-md md:text-lg font-semibold transition-colors ${
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
      

      {/* Small Screen Category */}
      {/* <div className="md:hidden flex border-gray-300 space-x-8 w-full mt-3 mb-1 md:order-1 ">
        <select name="" id="" className="border w-full md:max-w-[240px] border-gray-300 rounded-md p-1 text-gray-500   cursor-pointer">
          <option value=""className="text-xs">Category</option>
          {tabs.map((tab) => (
          <option
            key={tab}
            className={`cursor-pointer text-xs md:text-lg font-semibold transition-colors ${
              activeTab === tab
                ? "text-cyan-600 border-b-2 border-cyan-600"
                : "text-gray-500"
            }`}
            onClick={() => onTabChange(tab)} value={tab}
          >
            {tab}
          </option>
        ))}
        </select>
      </div> */}



    </nav>
  );
};

export default InvNav;
