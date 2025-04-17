// components/packing/TypeFilter.jsx
import React from "react";

const TypeFilter = ({ packingTypes, selectedType, onTypeChange }) => {
  // Add "All" option to the beginning
  const allTypes = [{ id: "All", name: "All Types" }, ...(packingTypes || [])];
  
  return (
    <div className="filter-container">
      <span className="filter-label">Type:</span>
      <select
        className="type-filter"
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
      >
        {allTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TypeFilter;