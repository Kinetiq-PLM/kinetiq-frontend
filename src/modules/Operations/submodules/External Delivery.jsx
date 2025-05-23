import React, { useState, useEffect } from "react";
import "../styles/External Delivery.css";

const TabSystem = () => {
    const [activeTab, setActiveTab] = useState("Billing Receipt");
    const tabs = ["Billing Receipt", "Delivery Receipt", "Return Order", "Goods Issue"];
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedData, setSelectedData] = useState(null);

    const handleCheckboxChange = (index, row) => {
        setSelectedRow(index);
        setSelectedData(row);
    };

    const fetchData = async (endpoint) => {
        try {
            setLoading(true);
            setError(null);


            const response = await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/${endpoint}/`);
            if (endpoint === "DeliveryReturnOrder"){
                const syncDataResponse = await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/${endpoint}/sync-deliveryreworkorder/`);
            }else if (endpoint === "DeliveryReceipt"){
                const syncDataResponse = await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/${endpoint}/sync-deliveryreceipt/`);
            }else if (endpoint === "BillingReceipt"){
                const syncDataResponse = await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/${endpoint}/sync-billingreceipt/`);
            }else if (endpoint === "GoodsIssue"){
                const syncDataResponse = await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/${endpoint}/sync-deliverygoodsissue/`);
            }
            
            if (!response.ok) throw new Error("Connection to database failed");

            const data = await response.json();
            if (!Array.isArray(data)) throw new Error("Invalid data format");

            setTableData(data);
            if (data.length > 0) {
                setSelectedRow(0);
                setSelectedData(data[0]);
            }
        } catch (error) {
            if (error.name !== "AbortError") setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "Billing Receipt") fetchData("BillingReceipt");
        else if (activeTab === "Delivery Receipt") fetchData("DeliveryReceipt");
        else if (activeTab === "Return Order") fetchData("DeliveryReturnOrder"); else if (activeTab === "Delivery Rework Order") fetchData("DeliveryReworkOrder");
        else if (activeTab === "Goods Issue") fetchData("GoodsIssue");
    }, [activeTab]);

    return (
        <div className="delivery-receipt-wrapper">
            <div className="body-content-container">
                <div className="tab-container">
                    <div className="tab-header">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Billing Receipt */}
                    {activeTab === "Billing Receipt" && (
                        <div className="table-container">
                            <div className="table-wrapper">
                                <table className="billing-table">
                                    <thead>
                                        <tr>
                                            <th>Billing ID</th>
                                            <th>Delivery ID</th>
                                            <th>Delivery Date</th>
                                            <th>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="text-center">Loading...</td>
                                            </tr>
                                        ) : tableData.length > 0 ? (
                                            tableData.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.billing_receipt_id}</td>
                                                    <td>{row.delivery_receipt_id}</td>
                                                    <td>{row.delivery_date}</td>
                                                    <td>{row.total_receipt}</td>
                                                </tr>
                                            ))
                                        ) : (  
                                            <tr>
                                                <td colSpan="4" className="no-records">No records found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Delivery Receipt */}
                    {activeTab === "Delivery Receipt" && (
                        <div className="table-container">
                            <div className="table-wrapper">
                                <table className="billing-table">
                                    <thead>
                                        <tr>
                                            <th>Delivery ID</th>
                                            <th>Delivery Date</th>
                                            <th>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="3" className="text-center">Loading...</td>
                                            </tr>
                                        ) : tableData.length > 0 ? (
                                            tableData.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.delivery_receipt_id}</td>
                                                    <td>{row.delivery_date}</td>
                                                    <td>{row.total_amount}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="no-records">No records found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Rework Order */}
                    {activeTab === "Return Order" && (
                        <div className="table-container">
                            <div className="table-wrapper">
                                <table className="billing-table">
                                    <thead>
                                        <tr>
                                            <th>Return ID</th>
                                            <th>Delivery ID</th>
                                            <th>Return Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="text-center">Loading...</td>
                                            </tr>
                                        ) : tableData.length > 0 ? (
                                            tableData.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.rework_id}</td>
                                                    <td>{row.failed_shipment_id}</td>
                                                    <td>{row.rework_date}</td>
                                                    <td>{row.rework_status}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="no-records">No records found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Goods Issue */}
                    {activeTab === "Goods Issue" && (
                        <div className="table-container">
                            <div className="table-wrapper">
                                <table className="billing-table">
                                    <thead>
                                        <tr>
                                            <th>Goods ID</th>
                                            <th>Issued Date</th>
                                            <th>Issued By</th>
                                            <th>Item Name</th>
                                            <th>Quantity</th>
                                            <th>Warehouse Location</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="text-center">Loading...</td>
                                            </tr>
                                        ) : tableData.length > 0 ? (
                                            tableData.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.goods_issue_id}</td>
                                                    <td>{row.issue_date}</td>
                                                    <td>{row.issued_by}</td>
                                                    <td>{row.item_name}</td>
                                                    <td>{row.item_quantity}</td>
                                                    <td>{row.warehouse_location}</td> 
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="no-records">No records found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TabSystem;