import React from 'react'

const Search = ({ type, placeholder, value, onChange }) => {
  return (
    <div className="max-sm:py-1 max-sm:px-2 max-sm:w-40 flex items-center border border-gray-500 rounded-lg px-3 py-2 bg-white shadow-sm focus-within:border-gray-800">
      <img 
        src="./accounting/searching-icon.svg" 
        alt="Search" 
        className="w-5 h-5 text-gray-400"
      />
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className="max-sm:text-xs ml-2 w-full outline-none bg-transparent text-gray-700"
      />
    </div>
  );
};

export default Search
