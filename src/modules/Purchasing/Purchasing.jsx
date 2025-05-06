import React, { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { FaFileAlt, FaQuoteRight, FaShoppingCart, FaTruck, FaFileInvoice, FaCreditCard } from 'react-icons/fa';
import './styles/Purchasing.css';
import axios from "axios";

import PurchaseReqList from './submodules/PurchaseReqList';
import PurchaseQuot from './submodules/PurchaseQuot';
import PurchaseOrdStat from './submodules/PurchaseOrdStat';
import PurchaseAPInvoice from './submodules/PurchaseAPInvoice';
import PurchaseCredMemo from './submodules/PurchaseCredMemo';

const COLORS = ['#82ca9d', '#FFD580', '#FFFFC5', '#FF0000'];

const PurchasingBody = () => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedModule, setSelectedModule] = useState(null);

    // State for dynamic chart data
    const [barData, setBarData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [responseTimeData, setResponseTimeData] = useState([]);

    useEffect(() => {
        // Fetch data for charts
        const fetchChartData = async () => {
            try {
                // Fetch bar chart data (e.g., PRs by department)
                const prfResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/list/");
                const barChartData = prfResponse.data.reduce((acc, prf) => {
                    const department = prf.dept_id || "Unknown";
                    const existing = acc.find((item) => item.name === department);
                    if (existing) {
                        existing.prs += 1;
                    } else {
                        acc.push({ name: department, prs: 1 });
                    }
                    return acc;
                }, []);
                setBarData(barChartData);

                // Fetch line chart data (e.g., trends in purchase orders)
                const purchaseOrdersResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase-orders/list/");
                const lineChartData = purchaseOrdersResponse.data.reduce((acc, order) => {
                    const month = new Date(order.order_date).toLocaleString("default", { month: "short" });
                    const existing = acc.find((item) => item.name === month);
                    if (existing) {
                        existing.submitted += 1;
                        if (order.status === "Approved") {
                            existing.approved += 1;
                        }
                    } else {
                        acc.push({ name: month, submitted: 1, approved: order.status === "Approved" ? 1 : 0 });
                    }
                    return acc;
                }, []);
                setLineData(lineChartData);

                // Fetch pie chart data (e.g., quotation statuses)
                const quotationsResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/list/");
                const pieChartData = quotationsResponse.data.reduce((acc, quotation) => {
                    const status = quotation.status || "Unknown";
                    const existing = acc.find((item) => item.name === status);
                    if (existing) {
                        existing.value += 1;
                    } else {
                        acc.push({ name: status, value: 1 });
                    }
                    return acc;
                }, []);
                setPieData(pieChartData);

                // Fetch response time data (e.g., average response time for invoices)
                const invoicesResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/invoices/list/");
                const responseTimeChartData = invoicesResponse.data.reduce((acc, invoice) => {
                    const month = new Date(invoice.invoice_date).toLocaleString("default", { month: "short" });
                    const responseTime = (new Date(invoice.payment_date) - new Date(invoice.invoice_date)) / (1000 * 60 * 60 * 24); // in days
                    const existing = acc.find((item) => item.name === month);
                    if (existing) {
                        existing.time = (existing.time + responseTime) / 2; // Average response time
                    } else {
                        acc.push({ name: month, time: responseTime });
                    }
                    return acc;
                }, []);
                setResponseTimeData(responseTimeChartData);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        fetchChartData();
    }, []);

    const handleModuleClick = (moduleName) => {
        if (moduleName === 'GoodsPendingReceipt') {
            alert("This is for Operation Module.");
            return;
        }
        setCurrentView('module');
        setSelectedModule(moduleName);
        console.log(`Navigating to ${moduleName}`);
    };

    const handleBackToDashboard = () => {
        setCurrentView('dashboard');
        setSelectedModule(null);
    };

    return (
        <div className="purch">
            <div className="purch-body-content-container">
                {currentView === 'dashboard' ? (
                    <div className="purch-content-wrapper">
                        <h1 className="purch-title">Purchasing Department Dashboard</h1>

                        <div className="purch-charts">
                            <div className="purch-chart-container">
                                <div className="purch-chart-header">
                                    <h2>Purchase Request Status</h2>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={barData} layout="vertical" margin={{ left: 30, right: 5, top: 5, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="prs" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="purch-chart-container">
                                <div className="purch-chart-header">
                                    <h2>Quotation Monitoring</h2>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={70}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="purch-chart-container">
                                <div className="purch-chart-header">
                                    <h2>Response Time</h2>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={responseTimeData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="time" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="purch-module-container">
                        {selectedModule === 'PurchaseReqList' && <PurchaseReqList onBackToDashboard={handleBackToDashboard} />}
                        {selectedModule === 'PurchaseQuot' && <PurchaseQuot onBackToDashboard={handleBackToDashboard} />}
                        {selectedModule === 'PurchaseOrdStat' && <PurchaseOrdStat onBackToDashboard={handleBackToDashboard} />}
                        {selectedModule === 'PurchaseAPInvoice' && <PurchaseAPInvoice onBackToDashboard={handleBackToDashboard} />}
                        {selectedModule === 'PurchaseCredMemo' && <PurchaseCredMemo onBackToDashboard={handleBackToDashboard} />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchasingBody;