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
    const warehouse = warehouseList.find(w => w.warehouse_location === row.warehouse_location);
    setSelectedWarehouse(warehouse?.warehouse_location || "");
  };


  const fetchWarehouse = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/get-warehouseID/");
      if (!response.ok) throw new Error("Connection to database failed");


      const data = await response.json();


      if (!Array.isArray(data)) throw new Error("Invalid warehouse format");
      const sortedWarehouses = [...data].sort((a, b) => {
        const getLastWord = (str) => {
          const words = str.split(/\s+/);
          return words[words.length - 1];
        };
  
        const lastWordA = getLastWord(a.warehouse_location);
        const lastWordB = getLastWord(b.warehouse_location);
  
        return lastWordA.localeCompare(lastWordB);
      });
  
      setWarehouseList(sortedWarehouses);


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
      const warehouse = warehouseList.find(w => w.warehouse_location === selectedData.warehouse_location);
      setSelectedWarehouse(warehouse?.warehouse_location || "");
    }
  }, [selectedData, warehouseList]);


  const fetchDeliveryRequest = async () => {
      try {
          setLoading(true);
          setError(null); 
          const syncDataResponse = await fetch("https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/external-modules/sync-production/");
          const response = await fetch("https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/internal-transfer-delivery-request/");
          const reworkResponse = await fetch("https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/external-modules/rework-order/");
          if (!response.ok || !syncDataResponse || !reworkResponse) throw new Error("Connection to database failed");
 
          const data = await response.json();
          const reworkorderData = await reworkResponse.json();

          if (!Array.isArray(data) || !Array.isArray(reworkorderData)) {
            throw new Error("Invalid data format");
          }
          const sortedRequestData = data.sort((a, b) => {
            if (!a.warehouse_location && b.warehouse_location) return -1;
            if (a.warehouse_location && !b.warehouse_location) return 1;
          
            const dateA = new Date(a.request_date);
            const dateB = new Date(b.request_date);
            return dateA - dateB;
          });
          setDeliveryRequest(sortedRequestData);
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
 
    const selected = warehouseList.find(w => w.warehouse_location === selectedWarehouse);
    if (!selected) {
      toast.error("Invalid warehouse selection.");
      return;
    }
 
    try {
      const response = await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/update-delivery-request/${selectedData.delivery_id}/`, {
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
    if (field === 'quantity') {
      const actualQuantity = newSelectedData.actual_quantity;
      const reworkQuantity = parseInt(e.target.value);
      
      if (reworkQuantity > actualQuantity) {
        toast.dismiss();
        toast.error('Error: Rework quantity must not be greater than actual quantity.');
        return;
      }
      
      newSelectedData.quantity = reworkQuantity;
    } else if (field === 'reason_rework') {
      newSelectedData.reason_rework = e.target.value;
    }
  
    setSelectedData(newSelectedData);
  };
 
  const updateRework = async (data) => {
    const actualQuantity = selectedData.actual_quantity;
    const reworkQuantity = Number(selectedData.quantity) || 0;
    try {
      if (reworkQuantity > actualQuantity) {
        toast.dismiss()
        toast.error('Error: Rework quantity must not be greater than actual quantity.');
        fetchDeliveryRequest()
        return;
      }
      if (data.reason_rework && (!reworkQuantity || reworkQuantity <= 0)) {
        toast.dismiss();
        toast.error("Rework quantity is required when a rework reason is provided.");
        fetchDeliveryRequest()
        return;
      }
      if ((!data.reason_rework || data.reason_rework == null) && (data.quantity > 0)) {
        toast.dismiss();
        toast.error("Rework reason is required when a rework quantity is provided.");
        fetchDeliveryRequest()
        return;
      }
      const response = await fetch('https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/external-modules/update-rework/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          production_order_detail_id: data.rework_id,
          quantity: Number(data.quantity) || 0,  
          reason_rework: data.reason_rework,
        }),
      });
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.status === 'success') {
          await fetchDeliveryRequest()
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
                {activePrimaryTab === "Delivery Request" ? (
                  <>
                    <th className="deliveryTH"></th>
                    <th className="deliveryTH">Delivery ID</th> {/* ID column next */}
                    <th className="deliveryTH">Item Name</th>
                    <th className="deliveryTH">Quantity</th>
                    <th className="deliveryTH">Date</th>
                    <th className="deliveryTH">Delivery Type</th>
                    <th className="deliveryTH">Warehouse Location</th>
                    <th className="deliveryTH">Receiving Unit</th>
                  </>
                ) : (
                  <>
                    <th className="reworkTH"></th>
                    <th className="reworkTH">Rework ID</th>
                    <th className="reworkTH">Product Name</th>
                    <th className="reworkTH">Reason for Rework</th>
                    <th className="reworkTH">Actual Quantity</th>
                    <th className="reworkTH">Rework Quantity</th>
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
                <tr key={row?.delivery_id || row.rework_id }>
                  
                 
                  {activePrimaryTab === "Delivery Request" ? (
                    <>
                      <td className="deliveryTD">
                        <input
                          type="checkbox"
                          checked={selectedRow === index}
                          onChange={() => handleCheckboxChange(index, row)}
                        />
                      </td>
                      <td className="deliveryTD">{row.delivery_id}</td>
                      <td className="deliveryTD">{row.item_name}</td>
                      <td className="deliveryTD">{row.quantity || 0}</td> 
                      <td className="deliveryTD">{row.request_date}</td>
                      <td className="deliveryTD">{row.delivery_type}</td>
                      <td className="deliveryTD">{row.warehouse_location}</td>
                      <td className="deliveryTD">{row.module_name}</td>
                    </>
                  ) : (
                    <>
                      <td className="reworkTD">
                        <input
                          type="checkbox"
                          checked={selectedRow === index}
                          onChange={() => handleCheckboxChange(index, row)}
                        />
                      </td>
                      <td className="reworkTD">{row?.rework_id || ""}</td>
                      <td className="reworkTD">{row?.product_name || ""}</td>
                      <td className="reworkTD">{row?.reason_rework || ""}</td>
                      <td className="reworkTD">{row?.actual_quantity || ""}</td>
                      <td className="reworkTD">{row?.quantity ?? ""}</td>
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
            </div>


            <div className="input-row">
              
              <div className="input-group">
                <label>Receiving Unit</label>
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
                    <option value="">Loading warehouse...</option>
                  ) : (
                    warehouseList.map((warehouse) => (
                      <option key={warehouse.warehouse_location} value={warehouse.warehouse_location}>
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
          <div className="input-container reworkOrder">
            <div className="input-row">
              <div className="input-group">
                <label>Rework ID</label>
                <input 
                  type="text" 
                  className="short-input req-input" 
                  value={selectedData?.rework_id || ""} 
                  style={{ cursor: 'default' }} readOnly
                />
              </div>
              <div className="input-group">
                <label>Rework Reason</label>
                <input
                  type="text"
                  className="short-input"
                  value={selectedData?.reason_rework || ''}
                  onChange={(e) => handleChange(e, 'reason_rework')}
                />
              </div>
              </div>
            <div className="input-row">
              <div className="input-group">
                <label>Actual Quantity</label>
                <input 
                  type="text" 
                  className="short-input req-input" 
                  max="10000000"
                  value={selectedData?.actual_quantity || ''} 
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
                  value={selectedData?.quantity ?? ''}
                  onKeyDown={(e) => {
                    if (e.key === '.') {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => handleChange(e, 'quantity')}
                />
              </div>
            </div>
          </div>
        )}
        <div className="button-container">
          <button className="send-to-button" onClick={handleSendClick} style={{ position: 'relative', bottom: '8px' }}>Save</button>
        </div>
      </div>
    </div>
  );
};




export default ApprovalTable;
























   