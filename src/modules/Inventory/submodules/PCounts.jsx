import React, { useEffect, useState } from "react";
import "../styles/PCounts.css";
import InvPcountForm from "../components/InvPcountForm";
import DiscrepancyReportForm from "../components/DiscrepancyReportForm";

const BodyContent = () => {
  const [pcounts, setPcounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [showInvPcountForm, setShowInvPcountForm] = useState(false);
  const [showDiscrepancyForm, setShowDiscrepancyForm] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [inventoryItems, setInventoryItems] = useState({});
  const [countHistory, setCountHistory] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Format UTC time properly
  const formatUTCTime = (date) => {
    const utcDate = date.getUTCDate().toString().padStart(2, '0');
    const utcMonth = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const utcYear = date.getUTCFullYear();
    const utcHours = date.getUTCHours().toString().padStart(2, '0');
    const utcMinutes = date.getUTCMinutes().toString().padStart(2, '0');
    const utcSeconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${utcDate}/${utcMonth}/${utcYear}, ${utcHours}:${utcMinutes}:${utcSeconds} UTC`;
  };

  // Timer for real-time clock updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up timer on component unmount
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("http://127.0.0.1:8000/api/warehouses/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error fetching warehouses! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Warehouse data:", data);
        if (data && data.length > 0) {
          setWarehouses(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching warehouses:", err);
      });

    fetch("http://127.0.0.1:8000/api/inventory-items/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error fetching inventory items! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Inventory Items API Response:", data);
        const itemsMap = {};
        data.forEach(item => {

          if (item && item.inventory_item_id) {
            console.log(`Processing item ${item.inventory_item_id} with type: ${item.item_type}`);
            itemsMap[item.inventory_item_id] = item;
          } else {
            console.warn("Skipping invalid inventory item:", item);
          }
        });
        console.log("Final inventoryItems map:", itemsMap);
        setInventoryItems(itemsMap);
      })
      .catch((err) => {
        console.error("Error fetching inventory items:", err);
      });

    fetch("http://127.0.0.1:8000/api/cyclic_counts/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error fetching cyclic counts! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Cyclic Counts API Response:", data);

        // If warehouses weren't fetched separately, extract them from counts
        if (warehouses.length === 0) {
          const uniqueWarehouses = [...new Set(data
            .filter(item => item.warehouse_id)
            .map(item => item.warehouse_id))];

          if (uniqueWarehouses.length > 0) {
            setWarehouses(uniqueWarehouses);
          }
        }

        // Process count history by inventory_item_id
        const history = {};
        data.forEach(count => {
          if (count.inventory_item_id) {
            if (!history[count.inventory_item_id]) {
              history[count.inventory_item_id] = [];
            }
            history[count.inventory_item_id].push(count);
          }
        });

        // Sort each item's history by date
        Object.keys(history).forEach(itemId => {
          history[itemId].sort((a, b) => {
            // Sort by date if available, otherwise by time_period
            if (a.date_created && b.date_created) {
              return new Date(b.date_created) - new Date(a.date_created);
            }
            return 0;
          });
        });

        setCountHistory(history);
        setPcounts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cyclic counts:", err);
        setError(`Failed to load cyclic counts: ${err.message}`);
        setLoading(false);
      });
  }, []);

  const filterByDateRange = (data, range) => {
    return data.filter((item) => {
      const period = item.time_period?.toLowerCase();
      if (!period) return false;
      switch (range) {
        case "Last 24 Hours":
          return period === "daily";
        case "Last Week":
          return period === "weekly";
        case "Last 30 Days":
          return period === "monthly";
        case "Last 6 Months":
          return period === "quarterly" || period === "biannually" || period === "yearly";
        default:
          return true;
      }
    });
  };

  const filteredData = pcounts.filter((item) => {
    const statusMatch = selectedStatus
      ? item.status?.toLowerCase() === selectedStatus.toLowerCase()
      : true;
    const dateMatch = selectedDate ? filterByDateRange([item], selectedDate).length > 0 : true;
    const warehouseMatch = selectedWarehouse
      ? item.warehouse_id === selectedWarehouse
      : true;
    return statusMatch && dateMatch && warehouseMatch;
  });

  const getStatusDisplayValue = (backendStatus) => {
    if (!backendStatus) return "Unknown";

    const statusMap = {
      'Completed': 'Completed',
      'In Progress': 'In Progress',
      'Open': 'Open',
      'Closed': 'Closed'
    };
    return statusMap[backendStatus] || backendStatus;
  };

  const getStatusColorClass = (status) => {
    if (!status) return 'text-gray-600';
    switch (status) {
      case 'Completed':
        return 'text-green-600';
      case 'In Progress':
        return 'text-yellow-600';
      case 'Open':
        return 'text-blue-600';
      case 'Closed':
        return 'text-gray-800';
      default:
        return 'text-gray-600';
    }
  };

  const getDifferenceColorClass = (diff) => {
    if (diff === 0) return 'text-gray-600';
    return diff < 0 ? 'text-red-600' : 'text-green-600';
  };

  // Simple history representation without charts
  const renderCountHistory = (itemId) => {
    if (!itemId || !countHistory[itemId]) return null;

    // Get up to the last 5 counts for this item
    const history = countHistory[itemId].slice(0, 5);

    if (history.length <= 1) return null;

    return (
      <div className="mt-2">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-1 py-1">Date</th>
              <th className="border px-1 py-1">Onhand</th>
              <th className="border px-1 py-1">Counted</th>
              <th className="border px-1 py-1">Diff</th>
            </tr>
          </thead>
          <tbody>
            {history.map((count, index) => (
              <tr key={index} className="border-b">
                <td className="border px-1 py-1">{count.time_period || "N/A"}</td>
                <td className="border px-1 py-1">{count.item_onhand || 0}</td>
                <td className="border px-1 py-1">{count.item_actually_counted || 0}</td>
                <td className={`border px-1 py-1 ${getDifferenceColorClass(count.difference_in_qty)}`}>
                  {count.difference_in_qty || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="inv">
      <div className="pcounts">
        <div className="body-content-container">
          <div className="flex w-full h-full flex-col min-h-screen p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Physical Counts</h2>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="flex w-full h-full space-x-4 py-7">
              <div className="pcounts-table-container flex-2 border border-gray-300 rounded-lg scroll-container overflow-y-auto min-h-40 p-3">
                <table className="w-full table-layout:fixed text-center cursor-pointer">
                  <thead>
                    <tr className="border-b border-gray-300">
                      {['Item Type', 'Item ID', 'Item Onhand', 'Item Counted', 'Difference', 'Date Checked', 'Employee', 'Warehouse', 'Status'].map((header) => (
                        <th key={header} className="p-2 text-gray-600">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="9" className="p-2 text-gray-400">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="p-2 text-gray-400">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item, index) => {
                      
                        const inventoryItem = item.inventory_item_id ? inventoryItems[item.inventory_item_id] : null;
                        return (
                          <tr
                            key={index}
                            className="border-b border-gray-300 hover:bg-gray-100"
                            onClick={() => setSelectedRow(item)}
                          >
                            <td className="p-2">{item.item_type || "Unknown"}</td> 
                            <td className="p-2">{item.inventory_item_id || item.item_id || "N/A"}</td>
                            <td className="p-2">{item.item_onhand ?? "-"}</td>
                            <td className="p-2">{item.item_actually_counted ?? "-"}</td>
                            <td className={`p-2 ${getDifferenceColorClass(item.difference_in_qty)}`}>
                              {item.difference_in_qty ?? "-"}
                            </td>
                            <td className="p-2">{item.time_period || "-"}</td>
                            <td className="p-2">{item.employee || "Unassigned"}</td>
                            <td className="p-2">{item.warehouse_id || "-"}</td>
                            <td className={`p-2 ${getStatusColorClass(item.status)}`}>
                              {getStatusDisplayValue(item.status)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-rows-4 gap-3 justify-between h-full">
                <div className="self-center text-sm text-gray-500">
                  {formatUTCTime(currentTime)}
                </div>

                {/* Warehouse filter dropdown */}
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 cursor-pointer"
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>

                <select
                  className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 cursor-pointer"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  {["Completed", "In Progress", "Open", "Closed"].map((s) => (
                    <option key={s} value={s}>
                      {getStatusDisplayValue(s)}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 cursor-pointer"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="">Select Date</option>
                  {["Last 24 Hours", "Last Week", "Last 30 Days", "Last 6 Months"].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <h3 className="text-gray-600 font-semibold">P-Count Details</h3>

                {selectedRow ? (
                  <div className="w-60 border border-gray-300 rounded-lg p-3 h-96 overflow-y-auto">
                    {/* Get inventory item details if available */}
                    {(() => {
                      const inventoryItem = selectedRow.inventory_item_id ? inventoryItems[selectedRow.inventory_item_id] : null;

                      return (
                        <>
                          <div className="mb-4">
                          <h4 className="text-cyan-600 text-sm font-semibold">Selected Item</h4>
                          <div className="flex items-center">
                            <p className="text-gray-500 text-sm">{selectedRow?.inventory_item_id || selectedRow?.item_id || "N/A"}</p>
                          </div>
                          {inventoryItem && (
                            <p className="text-gray-500 text-sm">
                              {inventoryItem.item_type ? `Type: ${inventoryItem.item_type}` : ""}
                            </p>
                          )}
                          
                        </div> 

                          <div className="mb-4">
                            <h4 className="text-cyan-600 text-sm font-semibold">Count Information</h4>
                            <p className="text-gray-500 text-sm">Onhand: {selectedRow?.item_onhand ?? "-"}</p>
                            <p className="text-gray-500 text-sm">Counted: {selectedRow?.item_actually_counted ?? "-"}</p>
                            <p className={`text-sm ${getDifferenceColorClass(selectedRow?.difference_in_qty)}`}>
                              Difference: {selectedRow?.difference_in_qty ?? "-"}
                            </p>
                          </div>

                          {inventoryItem && (
                            <div className="mb-4">
                              <h4 className="text-cyan-600 text-sm font-semibold">Inventory Details</h4>
                              <p className="text-gray-500 text-sm">Type: {inventoryItem.item_type || "N/A"}</p>
                              <p className="text-gray-500 text-sm">Quantity: {inventoryItem.current_quantity || 0}</p>
                              {inventoryItem.expiry && (
                                <p className={`text-sm ${new Date(inventoryItem.expiry) < new Date() ? 'text-red-500' : 'text-gray-500'}`}>
                                  Expiry: {formatDate(inventoryItem.expiry)}
                                </p>
                              )}
                              {inventoryItem.shelf_life && (
                                <p className="text-gray-500 text-sm">Shelf Life: {inventoryItem.shelf_life}</p>
                              )}
                              {inventoryItem.serial_id && (
                                <p className="text-gray-500 text-sm">Serial ID: {inventoryItem.serial_id}</p>
                              )}
                              {inventoryItem.last_update && (
                                <p className="text-gray-500 text-sm">Last Update: {formatDate(inventoryItem.last_update)}</p>
                              )}
                            </div>
                          )}

                          <div className="mb-4">
                            <h4 className="text-cyan-600 text-sm font-semibold">Location & Personnel</h4>
                            <p className="text-gray-500 text-sm">Employee: {selectedRow?.employee || "Unassigned"}</p>
                            <p className="text-gray-500 text-sm">Warehouse: {selectedRow?.warehouse_id || "-"}</p>
                            <p className="text-gray-500 text-sm">Time Period: {selectedRow?.time_period || "-"}</p>
                          </div>

                          {selectedRow.inventory_item_id && (
                            <div className="mb-4">
                              <h4 className="text-cyan-600 text-sm font-semibold">Count History</h4>
                              {renderCountHistory(selectedRow.inventory_item_id)}
                            </div>
                          )}

                          {selectedRow?.remarks && (
                            <div className="mb-4">
                              <h4 className="text-cyan-600 text-sm font-semibold">Remarks</h4>
                              <p className="text-gray-500 text-sm">{selectedRow.remarks}</p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="w-60 border border-gray-300 rounded-lg p-3">
                    <p className="text-gray-500 text-sm">Select a row to view details</p>
                  </div>
                )}

                <button
                  className="w-full bg-cyan-600 text-white rounded-lg p-2 hover:bg-cyan-700"
                  onClick={() => setShowInvPcountForm(true)}
                >
                  Add P-counts
                </button>

                <button
                  className="w-full bg-cyan-600 text-white rounded-lg p-2 hover:bg-cyan-700"
                  onClick={() => setShowDiscrepancyForm(true)}
                >
                  Report a Discrepancy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showInvPcountForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <InvPcountForm
              onClose={() => setShowInvPcountForm(false)}
              selectedItem={selectedRow}
              warehouses={warehouses}
              inventoryItems={inventoryItems}
            />
          </div>
        </div>
      )}

      {showDiscrepancyForm && (
        <DiscrepancyReportForm
          onClose={() => setShowDiscrepancyForm(false)}
          selectedItem={selectedRow}
          inventoryItems={inventoryItems}
        />
      )}
    </div>
  );
};

export default BodyContent;
