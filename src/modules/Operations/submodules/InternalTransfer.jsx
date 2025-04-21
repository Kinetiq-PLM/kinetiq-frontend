import { useState, useEffect } from "react";
import "../styles/InternalTransfer.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';

const ApprovalTable = ({employee_id}) => {
  const [activePrimaryTab, setActivePrimaryTab] = useState("Delivery Request");




  const [deliveryRequestData, setDeliveryRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");


  const [ITReworkOrderData, setITReworkOrder] = useState([]);


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
          const syncDataResponse = await fetch("http://127.0.0.1:8000/operation/external-modules/sync-production/");
          const response = await fetch("http://127.0.0.1:8000/operation/internal-transfer-delivery-request/");
          const reworkResponse = await fetch("http://127.0.0.1:8000/operation/external-modules/rework-order/");
          if (!response.ok || !syncDataResponse || !reworkResponse) throw new Error("Connection to database failed");
 
          const data = await response.json();
          const reworkorderData = await reworkResponse.json();
          console.log(data)
          if (!Array.isArray(data) || !Array.isArray(reworkorderData)) {
            throw new Error("Invalid data format");
          }
          setDeliveryRequest(data);
          setITReworkOrder(reworkorderData)
      } catch (error) {
          if (error.name !== "AbortError") setError(error.message);
      } finally {
          setLoading(false);
      }
  };
 
  useEffect(() => {
    fetchDeliveryRequest();
  }, []);


  useEffect(() => {
    const filteredData = activePrimaryTab === "Delivery Request" ? deliveryRequestData : ITReworkOrderData;
    if (filteredData.length > 0) {
      setSelectedRow(0);
      setSelectedData(filteredData[0]);
    } else {
      setSelectedRow(null);
      setSelectedData(null);
    }
  }, [activePrimaryTab, deliveryRequestData, ITReworkOrderData]);
 
  // Filtered Data
  const filteredData = activePrimaryTab === "Delivery Request" ? deliveryRequestData : ITReworkOrderData;


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
    if (!selectedData || !selectedWarehouse) return;
 
    // Find the selected warehouse_id from the location name
    const selected = warehouseList.find(w => w.warehouse_location === selectedWarehouse);
    if (!selected) {
      toast.error("Invalid warehouse selection.");
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
      toast.success("Warehouse updated:", result);

    fetchDeliveryRequest();
    } catch (error) {
      toast.error(`Failed to update data. Details: ${error.message}`);
    }
  };


  const handleChange = (e, field) => {
    const newSelectedData = { ...selectedData };
    newSelectedData.external_module[field] = e.target.value;
 
    if (field === 'rework_quantity') {
      const actualQuantity = newSelectedData.production_order.actual_quantity;
      const reworkQuantity = parseInt(e.target.value);
      
      if (reworkQuantity > actualQuantity) {
        toast.dismiss()
        toast.error('Error: Rework quantity must not be greater than actual quantity.');
        return;
      }
    }
 
    setSelectedData(newSelectedData);
  };
 
  const updateRework = async (data) => {
    const actualQuantity = selectedData.production_order.actual_quantity;
    const reworkQuantity = parseInt(selectedData.external_module.rework_quantity);
    try {
  
      if (reworkQuantity > actualQuantity) {
        toast.dismiss()
        toast.error('Error: Rework quantity must not be greater than actual quantity.');
        fetchDeliveryRequest()
        return;
      }
      if (data.external_module.reason_rework && (!data.external_module.rework_quantity || data.external_module.rework_quantity <= 0)) {
        toast.dismiss();
        toast.error("Rework quantity is required when a rework reason is provided.");
        fetchDeliveryRequest()
        return;
      }
      if (!data.external_module.reason_rework && (data.external_module.rework_quantity < 0)) {
        toast.dismiss();
        toast.error("Rework reason is required when a rework quantity is provided.");
        fetchDeliveryRequest()
        return;
      }
      const response = await fetch('http://127.0.0.1:8000/operation/external-modules/update-rework/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          production_order_detail_id: data.production_order_detail_id,
          rework_quantity: data.external_module.rework_quantity,
          reason_rework: data.external_module.reason_rework,
        }),
      });
 
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.status === 'success') {
          toast.success('Data updated successfully');
        } else {
          toast.error('Error updating database:', responseData.message);
        }
      } else {
        toast.error('Error with the API request');
      }
    } catch (error) {
      toast.error('Error sending data to the server:', error);
    }
  };

  const handleSendClick = () => {
    if (activePrimaryTab === "Delivery Request") {
      updateDeliveryRequest();
    } else if (activePrimaryTab === "Rework Order") {
      updateRework(selectedData);
    }
  };
  

  return (
    <div className={`InternalTransfer ${activePrimaryTab === "Rework Order" ? "rework" : ""}`}>
      <div className="body-content-container">
      <ToastContainer transition={Slide} />

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
                <th></th> {/* Checkbox column - no checkbox in header */}
                <th>ID</th> {/* ID column next */}
                {activePrimaryTab === "Delivery Request" ? (
                  <>
                    <th>Item Name</th>
                    <th>Date</th>
                    <th>Delivery Type</th>
                    <th>Warehouse Location</th>
                    <th>Module</th>
                  </>
                ) : (
                  <>
                    <th>Product Name</th>
                    <th>Reason for Rework</th>
                    <th>Actual Quantity</th>
                    <th>Rework Quantity</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center">Loading...</td>
                </tr>
              ) : filteredData.map((row, index) => (
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
                      <td>{row.item_name}</td>
                      <td>{row.request_date}</td>
                      <td>{row.delivery_type}</td>
                      <td>{warehouseList.find(w => w.warehouse_id === row.warehouse_id)?.warehouse_location || "N/A"}</td>
                      <td>{row.module_name}</td>
                    </>
                  ) : (
                    <>
                      <td>{row.production_order_detail_id}</td>
                      <td>{row.product_name}</td>
                      <td>{row.external_module?.reason_rework || ""}</td>
                      <td>{row.production_order?.actual_quantity || ""}</td>
                      <td>{row.external_module?.rework_quantity || ""}</td>
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
                <label>Delivery ID</label>
                <input 
                  type="text" 
                  className="short-input"  
                  value={selectedData?.delivery_id || "" } 
                  readOnly
                  style={{
                    backgroundColor: '#f8f8f8', 
                    cursor: 'not-allowed'
                  }}
                />
              </div>
              <div className="input-group">
                <label>Date</label>
                <input 
                  type="date" 
                  className="short-input" 
                  value={selectedData?.request_date || ""} 
                  readOnly
                  style={{
                    backgroundColor: '#f8f8f8', 
                    cursor: 'not-allowed'
                  }}
                />
              </div>
            </div>


            <div className="input-row">
              <div className="input-group">
                <label>Delivery Type</label>
                <input 
                  type="text" 
                  className="short-input" 
                  value={selectedData?.delivery_type || ""} 
                  readOnly
                  style={{
                    backgroundColor: '#f8f8f8', 
                    cursor: 'not-allowed'
                  }}
                />
              </div>
              <div className="input-group">
                <label>Module</label>
                <input 
                  type="text" 
                  className="short-input"  
                  value={selectedData?.module_name || ""} 
                  readOnly
                  style={{
                    backgroundColor: '#f8f8f8', 
                    cursor: 'not-allowed'
                  }}
                />
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
                <input 
                  type="text" 
                  className="short-input req-input" 
                  value={selectedData.production_order_detail_id} 
                  style={{ cursor: 'default' }} readOnly
                />
              </div>
              <div className="input-group">
                <label>Rework Reason</label>
                <input
                  type="text"
                  className="short-input"
                  value={selectedData?.external_module?.reason_rework || ''}
                  onChange={(e) => handleChange(e, 'reason_rework')}
                />
              </div>
              <div className="input-group">
                <label>Actual Quantity</label>
                <input 
                  type="text" 
                  className="short-input req-input" 
                  max="10000000"
                  value={selectedData?.production_order?.actual_quantity || ''} 
                  style={{ cursor: 'not-alowed' }}
                  readOnly
                />
              </div>
              <div className="input-group item-number">
                <label>Rework Quantity</label>
                <input
                  type="number"
                  className="short-input"
                  min="0"
                  max="10000000"
                  value={selectedData?.external_module?.rework_quantity || ''}
                  onChange={(e) => handleChange(e, 'rework_quantity')}
                />
              </div>
            </div>
          </div>
        )}
        <div className="button-container">
          <button className="send-to-button" onClick={handleSendClick}>Save</button>
        </div>
      </div>
    </div>
  );
};




export default ApprovalTable;
























   





