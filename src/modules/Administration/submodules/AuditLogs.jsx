import React, { useState } from "react";
import "../styles/AuditLogs.css";

const dummyLogs = [
    { logId: "LOG-100001", userId: "Admin01", action: "Login", timestamp: "2025-04-01 08:00", ip: "192.168.1.10" },
    { logId: "LOG-100002", userId: "Admin02", action: "Logout", timestamp: "2025-04-01 09:30", ip: "192.168.1.11" },
    { logId: "LOG-100003", userId: "UserA", action: "Update Record", timestamp: "2025-04-02 12:00", ip: "192.168.1.12" },
    { logId: "LOG-100004", userId: "UserB", action: "Delete Record", timestamp: "2025-04-03 14:45", ip: "192.168.1.13" },
    { logId: "LOG-100005", userId: "SuperUser", action: "Access Logs", timestamp: "2025-04-04 10:15", ip: "192.168.1.14" },
];

const AuditLogs = () => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [subFilter, setSubFilter] = useState(null);
    const [dateRange, setDateRange] = useState({ from: "", to: "" });

    const toggleFilter = () => {
        setFilterOpen((prev) => !prev);
        setSubFilter(null);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Audit Logs</h2>

            <div className="flex justify-between items-center mb-4 relative">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />

                <div className="relative">
                    <button
                        onClick={toggleFilter}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300"
                    >
                        Filter by ▾
                    </button>

                    {filterOpen && (
                        <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg z-50 w-48">
                            <div
                                onClick={() => setSubFilter("date")}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                Filter By Date ▸
                            </div>
                            <div
                                onClick={() => setSubFilter("column")}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                Filter By Columns ▸
                            </div>
                        </div>
                    )}

                    {subFilter === "date" && (
                        <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg p-4 z-50 w-72">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">From</label>
                                <input
                                    type="date"
                                    value={dateRange.from}
                                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                    className="border px-3 py-2 rounded-md"
                                />
                                <label className="text-sm text-gray-600">To</label>
                                <input
                                    type="date"
                                    value={dateRange.to}
                                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                    className="border px-3 py-2 rounded-md"
                                />
                                <div className="flex justify-end gap-2 mt-3">
                                    <button className="px-4 py-1 bg-teal-500 text-white rounded hover:bg-teal-600">OK</button>
                                    <button onClick={() => setSubFilter(null)} className="px-4 py-1 bg-white text-gray-600 border border-gray-400 rounded hover:bg-gray-100">Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {subFilter === "column" && (
                        <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg p-4 z-50 w-72">
                            <p className="text-sm text-gray-500 mb-2">Column filter UI here...</p>
                            <div className="flex justify-end gap-2">
                                <button className="px-4 py-1 bg-teal-500 text-white rounded hover:bg-teal-600">OK</button>
                                <button onClick={() => setSubFilter(null)} className="px-4 py-1 bg-white text-gray-600 border border-gray-400 rounded hover:bg-gray-100">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 rounded-xl">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 border border-gray-200 text-left">Log ID</th>
                            <th className="p-3 border border-gray-200 text-left">User ID</th>
                            <th className="p-3 border border-gray-200 text-left">Action</th>
                            <th className="p-3 border border-gray-200 text-left">Timestamp</th>
                            <th className="p-3 border border-gray-200 text-left">IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyLogs.map((log, index) => (
                            <tr key={index} className="border border-gray-200 odd:bg-gray-50 hover:bg-gray-100">
                                <td className="p-3 border border-gray-200">{log.logId}</td>
                                <td className="p-3 border border-gray-200">{log.userId}</td>
                                <td className="p-3 border border-gray-200">{log.action}</td>
                                <td className="p-3 border border-gray-200">{log.timestamp}</td>
                                <td className="p-3 border border-gray-200">{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogs;
