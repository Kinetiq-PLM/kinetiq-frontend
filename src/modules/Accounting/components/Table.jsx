import React, { useState } from "react";
import "./Table.css"; // Ensure this file is updated

const Table = ({ columns, data, enableCheckbox }) => {
    const [selectedRows, setSelectedRows] = useState([]);

    const handleCheckboxChange = (index) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(index)
                ? prevSelectedRows.filter((row) => row !== index)
                : [...prevSelectedRows, index]
        );
    };

    return (
        <div className={`table-container ${enableCheckbox ? 'checkbox-enabled' : ''}`}>
            <table>
                <thead>
                    <tr>
                        {enableCheckbox && <th></th>}
                        {columns.map((column, index) => (
                            <th key={index} >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
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
                                // Check if this column is the "Status" column
                                const isStatusColumn = columns[cellIndex] === "Status";

                                return (
                                    <td key={cellIndex} className={isStatusColumn ? "status-cell" : ""}>
                                        <div className={isStatusColumn ? (cell === "Active" ? "status-active" : "status-inactive") : ""}>
                                            {cell}
                                        </div>
                                    </td>
                                );
                            })}

                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default Table;
