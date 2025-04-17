import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/accounting-styling.css";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57"];

const BodyContent = () => {
    const [chartLabels, setChartLabels] = useState([]);
    const [chartSeries, setChartSeries] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState({
        debit: 0,
        credit: 0,
        payable: 0,
        receivable: 0,
    });

    const fetchData = () => {
        fetch("http://127.0.0.1:8000/api/general-ledger-jel-view/")
            .then((response) => response.json())
            .then((result) => {
                const grouped = {};
                let totalDebit = 0;
                let totalCredit = 0;
                let accountsPayableTotal = 0;
                let accountsReceivableTotal = 0;

                result.forEach((entry) => {
                    const accountName = entry.account_name || "Unknown";
                    const debit = parseFloat(entry.debit_amount || 0);
                    const credit = parseFloat(entry.credit_amount || 0);

                    // Grouping for bar chart
                    if (!grouped[accountName]) {
                        grouped[accountName] = { debit: 0, credit: 0 };
                    }
                    grouped[accountName].debit += debit;
                    grouped[accountName].credit += credit;

                    // Totals
                    totalDebit += debit;
                    totalCredit += credit;

                    // Accounts Payable Summary
                    if (accountName === "Accounts Payable" || accountName === "Cash in Bank") {
                        accountsPayableTotal += credit - debit; // Net Payable
                    }

                    // Accounts Receivable Summary
                    if (accountName === "Accounts Receivable" || accountName === "Sales Revenue") {
                        accountsReceivableTotal += debit - credit; // Net Receivable
                    }
                });

                // Set chart series
                const labels = Object.keys(grouped);
                const chartData = labels.map((label) => ({
                    name: label,
                    Debit: parseFloat(grouped[label].debit.toFixed(2)),
                    Credit: parseFloat(grouped[label].credit.toFixed(2)),
                }));

                setChartSeries(chartData);
                setSummary({
                    debit: totalDebit.toFixed(2),
                    credit: totalCredit.toFixed(2),
                    payable: accountsPayableTotal.toFixed(2),
                    receivable: accountsReceivableTotal.toFixed(2),
                });
            })
            .catch((error) => console.error("Error fetching GL data:", error));
    };


    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/chart-of-accounts/")
            .then((response) => {
                const rawData = response.data;
                setData(rawData.map((acc, index) => ({
                    id: index + 1,
                    account_code: acc.account_code,
                    account_name: acc.account_name,
                    account_type: acc.account_type,
                })));

                const typeCounts = {};
                rawData.forEach((acc) => {
                    typeCounts[acc.account_type] = (typeCounts[acc.account_type] || 0) + 1;
                });

                const formattedPie = Object.entries(typeCounts).map(([label, value], idx) => ({
                    name: label,
                    value,
                }));

                setPieData(formattedPie);
            })
            .catch((error) => console.error("Error fetching COA data:", error));
    }, []);

    return (
        <div className="accounting">
            <div className="body-content-container">
                <div className="title-subtitle-container">
                    <h1 className="subModule-title">Accounting Dashboard</h1>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-white to-green-50 shadow-lg rounded-2xl p-4 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                        <p className="text-gray-800 truncate">Total Debit</p>
                        <p className="text-xl font-semibold text-green-700 truncate">{Number(summary.debit).toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-r from-white to-red-50 shadow-lg rounded-2xl p-4 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                        <p className="text-gray-800 truncate">Total Credit</p>
                        <p className="text-xl font-semibold text-red-700 truncate">{Number(summary.credit).toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-r from-white to-orange-50 shadow-lg rounded-2xl p-4 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                        <p className="text-gray-800 truncate">Accounts Payables</p>
                        <div className="text-xl font-semibold text-orange-600 truncate">
                            {Number(summary.payable).toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-white to-blue-50 shadow-lg rounded-2xl p-4 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                        <p className="text-gray-800 truncate">Accounts Receivables</p>
                        <div className="text-xl font-semibold text-blue-600 truncate">
                            {Number(summary.receivable).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-r from-white to-blue-50 shadow-lg rounded-2xl p-4 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                        <h2 className="font-bold mt-2 mb-5 text-gray-800">Debit and Credit per Account</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartSeries}>
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Debit" fill="#4ade80" />
                                <Bar dataKey="Credit" fill="#f87171" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-gradient-to-r from-gray-800 to-gray-600 shadow-lg rounded-2xl p-4 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                        <h2 className="font-bold mt-2 mb-5 text-white">Chart of Account Types</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default BodyContent;
