import React, { useState, useEffect } from "react";
import "../styles/GoodsTracking.css";    
import GoodsReceiptPO from "./GoodsReceiptPO";
import GoodsReceipt from "./GoodsReceipt";
import GoodsIssue from "./GoodsIssue"; 
import ARCreditMemo from "./ARCreditMemo";

const GoodsTracking = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedGoods, setSelectedGoods] = useState("Goods Receipt PO");
  const [showGoodsReceiptPO, setShowGoodsReceiptPO] = useState(false);
  const [showGoodsReceipt, setShowGoodsReceipt] = useState(false);
  const [showGoodsIssue, setShowGoodsIssue] = useState(false);
  const [showARCreditMemo, setShowARCreditMemo] = useState(false);

  const goodsOptions = ["Goods Receipt PO", "Goods Receipt", "Goods Issue", "A/R Credit Memo"];

  const tableData = [ 
    { id: 1, transactionId: "0031", documentNo: "0042", status: "closed", postingDate: "12/23/24", cost: "12/24/24" },
    { id: 2, transactionId: "0035", documentNo: "0043", status: "open", postingDate: "01/31/25", cost: "01/31/25" },
    { id: 3, transactionId: "0036", documentNo: "0044", status: "cancelled", postingDate: "02/01/25", cost: "02/01/25" },
    { id: 4, transactionId: "0038", documentNo: "0048", status: "draft", postingDate: "02/04/25", cost: "02/04/25" },
    { id: 5, transactionId: "0039", documentNo: "0049", status: "open", postingDate: "02/05/25", cost: "02/05/25" },
    { id: 6, transactionId: "0040", documentNo: "0050", status: "closed", postingDate: "02/06/25", cost: "02/06/25" },
    { id: 7, transactionId: "0041", documentNo: "0051", status: "draft", postingDate: "02/07/25", cost: "02/07/25" },
    { id: 8, transactionId: "0042", documentNo: "0052", status: "cancelled", postingDate: "02/08/25", cost: "02/08/25" },
    { id: 9, transactionId: "0043", documentNo: "0053", status: "open", postingDate: "02/09/25", cost: "02/09/25" },
    { id: 10, transactionId: "0044", documentNo: "0054", status: "closed", postingDate: "02/10/25", cost: "02/10/25" },
  ];

  const filteredData = activeTab === "all" ? tableData : tableData.filter(row => row.status === activeTab);

  const handleCreate = () => {
    if (selectedGoods === "Goods Receipt PO") {
      setShowGoodsReceiptPO(true);
    } else if (selectedGoods === "Goods Receipt") {
      setShowGoodsReceipt(true);
    } else if (selectedGoods === "Goods Issue") {
      setShowGoodsIssue(true);
    } else if (selectedGoods === "A/R Credit Memo") {
      setShowARCreditMemo(true);
    }
  };

  useEffect(() => {
    localStorage.setItem('operationsActiveTab', activeTab);
  }, [activeTab]);

  if (showGoodsReceiptPO) {
    return <GoodsReceiptPO onBack={() => setShowGoodsReceiptPO(false)} />;
  }

  if (showGoodsReceipt) {
    return <GoodsReceipt onBack={() => setShowGoodsReceipt(false)} />;
  }

  if (showGoodsIssue) {
    return <GoodsIssue onBack={() => setShowGoodsIssue(false)} />;
  }

  if (showARCreditMemo) {
    return <ARCreditMemo onBack={() => setShowARCreditMemo(false)} />;
  }

  return (
    <div className="gr">
      <div className="body-content-container">
        <div className="header-container">
          <h2>Goods Tracking</h2>
          <div className="goods-dropdown-container">
            <select 
              className="goods-dropdown"
              value={selectedGoods}
              onChange={(e) => setSelectedGoods(e.target.value)}
            >
              {goodsOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="operations-gt-filters">
          {["all", "open", "closed", "cancelled", "draft"].map((status) => (
            <button
              key={status}
              className={`operations-gt-tab ${activeTab === status ? "active" : ""}`}
              onClick={() => setActiveTab(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="operation_table_container">
          <div className="operations-gt-table">
            <table>
              <thead>
                <tr>
                  <th className="checkbox-column"></th>
                  <th>No.</th>
                  <th>Transaction ID</th>
                  <th>Document No.</th>
                  <th>Status</th>
                  <th>Posting Date</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.id}>
                    <td className="checkbox-column">
                      <input type="checkbox" className="teal-checkbox" />
                    </td>
                    <td>{row.id}</td>
                    <td>{row.transactionId}</td>
                    <td>{row.documentNo}</td>
                    <td>
                      <span className={`status-badge ${row.status}`}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </span>
                    </td>
                    <td>{row.postingDate}</td>
                    <td>{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="action-buttons">
          <button className="view-btn">Edit</button>
          <button className="create-btn" onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default GoodsTracking;