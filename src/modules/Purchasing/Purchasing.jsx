import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { FaClipboardList, FaFileAlt, FaTruck, FaFileInvoice, FaReceipt, FaCreditCard, FaCarAlt, FaQuora, FaMarkdown, FaMarsDouble, FaAngleDoubleRight, FaBeer, FaAngellist, FaQuoteRight, FaCartPlus, FaShoppingCart } from 'react-icons/fa';
import './styles/Purchasing.css';

import PurchaseReqList from './submodules/PurchaseReqList';
import PurchaseQuot from './submodules/PurchaseQuot';
import PurchaseOrdStat from './submodules/PurchaseOrdStat';
import PurchaseAPInvoice from './submodules/PurchaseAPInvoice';
import PurchaseCredMemo from './submodules/PurchaseCredMemo';

const barData = [
    { name: 'IT', prs: 4 },
    { name: 'Operations', prs: 6 },
    { name: 'Admin', prs: 3 },
];

const lineData = [
    { name: 'Jan', submitted: 10, approved: 8 },
    { name: 'Feb', submitted: 12, approved: 9 },
    { name: 'Mar', submitted: 14, approved: 11 },
    { name: 'Apr', submitted: 13, approved: 10 },
];

const pieData = [
    { name: 'Approved', value: 40 },
    { name: 'Pending', value: 30 },
    { name: 'Quotation Sent', value: 20 },
    { name: 'Rejected', value: 10 },
];

const responseTimeData = [
    { name: 'Jan', time: 3.0 },
    { name: 'Feb', time: 2.5 },
    { name: 'Mar', time: 3.5 },
    { name: 'Apr', time: 3.0 },
];

const COLORS = ['#82ca9d', '#FFD580', '#FFFFC5', '#FF0000'];

const PurchasingBody = () => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedModule, setSelectedModule] = useState(null);
    
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
                            <select className="purch-select">
                                <option>All Departments</option>
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
                                <div className="purch-chart-left">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={barData} layout="vertical" margin={{ left: 30, right: 5, top: 5, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category"/>
                                            <Tooltip />
                                            <Legend content={() => (
                                                <div className="purch-chart-legend">
                                                    <div className="purch-legend-item">
                                                        <div className="purch-legend-color" style={{backgroundColor: "#8884d8"}}></div>
                                                        <span>PRs by Department</span>
                                                    </div>
                                                </div>
                                            )} />
                                            <Bar dataKey="prs" fill="#8884d8" />
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
                            <div className="purch-table">
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
                                            <td>IT</td>
                                            <td>15</td>
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
                    
                    <div className="purch-leave-requests">
                        <h2 className="purch-section-title">Leave Requests</h2>
                        <div className="purch-table-container">
                            <table className="purch-leave-table" style={{width: "100%"}}>
                                <colgroup>
                                    <col style={{width: "14%"}} />
                                    <col style={{width: "14%"}} />
                                    <col style={{width: "18%"}} />
                                    <col style={{width: "18%"}} />
                                    <col style={{width: "18%"}} />
                                    <col style={{width: "18%"}} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>Emp ID</th>
                                        <th>Leave ID</th>
                                        <th>Leave Type</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>E001</td>
                                        <td>L001</td>
                                        <td><span className="purch-badge vacation">Vacation</span></td>
                                        <td>2025-03-12</td>
                                        <td>2025-03-14</td>
                                        <td><span className="purch-badge rejected">Rejected by Management</span></td>
                                    </tr>
                                    <tr>
                                        <td>E002</td>
                                        <td>L002</td>
                                        <td><span className="purch-badge sick">Sick</span></td>
                                        <td>2025-03-12</td>
                                        <td>2025-03-13</td>
                                        <td><span className="purch-badge approved">Approved by Management</span></td>
                                    </tr>
                                    <tr>
                                        <td>E003</td>
                                        <td>L003</td>
                                        <td><span className="purch-badge sick">Sick</span></td>
                                        <td>2025-03-12</td>
                                        <td>2025-03-12</td>
                                        <td><span className="purch-badge approved">Approved by Management</span></td>
                                    </tr>
                                </tbody>
                            </table>
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
