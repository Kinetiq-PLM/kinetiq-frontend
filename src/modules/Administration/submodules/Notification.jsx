import React, { useState } from "react";
import "../styles/Notification.css";

const initialNotifications = [
    {
        notificationId: "Maria",
        toUserId: "Mari123",
        message: "Masikip",
        status: "Qwdw",
        createdAt: "Qwdw",
        updatedAt: "Qwdw",
    },
    {
        notificationId: "Maria",
        toUserId: "Mari123",
        message: "Masikip",
        status: "Qwdw",
        createdAt: "Qwdw",
        updatedAt: "Qwdw",
    },
    {
        notificationId: "Maria",
        toUserId: "Mari123",
        message: "Masikip",
        status: "Qwdw",
        createdAt: "Qwdw",
        updatedAt: "Qwdw",
    },
    {
        notificationId: "Maria",
        toUserId: "Mari123",
        message: "Masikip",
        status: "Qwdw",
        createdAt: "Qwdw",
        updatedAt: "Qwdw",
    },
];

const Notification = () => {
    const [rows] = useState(initialNotifications);
    const [openIndex, setOpenIndex] = useState(null);

    const toggleDropdown = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className="notification-wrapper">
            <div className="notification-header">
                <h2>Notification</h2>
                <div className="notification-header-right">
                    <input type="text" placeholder="Search" />
                    <button className="vendor-info-dropdown">Vendor Info ⌄</button>
                </div>
            </div>

            <div className="notification-table-scroll">
                <table className="notification-table">
                    <thead>
                        <tr>
                            <th>Notification ID</th>
                            <th>To User ID</th>
                            <th>Message</th>
                            <th>Notification Status</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                <td>
                                    <input type="checkbox" className="mr-2" />
                                    {row.notificationId}
                                </td>
                                <td>{row.toUserId}</td>
                                <td>{row.message}</td>
                                <td>{row.status}</td>
                                <td>{row.createdAt}</td>
                                <td>{row.updatedAt}</td>
                                <td className="relative">
                                    <button className="ellipsis-btn" onClick={() => toggleDropdown(idx)}>⋮</button>
                                    {openIndex === idx && (
                                        <div className="notification-dropdown-modal">
                                            <h3>Notification</h3>
                                            <div className="modal-inputs">
                                                {[
                                                    { label: "Notification id*", placeholder: "0ABC00WE" },
                                                    { label: "To User id", placeholder: "Vocschouts Dept." },
                                                    { label: "Message", placeholder: "XYZ Materials" },
                                                    { label: "Notification Status", placeholder: "956GUY" },
                                                    { label: "Created AT", placeholder: "956GUY" },
                                                    { label: "Updated AT", placeholder: "956GUY" }
                                                ].map((field, i) => (
                                                    <div key={i}>
                                                        <label>{field.label}</label>
                                                        <input type="text" placeholder={field.placeholder} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="modal-buttons">
                                                <button className="add">Add</button>
                                                <button className="alter">Alter</button>
                                                <button className="delete">Delete</button>
                                                <button className="cancel">Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Notification;
