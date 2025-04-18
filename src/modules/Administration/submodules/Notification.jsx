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
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Notification</h2>

            <div className="flex items-center gap-4 mb-4 border-b pb-2">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border border-gray-300 px-3 py-2 rounded-md text-sm"
                />
                <button className="border border-gray-300 px-3 py-2 rounded-md text-sm flex items-center gap-1">
                    Vendor Info <span>&#9662;</span>
                </button>
            </div>

            <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 rounded-xl">
                    <thead>
                        <tr className="bg-gray-100">
                            {["Notification ID", "To User ID", "Message", "Notification Status", "Created At", "Updated At", ""].map((col, i) => (
                                <th key={i} className="px-4 py-3 border border-gray-200 text-left">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx} className="border border-gray-200 odd:bg-gray-50 hover:bg-gray-100">
                                <td className="px-4 py-3 border border-gray-200">{row.notificationId}</td>
                                <td className="px-4 py-3 border border-gray-200">{row.toUserId}</td>
                                <td className="px-4 py-3 border border-gray-200">{row.message}</td>
                                <td className="px-4 py-3 border border-gray-200">{row.status}</td>
                                <td className="px-4 py-3 border border-gray-200">{row.createdAt}</td>
                                <td className="px-4 py-3 border border-gray-200">{row.updatedAt}</td>
                                <td className="px-4 py-3 border border-gray-200 text-right relative">
                                    <button
                                        className="text-xl px-2"
                                        onClick={() => toggleDropdown(idx)}
                                    >
                                        ⋮
                                    </button>
                                    {openIndex === idx && (
                                        <div className="absolute right-0 mt-2 bg-white/95 backdrop-blur-sm border shadow-lg rounded-2xl p-6 w-[450px] z-50">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                                                Notification
                                            </h3>
                                            <div className="space-y-3">
                                                {[
                                                    { label: "Notification ID*", placeholder: "OABC00WE" },
                                                    { label: "To User ID", placeholder: "Vocschouts Dept." },
                                                    { label: "Message", placeholder: "XYZ Materials" },
                                                    { label: "Notification Status", placeholder: "Unread" },
                                                    { label: "Created At", placeholder: "04/15/2025" },
                                                    { label: "Updated At", placeholder: "04/16/2025" }
                                                ].map((field, i) => (
                                                    <div key={i}>
                                                        <label className="block text-sm text-teal-700 mb-1">{field.label}</label>
                                                        <input
                                                            type="text"
                                                            placeholder={field.placeholder}
                                                            className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-end gap-2 mt-6">
                                                <button className="bg-teal-500 text-white px-6 py-2 rounded-md text-sm">Add</button>
                                                <button className="border border-teal-500 text-teal-600 px-6 py-2 rounded-md text-sm">Alter</button>
                                                <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md text-sm">Delete</button>
                                                <button
                                                    className="border border-gray-300 text-gray-600 px-6 py-2 rounded-md text-sm"
                                                    onClick={() => setOpenIndex(null)}
                                                >
                                                    Cancel
                                                </button>
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
