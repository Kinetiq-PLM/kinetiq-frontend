import React, { useState } from "react";
import "../styles/Currency.css";

const generateNextSevenDays = () => {
    const today = new Date();
    return Array.from({ length: 8 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date.getDate();
    });
};

const countries = ["UNITED STATES", "JAPAN", "UNITED KINGDOM"];
const dates = generateNextSevenDays();

const initialRates = [
    { country: "UNITED STATES", rates: [1.093, 1.092, 1.091, 1.089, 1.087, 1.088, 1.086, 1.085] },
    { country: "JAPAN", rates: [151.45, 151.32, 151.20, 150.98, 150.75, 150.89, 150.60, 150.47] },
    { country: "UNITED KINGDOM", rates: [0.79, 0.788, 0.787, 0.786, 0.785, 0.783, 0.782, 0.780] },
    { country: "UNITED KINGDOM", rates: [0.78, 0.781, 0.782, 0.783, 0.784, 0.785, 0.786, 0.787] },
    { country: "UNITED KINGDOM", rates: [0.789, 0.790, 0.791, 0.792, 0.793, 0.794, 0.795, 0.796] },
    { country: "UNITED KINGDOM", rates: [0.794, 0.793, 0.792, 0.791, 0.790, 0.789, 0.788, 0.787] },
];

const Currency = () => {
    const [selectedMonth, setSelectedMonth] = useState("APR");
    const [selectedYear, setSelectedYear] = useState("2025");
    const [rates] = useState(initialRates);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Exchange Rates</h2>

            <div className="bg-white rounded-xl shadow-md p-4 relative">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-3">
                        <select
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {["APR", "MAY", "JUN"].map((m) => (
                                <option key={m}>{m}</option>
                            ))}
                        </select>
                        <select
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {["2025", "2024"].map((y) => (
                                <option key={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <button className="text-gray-500 text-xl hover:text-red-500">✕</button>
                </div>

                <div
                    className="border border-gray-200 rounded-xl overflow-auto relative"
                    style={{
                        maxHeight: "380px",
                        paddingBottom: "12px",
                        paddingRight: "12px",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#14b8a6 #f1f1f1"
                    }}
                >
                    <div style={{ minWidth: "800px", overflow: "auto" }}>
                        <table className="min-w-full border-collapse">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="p-3 border border-gray-200">{selectedMonth}</th>
                                    {dates.map((d, i) => (
                                        <th key={i} className="p-3 border border-gray-200">{d}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rates.map((entry, i) => (
                                    <tr key={i} className="odd:bg-gray-50 hover:bg-gray-100">
                                        <td className="p-3 border border-gray-200 font-medium">{entry.country}</td>
                                        {entry.rates.map((rate, j) => (
                                            <td key={j} className="p-3 border border-gray-200">{rate}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-start mt-6">
                    <button className="bg-teal-500 text-white px-6 py-2 rounded-md text-sm">Update</button>
                </div>
            </div>
        </div>
    );
};

export default Currency;
