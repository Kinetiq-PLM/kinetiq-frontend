import React, { useState } from "react";
import "../styles/GoodsReceiptPO.css";




const GoodsReceiptPO = ({ onBack }) => {
  const [selectedOwner, setSelectedOwner] = useState("Bob Smith");
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [activeTab, setActiveTab] = useState("document");




  const ownerOptions = ["Bob Smith", "John Smith", "Sarah Johnson"];
  const statusOptions = ["Open", "Closed", "Cancelled", "Draft"];




  const tableData = [
    {
      id: 1,
      materialId: "RM039",
      materialName: "Circuit Boards",
      uom: "PIECE",
      quantity: "3",
      costPerUnit: "290.00",
      total: "870.00",
      manufacturingDate: "2025-01-15",
      expiryDate: "2026-01-15",
      warehouseLocation: "WH-01-23-25",
      batchNo: "BATCH-2025-01",
    },
    {
      id: 2,
      materialId: "RM042",
      materialName: "LCD Screen",
      uom: "PIECE",
      quantity: "5",
      costPerUnit: "150.00",
      total: "750.00",
      manufacturingDate: "2025-01-20",
      expiryDate: "2026-01-20",
      warehouseLocation: "WH-01-23-29",
      batchNo: "BATCH-2025-02",
    },
    {
      id: 3,
      materialId: "RM045",
      materialName: "Microcontroller",
      uom: "PIECE",
      quantity: "10",
      costPerUnit: "85.00",
      total: "850.00",
      manufacturingDate: "2025-01-18",
      expiryDate: "2027-01-18",
      warehouseLocation: "WH-01-24-01",
      batchNo: "BATCH-2025-03",
    }
  ];




  return (
    <div className="grpo">
      <div className="body-content-container">
        <div className="back-button" onClick={onBack}>← Back</div>
        <div className="content-wrapper">
          <div className="details-grid">
            <div className="details-section">
              <div className="detail-row">
                <label>Vendor Code</label>
                <input type="text" value="ADMIN-VENDOR-20" readOnly />
              </div>
              <div className="detail-row">
                <label>Vendor Name</label>
                <input type="text" value="BioFlex Composites" readOnly />
              </div>
              <div className="detail-row">
                <label>Contact Person</label>
                <input type="text" value="Francisco Lopez" readOnly />
              </div>
              <div className="detail-row">
                <label>Buyer</label>
                <input type="text" value="Alice Johnson" readOnly />
              </div>
              <div className="detail-row">
                <label>Owner</label>
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
                  className={`tab-button ${activeTab === 'cost' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cost')}
                >
                  Cost Details
                </button>
              </div>
             
              {activeTab === 'document' ? (
                <div className="tab-content">
                  <div className="detail-row">
                    <label>Transaction ID</label>
                    <input type="text" value="0035" readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Delivery Date</label>
                    <div className="date-input clickable">
                      <input type="date" defaultValue="2025-02-02" />
                      <span className="calendar-icon">📅</span>
                    </div>
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
                  <div className="detail-row">
                    <label>Posting Date</label>
                    <div className="date-input clickable">
                      <input type="date" defaultValue="2025-01-31" />
                      <span className="calendar-icon">📅</span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <label>Document No</label>
                    <input type="text" value="0043" readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Document Date</label>
                    <div className="date-input clickable">
                      <input type="date" defaultValue="2025-01-31" />
                      <span className="calendar-icon">📅</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="tab-content cost-details">
                  <div className="detail-row">
                    <label>Initial Amount</label>
                    <input type="text" value="5000.00" readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Tax Rate</label>
                    <input type="text" value="10.00%" readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Discount Rate</label>
                    <input type="text" value="5.00%" readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Tax Amount</label>
                    <input type="text" value="500.00" readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Discount Amount</label>
                    <input type="text" value="250.00" readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Total</label>
                    <input type="text" value="5350.00" readOnly />
                  </div>
                  <div className="detail-row">
                    <label>Freight</label>
                    <input type="text" value="100.00" readOnly />
                  </div>
                </div>
              )}
            </div>
          </div>




          <div className="table-section">
            <div className="table-header">
              <table className="materials-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Material ID</th>
                    <th>Item Name</th>
                    <th>Material Name</th>
                    <th>UoM</th>
                    <th>Quantity</th>
                    <th>Cost Per Unit</th>
                    <th>Total</th>
                    <th>Manufacturing Date</th>
                    <th>Expiry Date</th>
                    <th>Warehouse Location</th>
                    <th>Serial No.</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="table-body">
              <table className="materials-table">
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={row.id}>
                      <td>{index + 1}</td>
                      <td>{row.materialId}</td>
                      <td>{row.materialName}</td>
                      <td>{row.materialName}</td>
                      <td>{row.uom}</td>
                      <td>{row.quantity}</td>
                      <td>{row.costPerUnit}</td>
                      <td>{row.total}</td>
                      <td>{row.manufacturingDate}</td>
                      <td>{row.expiryDate}</td>
                      <td>{row.warehouseLocation}</td>
                      <td>{row.serialNo || '-'}</td>
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




export default GoodsReceiptPO;









