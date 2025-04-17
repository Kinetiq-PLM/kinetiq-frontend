import React, { useState } from "react";
import "../styles/Currency.css";

// Dynamically generate dates starting from today
const generateNextSevenDays = () => {
    const today = new Date();
    return Array.from({ length: 8 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date.getDate(); // Only the day of the month
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
    const [rates, setRates] = useState(initialRates);

    return (
        <div className="currency-container">
            <h2 className="currency-title">Exchange Rates</h2>

            <div className="currency-table-wrapper">
                <div className="currency-controls">
                    <select className="currency-select">
                        {["APR", "MAY", "JUN"].map((m) => (
                            <option key={m}>{m}</option>
                        ))}
                    </select>
                    <select className="currency-select">
                        {["2025", "2024"].map((y) => (
                            <option key={y}>{y}</option>
                        ))}
                    </select>
                    <button className="currency-close-btn">✕</button>
                </div>

                <div className="currency-scroll-table">
                    <table className="currency-table">
                        <thead>
                            <tr>
                                <th>{selectedMonth}</th>
                                {dates.map((d) => (
                                    <th key={d}>{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rates.map((entry, i) => (
                                <tr key={i}>
                                    <td>{entry.country}</td>
                                    {entry.rates.map((rate, j) => (
                                        <td key={j}>{rate}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="currency-footer">
                <div className="currency-actions-left">
                    <button className="btn-update">Update</button>
                    <button className="btn-cancel">Cancel</button>
                </div>
                <div className="currency-actions-right">
                    <button className="btn-export">Auto Export</button>
                    <button className="btn-import">Auto Import</button>
                </div>
            </div>

            <div className="currency-criteria-btn">
                <button>Set rate for Selection Criteria</button>
            </div>
        </div>
    );
};

export default Currency;
