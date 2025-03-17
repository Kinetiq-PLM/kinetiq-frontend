"use client";

import { useState, useRef, useEffect } from "react";
import { TAX_RATE } from "../temp_data/sales_data";

const SalesTable = ({
  columns,
  data,
  onSelect,
  onDataChange,
  minWidth = false,
  updateData,
}) => {
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
    const newValue = isNaN(editValue) ? editValue : Number(editValue);

    // Validate discount
    if (
      editingCell.columnKey === "discount" &&
      (newValue < 0 || newValue > newData[rowIndex].total_price)
    ) {
      alert(
        "Invalid discount value: Discount cannot be negative or bigger than the total price."
      );
      return; // Prevent saving invalid discount values
    }

    // Validate quantity HERE
    if (
      editingCell.columnKey === "quantity" &&
      (newValue <= 0 || !Number.isInteger(newValue))
    ) {
      alert("Invalid quantity: Quantity must be a positive whole number.");
      return;
    }

    // Validate unit price
    if (editingCell.columnKey === "unit_price" && newValue < 0) {
      alert("Invalid unit price: Price cannot be negative.");
      return;
    }

    newData[rowIndex] = {
      ...newData[rowIndex],
      [editingCell.columnKey]: isNaN(editValue) ? editValue : Number(editValue),
    };

    const updatedData = newData.map((item) => {
      const unitPrice = Number(item.unit_price); // Keep unit_price as a number
      const tax = TAX_RATE * unitPrice * item.quantity; // Correct tax calculation
      const total = unitPrice * item.quantity + tax - item.discount;
      return {
        ...item,
        unit_price: unitPrice.toFixed(2), // Convert to string only for display
        tax: tax.toFixed(2), // Ensure tax is formatted properly
        total_price: total.toFixed(2), // Calculate total price
      };
    });

    setTableData(updatedData);
    updateData(updatedData);

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

  useEffect(() => {
    // This should run whenever the data prop changes
    const updatedData = data.map((item) => {
      const unitPrice = Number(item.unit_price); // Keep unit_price as a number
      const tax = TAX_RATE * unitPrice * item.quantity; // Correct tax calculation
      const total = unitPrice * item.quantity + tax - item.discount;
      return {
        ...item,
        unit_price: unitPrice.toFixed(2), // Convert to string only for display
        tax: tax.toFixed(2), // Ensure tax is formatted properly
        total_price: total.toFixed(2), // Calculate total price
      };
    });

    setTableData(updatedData);
  }, [data]);

  return (
    <div
      ref={tableRef}
      className="h-full max-w-full min-w-[350px] overflow-auto"
    >
      <table className="w-full text-sm border border-gray-200">
        <thead className="sticky top-0 bg-[#F7F7F7]">
          <tr className="bg-muted/50">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-3 font-medium text-center ${
                  minWidth ? "min-w-[150px]" : ""
                }`}
              >
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

export default SalesTable;
