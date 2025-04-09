import React, { useState, useEffect } from "react";
import "../styles/DeliveryReceipt.css";


const TabSystem = () => {
    const tabs = ["Billing Receipt", "Delivery Receipt", "Rework Order", "Goods Issue"];
    
    const [activeTab, setActiveTab] = useState(() => {
        // Get the saved tab state from localStorage with the specific module name
        const savedTab = localStorage.getItem('operationsActiveTab');
        return savedTab && tabs.includes(savedTab) ? savedTab : tabs[0];
    });

    useEffect(() => {
        // Save the active tab state to localStorage whenever it changes
        localStorage.setItem('operationsActiveTab', activeTab);
    }, [activeTab]);


    const billingData = [
        { billingId: "B001", deliveryId: "D1001", deliveryDate: "03/20/25", totalAmount: "$500" },
        { billingId: "B002", deliveryId: "D1002", deliveryDate: "03/21/25", totalAmount: "$750" },
    ];


    const deliveryData = [
        { deliveryId: "D1001", deliveryDate: "03/20/25", totalAmount: "$500" },
        { deliveryId: "D1002", deliveryDate: "03/21/25", totalAmount: "$750" },
    ];
 
    const reworkData = [
        { reworkId: "R001", deliveryId: "D1001", reworkDate: "03/21/25", status: "Pending" },
        { reworkId: "R002", deliveryId: "D1002", reworkDate: "03/22/25", status: "Completed" },
    ];


    const goodsData = [
        { goodsId: "G001", date: "03/25/25" },
        { goodsId: "G002", date: "03/26/25" },
    ];


    const itemData = [
        { no: 1, item: "Item A" },
        { no: 2, item: "Item B" },
    ];


    return (
        <div className="tab-container">
            <div className="tab-header">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`tab-button ${activeTab === tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>


            {/* Billing Receipt */}
            {activeTab === "Billing Receipt" && (
                <div className="table-container">
                    <table className="billing-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Billing ID</th>
                                <th>Delivery ID</th>
                                <th>Delivery Date</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billingData.map((row, index) => (
                                <tr key={index}>
                                    <td className="checkbox-cell"><input type="checkbox" /></td>
                                    <td>{row.billingId}</td>
                                    <td>{row.deliveryId}</td>
                                    <td>{row.deliveryDate}</td>
                                    <td>{row.totalAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            {/* Delivery Receipt */}
            {activeTab === "Delivery Receipt" && (
                <div className="table-container">
                    <table className="billing-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Delivery ID</th>
                                <th>Delivery Date</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveryData.map((row, index) => (
                                <tr key={index}>
                                    <td className="checkbox-cell"><input type="checkbox" /></td>
                                    <td>{row.deliveryId}</td>
                                    <td>{row.deliveryDate}</td>
                                    <td>{row.totalAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            {/* Rework Order */}
            {activeTab === "Rework Order" && (
                <div className="table-container">
                    <table className="billing-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Rework ID</th>
                                <th>Delivery ID</th>
                                <th>Rework Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reworkData.map((row, index) => (
                                <tr key={index}>
                                    <td className="checkbox-cell"><input type="checkbox" /></td>
                                    <td>{row.reworkId}</td>
                                    <td>{row.deliveryId}</td>
                                    <td>{row.reworkDate}</td>
                                    <td>{row.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            {/* Goods Issue */}
            {activeTab === "Goods Issue" && (
                <div className="table-container">
                    <table className="billing-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Goods ID</th> 
                                <th>Date</th>
                                <th>No.</th>
                                <th>Item</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goodsData.map((row, index) => (
                                <tr key={index}>
                                    <td className="checkbox-cell"><input type="checkbox" /></td>
                                    <td>{row.goodsId}</td>
                                    <td>{row.goodsId}</td>
                                    <td>{index + 1}</td>
                                    <td>{itemData[index]?.item || ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Send to */}
            <div className="send-to-container">
                <button className="send-to-button">Send To</button>
            </div>
        </div>
    );
};


export default TabSystem;
