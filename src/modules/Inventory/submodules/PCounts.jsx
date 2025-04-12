import React, { useEffect, useState } from "react";
import "../styles/PCounts.css";
import InvPcountForm from "../components/InvPcountForm";

const BodyContent = () => {

  const [pcounts, setPcounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  const [showInvPcountForm, setShowInvPcountForm] = useState(false);
  const [warehouses, setWarehouses] = useState([]);

  // Fetch warehouses list from API
  useEffect(() => {
    // Fetch warehouses first
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
        // Don't set error state here, as we'll continue with cyclic counts
      });
  }, []);

  // Fetch cyclic counts
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/cyclic_counts/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Response Data:", data);
        
        // If warehouses weren't fetched separately, extract them from counts
        if (warehouses.length === 0) {
          const uniqueWarehouses = [...new Set(data
            .filter(item => item.warehouse_id)
            .map(item => item.warehouse_id))];
          
          if (uniqueWarehouses.length > 0) {
            setWarehouses(uniqueWarehouses);
          }
        }
        
        setPcounts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cyclic counts:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [warehouses.length]);

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
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="inv">
      <div className="pcounts">
        <div className="body-content-container">
          <div className="flex w-full h-full flex-col min-h-screen p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Physical Counts</h2>
              {/* Debug toggle can be added here if needed */}

  
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong>Error:</strong> {error}
              </div>
            )}

            {debugMode && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                <strong>Debug Info:</strong>
                <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(pcounts, null, 2)}</pre>
              </div>
            )}

            <div className="flex w-full h-full space-x-4 py-7">
              <div className="pcounts-table-container flex-2 border border-gray-300 rounded-lg scroll-container overflow-y-auto min-h-40 p-3">
                <table className="w-full table-layout:fixed text-center cursor-pointer">
                  <thead>
                    <tr className="border-b border-gray-300">
                      {['Product Name', 'Item Onhand', 'Item Counted' ,'Difference', 'Date Checked', 'Employee', 'Warehouse', 'Status'].map((header) => (
                        <th key={header} className="p-2 text-gray-600">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="p-2 text-gray-400">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-2 text-gray-400">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-300 hover:bg-gray-100"
                          onClick={() => setSelectedRow(item)}
                        >
                          <td className="p-2">{item.product_name || "No Inventory Item"}</td>
                          <td className="p-2">{item.item_onhand ?? "-"}</td>
                          <td className="p-2">{item.item_actually_counted ?? "-"}</td>
                          <td className="p-2">{item.difference_in_qty ?? "-"}</td>
                          <td className="p-2">{item.time_period || "-"}</td>
                          <td className="p-2">{item.employee || "Unassigned"}</td>
                          <td className="p-2">{item.warehouse_id || "-"}</td>
                          <td className={`p-2 ${getStatusColorClass(item.status)}`}>
                            {getStatusDisplayValue(item.status)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-rows-4 gap-3 justify-between h-full">
                <div className="self-center text-sm text-gray-500">00 - 00 - 0000 / 00:00 UTC</div>

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
                <div className="w-60 border border-gray-300 rounded-lg p-3">
                  {selectedRow ? (
                    <>
                      {[
                        { label: "Selected Product", value: selectedRow?.product_name || "N/A" },
                        { label: "Total Quantity Checked", value: selectedRow?.item_actually_counted ?? "-" },
                        { label: "Employee", value: selectedRow?.employee || "Unassigned" },
                        { label: "Warehouse", value: selectedRow?.warehouse_id || "-" },
                        { label: "Date Checked", value: selectedRow?.time_period || "-" }
                      ].map(({ label, value }) => (
                        <div key={label} className="mb-2">
                          <h4 className="text-cyan-600 text-sm font-semibold">{label}</h4>
                          <p className="text-gray-500 text-sm">{value}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">Select a row to view details</p>
                  )}
                </div>

                <button
                  className="w-full bg-cyan-600 text-white rounded-lg p-2 hover:bg-cyan-700"
                  onClick={() => setShowInvPcountForm(true)}
                >
                  Add P-counts
                </button>

                <button className="w-full bg-cyan-600 text-white rounded-lg p-2 hover:bg-cyan-700">
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
              activeTab="Raw Materials"
              warehouses={warehouses}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyContent;
