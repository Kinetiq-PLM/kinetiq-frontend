import React, { useState } from "react";
import "../styles/GoodsIssue.css";

const GoodsIssue = ({ onBack }) => {
  const [selectedOwner, setSelectedOwner] = useState("Bob Smith");
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [activeTab, setActiveTab] = useState("document");
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [selectedSerialNumbers, setSelectedSerialNumbers] = useState([]);

  const ownerOptions = ["Bob Smith", "John Smith", "Sarah Johnson"];
  const statusOptions = ["Open", "Closed", "Cancelled", "Draft"];

  const tableData = [
    {
      id: 1,
      itemId: "ADMIN-PROD-2025-1238",
      itemName: "Office Laptop",
      uom: "UNIT",
      quantity: "2",
      costPerUnit: "1200.00",
      total: "2400.00",
      warehouseLocation: "WH-A-101",
      serialNo: "...",
    },
    {
      id: 2,
      itemId: "ADMIN-PROD-2025-1234",
      itemName: "Neonatal Incubator",
      uom: "UNIT",
      quantity: "5",
      costPerUnit: "25.00",
      total: "125.00",
      warehouseLocation: "WH-B-203",
      serialNo: "...",
    },
    { 
      id: 3,
      itemId: "ADMIN-PROD-2025-1233",
      itemName: "Keyboard",
      uom: "UNIT",
      quantity: "5",
      costPerUnit: "45.00",
      total: "225.00",
      warehouseLocation: "WH-A-102",
      serialNo: "...",
    }
  ];

  const serialNumbers = [
    { no: 1, itemId: "ADMIN-PROD-2025-1238", itemName: "Office Laptop", serialNo: "J1N-TYY4JC" },
    { no: 2, itemId: "ADMIN-PROD-2025-1238", itemName: "Office Laptop", serialNo: "FO5-R5Y811" },
    { no: 3, itemId: "ADMIN-PROD-2025-1234", itemName: "Neonatal Incubator", serialNo: "K48-H9X62V" },
    { no: 4, itemId: "ADMIN-PROD-2025-1234", itemName: "Neonatal Incubator", serialNo: "7L3-W8JV2X" },
    { no: 5, itemId: "ADMIN-PROD-2025-1234", itemName: "Neonatal Incubator", serialNo: "GV9-CF5GDX" },
    { no: 6, itemId: "ADMIN-PROD-2025-1234", itemName: "Neonatal Incubator", serialNo: "QWE-R5T6U1" },
    { no: 7, itemId: "ADMIN-PROD-2025-1234", itemName: "Neonatal Incubator", serialNo: "ZXC-V7B8NM" },
    { no: 8, itemId: "ADMIN-PROD-2025-1233", itemName: "Keyboard", serialNo: "XWY-13BDUS" },
    { no: 9, itemId: "ADMIN-PROD-2025-1233", itemName: "Keyboard", serialNo: "11D-DSHW34" }
  ];

  return (
    <div className="gi">
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

          <div className="operation_table_container">
            <div className="gi-table">
              <table className="materials-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>UoM</th>
                    <th>Quantity</th>
                    <th>Cost Per Unit</th>
                    <th>Total</th>
                    <th>Warehouse Location</th>
                    <th>Serial No.</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.itemId}</td>
                      <td>{item.itemName}</td>
                      <td>{item.uom}</td>
                      <td>{item.quantity}</td>
                      <td>${item.costPerUnit}</td>
                      <td>${item.total}</td>
                      <td>{item.warehouseLocation}</td>
                      <td>
                        <button
                          className="serial-button"
                          onClick={() => {
                            setShowSerialModal(true);
                            setSelectedSerialNumbers(serialNumbers.filter(sn => sn.itemId === item.itemId));
                          }}
                        >
                          ...
                        </button>
                      </td>
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

      {showSerialModal && (
        <div className="modal-overlay">
          <div className="serial-modal">
            <div className="modal-header">
              <h3>Serial Numbers</h3>
              <button className="close-button" onClick={() => setShowSerialModal(false)}>
                Close
              </button>
            </div>
            <div className="modal-content">
              <div className="serial-table-container">
                <table className="serial-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Item ID</th>
                      <th>Item Name</th>
                      <th>Serial No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSerialNumbers.map((item) => (
                      <tr key={item.no}>
                        <td>{item.no}</td>     
                        <td>{item.itemId}</td>
                        <td>{item.itemName}</td>
                        <td>{item.serialNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 

export default GoodsIssue;
