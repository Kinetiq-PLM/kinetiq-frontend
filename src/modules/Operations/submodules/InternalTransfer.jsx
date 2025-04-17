import { useState } from "react";
import "../styles/InternalTransfer.css";




const ApprovalTable = () => {
  const [activePrimaryTab, setActivePrimaryTab] = useState("Delivery Request");




  // Sample Data
  const deliveryData = [
    { id: 1, date: "03/20/25", project: "Project A", delivery: "Yes", module: "Module X", status: "Approved" },
    { id: 2, date: "03/18/25", project: "Project B", delivery: "No", module: "Module Y", status: "Pending" },
    { id: 3, date: "03/15/25", project: "Project C", delivery: "Yes", module: "Module Z", status: "Approved" },
  ];




  const reworkData = [
    { id: 1, reason: "Defective Part", cost: "$200", date: "03/19/25", status: "Approved" },
    { id: 2, reason: "Wrong Specification", cost: "$350", date: "03/17/25", status: "Pending" },
    { id: 3, reason: "Defective Part", cost: "$0", date: "03/17/25", status: "Pending" },
    { id: 4, reason: "Defective Part0", cost: "$0", date: "03/17/25", status: "Pending" },
  ];  




  // Filtered Data
  const filteredData = activePrimaryTab === "Delivery Request" ? deliveryData : reworkData;




  const [selectedRows, setSelectedRows] = useState([]);




  // Function to handle individual checkbox selection
  const handleCheckboxChange = (id) => {
    setSelectedRows(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(rowId => rowId !== id)
        : [...prevSelected, id]
    );
  };




  const modules = [
    "Inventory",
    "Production",
  ];




  const [selectedModule, setSelectedModule] = useState(modules[0]); // Default module




  return (
    <div className={`InternalTransfer ${activePrimaryTab === "Rework Order" ? "rework" : ""}`}>
      <div className="body-content-container">
        {/* Primary Tabs */}
        <div className="tabs">
          <div
            className={`tab ${activePrimaryTab === "Delivery Request" ? "active" : ""}`}
            onClick={() => setActivePrimaryTab("Delivery Request")}
          >
            Delivery Request
          </div>
          <div
            className={`tab ${activePrimaryTab === "Rework Order" ? "active" : ""}`}
            onClick={() => setActivePrimaryTab("Rework Order")}
          >
            Rework Order
          </div>
        </div>




        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Select</th> {/* Checkbox column - no checkbox in header */}
                <th>ID</th> {/* ID column next */}
                {activePrimaryTab === "Delivery Request" ? (
                  <>
                    <th>Date</th>
                    <th>Delivery Type</th>
                    <th>Warehouse Location</th>
                    <th>Module</th>
                  </>
                ) : (
                  <>
                    <th>Reason for Rework</th>
                    <th>Cost</th>
                    <th>Date</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.map(row => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleCheckboxChange(row.id)}
                    />
                  </td>
                  <td>{row.id}</td>
                  {activePrimaryTab === "Delivery Request" ? (
                    <>
                      <td>{row.date}</td>
                      <td>{row.project}</td>
                      <td>{row.delivery}</td>
                      <td>{row.module}</td>
                    </>
                  ) : (
                    <>
                      <td>{row.reason}</td>
                      <td>{row.cost}</td>
                      <td>{row.date}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>




        {/* Input Fields (Only for Delivery Request) */}
        {activePrimaryTab === "Delivery Request" && (
          <div className="input-container">
            <div className="input-row first-row">
              <div className="input-group">
                <label>ID</label>
                <input type="text" className="short-input" />
              </div>
              <div className="input-group">
                <label>Date</label>
                <input type="date" className="short-input" />
              </div>
            </div>




            <div className="input-row">
              <div className="input-group">
                <label>Delivery Type</label>
                <input type="text" className="short-input" />
              </div>
              <div className="input-group">
                <label>Warehouse Location</label>
                <input type="text" className="short-input" />
              </div>
              <div className="input-group">
                <label>Module</label>
                <select
                  className="module-dropdown w-40 h-8 border rounded px-2"
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                >
                  {modules.map((module, index) => (
                    <option key={index} value={module}>
                      {module}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}




        <div className="button-container">
          <button className="send-to-button">Send To</button>
        </div>




      </div>
    </div>
  );
};




export default ApprovalTable;






   



