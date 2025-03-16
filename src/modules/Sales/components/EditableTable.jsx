"use client";

import { useState, useRef, useEffect } from "react";

const EditableTable = ({ columns, data, onSelect, onDataChange }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [tableData, setTableData] = useState(data);

  const tableRef = useRef(null); // Ref for the table container

  const handleRowClick = (row, rowIndex) => {
    if (!editingCell) {
      setSelectedRow(row);
      if (onSelect) {
        onSelect(row);
      }
    }
  };

  const handleCellDoubleClick = (row, rowIndex, columnKey) => {
    const column = columns.find((col) => col.key === columnKey);
    if (column && column.editable !== false) {
      setEditingCell({ rowIndex, columnKey });
      setEditValue(row[columnKey] || "");
    }
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditKeyDown = (e, rowIndex) => {
    if (e.key === "Enter") {
      saveEdit(rowIndex);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const saveEdit = (rowIndex) => {
    if (!editingCell) return;

    const newData = [...tableData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [editingCell.columnKey]: editValue,
    };

    setTableData(newData);
    setEditingCell(null);

    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const cancelEdit = () => {
    setEditingCell(null);
  };

  // Detect clicks outside of the table component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        if (editingCell) {
          saveEdit(editingCell.rowIndex);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingCell]);

  return (
    <div
      ref={tableRef}
      className="h-full max-w-full min-w-[350px] overflow-auto"
    >
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
          {tableData.map((row, rowIndex) => {
            const isSelected = selectedRow === row;
            return (
              <tr
                key={rowIndex}
                className={`transition-colors hover:bg-gray-200 ${
                  isSelected ? "bg-blue-300 hover:bg-blue-500" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRowClick(row, rowIndex);
                }}
              >
                {columns.map((column, colIndex) => {
                  const isEditing =
                    editingCell &&
                    editingCell.rowIndex === rowIndex &&
                    editingCell.columnKey === column.key;

                  return (
                    <td
                      key={colIndex}
                      className={`px-4 py-3 text-center ${
                        column.editable !== false ? "cursor-pointer" : ""
                      }`}
                      onDoubleClick={() =>
                        handleCellDoubleClick(row, rowIndex, column.key)
                      }
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full max-w-[200px] text-center px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={editValue}
                          onChange={handleEditChange}
                          onKeyDown={(e) => handleEditKeyDown(e, rowIndex)}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      ) : (
                        row[column.key] ?? "-"
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EditableTable;
