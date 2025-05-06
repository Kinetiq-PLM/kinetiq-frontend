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
  const [inventoryItems, setInventoryItems] = useState({}); // Keep this for extra details if needed
  const [countHistory, setCountHistory] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  // New state variables for the remarks modal
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [remarksInput, setRemarksInput] = useState("");

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
    const fetchWarehouses = async () => {
      try {
        // Use localhost base API URL
        const res = await fetch("http://127.0.0.1:8000/api/warehouse-list/");
        if (!res.ok) {
          throw new Error(`HTTP error fetching warehouses! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Warehouse data:", data);
        if (data && Array.isArray(data) && data.length > 0) {
          setWarehouses(data);
          console.log("Updated warehouses state:", data);
        } else {
          console.warn("No warehouse data received");
        }
      } catch (err) {
        console.error("Error fetching warehouses:", err);
        setError(`Failed to load warehouses: ${err.message}`);
      }
    };

    // Keep this fetch if you need extra item details (expiry, etc.) in the sidebar
    const fetchInventoryItems = async () => {
      try {
        // Use localhost base API URL
        const res = await fetch("http://127.0.0.1:8000/api/inventory-items/");
        if (!res.ok) {
          throw new Error(`HTTP error fetching inventory items! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Inventory Items API Response:", data);
        const itemsMap = {};
        data.forEach(item => {
          // Use the ID that the CyclicCount uses to link (likely inventory_item_id)
          if (item && item.inventory_item_id) {
            itemsMap[item.inventory_item_id] = item;
          } else {
            console.warn("Skipping invalid inventory item:", item);
          }
        });
        setInventoryItems(itemsMap);
      } catch (err) {
        console.error("Error fetching inventory items:", err);
      }
    };

    const fetchCyclicCounts = async () => {
      try {
        // Use localhost base API URL
        const res = await fetch("http://127.0.0.1:8000/api/cyclic_counts/");
        if (!res.ok) {
          throw new Error(`HTTP error fetching cyclic counts! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Cyclic Counts API Response:", data);

        // History calculation based on inventory_item_id (read-only) might need adjustment if primary key changes
        // Or perhaps base history on the display name if that's more consistent? Revisit if needed.
        const history = {};
        data.forEach(count => {
          // Assuming you still get inventory_item_id from the backend for history grouping
          // We need the ID for grouping, even if we display the name. Let's use the ID we get back.
          // Check the actual API response to confirm the ID field name (e.g., inventory_item_id or inventory_item_id_display)
          const historyKey = count.inventory_item_id; // Use the actual FK ID if available
          if (historyKey) {
            if (!history[historyKey]) {
              history[historyKey] = [];
            }
            history[historyKey].push(count);
          }
        });

        Object.keys(history).forEach(itemId => {
          history[itemId].sort((a, b) => {
            // Sorting logic might need update if date field name changes
            if (a.date_created && b.date_created) { // Check if backend provides date_created
              return new Date(b.date_created) - new Date(a.date_created);
            }
            return 0;
          });
        });

        setCountHistory(history);
        setPcounts(data);
      } catch (err) {
        console.error("Error fetching cyclic counts:", err);
        setError(`Failed to load cyclic counts: ${err.message}`);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      await fetchWarehouses();
      // Fetch inventory items might run concurrently or after counts depending on needs
      await Promise.all([fetchInventoryItems(), fetchCyclicCounts()]);
      setLoading(false);
      console.log("Final warehouses state after all fetches:", warehouses);
    };

    fetchData();

    // Clock timer
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId); // Cleanup timer on unmount
  }, []);


  // Updated function to open the remarks modal instead of using prompt
  const updateCountStatus = (newStatus) => {
    if (!selectedRow || !selectedRow.inventory_count_id) return;

    // Set up the modal with initial values
    setPendingStatusChange(newStatus);
    setRemarksInput(selectedRow.remarks || "");
    setShowRemarksModal(true);
  };

  // New function to handle the actual status update after the modal is confirmed
  const confirmStatusUpdate = () => {
    if (!pendingStatusChange || !selectedRow) return;

    // Use localhost base API URL
    fetch(`http://127.0.0.1:8000/api/cyclic_counts/${selectedRow.inventory_count_id}/status/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: pendingStatusChange,
        remarks: remarksInput
      }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || `Status change failed: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(data => {
        // Update the selected row and the pcounts array
        setSelectedRow(data);
        setPcounts(pcounts.map(item =>
          item.inventory_count_id === data.inventory_count_id ? data : item
        ));

        // Close modal and reset
        setShowRemarksModal(false);
        setPendingStatusChange(null);
        setRemarksInput("");
      })
      .catch(error => {
        setError(error.message);
        setShowRemarksModal(false);
      });
  };

  // Add this function to get valid next statuses
  const getValidNextStatuses = (currentStatus) => {
    const transitions = {
      'Open': ['In Progress', 'Cancelled'],
      'In Progress': ['Completed', 'Cancelled'],
      'Completed': ['Closed', 'In Progress'],
      'Closed': [],
      'Cancelled': []
    };
    return transitions[currentStatus] || [];
  };

  // Filter logic using time_period might need update if date field changes
  const filterByDateRange = (data, range) => {
    return data.filter((item) => {
      const period = item.time_period?.toLowerCase();
      if (!period) return false;
      switch (range) {
        case "Last 24 Hours":
          return period === "daily"; // Assuming daily exists
        case "Last Week":
          return period === "weekly";
        case "Last 30 Days":
          return period === "monthly";
        case "Last 6 Months":
          // Adjust based on available periods
          return period === "quarterly" || period === "biannually" || period === "yearly";
        default:
          return true;
      }
    });
  };

  // Make sure the filtering logic uses the correct warehouse ID field if available
  const filteredData = pcounts.filter((item) => {
    const statusMatch = selectedStatus
      ? item.status?.toLowerCase() === selectedStatus.toLowerCase()
      : true;
    const dateMatch = selectedDate ? filterByDateRange([item], selectedDate).length > 0 : true;
    // Compare by warehouse name (item.warehouse_location)
    const warehouseNameForFilter = item.warehouse_location;
    const warehouseMatch = selectedWarehouse
      ? warehouseNameForFilter === selectedWarehouse // Compare names directly
      : true; // If no warehouse is selected, it's a match
    return statusMatch && dateMatch && warehouseMatch;
  });

  const getStatusDisplayValue = (backendStatus) => {
    if (!backendStatus) return "Unknown";
    // Ensure map covers all possible statuses from backend
    const statusMap = {
      'Completed': 'Completed',
      'In Progress': 'In Progress',
      'Open': 'Open',
      'Closed': 'Closed',
      'Cancelled': 'Cancelled'
    };
    return statusMap[backendStatus] || backendStatus;
  };

  const getStatusColorClass = (status) => {
    if (!status) return 'text-gray-600';
    switch (status) {
      case 'Completed': return 'text-green-600';
      case 'In Progress': return 'text-yellow-600';
      case 'Open': return 'text-blue-600';
      case 'Closed': return 'text-gray-800';
      case 'Cancelled': return 'text-red-600'; // Add color for Cancelled
      default: return 'text-gray-600';
    }
  };

  const getDifferenceColorClass = (diff) => {
    // Check if diff is a number before comparison
    if (typeof diff !== 'number') return 'text-gray-600';
    if (diff === 0) return 'text-gray-600';
    return diff > 0 ? 'text-red-600' : 'text-green-600'; // Check logic: Positive diff = shortage?
  };

  // Simple history representation without charts
  const renderCountHistory = (itemId) => {
    // Ensure itemId used here matches the key used in fetchCyclicCounts
    if (!itemId || !countHistory[itemId]) return null;

    const history = countHistory[itemId].slice(0, 5); // Show last 5
    if (history.length <= 1) return null; // Don't show history if only 1 record

    return (
      <div className="mt-2">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-1 py-1">Period</th>
              <th className="border px-1 py-1">Onhand</th>
              <th className="border px-1 py-1">Counted</th>
              <th className="border px-1 py-1">Diff</th>
            </tr>
          </thead>
          <tbody>
            {history.map((count, index) => (
              <tr key={index} className="border-b">
                <td className="border px-1 py-1">{count.time_period || "N/A"}</td>
                <td className="border px-1 py-1">{count.item_onhand ?? "-"}</td>
                <td className="border px-1 py-1">{count.item_actually_counted ?? "-"}</td>
                <td className={`border px-1 py-1 ${getDifferenceColorClass(count.difference_in_qty)}`}>
                  {count.difference_in_qty ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="pcounts">
      <div className="body-content-container ">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex-col w-full h-full py-5">
          {/* filter and time */}
          <div className="flex flex-1 flex-col md:flex-row justify-between max-h-100 space-y-2 ">
            <span className="text-sm self-center text-gray-500 md:order-2">
              {formatUTCTime(currentTime)}
            </span>

            <span className="flex flex-row text-sm space-x-3">
              {/* Warehouse filter dropdown */}
              <select
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 cursor-pointer"
                value={selectedWarehouse} // Value will now be the warehouse name
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                disabled={loading || error}
              >
                <option value="">Select Warehouse</option>
                {loading ? (
                  <option disabled>Loading...</option>
                ) : error ? (
                  <option disabled>Error loading warehouses</option>
                ) : warehouses.length === 0 ? (
                  <option disabled>No warehouses available</option>
                ) : (
                  // Filter out archived warehouses, then sort alphabetically by location name
                  [...warehouses]
                    .filter(w => !(w.warehouse_location && w.warehouse_location.startsWith("ARCHIVED_")))
                    .sort((a, b) => (a.warehouse_location || "").localeCompare(b.warehouse_location || "")).map((w, index) => {
                      console.log("Rendering warehouse option:", w); // Log each option
                      return (
                        <option
                          key={w.warehouse_id || index} // Key remains unique ID
                          value={w.warehouse_location || `Warehouse ${w.warehouse_id}`} // Value is now the name
                          className="text-gray-600 cursor-pointer"
                        >
                          {/* Display the location name */}
                          {w.warehouse_location || `Warehouse ${w.warehouse_id}`}
                        </option>
                      );
                    })
                )}
              </select>

              <select
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 cursor-pointer"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                {/* Include all statuses */}
                {["Open", "In Progress", "Completed", "Closed", "Cancelled"].map((s) => (
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
                <option value="">Select Period</option> {/* Changed label */}
                {/* Adjust options based on available time_period values */}
                {/* Assuming filter logic uses values like 'Daily', 'Weekly' etc. */}
                {["Last 24 Hours", "Last Week", "Last 30 Days", "Last 6 Months"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </span>

            <span className="md:hidden space-y-2">
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
            </span>
          </div>

          <main className="flex flex-row flex-wrap w-full space-x-2 p-2">
            {/* table */}
            <div className="pcounts-table-container flex-2 border border-gray-300 rounded-lg scroll-container overflow-y-auto min-h-30 p-3">
              <table className="w-full table-layout:fixed text-center cursor-pointer">
                <thead>
                  <tr className="border-b border-gray-300">
                    {/* Changed 'Item ID' header to 'Item Name' */}
                    {/* Changed 'Date Checked' header to 'Period' */}
                    {['Item Type', 'Item Name', 'Item Onhand', 'Item Counted', 'Difference', 'Period', 'Employee', 'Warehouse', 'Status'].map((header) => (
                      <td key={header} className="w-[200px] py-2 px-4 font-bold text-gray-600 whitespace-nowrap">{header}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="9" className="p-2 text-gray-400">Loading...</td></tr>
                  ) : filteredData.length === 0 ? (
                    <tr><td colSpan="9" className="p-2 text-gray-400">No data available</td></tr>
                  ) : (
                    filteredData.map((item, index) => {
                      // Fetching inventoryItem locally might still be useful for details not in count record
                      // const inventoryItem = item.inventory_item_id ? inventoryItems[item.inventory_item_id] : null; // Assuming backend sends inventory_item_id
                      return (
                        <tr
                          key={item.inventory_count_id || index} // Use unique ID for key
                          className="border-b border-gray-300 hover:bg-gray-100"
                          onClick={() => setSelectedRow(item)}
                        >
                          <td className="p-2">{item.item_type || "Unknown"}</td>
                          {/* MODIFIED: Use item_display_name */}
                          <td className="p-2">{item.item_display_name || "N/A"}</td>
                          <td className="p-2">{item.item_onhand ?? "-"}</td>
                          <td className="p-2">{item.item_actually_counted ?? "-"}</td>
                          <td className={`p-2 ${getDifferenceColorClass(item.difference_in_qty)}`}>
                            {item.difference_in_qty ?? "-"}
                          </td>
                          <td className="p-2">{item.time_period || "-"}</td>
                          <td className="p-2">{item.employee || "Unassigned"}</td>
                          {/* MODIFIED: Use warehouse_location */}
                          <td className="p-2">{item.warehouse_location || "-"}</td>
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

            {/* side bar */}
            <div className="hidden md:flex flex-col space-y-4">
              <h3 className="text-gray-600 font-semibold">P-Count Details</h3>
              {selectedRow ? (
                <div className="w-50 border border-gray-300 rounded-lg p-3 h-full overflow-y-auto">
                  {/* Get inventory item details if available using local state */}
                  {(() => {
                    // Adjust key if backend sends different ID for mapping
                    // Use the FK ID if backend provides it, for mapping to extra details
                    const inventoryItemKey = selectedRow.inventory_item_id; // Adjust if backend changes FK name
                    const inventoryItem = inventoryItemKey ? inventoryItems[inventoryItemKey] : null;
                    return (
                      <>
                        <div className="mb-4">
                          <h4 className="text-cyan-600 text-sm font-semibold">Selected Item</h4>
                          {/* MODIFIED: Use item_display_name */}
                          <p className="text-gray-500 text-sm">{selectedRow?.item_display_name || "N/A"}</p>
                          {/* Display type directly from count record */}
                          <p className="text-gray-500 text-sm">Type: {selectedRow?.item_type || "Unknown"}</p>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-cyan-600 text-sm font-semibold">Count Information</h4>
                          <p className="text-gray-500 text-sm">Onhand: {selectedRow?.item_onhand ?? "-"}</p>
                          <p className="text-gray-500 text-sm">Counted: {selectedRow?.item_actually_counted ?? "-"}</p>
                          <p className={`text-sm ${getDifferenceColorClass(selectedRow?.difference_in_qty)}`}>
                            Difference: {selectedRow?.difference_in_qty ?? "-"}
                          </p>
                        </div>

                        {/* Show extra details if inventoryItem was fetched and found */}
                        {inventoryItem && (
                          <div className="mb-4">
                            <h4 className="text-cyan-600 text-sm font-semibold">Inventory Details (if available)</h4>
                            <p className="text-gray-500 text-sm">Quantity: {inventoryItem.current_quantity || 0}</p>
                            {inventoryItem.expiry && (
                              <p className={`text-sm ${new Date(inventoryItem.expiry) < new Date() ? 'text-red-500' : 'text-gray-500'}`}>
                                Expiry: {formatDate(inventoryItem.expiry)}
                              </p>
                            )}
                            {inventoryItem.shelf_life && (
                              <p className="text-gray-500 text-sm">Shelf Life: {inventoryItem.shelf_life}</p>
                            )}
                            {/* Assuming serial_id is not present based on previous errors */}
                            {/* {inventoryItem.serial_id && (
                              <p className="text-gray-500 text-sm">Serial ID: {inventoryItem.serial_id}</p>
                            )} */}
                            {/* Display other available fields from InventoryItem */}
                            {inventoryItem.item_no && (
                              <p className="text-gray-500 text-sm">Item No: {inventoryItem.item_no}</p>
                            )}
                            {inventoryItem.last_update && (
                              <p className="text-gray-500 text-sm">Last Update: {formatDate(inventoryItem.last_update)}</p>
                            )}
                          </div>
                        )}

                        <div className="mb-4">
                          <h4 className="text-cyan-600 text-sm font-semibold">Location & Personnel</h4>
                          <p className="text-gray-500 text-sm">Employee: {selectedRow?.employee || "Unassigned"}</p>
                          {/* MODIFIED: Use warehouse_location */}
                          <p className="text-gray-500 text-sm">Warehouse: {selectedRow?.warehouse_location || "-"}</p>
                          <p className="text-gray-500 text-sm">Time Period: {selectedRow?.time_period || "-"}</p>
                        </div>

                        {selectedRow && (
                          <div className="mb-4">
                            <h4 className="text-cyan-600 text-sm font-semibold">Status Management</h4>
                            <p className={`text-sm ${getStatusColorClass(selectedRow.status)}`}>
                              Current Status: {getStatusDisplayValue(selectedRow.status)}
                            </p>
                            {getValidNextStatuses(selectedRow.status).length > 0 && (
                              <div className="mt-2">
                                <p className="text-gray-500 text-xs mb-1">Update Status:</p>
                                <div className="flex flex-wrap gap-1">
                                  {getValidNextStatuses(selectedRow.status).map(status => (
                                    <button
                                      key={status}
                                      onClick={() => updateCountStatus(status)}
                                      className={`text-xs px-2 py-1 rounded ${status === 'Cancelled' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                                        status === 'Completed' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                          status === 'Closed' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' :
                                            'bg-blue-100 text-blue-700 hover:bg-blue-200' // Default/In Progress
                                        }`}
                                    >
                                      {status}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* History rendering based on selected row's ID */}
                        {/* Ensure selectedRow provides the correct ID key for history */}
                        {/* Use the same key used for fetching inventoryItems map */}
                        {inventoryItemKey && (
                          <div className="mb-4">
                            <h4 className="text-cyan-600 text-sm font-semibold">Count History</h4>
                            {renderCountHistory(inventoryItemKey)}
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
                <div className="w-full border border-gray-300 rounded-lg p-3">
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
          </main>
        </div>
      </div>

      {showInvPcountForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <InvPcountForm
              onClose={() => setShowInvPcountForm(false)}
              selectedItem={selectedRow}
              warehouses={warehouses}
              inventoryItems={inventoryItems} // Pass full map for potential use in form
            />
          </div>
        </div>
      )}

      {showDiscrepancyForm && (
        <DiscrepancyReportForm
          onClose={() => setShowDiscrepancyForm(false)}
          selectedItem={selectedRow}
          inventoryItems={inventoryItems} // Pass full map for potential use in form
        />
      )}

      {/* Custom remarks modal */}
      {showRemarksModal && (
        <div className="modal-overlay">
          <div className="modal-content w-96">
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>
            <p className="mb-2">
              Changing status to: <span className={getStatusColorClass(pendingStatusChange)}>{pendingStatusChange}</span>
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Add remarks for this status change (optional):
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
                value={remarksInput}
                onChange={(e) => setRemarksInput(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={() => {
                  setShowRemarksModal(false);
                  setPendingStatusChange(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
                onClick={confirmStatusUpdate}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyContent;