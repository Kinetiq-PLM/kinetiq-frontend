import React, { useState, useEffect } from 'react';
import '../styles/ItemRemoval.css';


const ItemRemoval = () => {
  const [activeTab, setActiveTab] = useState("All");
    const tabs = ["All", "Approved", "Pending", "Rejected"];
    const [tabIndicatorStyle, setTabIndicatorStyle] = useState({});
   
    const [asset_removal_data, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const tableHeaders = ["", "Deprecation ID", "Item No", "Item Name", "Date", "Status"];

    const items = [
      { id: 'D001', itemNo: 'IT1001', itemName: 'Laptop', date: '03/20/25', status: 'Approved' },
      { id: 'D002', itemNo: 'IT1002', itemName: 'Printer', date: '03/21/25', status: 'Pending' },
      { id: 'D003', itemNo: 'IT1003', itemName: 'Monitor', date: '03/22/25', status: 'Approved' },
    ];
  
    const handleCheckboxChange = (index, row) => {
        setSelectedRow(index);
        setSelectedData(row);
    };

    const handleSentButton = async () => {
      console.log("External ID:", selectedData.external_id);




      if (!selectedData) {
          alert("Please select a record to update.");
          return;
      }
      if (selectedData.deprecation_status !== 'Pending') {
        alert("Only records with status 'Pending' can be sent to management.");
        return;
      }
      const updatePayload = {
          external_id: selectedData.external_id
      }


      console.log("Sending payload:", updatePayload);


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
      } catch (error) {
          console.error("Update error:", error);
          alert("Error updating approval status.");
      }
    };

    useEffect(() => {
        const filteredData = activeTab === "All"
            ? asset_removal_data
            : asset_removal_data.filter(row => row.status === activeTab);
        console.log("Filtered Data after tab change:", filteredData);
    }, [activeTab, asset_removal_data]);


    const fetchData = async () => {
      try {
          setLoading(true);
          setError(null); // Reset error state
 
          const response = await fetch("http://127.0.0.1:8000/operation/item-removal/");
          if (!response.ok) throw new Error("Connection to database failed");
 
          const data = await response.json();
          if (!Array.isArray(data)) throw new Error("Invalid goods data format");
 
          setTableData(data);
          if (data.length > 0){
              setSelectedRow(0);
              setSelectedData(data[0]);
          }
          console.log(data)
      } catch (error) {
          if (error.name !== "AbortError") setError(error.message);
      } finally {
          setLoading(false);
      }
  };
 
  useEffect(() => {
      fetchData();
  }, []);


  const filteredData = activeTab === "All" ? asset_removal_data : asset_removal_data.filter(row => row.deprecation_status === activeTab);

  return (
    <div className="ItemRemoval">
     
      <div className="body-content-container">
        
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => setActiveTab('approved')}
            >
              Approved
            </button>
            <button
              className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
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
                    <td colSpan="7" className="text-center">Loading...</td>
                  </tr>
                ) : filteredData.length > 0 ? (
                    filteredData.map((row, index) => (
                    <tr key={row.external_id}>
                        <td>
                        <input type="checkbox"  checked={selectedRow === index} onChange={() => handleCheckboxChange(index, row)}/>
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
          <button onClick={handleSentButton}>Send To</button>
        </div>
      </div>
    </div>
  );
};


export default ItemRemoval;


