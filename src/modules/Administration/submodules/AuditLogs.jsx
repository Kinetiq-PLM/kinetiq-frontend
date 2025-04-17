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
        <div className="auditlogs-container">
            <h2 className="auditlogs-title">Audit Logs</h2>

            <div className="auditlogs-toolbar">
                <input
                    type="text"
                    placeholder="Search..."
                    className="auditlogs-search"
                />
                <div className="auditlogs-filter-dropdown">
                    <button onClick={toggleFilter} className="auditlogs-filter-btn">
                        Filter by ▾
                    </button>

                    {filterOpen && (
                        <div className="auditlogs-dropdown-menu">
                            <div
                                onClick={() => setSubFilter("date")}
                                className="auditlogs-dropdown-item"
                            >
                                Filter By Date ▸
                            </div>
                            <div
                                onClick={() => setSubFilter("column")}
                                className="auditlogs-dropdown-item"
                            >
                                Filter By Columns ▸
                            </div>
                        </div>
                    )}

                    {subFilter === "date" && (
                        <div className="auditlogs-submenu">
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                            />
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                            />
                            <div className="auditlogs-submenu-actions">
                                <button className="ok-btn">OK</button>
                                <button onClick={() => setSubFilter(null)} className="cancel-btn">Cancel</button>
                            </div>
                        </div>
                    )}

                    {subFilter === "column" && (
                        <div className="auditlogs-submenu">
                            {/* Column filter inputs or checkboxes can go here */}
                            <p className="auditlogs-placeholder">Column filter UI here...</p>
                            <div className="auditlogs-submenu-actions">
                                <button className="ok-btn">OK</button>
                                <button onClick={() => setSubFilter(null)} className="cancel-btn">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="auditlogs-table-wrapper">
                <table className="auditlogs-table">
                    <thead>
                        <tr>
                            <th>Log ID</th>
                            <th>User ID</th>
                            <th>Action</th>
                            <th>Timestamp</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyLogs.map((log, index) => (
                            <tr key={index}>
                                <td>{log.logId}</td>
                                <td>{log.userId}</td>
                                <td>{log.action}</td>
                                <td>{log.timestamp}</td>
                                <td>{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogs;
