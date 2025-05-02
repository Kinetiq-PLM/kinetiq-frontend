import React, { useState } from "react";
import "./Table.css"; // Ensure this file is updated

const Table = ({ columns, data, enableCheckbox, handleStatusToggle }) => {
    const [selectedRows, setSelectedRows] = useState([]);

    const handleCheckboxChange = (index) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(index)
                ? prevSelectedRows.filter((row) => row !== index)
                : [...prevSelectedRows, index]
        );
    };

    // Function to format numbers with commas (if it's a valid number)
    const formatNumber = (value) => {
        if (!isNaN(value) && value !== "" && value !== null) {
            return parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 2 });
        }
        return value; // Return as is if it's not a number
    };

    return (
        <div className="accounting-table">
            <div className={`table-container ${enableCheckbox ? 'checkbox-enabled' : ''}`}>
                <table>
                    <thead>
                        <tr>
                            {enableCheckbox && <th></th>}
                            {columns.map((column, index) => (
                                <th key={index}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={selectedRows.includes(rowIndex) ? "selected-row" : ""}
                            >
                                {enableCheckbox && (
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(rowIndex)}
                                            onChange={() => handleCheckboxChange(rowIndex)}
                                        />
                                    </td>
                                )}
                                {row.map((cell, cellIndex) => {
                                    const isStatusColumn = columns[cellIndex] === "Status";
                                    const formattedCell = formatNumber(cell);

                                    return (
                                        <td key={cellIndex} className={isStatusColumn ? "status-cell" : ""}>
                                            <div
                                                className={
                                                    isStatusColumn
                                                        ? cell === "Active"
                                                            ? "status-active"
                                                            : cell === "Inactive"
                                                                ? "status-inactive"
                                                                : cell === "Draft"
                                                                    ? "status-draft"
                                                                    : cell === "Processing"
                                                                        ? "status-processing"
                                                                        : cell === "Completed"
                                                                            ? "status-completed"
                                                                            : ""
                                                        : ""
                                                }
                                                onClick={() => isStatusColumn && handleStatusToggle(rowIndex)}
                                                style={{ cursor: isStatusColumn ? "pointer" : "default" }}
                                            >
                                                {isStatusColumn ? cell : formattedCell}
                                            </div>

                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
