import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import '../styles/ItemRemovalRequisition.css';


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

      if (!selectedData) {
          toast.error("Please select a record to update.");
          return;
      }
      if (selectedData.deprecation_status !== 'Pending') {
        toast.error("Only records with status 'Pending' can be sent to Management.");
        return;
      }
      const updatePayload = {
        external_id: selectedData.report_id,
        status: "pending"
      }
      console.log(updatePayload)
      try {
          const response = await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/send-to-management/`, {
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
          toast.error("Error: Unable to send to management.", error);
      }
    };

    useEffect(() => {
        const filteredData = activeTab === "All"
            ? asset_removal_data
            : asset_removal_data.filter(row => row.status === activeTab);
    }, [activeTab, asset_removal_data]);


    const fetchData = async () => {
      try {
          setLoading(true);
          setError(null); // Reset error state
 
          const response = await fetch("https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/item-removal/");
          if (!response.ok) throw new Error("Connection to database failed");
 
          const data = await response.json();
          if (!Array.isArray(data)) throw new Error("Invalid goods data format");
 
          setTableData(data);
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
      fetchData();
  }, []);


  const filteredData = activeTab === "All" ? asset_removal_data : asset_removal_data.filter(row => row.deprecation_status === activeTab);

  return (
    <div className="ItemRemoval">
     <ToastContainer />
      <div className="body-content-container">
        
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'All' ? 'active' : ''}`}
              onClick={() => setActiveTab('All')}
            >
              All
            </button>
            <button
              className={`tab ${activeTab === 'Approved' ? 'active' : ''}`}
              onClick={() => setActiveTab('Approved')}
            >
              Approved
            </button>
            <button
              className={`tab ${activeTab === 'Pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('Pending')}
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
                    <tr key={row.report_id}>
                        <td>
                      
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={selectedRow === index}
                          onChange={() => handleCheckboxChange(index, row)}
                        />
                        </td>
                        <td>{row.report_id}</td>
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


