import React, { useState, useEffect } from "react";
import "../styles/GoodsTracking.css";    
import GoodsReceiptPO from "./GoodsReceiptPO";
import GoodsReceipt from "./GoodsReceipt";
import GoodsIssue from "./GoodsIssue";
import ARCreditMemo from "./ARCreditMemo";


const GoodsTracking = ({employee_id}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedGoods, setSelectedGoods] = useState("Goods Receipt PO");
  const [showGoodsReceiptPO, setShowGoodsReceiptPO] = useState(false);
  const [showGoodsReceipt, setShowGoodsReceipt] = useState(false);
  const [showGoodsIssue, setShowGoodsIssue] = useState(false);
  const [showARCreditMemo, setShowARCreditMemo] = useState(false);


  const goodsOptions = ["Goods Receipt PO", "Goods Receipt", "Goods Issue", "A/R Credit Memo"];

  const [selectedButton, setSelectedButton] = useState(null);

  const emptyGoodsReceiptPO = {
    transaction_id: "",
    document_no: "",
    status: "Draft",
    posting_date: new Date().toISOString().split('T')[0], // Today's date
    document_date: new Date().toISOString().split('T')[0],
    vendor_code: "",
    employee_id: "",
    buyer: "",
    tax_rate: 0,
    discount_rate: 0,
    freight: 0,
    document_items: [],
  };

  const handleCreate = () => {
    setSelectedButton("Create")
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

  const handleEdit = () => {
    setSelectedButton("Edit")
    if (selectedGoods === "Goods Receipt PO") {
      setShowGoodsReceiptPO(true);
    } else if (selectedGoods === "Goods Receipt") {
      setShowGoodsReceipt(true);
    } else if (selectedGoods === "Goods Issue") {
      setShowGoodsIssue(true);
    }else if (selectedGoods === "A/R Credit Memo") {
      setShowARCreditMemo(true);
    }
  };

  useEffect(() => {
    localStorage.setItem('operationsActiveTab', activeTab);
  }, [activeTab]);

  const [goodsTrackingData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const handleCheckboxChange = (index, row) => {
    setSelectedRow(index);
    setSelectedData(row);
    console.log(selectedData)
  };

  const fetchData = async () => {
      try {
          setLoading(true);
          setError(null); // Reset error state
          const response = await fetch("https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/goods-tracking/");
          if (!response.ok) throw new Error("Connection to database failed");
 
          const data = await response.json();
          if (!Array.isArray(data)) throw new Error("Invalid goods data format");
 
          setTableData(data);
          
          if (data.length > 0){
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
    fetchData();
  }, []);
  const refreshData = async () => {
    await fetchData(); // Re-fetch data from the API
    if (goodsTrackingData.length > 0) {
      setSelectedRow(0);
      setSelectedData(goodsTrackingData[0]);
    }
  };
  useEffect(() => {
    const filtered = goodsTrackingData.filter(row =>
      (activeTab === "all" || row.status.toLowerCase() === activeTab.toLowerCase()) &&
      row.document_type === selectedGoods
    );
 
    if (filtered.length > 0) {
      setSelectedRow(0);
      setSelectedData(filtered[0]);
    } else {
      setSelectedRow(null);
      setSelectedData(null);
    }
  }, [goodsTrackingData, activeTab, selectedGoods]);
  if (showGoodsReceiptPO) {
    if (selectedButton === "Create"){
      return <GoodsReceiptPO
      onBack={() => setShowGoodsReceiptPO(false)}
      onSuccess={refreshData}
      selectedData={emptyGoodsReceiptPO} // Pass the selected row data
      selectedButton={selectedButton}
      employee_id={employee_id}
      />
    } else {
      return <GoodsReceiptPO
      onBack={() => setShowGoodsReceiptPO(false)}
      onSuccess={refreshData}
      selectedData={selectedData} // Pass the selected row data
      selectedButton={selectedButton}
      employee_id={employee_id}
      />
    }
  }
  if (showGoodsReceipt) {
    if (selectedButton === "Create"){
      return <GoodsReceipt
      onBack={() => setShowGoodsReceipt(false)}
      onSuccess={refreshData}
      selectedData={emptyGoodsReceiptPO} // Pass the selected row data
      selectedButton={selectedButton}
      employee_id={employee_id}
      />
    } else {
      return <GoodsReceipt
      onBack={() => setShowGoodsReceipt(false)}
      onSuccess={refreshData}
      selectedData={selectedData} // Pass the selected row data
      selectedButton={selectedButton}
      employee_id={employee_id}
      />
    }
  }
  
  if (showGoodsIssue) {
    if (selectedButton === "Create"){
      return <GoodsIssue
      onBack={() => setShowGoodsIssue(false)}
      onSuccess={refreshData}
      selectedData={emptyGoodsReceiptPO} // Pass the selected row data
      selectedButton={selectedButton}
      employee_id={employee_id}
      />
    } else {
      return <GoodsIssue
      onBack={() => setShowGoodsIssue(false)}
      onSuccess={refreshData}
      selectedData={selectedData} // Pass the selected row data
      selectedButton={selectedButton}
      employee_id={employee_id}
      />
    }
  }
  if (showARCreditMemo) {
    if (selectedButton === "Create"){
      return <ARCreditMemo
      onBack={() => setShowARCreditMemo(false)}
      onSuccess={refreshData}
      selectedData={emptyGoodsReceiptPO} // Pass the selected row data
      selectedButton={selectedButton}
      employee_id={employee_id}
      />
    } else {
      return <ARCreditMemo
      onBack={() => setShowARCreditMemo(false)}
      onSuccess={refreshData}
      selectedData={selectedData} // Pass the selected row data
      selectedButton={selectedButton}
      employee_id={employee_id}
      />
    }
  }
 

  const filteredData = goodsTrackingData.filter(row =>
    (activeTab === "all" || row.status.toLowerCase() === activeTab.toLowerCase()) &&
    row.document_type === selectedGoods
   
  );

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
                  {selectedGoods !== "A/R Credit Memo" && <th>Document No.</th>}
                  <th>Status</th>
                  <th>Posting Date</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center">Loading...</td>
                </tr>
              ) : filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr key={row.document_id}>
                      <td>
                        <input type="checkbox"  checked={selectedRow === index} onChange={() => handleCheckboxChange(index, row)}/>
                      </td>
                      <td>{index + 1}</td>
                      <td>{row.transaction_id}</td>
                      {selectedGoods !== "A/R Credit Memo" && <td>{row.document_no}</td>}
                      <td className={`operations-gt-status ${row.status.toLowerCase()}`}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </td>
                      <td>{row.posting_date}</td>
                      <td>{row.transaction_cost}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-500">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        <div className="action-buttons">
          <button className="view-btn" onClick={handleEdit}>Edit</button>
          <button className="create-btn" onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
};


export default GoodsTracking;


