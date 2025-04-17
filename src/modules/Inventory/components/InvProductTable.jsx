import React from "react";
import "../styles/InvProductTable.css"; 


const InvProductTable = ({ columns, data, onSelectProduct }) => {
    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden w-full hidden md:block">
            {/* Table Container */}
            <div className="scroll-container overflow-y-auto min-h-85 max-h-85">
                <table className="w-full table-layout:fixed text-left">
                    {/* Table Header */}
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            {columns.map((header) => (
                                <th key={header} className="py-2 px-4">{header}</th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {data.map((item, index) => (

                            // Table Rows
                            <tr
                                key={index}
                                className={index % 2 === 0 ? "bg-gray-50" : ""}
                                onClick={() => onSelectProduct(item)}
                            >
                                {columns.map((col) => (
                                    <td key={col} className="py-2 px-4">{item[col]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvProductTable;
