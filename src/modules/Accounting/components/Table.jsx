import React, { useState } from "react";
import "./Table.css"; // Ensure this file is updated

const Table = ({ columns, data, enableCheckbox }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [wrappedColumns, setWrappedColumns] = useState({}); // Track wrapped columns

    const handleCheckboxChange = (index) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(index)
                ? prevSelectedRows.filter((row) => row !== index)
                : [...prevSelectedRows, index]
        );
    };

    const toggleWrap = (index) => {
        setWrappedColumns((prev) => ({
            ...prev,
            [index]: !prev[index] // Toggle wrap state
        }));
    };

    return (
        <div className={`table-container ${enableCheckbox ? 'checkbox-enabled' : ''}`}>
            <table>
                <thead>
                    <tr>
                        {enableCheckbox && <th></th>}
                        {columns.map((column, index) => (
                            <th key={index} onClick={() => toggleWrap(index)}>
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
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className={wrappedColumns[cellIndex] ? "wrapped" : ""}
                                    onClick={() => toggleWrap(cellIndex)}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
