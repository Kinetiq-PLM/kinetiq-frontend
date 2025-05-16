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
    const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

    // Full data for all departments
    const allDepartmentsData = [
        { name: 'Administration', Pending: 4, Approved: 8, Rejected: 2 },
        { name: 'Accounting', Pending: 5, Approved: 3, Rejected: 1 },
        { name: 'Human Resources', Pending: 4, Approved: 5, Rejected: 0 },
        { name: 'Information Technology', Pending: 3, Approved: 7, Rejected: 1 },
        { name: 'Marketing', Pending: 4, Approved: 6, Rejected: 0 },
        { name: 'Research and Development', Pending: 6, Approved: 4, Rejected: 2 },
        { name: 'Customer Service', Pending: 2, Approved: 3, Rejected: 1 },
        { name: 'Production', Pending: 5, Approved: 7, Rejected: 3 },
        { name: 'Quality Assurance', Pending: 3, Approved: 5, Rejected: 1 },
        { name: 'Sales', Pending: 4, Approved: 6, Rejected: 2 },
        { name: 'Distribution', Pending: 3, Approved: 4, Rejected: 1 },
        { name: 'Operations', Pending: 5, Approved: 8, Rejected: 2 }
    ];
    
    // State for dynamic chart data
    const [barData, setBarData] = useState(allDepartmentsData);
    const [lineData, setLineData] = useState([
        { name: 'Jan', submitted: 10, approved: 8 },
        { name: 'Feb', submitted: 12, approved: 9 },
        { name: 'Mar', submitted: 14, approved: 11 },
        { name: 'Apr', submitted: 13, approved: 10 },
    ]);
    const [pieData, setPieData] = useState([
        { name: 'Approved', value: 40 },
        { name: 'Pending', value: 30 },
        { name: 'Quotation Sent', value: 20 },
        { name: 'Rejected', value: 10 },
    ]);
    const [responseTimeData, setResponseTimeData] = useState([
        { name: 'Jan', time: 3.0 },
        { name: 'Feb', time: 2.5 },
        { name: 'Mar', time: 3.5 },
        { name: 'Apr', time: 3.0 },
    ]);

    useEffect(() => {
    // Fetch data for charts
    const fetchChartData = async () => {
        try {
            // Fetch purchase requests
            const prfResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/list/");
            const purchaseRequests = prfResponse.data;

            // Fetch employee data to map dept_id
            const employeeResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/employees/");
            const employeeMap = employeeResponse.data.reduce((map, employee) => {
                map[employee.employee_id] = employee.dept_id || "Unknown";
                return map;
            }, {});

            // Fetch department data to map dept_id to dept_name
            const departmentResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/departments/");
            const departmentMap = departmentResponse.data.reduce((map, department) => {
                map[department.dept_id] = department.dept_name || "Unknown";
                return map;
            }, {});

            // Process bar chart data (PRs by department and status)
            const barChartData = purchaseRequests.reduce((acc, prf) => {
                const deptId = employeeMap[prf.employee_id] || "Unknown";
                const deptName = departmentMap[deptId] || "Unknown";
                const status = prf.status || "Pending";

                // Find existing department entry
                let deptEntry = acc.find((item) => item.name === deptName);
                if (!deptEntry) {
                    deptEntry = { name: deptName, Pending: 0, Approved: 0, Rejected: 0 };
                    acc.push(deptEntry);
                }

                // Increment the count for the corresponding status
                if (status in deptEntry) {
                    deptEntry[status] += 1;
                } else {
                    deptEntry[status] = 1;
                }

                return acc;
            }, []);

            // Comment out this line to prevent API data from overwriting our static data
            // setBarData(barChartData);

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

            // Filter out "Unknown" entries
            const filteredPieChartData = pieChartData.filter((item) => item.name !== "Unknown");

            setPieData(filteredPieChartData);

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
    
    const handleDepartmentChange = (e) => {
        const department = e.target.value;
        setSelectedDepartment(department);
        
        if (department === 'All Departments') {
            setBarData(allDepartmentsData);
        } else {
            const filteredData = allDepartmentsData.filter(item => item.name === department);
            setBarData(filteredData);
        }
    };

    return (
        <div className="purch">
            <div className="purch-body-content-container">
                {currentView === 'dashboard' ? (
                <div className="purch-content-wrapper">
                    <h1 className="purch-title">Purchasing Department Dashboard</h1>
                    
                    <div className="purch-filters">
                        <div className="purch-filter-group">
                            <label>Date Range</label>
                            <select className="purch-select">
                                <option>Year</option>
                            </select>
                        </div>
                        <div className="purch-filter-group">
                            <label>Vendor</label>
                            <select className="purch-select">
                                <option>Vendor B</option>
                            </select>
                        </div>
                        <div className="purch-filter-group">
                            <label>Department</label>
                            <select className="purch-select" value={selectedDepartment} onChange={handleDepartmentChange}>
                                <option>All Departments</option>
                                <option>Administration</option>
                                <option>Accounting</option>
                                <option>Distribution</option>
                                <option>Operations</option>
                                <option>Human Resources</option>
                                <option>Information Technology</option>
                                <option>Marketing</option>
                                <option>Research and Development</option>
                                <option>Customer Service</option>
                                <option>Production</option>
                                <option>Quality Assurance</option>
                                <option>Sales</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="purch-stats">
                        <div className="purch-stat-card" onClick={() => handleModuleClick('PurchaseReqList')} style={{cursor: 'pointer'}}>
                            <div className="purch-stat-content">
                                <div className="purch-stat-title">Open Purchase Requests</div>
                                <div className="purch-stat-number">15</div>
                                <div className="purch-stat-icon yellow"><FaFileAlt /></div>
                            </div>
                        </div>
                        <div className="purch-stat-card" onClick={() => handleModuleClick('PurchaseQuot')} style={{cursor: 'pointer'}}>
                            <div className="purch-stat-content">
                                <div className="purch-stat-title">Pending Quotations</div>
                                <div className="purch-stat-number">5</div>
                                <div className="purch-stat-icon yellow"><FaQuoteRight /></div>
                            </div>
                        </div>
                        <div className="purch-stat-card" onClick={() => handleModuleClick('PurchaseOrdStat')} style={{cursor: 'pointer'}}>
                            <div className="purch-stat-content">
                                <div className="purch-stat-title">Open Purchase Orders</div>
                                <div className="purch-stat-number">8</div>
                                <div className="purch-stat-icon yellow"><FaShoppingCart /></div>
                            </div>
                        </div>
                        <div className="purch-stat-card" onClick={() => handleModuleClick('GoodsPendingReceipt')} style={{cursor: 'pointer'}}>
                            <div className="purch-stat-content">
                                <div className="purch-stat-title">Goods Pending Receipt</div>
                                <div className="purch-stat-number">4</div>
                                <div className="purch-stat-icon yellow"><FaTruck /></div>
                            </div>
                        </div>
                        <div className="purch-stat-card" onClick={() => handleModuleClick('PurchaseAPInvoice')} style={{cursor: 'pointer'}}>
                            <div className="purch-stat-content">
                                <div className="purch-stat-title">Unmatched Invoices</div>
                                <div className="purch-stat-number">3</div>
                                <div className="purch-stat-icon red"><FaFileInvoice /></div>
                            </div>
                        </div>
                        <div className="purch-stat-card" onClick={() => handleModuleClick('PurchaseCredMemo')} style={{cursor: 'pointer'}}>
                            <div className="purch-stat-content">
                                <div className="purch-stat-title">Credit Memos Issued</div>
                                <div className="purch-stat-number">2</div>
                                <div className="purch-stat-icon green"><FaCreditCard /></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="purch-charts">
                        <div className="purch-chart-container">
                            <div className="purch-chart-header">
                                <h2>Purchase Request Status</h2>
                            </div>
                            <div className="purch-chart-content">
                                <div className="purch-chart-left purch-chart-scrollable">
                                    <ResponsiveContainer width="100%" height={450}>
                                        <BarChart 
                                            data={barData} 
                                            layout="vertical" 
                                            margin={{ left: 140, right: 20, top: 10, bottom: 30 }}
                                            barCategoryGap={8}
                                            barGap={2}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
                                            <XAxis type="number" domain={[0, 'dataMax + 1']} />
                                            <YAxis 
                                                dataKey="name" 
                                                type="category" 
                                                width={130} 
                                                tick={{ fontSize: 11, fill: '#555' }}
                                                tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                                                padding={{ top: 15, bottom: 15 }}
                                            />
                                            <Tooltip cursor={{fill: 'rgba(0, 0, 0, 0.05)'}} />
                                            <Legend 
                                                verticalAlign="bottom" 
                                                height={36} 
                                                iconType="circle"
                                            />
                                            <Bar dataKey="Pending" fill="#8884d8" name="Pending" barSize={45} />
                                            <Bar dataKey="Approved" fill="#82ca9d" name="Approved" barSize={45} />
                                            <Bar dataKey="Rejected" fill="#FF8042" name="Rejected" barSize={45} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="purch-chart-right">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={lineData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend content={() => (
                                                <div className="purch-chart-legend">
                                                    <div className="purch-legend-item">
                                                        <div className="purch-legend-color" style={{backgroundColor: "#8884d8"}}></div>
                                                        <span>Submitted</span>
                                                    </div>
                                                    <div className="purch-legend-item">
                                                        <div className="purch-legend-color" style={{backgroundColor: "#82ca9d"}}></div>
                                                        <span>Approved</span>
                                                    </div>
                                                </div>
                                            )} />
                                            <Line type="monotone" dataKey="submitted" stroke="#8884d8" />
                                            <Line type="monotone" dataKey="approved" stroke="#82ca9d" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="purch-table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>PR ID</th>
                                            <th>DEPARTMENT</th>
                                            <th>DAYS OVER SLA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="purch-red">PR001</td>
                                            <td>Administration</td>
                                            <td>15</td>
                                        </tr>
                                        <tr>
                                            <td className="purch-red">PR002</td>
                                            <td>Accounting</td>
                                            <td>12</td>
                                        </tr>
                                        <tr>
                                            <td className="purch-red">PR003</td>
                                            <td>Distribution</td>
                                            <td>8</td>
                                        </tr>
                                        <tr>
                                            <td className="purch-red">PR004</td>
                                            <td>Operations</td>
                                            <td>10</td>
                                        </tr>
                                        <tr>
                                            <td className="purch-red">PR005</td>
                                            <td>Finance</td>
                                            <td>14</td>
                                        </tr>
                                        <tr>
                                            <td className="purch-red">PR006</td>
                                            <td>Human Resources</td>
                                            <td>9</td>
                                        </tr>
                                        <tr>
                                            <td className="purch-red">PR007</td>
                                            <td>Information Technology</td>
                                            <td>11</td>
                                        </tr>
                                        <tr>
                                            <td className="purch-red">PR008</td>
                                            <td>Marketing</td>
                                            <td>7</td>
                                        </tr>
                                        <tr>
                                            <td className="purch-red">PR009</td>
                                            <td>Research and Development</td>
                                            <td>13</td>
                                        </tr>
                                        <tr>
                                            <td className="purch-red">PR010</td>
                                            <td>Customer Service</td>
                                            <td>6</td>
                                        </tr>
                                        <tr>
                                            <td className="purch-red">PR011</td>
                                            <td>Production</td>
                                            <td>16</td>
                                        </tr>
                                        <tr>
                                            <td className="purch-red">PR012</td>
                                            <td>Quality Assurance</td>
                                            <td>10</td>
                                        </tr>
                                        <tr>
                                            <td className="purch-red">PR013</td>
                                            <td>Sales</td>
                                            <td>8</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="purch-chart-container">
                            <div className="purch-chart-header">
                                <h2>Quotation Monitoring</h2>
                            </div>
                            <div className="purch-chart-content">
                                <div className="purch-chart-left">
                                    <div className="purch-pie-container">
                                        <ResponsiveContainer width="100%" height={200}>
                                            <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={70}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={false}
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend 
                                                    layout="horizontal"
                                                    verticalAlign="bottom"
                                                    align="center"
                                                    wrapperStyle={{
                                                        paddingTop: "10px",
                                                        width: "100%",
                                                        fontSize: "12px"
                                                    }}
                                                    iconType="square"
                                                    iconSize={10}
                                                    formatter={(value, entry) => <span style={{ color: '#000' }}>{value}</span>}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="purch-chart-right">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={responseTimeData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend content={() => (
                                                <div className="purch-chart-legend">
                                                    <div className="purch-legend-item">
                                                        <div className="purch-legend-color" style={{backgroundColor: "#8884d8"}}></div>
                                                        <span>Avg Response Time (Days)</span>
                                                    </div>
                                                </div>
                                            )} />
                                            <Line type="monotone" dataKey="time" stroke="#8884d8" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="purch-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>VENDOR</th>
                                            <th>QUOTATION AMOUNT</th>
                                            <th>DELIVERY TIME</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Vendor A</td>
                                            <td>$100,000</td>
                                            <td>0 days</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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