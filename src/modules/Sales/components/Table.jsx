import React, { useState } from "react";

const Table = ({ columns, data, onSelect }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    if (onSelect) {
      onSelect(row);
    }
  };

  return (
    <div className="h-full">
      <table className="w-full text-sm border border-gray-200">
        <thead className="sticky top-0 bg-[#F7F7F7]">
          <tr className="bg-muted/50">
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-3 font-medium text-center">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const isSelected = selectedRow === row;
            return (
              <tr
                key={index}
                className={`transition-colors hover:bg-gray-200 cursor-pointer ${
                  isSelected ? "bg-blue-300 hover:bg-blue-500" : ""
                }`}
                onClick={() => handleRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-center">
                    {row[column.key] ?? "-"}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
