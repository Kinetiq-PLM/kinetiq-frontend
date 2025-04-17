import React, { useState } from "react";
import "../styles/ARCreditMemo.css";

const ARCreditMemo = ({ onBack }) => {
  const [selectedOwner, setSelectedOwner] = useState("Bob Smith");
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [activeTab, setActiveTab] = useState("document");

  const ownerOptions = ["Bob Smith", "John Smith", "Sarah Johnson"];
  const statusOptions = ["Open", "Closed", "Cancelled", "Draft"];

  const tableData = [
    {
      id: 1,
      invoiceNo: "INV-001",
      description: "Software License",
      quantity: "2",
      unitPrice: "500.00",
      discountRate: "10%",
      taxRate: "832095",

    },
    {
      id: 2,
      invoiceNo: "INV-002",
      description: "Consulting Services",
      quantity: "40",
      unitPrice: "75.00",
      discountRate: "5%",
      taxRate: "10000" 
    },
    {
      id: 3,
      invoiceNo: "INV-003",
      description: "Hardware Support",
      quantity: "1",
      unitPrice: "1200.00",
      discountRate: "15%",
      taxRate: "742939",
    
    }
  ];

  return (
    <div className="gr">
      <div className="body-content-container">
        <div className="back-button" onClick={onBack}>← Back</div>
        <div className="content-wrapper">
          <div className="details-grid">
            <div className="details-section">
              <div className="detail-row">
                <label>Customer ID</label>
                <input type="text" value="CUST-2025-001" readOnly />
              </div>
              <div className="detail-row">
                <label>Customer Name</label>
                <input type="text" value="TechCorp Solutions" readOnly />
              </div>
              <div className="detail-row">
                <label>Contact Person</label>
                <input type="text" value="Michael Chen" readOnly />
              </div>
              <div className="detail-row">
                <label>Owner</label>
                <input type="text" value="Emma Wilson" readOnly />
              </div>
              <div className="detail-row">
                <label>Credit Memo ID</label>
                <select
                  className="form-select"
                  value={selectedOwner}
                  onChange={(e) => setSelectedOwner(e.target.value)}
                >
                  {ownerOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="details-section tabbed-section">
              <div className="section-tabs">
                <button
                  className={`tab-button ${activeTab === 'document' ? 'active' : ''}`}
                  onClick={() => setActiveTab('document')}
                >
                  Document Details
                </button>
                <button
                  className={`tab-button ${activeTab === 'credit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('credit')}
                >
                  Credit Details
                </button>
              </div>
              
              {activeTab === 'document' ? (
                <div className="tab-content">
                  <div className="left-column"> 
                    <div className="detail-row">
                      <label>Transaction ID</label>
                      <input type="text" value="CR0035" readOnly />
                    </div>
                    <div className="detail-row">
                      <label>Document No</label>
                      <input type="text" value="CM0043" readOnly />
                    </div>
                    <div className="detail-row">
                      <label>Status</label>
                      <select
                        className="form-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="right-column">
                    <div className="detail-row">
                      <label>Invoice Date</label>
                      <div className="date-input clickable">
                        <input type="date" defaultValue="2025-02-02" />
                        <span className="calendar-icon">📅</span>
                      </div>
                    </div>
                    <div className="detail-row">
                      <label>Posting Date</label>
                      <div className="date-input clickable">
                        <input type="date" defaultValue="2025-01-31" />
                        <span className="calendar-icon">📅</span>
                      </div>
                    </div>
                    <div className="detail-row">
                      <label>Document Date</label>
                      <div className="date-input clickable">
                        <input type="date" defaultValue="2025-01-31" />
                        <span className="calendar-icon">📅</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="tab-content credit-details">
                  <div className="detail-row">
                    <label>Initial Amount</label>
                    <input type="text" value="5183.60" readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Invoice Balance</label>
                    <input type="text" value="7.00%" readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Sales Tax</label>
                    <input type="text" value="338.60" readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Remaining Balance</label>
                    <input type="text" value="455.00" readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Tax Amount</label>
                    <input type="text" placeholder="Enter remarks" />
                  </div>
                  <div className="detail-row">
                    <label>Remarks</label>
                    <input type="text" placeholder="Enter remarks" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="operation_table_container">
            <div className="gr-table">
              <table className="materials-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Discount Rate</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={row.id}>
                      <td>{index + 1}</td>
                      <td>{row.invoiceNo}</td>
                      <td>{row.description}</td>
                      <td>{row.quantity}</td>
                      <td>{row.unitPrice}</td>
                      <td>{row.discountRate}</td>
                      <td>{row.taxRate}</td>
                      <td>{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="button-section">
            <button className="copy-from-button">Copy From</button>
            <div className="right-buttons">
              <button className="cancel-button" onClick={onBack}>Cancel</button>
              <button className="send-to-button">Send To</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARCreditMemo;
