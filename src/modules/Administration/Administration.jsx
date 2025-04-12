import React from "react";

const Administration = ({ setActiveSubModule, loadSubModule }) => {
    return (
        <div className="admin">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Table */}
                    <Card title="User" clickable={true}>
                        <div
                            onClick={() => {
                                setActiveSubModule("User");
                                loadSubModule("User");
                            }}
                            className="cursor-pointer"
                        >
                            <Table
                                headers={[" ", "Username", "Email", "Date", "Category"]}
                                data={Array(4).fill(["User_02", "User02@Gmail.Com", "2024-12-16", "Employee Benefits"])}
                                withCheckbox={true}
                                highlightDisabledRow={true}
                                badge={true}
                            />
                        </div>
                    </Card>

                    {/* Masterlist Card */}
                    <Card title="Masterlist" clickable={true}>
                        <div
                            onClick={() => {
                                setActiveSubModule("Masterlist");
                                loadSubModule("Masterlist");
                            }}
                            className="cursor-pointer"
                        >
                            <Table
                                headers={["Username", "Email", "Date", "Category"]}
                                data={Array(4).fill(["User_02", "User02@Gmail.Com", "2024-12-16", "Employee Benefits"])}
                            />
                        </div>
                    </Card>                                


                    {/* Audit Logs Card */}
                    <Card title="Audit Logs" clickable={true}>
                        <div
                            onClick={() => {
                                setActiveSubModule("Audit Logs");
                                loadSubModule("Audit Logs");
                            }}
                            className="cursor-pointer"
                        >
                            <Table
                                headers={[" ", "Username", "Email", "Date"]}
                                data={Array(4).fill(["User_02", "User02@Gmail.Com", "2024-12-16"])}
                                withCheckbox={true}
                                badge={true}
                            />
                        </div>
                    </Card>


                    {/* Policy Card */}
                    <Card title="Policy" clickable={true}>
                        <div
                            onClick={() => {
                                setActiveSubModule("Policy");
                                loadSubModule("Policy");
                            }}
                            className="cursor-pointer"
                        >
                            <Table
                                headers={["Policy Id", "Policy Name", "Description"]}
                                data={Array(3).fill(["Mari123", "Employee Conduct Policy", "Masikip"])}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const Card = ({ title, children, onClick, clickable = false }) => (
    <div
        className={`bg-white shadow-md rounded-lg p-6 relative overflow-hidden ${clickable ? "cursor-pointer hover:shadow-lg transition" : ""}`}
        onClick={clickable ? onClick : undefined}
    >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <div>{children}</div>
    </div>
);

const Table = ({ headers, data, withCheckbox = false, highlightDisabledRow = false, badge = false }) => (
    <table className="w-full border-collapse border border-gray-200 rounded-lg">
        <thead>
            <tr className="bg-gray-100 text-gray-700">
                {headers.map((header, index) => (
                    <th key={index} className="p-3 border border-gray-200 text-left font-medium text-sm">
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border border-gray-200 odd:bg-gray-50 hover:bg-gray-100">
                    {withCheckbox && (
                        <td className="p-3 border border-gray-200 flex items-center">
                            <input type="checkbox" className="h-4 w-4" onClick={(e) => e.stopPropagation()} />
                        </td>
                    )}
                    {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className={`p-3 border border-gray-200 text-sm ${highlightDisabledRow && rowIndex === 2 ? 'text-gray-400 border-gray-300' : 'text-gray-700'}`}>
                            {badge && cellIndex === 0 ? (
                                <span className={`px-2 py-1 border rounded-lg ${rowIndex === 2 ? 'text-gray-400 border-gray-300' : 'text-teal-600 border-teal-400'}`}>
                                    {cell}
                                </span>
                            ) : (
                                cell
                            )}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

export default Administration;
