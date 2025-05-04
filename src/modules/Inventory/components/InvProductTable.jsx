import React from "react";
import "../styles/InvProductTable.css"; 


const InvProductTable = ({ columns, data, onSelectProduct }) => {
    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden min-h-[500px] w-full h-full">
            {/* Table Container */}
            <div className="scroll-container overflow-y-auto h-full w-full">
                <table className="table-auto text-center w-full min-w-max">
                    {/* Table Header */}
                    <thead className="bg-white sticky top-0 z-10 ">
                        <tr>
                            {columns.map((header) => (
                                <th key={header} className="w-[200px] py-2 px-4 text-gray-600 whitespace-nowrap">{header}</th>
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
                                    <td key={col} className="py-2 px-3">{item[col]}</td>
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
