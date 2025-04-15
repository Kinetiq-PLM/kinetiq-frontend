import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const Administration = ({ setActiveSubModule, loadSubModule }) => {
    const currencyData = [
        { name: "Nov 1", value: 1.8 },
        { name: "Nov 2", value: 2.4 },
        { name: "Nov 3", value: 2.5 },
        { name: "Nov 4", value: 1.3 },
        { name: "Nov 5", value: 1.5 },
        { name: "Nov 6", value: 3 },
        { name: "Nov 7", value: 1.4 }
    ];

    return (
        <div className="flex p-6 gap-6">
            {/* LEFT PANEL */}
            <div className="w-full md:w-1/2 space-y-6">
                {/* Combined User & Roles Card */}
                <div className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center">
                    {/* USER Section - Clickable */}
                    <div
                        className="flex-1 flex items-center gap-4 cursor-pointer hover:opacity-80 transition"
                        onClick={() => {
                            setActiveSubModule("User");
                            loadSubModule("User");
                        }}
                    >
                        <img src="/icons/user.png" alt="User Icon" className="w-10 h-10 object-contain" />
                        <div>
                            <p className="text-sm text-gray-500">User</p>
                            <p className="text-xl font-bold text-black">101</p>
                            <p className="text-xs text-gray-400">Employees</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-12 bg-gray-200 mx-4" />

                    {/* ROLES Section */}
                    <div className="flex-1">
                        <p className="text-sm text-gray-500">Roles</p>
                        <p className="text-xl font-bold text-black">16</p>
                        <p className="text-xs text-gray-400">Employees</p>
                    </div>
                </div>

                {/* Currency Chart - Clickable */}
                <div
                    className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:opacity-90 transition"
                    onClick={() => {
                        setActiveSubModule("Currency");
                        loadSubModule("Currency");
                    }}
                >
                    <div className="flex justify-between mb-2">
                        <h3 className="text-md font-semibold text-gray-800">currency</h3>
                        <span className="text-sm text-gray-500">UNITED STATES</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">November</p>
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={currencyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" hide />
                            <YAxis domain={[0, 3]} ticks={[0, 1, 2, 3]} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#00A8A8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Policy Table */}
                <Card title="Policy" onViewAll={() => {
                    setActiveSubModule("Policy");
                    loadSubModule("Policy");
                }}>
                    <Table
                        headers={["User id", "Employee ID", "First name", "Last name"]}
                        data={[
                            ["User_02", "User02@Gmail.Com", "2024-12-16", "Employee Benefits"],
                            ["User_02", "User02@Gmail.Com", "2024-12-16", "Employee Benefits"],
                        ]}
                        withCheckbox
                    />
                </Card>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full md:w-1/2 space-y-6 overflow-y-auto pr-2 max-h-[calc(100vh-100px)] custom-scroll">
                {[
                    { title: "Item Masterlist", module: "Item Masterlist" },
                    { title: "Business Partner Masterlist", module: "Business Partner Masterlist" },
                    { title: "Audit logs", module: "Audit Logs" },
                    { title: "Warehouse", module: "Warehouse" },
                ].map(({ title, module }) => (
                    <Card
                        key={title}
                        title={title}
                        onViewAll={() => {
                            setActiveSubModule(module);
                            loadSubModule(module);
                        }}
                    >
                        <Table
                            headers={["User id", "Employee ID", "First name", "Last name"]}
                            data={[
                                ["User_02", "User02@Gmail.Com", "2024-12-16", "Employee Benefits"],
                                ["User_02", "User02@Gmail.Com", "2024-12-16", "Employee Benefits"],
                                ["User_02", "User02@Gmail.Com", "2024-12-16", "Employee Benefits"],
                            ]}
                            withCheckbox
                            badge
                        />
                    </Card>
                ))}
            </div>
        </div>
    );
};

const Card = ({ title, children, onViewAll }) => (
    <div className="bg-white shadow-md rounded-lg p-4 relative overflow-hidden">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-semibold text-gray-800">{title}</h3>
            <button
                onClick={onViewAll}
                className="text-sm text-blue-500 hover:underline"
            >
                View all
            </button>
        </div>
        <div className="max-h-[200px] overflow-y-auto custom-scroll">
            {children}
        </div>
    </div>
);

const Table = ({ headers, data, withCheckbox = false, highlightDisabledRow = false, badge = false }) => (
    <table className="w-full border-collapse border border-gray-200 rounded-lg text-sm">
        <thead>
            <tr className="bg-gray-100 text-gray-700">
                {withCheckbox && (
                    <th className="p-3 border border-gray-200 text-left">
                        <input type="checkbox" className="h-4 w-4" />
                    </th>
                )}
                {headers.map((header, index) => (
                    <th key={index} className="p-3 border border-gray-200 text-left font-medium">
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border border-gray-200 odd:bg-gray-50 hover:bg-gray-100">
                    {withCheckbox && (
                        <td className="p-3 border border-gray-200">
                            <input type="checkbox" className="h-4 w-4" onClick={(e) => e.stopPropagation()} />
                        </td>
                    )}
                    {row.map((cell, cellIndex) => (
                        <td
                            key={cellIndex}
                            className={`p-3 border border-gray-200 ${highlightDisabledRow && rowIndex === 2
                                    ? 'text-gray-400 border-gray-300'
                                    : 'text-gray-700'
                                }`}
                        >
                            {badge && cellIndex === 0 ? (
                                <span className="px-2 py-1 border rounded-lg text-[#00A8A8] border-[#00A8A8]">
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
