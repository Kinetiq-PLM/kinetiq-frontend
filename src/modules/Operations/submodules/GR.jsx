import React, { useState } from "react";
import "../styles/GR.css";

const GRMain = () => {
  const [showGRPO, setShowGRPO] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const tableData = [
    { id: 1, transactionId: "0031", documentNo: "0042", status: "closed", documentDate: "12/23/24", postingDate: "12/24/24" },
    { id: 2, transactionId: "0035", documentNo: "0043", status: "open", documentDate: "01/31/25", postingDate: "01/31/25" },
    { id: 3, transactionId: "0036", documentNo: "0044", status: "cancelled", documentDate: "02/01/25", postingDate: "02/01/25" },
    { id: 4, transactionId: "0038", documentNo: "0048", status: "draft", documentDate: "02/04/25", postingDate: "02/04/25" },
  ];

  const filteredData = activeTab === "all" ? tableData : tableData.filter(row => row.status === activeTab);

  return (
    <div className="gr">
      <div className="body-content-container">
        {!showGRPO ? (
          <>
            <h2 className="text-xl font-bold">Goods Tracking</h2>

            <div className="operations-gt-filters flex gap-2 mt-4">
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
              <div className="operations-gt-table mt-5">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th></th>
                      <th>No.</th>
                      <th>Transaction ID</th>
                      <th>Document No.</th>
                      <th>Status</th>
                      <th>Posting Date</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((row, index) => (
                        <tr key={row.id}>
                          <td><input type="checkbox" /></td>
                          <td>{index + 1}</td>
                          <td>{row.transactionId}</td>
                          <td>{row.documentNo}</td>
                          <td className={`operations-gt-status ${row.status}`}>
                            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                          </td>
                          <td>{row.documentDate}</td>
                          <td>{row.postingDate}</td>
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

            <div className="operations-gt-actions flex justify-end mt-4">
              <button className="operations-gt-view">View</button>
              <button className="operations-gt-create" onClick={() => setShowGRPO(true)}>Create</button>
            </div>
          </>
        ) : (
          <GRPO onBack={() => setShowGRPO(false)} />
        )}
      </div>
    </div>
  );
};

const GRPO = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("document_details");
  const [vendorDetails, setVendorDetails] = useState({
    vendorCode: "0035",
    vendorName: "DuraWell Pro Ltd.",
    contactPerson: "Xzanelle Garcia",
    buyer: "Charlotte Dixon",
    owner: "Paul Robles"
  });
  const [documentDetails, setDocumentDetails] = useState({
    transactionId: "0035",
    postingDate: "2025-01-31",
    documentNo: "0043",
    deliveryDate: "2025-02-02",
    status: "Open",
    documentDate: "2025-01-31"
  });
  const [costDetails, setCostDetails] = useState({
    initialAmount: "1620.00",
    taxRate: "12%",
    discountRate: "5%",
    taxAmount: "194.40",
    discountAmount: "81.00",
    total: "1833.40",
    freight: "100.00"
  });

  return (
    <div className="operation_grpo">
      <div className="operations-gt-back-container">
        <button className="operations-gt-back" onClick={onBack}>⬅ Back</button>
      </div>
      <h2 className="text-xl font-bold"></h2>

      <div className="operation_details_container">
        <div className="operation_section operation_boxed" style={{ flexBasis: 'auto', maxWidth: '400px' }}>
          <div className="vendor_details">
            {Object.keys(vendorDetails).map((key) => (
              <React.Fragment key={key}>
                <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input type="text" value={vendorDetails[key]} readOnly />
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="operation_section document_cost_section operation_boxed">
          <div className="operation_tabs">
            <h3 className={`operation_tab ${activeTab === "document_details" ? "active" : ""}`} onClick={() => setActiveTab("document_details")}>Document Details</h3>
            <h3 className={`operation_tab ${activeTab === "cost_details" ? "active" : ""}`} onClick={() => setActiveTab("cost_details")}>Cost Details</h3>
          </div>

          {activeTab === "document_details" && (
            <div className="operation_box operation_document_grid">
              {Object.keys(documentDetails).map((key) => (
                <div key={key}>
                  <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <input
                    type={key.includes("Date") ? "date" : "text"}
                    value={documentDetails[key]}
                    readOnly={key !== "postingDate" && key !== "documentDate" && key !== "deliveryDate"}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "cost_details" && (
            <div className="operation_box operation_cost_grid">
              {Object.keys(costDetails).map((key) => (
                <div key={key}>
                  <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <input type="text" value={costDetails[key]} readOnly />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="operation_table_container">
        <table className="operation_table">
          <thead>
            <tr>
              <th></th>
              <th>No.</th>
              <th>Material ID</th>
              <th>Material Name</th>
              <th>UoM</th>
              <th>Quantity</th>
              <th>Cost Per Unit</th>
              <th>Total</th>
              <th>Manufacturing Date</th>
              <th>Expiry Date</th>
              <th>Warehouse Location</th>
              <th>Batch No.</th>
              <th>Serial No.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="checkbox" /></td>
              <td>1</td>
              <td>RM039</td>
              <td>Circuit Boards</td>
              <td>PIECE</td>
              <td>3</td>
              <td>290.00</td>
              <td>870.00</td>
              <td>A1</td>
              <td>B123</td>
              <td>01-23-25</td>
              <td>01-23-29</td>
              <td>...</td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>2</td>
              <td>RM042</td>
              <td>LCD Screen</td>
              <td>PIECE</td>
              <td>5</td>
              <td>150.00</td>
              <td>750.00</td>
              <td>B2</td>
              <td>B456</td>
              <td>01-23-29</td>
              <td>01-23-29</td>
              <td>...</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="operation_buttons">
        <button className="operation_btn">Copy From</button>
        <button className="operation_btn">Copy To</button>
        <button className="operation_btn cancel">Cancel</button>
        <button className="operation_btn send">Send To</button>
      </div>
    </div>
  );
};

export default GRMain;