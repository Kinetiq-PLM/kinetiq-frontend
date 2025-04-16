import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import '../styles/ItemRemoval.css';

const ItemRemoval = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [asset_removal_data, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const handleCheckboxChange = (index, row) => {
    setSelectedRow(index);
    setSelectedData(row);
  };

  const handleSentButton = async () => {
    if (!selectedData) {
      toast.error("Please select a record to update.");
      return;
    }
    if (selectedData.deprecation_status !== 'Pending') {
      toast.error("Only records with status 'Pending' can be sent to Management.");
      return;
    }

    const updatePayload = {
      external_id: selectedData.external_id
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/operation/send-to-management/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) throw new Error("Failed to update record.");
      fetchData();
      toast.success("Record sent to management."); 
    } catch (error) {
      toast.error("Error updating approval status.", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://127.0.0.1:8000/operation/item-removal/");
        if (!response.ok) throw new Error("Connection to database failed");

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid goods data format");

        setTableData(data);
        if (data.length > 0) {
          setSelectedRow(0);
          setSelectedData(data[0]);
        }
      } catch (error) {
        if (error.name !== "AbortError") setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = activeTab === "All"
    ? asset_removal_data
    : asset_removal_data.filter(row => row.deprecation_status === activeTab);

  return (
    <div className="ItemRemoval">
      <ToastContainer />
      <div className="body-content-container">
        <div className="tabs">
          <button className={`tab ${activeTab === 'All' ? 'active' : ''}`} onClick={() => setActiveTab('All')}>All</button>
          <button className={`tab ${activeTab === 'Approved' ? 'active' : ''}`} onClick={() => setActiveTab('Approved')}>Approved</button>
          <button className={`tab ${activeTab === 'Pending' ? 'active' : ''}`} onClick={() => setActiveTab('Pending')}>Pending</button>
        </div>

        <div className="table-itemremoval-container">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Deprecation ID</th>
                <th>Item No.</th>
                <th>Item Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">Loading...</td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr key={row.external_id}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedRow === index}
                        onChange={() => handleCheckboxChange(index, row)}
                      />
                    </td>
                    <td>{row.deprecation_report_id}</td>
                    <td>{row.item_id}</td>
                    <td>{row.item_name}</td>
                    <td>{row.reported_date}</td>
                    <td>{row.deprecation_status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="send-to">
          <button onClick={handleSentButton}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ItemRemoval;
