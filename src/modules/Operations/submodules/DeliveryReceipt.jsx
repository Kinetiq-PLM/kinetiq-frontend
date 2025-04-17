import React, { useState, useEffect } from "react";
import "../styles/DeliveryReceipt.css";




const TabSystem = () => {
    const [activeTab, setActiveTab] = useState("Billing Receipt");


    const tabs = ["Billing Receipt", "Delivery Receipt", "Rework Order", "Goods Issue"];

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedData, setSelectedData] = useState(null);


    const goodsData = [
        { goodsId: "G001", date: "03/25/25" },
        { goodsId: "G002", date: "03/26/25" },
        { goodsId: "G003", date: "03/27/25" },
        { goodsId: "G004", date: "03/28/25" },
        { goodsId: "G005", date: "03/29/25" },
        { goodsId: "G006", date: "03/30/25" },
        { goodsId: "G007", date: "03/31/25" },
        { goodsId: "G008", date: "04/01/25" },
        { goodsId: "G009", date: "04/02/25" },
        { goodsId: "G010", date: "04/03/25" }
    ];


    const handleCheckboxChange = (index, row) => {
        setSelectedRow(index);
        setSelectedData(row);
    };

    const fetchData = async (endpoint) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://127.0.0.1:8000/operation/${endpoint}/`);
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
        else if (activeTab === "Rework Order") fetchData("DeliveryReworkOrder");
        else if (activeTab === "Goods Issue") fetchData("GoodsIssue");
    }, [activeTab]);




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
                <div className="table-container" activeTab="Billing Receipt">
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
                            {tableData.length > 0 ? (
                                    tableData.map((row, index) => (
                                    <tr>
                                        <td>
                                        <input type="checkbox"  checked={selectedRow === index} onChange={() => handleCheckboxChange(index, row.external_id)}/>
                                        </td>
                                        <td>{row.billing_receipt_id}</td>
                                        <td>{row.delivery_receipt_id}</td>
                                        <td>{row.delivery_date}</td>
                                        <td>{row.total_receipt}</td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                    <td>No records found.</td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            )}




            {/* Delivery Receipt */}
            {activeTab === "Delivery Receipt" && (
                <div className="table-container" activeTab="Delivery Receipt">
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
                            {tableData.length > 0 ? (
                                tableData.map((row, index) => (
                                <tr>
                                    <td>
                                    <input type="checkbox"  checked={selectedRow === index} onChange={() => handleCheckboxChange(index, row.external_id)}/>
                                    </td>
                                    <td>{row.delivery_receipt_id}</td>
                                    <td>{row.delivery_date}</td>
                                    <td>{row.total_amount}</td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                <td>No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}




            {/* Rework Order */}
            {activeTab === "Rework Order" && (
                <div className="table-container" activeTab="Rework Order">
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
                            {tableData.length > 0 ? (
                                tableData.map((row, index) => (
                                <tr>
                                    <td>
                                    <input type="checkbox"  checked={selectedRow === index} onChange={() => handleCheckboxChange(index, row.external_id)}/>
                                    </td>
                                    <td>{row.rework_id}</td>
                                    <td>{row.failed_shipment_id}</td>
                                    <td>{row.rework_date}</td>
                                    <td>{row.rework_status}</td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                <td>No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}




            {/* Goods Issue */}
            {activeTab === "Goods Issue" && (
                <div className="table-container" activeTab="Goods Issue">
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
            {/* Send to 
            <div className="send-to-container">
                <button className="send-to-button">Send To</button>
            </div>*/}
        </div>
    );
};




export default TabSystem;






