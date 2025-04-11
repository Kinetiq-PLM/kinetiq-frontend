import { useState, useEffect } from "react";
import "../styles/InternalTransfer.css";


const ApprovalTable = () => {
  const [activePrimaryTab, setActivePrimaryTab] = useState("Delivery Request");

  // Sample Data
  const deliveryData = [
    { id: 1, date: "03/20/25", project: "Project A", delivery: "Yes", module: "Module X", status: "Approved" },
    { id: 2, date: "03/18/25", project: "Project B", delivery: "No", module: "Module Y", status: "Pending" },
    { id: 3, date: "03/15/25", project: "Project C", delivery: "Yes", module: "Module Z", status: "Approved" },
    { id: 4, date: "03/14/25", project: "Project D", delivery: "Yes", module: "Module A", status: "Pending" },
    { id: 5, date: "03/13/25", project: "Project E", delivery: "No", module: "Module B", status: "Approved" },
    { id: 6, date: "03/12/25", project: "Project F", delivery: "Yes", module: "Module C", status: "Pending" },
    { id: 7, date: "03/11/25", project: "Project G", delivery: "No", module: "Module D", status: "Approved" },
    { id: 8, date: "03/10/25", project: "Project H", delivery: "Yes", module: "Module E", status: "Pending" },
    { id: 9, date: "03/09/25", project: "Project I", delivery: "No", module: "Module F", status: "Approved" },
    { id: 10, date: "03/08/25", project: "Project J", delivery: "Yes", module: "Module G", status: "Pending" }
  ];

  const reworkData = [
    { id: 1, reason: "Defective Part", cost: "$200", date: "03/19/25", status: "Approved" },
    { id: 2, reason: "Wrong Specification", cost: "$350", date: "03/17/25", status: "Pending" },
    { id: 3, reason: "Defective Part", cost: "$0", date: "03/17/25", status: "Pending" },
    { id: 4, reason: "Quality Issue", cost: "$150", date: "03/16/25", status: "Approved" },
    { id: 5, reason: "Wrong Assembly", cost: "$280", date: "03/15/25", status: "Pending" },
    { id: 6, reason: "Missing Component", cost: "$420", date: "03/14/25", status: "Approved" },
    { id: 7, reason: "Defective Material", cost: "$180", date: "03/13/25", status: "Pending" },
    { id: 8, reason: "Wrong Measurement", cost: "$300", date: "03/12/25", status: "Approved" },
    { id: 9, reason: "Assembly Error", cost: "$250", date: "03/11/25", status: "Pending" },
    { id: 10, reason: "Component Failure", cost: "$190", date: "03/10/25", status: "Approved" }
  ];  

  const [selectedRows, setSelectedRows] = useState([]);
  const [deliveryRequestData, setDeliveryRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  const handleCheckboxChange = (index, row) => {
    setSelectedRow(index);
    setSelectedData(row);
    const warehouse = warehouseList.find(w => w.warehouse_id === row.warehouse_id);
    setSelectedWarehouse(warehouse ? warehouse.warehouse_location : "");
  };

  const fetchWarehouse = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/operation/get-warehouseID/");
      if (!response.ok) throw new Error("Connection to database failed");

      const data = await response.json();

      if (!Array.isArray(data)) throw new Error("Invalid warehouse format");
      setWarehouseList(data);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWarehouse();
  }, []);

  useEffect(() => {
    if (selectedData && warehouseList.length > 0) {
      const warehouse = warehouseList.find(w => w.warehouse_id === selectedData.warehouse_id);
      setSelectedWarehouse(warehouse ? warehouse.warehouse_location : "");
    }
  }, [selectedData, warehouseList]);

  const fetchDeliveryRequest = async () => {
      try {
          setLoading(true);
          setError(null); // Reset error state
 
          const response = await fetch("http://127.0.0.1:8000/operation/internal-transfer-delivery-request/");
          if (!response.ok) throw new Error("Connection to database failed");
 
          const data = await response.json();
          if (!Array.isArray(data)) throw new Error("Invalid delivery request data format");
 
          setDeliveryRequest(data);
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
    fetchDeliveryRequest();
  }, []);

  // Filtered Data
  const filteredData = activePrimaryTab === "Delivery Request" ? deliveryRequestData : reworkData;

  useEffect(() => {
    if (filteredData.length > 0) {
      setSelectedRow(0);
      setSelectedData(filteredData[0]);
    } else {
      setSelectedRow(null);
      setSelectedData(null);
    }
  }, [filteredData]);
  
  const updateDeliveryRequest = async () => {
    console.log(selectedData.content_id)
    console.log(selectedData.warehouse_id)
    if (!selectedData || !selectedWarehouse) return;
  
    // Find the selected warehouse_id from the location name
    const selected = warehouseList.find(w => w.warehouse_location === selectedWarehouse);
    console.log(selected.warehouse_id)
    if (!selected) {
      alert("Invalid warehouse selection.");
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/operation/update-delivery-request/${selectedData.content_id}/`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          warehouse_id: selected.warehouse_id,
          delivery_id: selectedData.delivery_id
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
          throw new Error(`Warehouse update failed for content_id ${selectedData.content_id}: ${JSON.stringify(errorData)}`);
      }
  
      const result = await response.json();
      console.log("Warehouse updated:", result);
      const insertResponse = await fetch("http://127.0.0.1:8000/operation/send-to-distribution/", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content_id: selectedData.content_id,
      }),
    });

    if (!insertResponse.ok) {
      const insertErrorData = await insertResponse.json();
      throw new Error(`Failed to insert into distribution.delivery_order: ${JSON.stringify(insertErrorData)}`);
    }

    const insertResult = await insertResponse.json();
    console.log("Delivery Order Inserted:", insertResult);

    // Refresh the delivery request data
    fetchDeliveryRequest();
    } catch (error) {
      console.error(`Error updating: ${error.message}`);
      alert(`Failed to update data. Details: ${error.message}`);
    }
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
                <th></th>
                <th>Order ID</th> {/* ID column next */}
                {activePrimaryTab === "Delivery Request" ? (
                  <>
                    
                    <th>Date</th>
                    <th>Delivery Type</th>
                    <th>Warehouse Location</th>
                    <th>Recieving Module</th>
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
              {filteredData.map((row, index) => (
                <tr key={row.external_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRow === index}
                      onChange={() => handleCheckboxChange(index, row)}
                    />
                  </td>
                  
                  {activePrimaryTab === "Delivery Request" ? (
                    <>
                      <td>{row.delivery_id}</td>
                      <td>{row.request_date}</td>
                      <td>{row.delivery_type}</td>
                      {warehouseList.find(w => w.warehouse_id === row.warehouse_id)?.warehouse_location || "N/A"}
                      <td>{row.module_name}</td>
                    </>
                  ) : (
                    <>
                      <td>{row.id}</td>
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
                <input type="text" className="short-input"  value={selectedData?.delivery_id || "" } readOnly/>
              </div>
              <div className="input-group">
                <label>Date</label>
                <input type="date" className="short-input" value={selectedData?.request_date || ""} readOnly/>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Delivery Type</label>
                <input type="text" className="short-input" value={selectedData?.delivery_type || ""} readOnly/>
              </div>
              <div className="input-group">
                <label>Module</label>
                <input type="text" className="short-input"  value={selectedData?.module_name || ""} readOnly/>
              </div>
              <div className="input-group">
                <label>Warehouse Location</label>
                <select value={selectedWarehouse} onChange={(e) => setSelectedWarehouse(e.target.value)}  className="module-dropdown w-40 h-8 border rounded px-2">
                  <option value="">Select Warehouse</option>
                  {loading ? (
                    <option value="">Loading vendors...</option>
                  ) : (
                    warehouseList.map((warehouse) => (
                      <option key={warehouse.warehouse_id} value={warehouse.warehouse_location}>
                        {warehouse.warehouse_location}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>
        )}


        {/* Input Fields (Only for Rework Order) */}
        {activePrimaryTab === "Rework Order" && (
          <div className="input-container">
            <div className="input-row">
              <div className="input-group">
                <label>Product ID</label>
                <input type="text" className="short-input" />
              </div>
              <div className="input-group">
                <label>Reason</label>
                <input type="text" className="short-input" />
              </div>
              <div className="input-group">
                <label>Quantity</label>
                <input type="number" className="short-input" min="1" />
              </div>
            </div>
          </div>
        )}


        <div className="button-container">
          <button className="send-to-button" onClick={updateDeliveryRequest}>Send To</button>
        </div>


      </div>
    </div>
  );
};


export default ApprovalTable;
























   




