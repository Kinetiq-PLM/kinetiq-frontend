"use client";

import { useState, useRef, useEffect } from "react";
import { TAX_RATE } from "../temp_data/sales_data";
import { useAlert } from "./Context/AlertContext";
import { GET } from "../api/api";
import { useQuery } from "@tanstack/react-query";
const SalesTable = ({
  columns,
  data,
  initialProducts,
  onSelect,
  onDataChange,
  minWidth = false,
  updateData,
  isQuotation = false,
}) => {
  const { showAlert } = useAlert();

  const [selectedRow, setSelectedRow] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [tableData, setTableData] = useState(data);
  const [warehouseOptions, setWarehouseOptions] = useState([]); // State for warehouse options
  const tableRef = useRef(null); // Ref for the table container
  const handleRowClick = (row, rowIndex) => {
    if (!editingCell) {
      setSelectedRow(row);
      if (onSelect) {
        onSelect(row);
      }
    }
  };

  useEffect(() => {
    const fetchWarehouseOptions = async (productId) => {
      try {
        const response = await GET(`sales/products?admin_product=${productId}`);
        console.log("response:", response);
        return response.flatMap((item) =>
          item.inventory_items.map((i) => ({
            ...i.warehouse,
            inventory_item_id: i.inventory_item_id,
          }))
        );
      } catch (error) {
        console.error("Error fetching warehouse options:", error);
        return [];
      }
    };

    // Get unique product IDs
    const productIds = [...new Set(data.map((row) => row.product_id))];

    // Fetch warehouse options for each product
    const loadOptions = async () => {
      const options = {};
      for (const productId of productIds) {
        options[productId] = await fetchWarehouseOptions(productId);
      }
      setWarehouseOptions(options);
    };

    if (productIds.length > 0) {
      loadOptions();
    }
  }, [data]);

  useEffect(() => {
    console.log("warehouseOptions", warehouseOptions);
  }, [warehouseOptions]);

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

    const newValue =
      editingCell.columnKey === "special_requests"
        ? editValue
        : isNaN(editValue)
        ? editValue
        : Number(editValue);

    // Validate discount

    if (
      editingCell.columnKey === "discount" &&
      newData[rowIndex].selling_price === 0 &&
      isQuotation
    ) {
      showAlert({
        type: "error",
        title: "Cannot apply discount on project order item",
      });
      cancelEdit();
      return;
    }

    if (
      editingCell.columnKey === "discount" &&
      (newValue < 0 || newValue > newData[rowIndex].total_price)
    ) {
      showAlert({
        type: "error",
        title: "Invalid discount value",
      });
      return; // Prevent saving invalid discount values
    }

    // Validate quantity HERE
    if (
      editingCell.columnKey === "quantity" &&
      (newValue <= 0 || !Number.isInteger(newValue))
    ) {
      showAlert({
        type: "error",
        title: "Invalid quantity value",
      });
      return;
    }

    if (
      editingCell.columnKey === "quantity" &&
      newValue > Number(newData[rowIndex].stock_level)
    ) {
      showAlert({
        type: "error",
        title: "Quantity must not exceed stock level.",
      });
      return;
    }

    if (
      initialProducts &&
      editingCell.columnKey === "quantity" &&
      newValue > Number(initialProducts[rowIndex].quantity)
    ) {
      showAlert({
        type: "error",
        title:
          "The product quantity cannot exceed the specified amount in the order.",
      });
      return;
    }

    // Validate unit price
    if (editingCell.columnKey === "selling_price" && newValue < 0) {
      showAlert({
        type: "error",
        title: "Price cannot be negative.",
      });
      return;
    }

    newData[rowIndex] = {
      ...newData[rowIndex],
      [editingCell.columnKey]:
        editingCell.columnKey === "special_requests"
          ? editValue
          : isNaN(editValue)
          ? editValue
          : Number(editValue),
    };

    const updatedData = newData.map((item, index) => {
      if (index === rowIndex) {
        if (editingCell.columnKey === "warehouse") {
          // Find the selected warehouse option
          const selectedWarehouse = warehouseOptions[item.product_id]?.find(
            (option) => option.inventory_item_id.toString() === editValue
          );
          return {
            ...item,
            warehouse: selectedWarehouse?.warehouse_name || "",
            inventory_item_id: selectedWarehouse?.inventory_item_id || "",
          };
        }

        if (item.special_requests && isQuotation) {
          return {
            ...item,
            selling_price: 0, // Convert to string only for display
            tax: 0, // Ensure tax is formatted properly
            total_price: 0, // Calculate total price
          };
        } else {
          const unitPrice =
            newData[rowIndex].selling_price === 0
              ? Number(item.backup_price)
              : item.selling_price; // Keep selling_price as a number
          const tax = TAX_RATE * unitPrice * item.quantity; // Correct tax calculation
          const total = unitPrice * item.quantity + tax - Number(item.discount);
          return {
            ...item,
            selling_price: unitPrice, // Convert to string only for display
            tax: tax, // Ensure tax is formatted properly
            total_price: total, // Calculate total price
          };
        }
      }
      return item;
    });

    setTableData(updatedData);
    updateData(updatedData);
    console.log("updatedData", updatedData);

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
      const unitPrice = Number(item.selling_price); // Keep selling_price as a number
      const tax = TAX_RATE * unitPrice * item.quantity; // Correct tax calculation
      const total = unitPrice * item.quantity + tax - item.discount;
      return {
        ...item,
        selling_price: Number(unitPrice), // Convert to string only for display
        tax: Number(tax),
        total_price: Number(total),
      };
    });

    setTableData(updatedData);
  }, [data]);

  return (
    <div
      ref={tableRef}
      className="h-full max-w-full min-w-[350px] overflow-auto"
    >
      <table className="w-full text-sm ">
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
                        column.dropdown ? (
                          <select
                            className="w-full max-w-[200px] text-center px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editValue}
                            onChange={handleEditChange}
                            onKeyDown={(e) => handleEditKeyDown(e, rowIndex)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          >
                            <option value="" disabled hidden>
                              Select Warehouse
                            </option>
                            {warehouseOptions[row.product_id]?.map(
                              (option, index) => (
                                <option
                                  key={index}
                                  value={option.inventory_item_id}
                                >
                                  {option.warehouse_name}
                                </option>
                              )
                            )}
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="w-full max-w-[200px] text-center px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editValue}
                            onChange={handleEditChange}
                            onKeyDown={(e) => handleEditKeyDown(e, rowIndex)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                        )
                      ) : typeof row[column.key] === "number" ? (
                        column.key === "quantity" ? (
                          row[column.key]
                        ) : (
                          row[column.key].toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        )
                      ) : (
                        row[column.key] || "-"
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
