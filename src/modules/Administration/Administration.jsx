import React from "react";

const Administration = ({ setActiveSubModule, loadSubModule }) => {
    return (
        <div className="admin">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* USER */}
                    <Card title="User" clickable={true}>
                        <div
                            onClick={() => {
                                setActiveSubModule("User");
                                loadSubModule("User");
                            }}
                            className="cursor-pointer"
                        >
                            <Table
                                headers={["User Id", "Email", "Date", "Category"]}
                                data={[
                                    ["User_01", "user01@mail.com", "2025-04-12", "Admin"],
                                    ["User_02", "user02@mail.com", "2025-04-10", "Employee Benefits"],
                                    ["User_03", "user03@mail.com", "2025-04-08", "HR"],
                                ]}
                                withCheckbox={true}
                                highlightDisabledRow={true}
                                badge={true}
                            />
                        </div>
                    </Card>

                    {/* ITEM MASTERLIST */}
                    <Card title="Item Masterlist" clickable={true}>
                        <div
                            onClick={() => {
                                setActiveSubModule("Item Masterlist");
                                loadSubModule("Item Masterlist");
                            }}
                            className="cursor-pointer"
                        >
                            <Table
                                headers={["Item ID", "Item Name", "Item Type", "Status"]}
                                data={[
                                    ["Item001", "Screw", "Assets", "Active"],
                                    ["Item002", "Glue", "Product", "Inactive"],
                                    ["Item003", "Wires", "Raw Materials", "Pending"],
                                ]}
                            />
                        </div>
                    </Card>

                    {/* BUSINESS PARTNER MASTERLIST */}
                    <Card title="Business Partner Masterlist" clickable={true}>
                        <div
                            onClick={() => {
                                setActiveSubModule("Business Partner Masterlist");
                                loadSubModule("Business Partner Masterlist");
                            }}
                            className="cursor-pointer"
                        >
                            <Table
                                headers={["Partner ID", "Vendor Code", "Partner Name", "Category"]}
                                data={[
                                    ["BP_01", "V001", "Acme Corp", "Vendor"],
                                    ["BP_02", "V002", "Beta Ltd", "Customer"],
                                    ["BP_03", "V003", "Gamma Inc", "Employee"],
                                ]}
                            />
                        </div>
                    </Card>

                    {/* AUDIT LOGS */}
                    <Card title="Audit Logs" clickable={true}>
                        <div
                            onClick={() => {
                                setActiveSubModule("Audit Logs");
                                loadSubModule("Audit Logs");
                            }}
                            className="cursor-pointer"
                        >
                            <Table
                                headers={["Log ID", "User ID", "Action", "Timestamp"]}
                                data={[
                                    ["LOG-20250412", "User01", "Login", "2025-04-12 09:00"],
                                    ["LOG-20250411", "User02", "Edit", "2025-04-11 14:30"],
                                    ["LOG-20250410", "User03", "Delete", "2025-04-10 18:15"],
                                ]}
                                withCheckbox={true}
                                badge={true}
                            />
                        </div>
                    </Card>

                    {/* POLICY */}
                    <Card title="Policy" clickable={true}>
                        <div
                            onClick={() => {
                                setActiveSubModule("Policy");
                                loadSubModule("Policy");
                            }}
                            className="cursor-pointer"
                        >
                            <Table
                                headers={["Policy ID", "Policy Name", "Description"]}
                                data={[
                                    ["POL001", "Code of Conduct", "Workplace behavior standards."],
                                    ["POL002", "Leave Policy", "Annual leave regulations."],
                                    ["POL003", "IT Usage", "Acceptable use of systems."],
                                ]}
                            />
                        </div>
                    </Card>

                    {/* CURRENCY */}
                    <Card title="Currency" clickable={true}>
                        <div
                            onClick={() => {
                                setActiveSubModule("Currency");
                                loadSubModule("Currency");
                            }}
                            className="cursor-pointer"
                        >
                            <Table
                                headers={["Country", "Apr 10", "Apr 11"]}
                                data={[
                                    ["UNITED STATES", "0.915", "0.916"],
                                    ["JAPAN", "0.915", "0.915"],
                                    ["UNITED KINGDOM", "0.915", "0.915"],
                                ]}
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
        className={`bg-white shadow-md rounded-lg p-6 relative overflow-hidden ${clickable ? "cursor-pointer hover:shadow-lg transition" : ""
            }`}
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
                        <td key={cellIndex} className={`p-3 border border-gray-200 text-sm ${highlightDisabledRow && rowIndex === 2 ? 'text-gray-400 border-gray-300' : 'text-gray-700'
                            }`}>
                            {badge && cellIndex === 0 ? (
                                <span className={`px-2 py-1 border rounded-lg ${rowIndex === 2 ? 'text-gray-400 border-gray-300' : 'text-teal-600 border-teal-400'
                                    }`}>
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
