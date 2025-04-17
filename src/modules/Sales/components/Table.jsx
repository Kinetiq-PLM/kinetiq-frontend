import React, { useState } from "react";

const Table = ({
  columns,
  data,
  onSelect = () => {},
  minWidth = false,
  setIsDocumentModalOpen = null,
  setDocument = null,
}) => {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    if (onSelect) {
      onSelect(row);
    }
  };

  return (
    <div className="h-full">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-[#F7F7F7]">
          <tr className="bg-muted/50">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-3 font-medium text-center min-w-[200px] ${
                  minWidth ? "min-w-[200px]" : ""
                }`}
              >
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
                {columns.map((column, colIndex) => {
                  if (column.key === "document_link") return null;
                  if (column.key !== "document") {
                    return (
                      <td key={colIndex} className="px-4 py-3 text-center">
                        {row[column.key] ?? "-"}
                      </td>
                    );
                  } else {
                    if (row[column.key]) {
                      return (
                        <td key={colIndex} className="px-4 py-3 text-center">
                          <a
                            onClick={() => {
                              setIsDocumentModalOpen(true);
                              setDocument(row.endpoint);
                            }}
                            // href={row.document_link}
                            className="underline text-[#00a8a8]"
                          >
                            View
                          </a>
                        </td>
                      );
                    }
                    return (
                      <td key={colIndex} className="px-4 py-3 text-center">
                        <a className="text-[#00a8a8]">Unavailable</a>
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
