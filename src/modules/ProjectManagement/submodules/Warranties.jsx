import React, { useState } from "react"; 
import "../styles/Warranties.css";

const BodyContent = () => {
  const [datawarrantymonitor, setDatawarrantymonitor] = useState([
    {
      WarrantyID: "Proj_0122123123",
      ProjectID: "Proj101",
      WarrantyCoverageYr: "1", 
      StartDate: "2023-01-01", 
      EndDate: "2024-01-01", 
    },
    // ... (other warranty objects)
  ]);

  const [selectedReports, setSelectedReports] = useState([]); 

  const handleCheckboxChange = (index) => {
    setSelectedReports((prevSelected) => {
      if (prevSelected.includes(index)) {
        return prevSelected.filter((i) => i !== index); 
      } else {
        return [...prevSelected, index]; 
      }
    });
  };

  const handleDeleteProjects = () => {
    setDatawarrantymonitor((prevData) => 
      prevData.filter((_, index) => !selectedReports.includes(index))
    );
    setSelectedReports([]); // Reset selected reports after deletion
  };

  return (
    <div className="body-content-container">
      <div className="warrantymonitoring">
        <b>Warranties</b>
      </div>
      <button className="delproj" onClick={handleDeleteProjects}>
        <b>Delete Project</b>
      </button>
      <div className="warrantytable">
        <table className="warrantytable1">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th><b>Warranty ID</b></th>
              <th><b>Project ID</b></th>
              <th><b>Warranty Coverage Yr.</b></th>
              <th><b>Start Date</b></th>
              <th><b>End Date</b></th>
            </tr>
          </thead>
          <tbody>
            {datawarrantymonitor.map((item, index) => (
              <tr key={item.WarrantyID}> 
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedReports.includes(index)} 
                    onChange={() => handleCheckboxChange(index)} 
                  />
                </td>
                <td><b>{item.WarrantyID}</b></td>
                <td>{item.ProjectID}</td>
                <td>{item.WarrantyCoverageYr}</td>
                <td>{item.StartDate}</td>                 
                <td>{item.EndDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BodyContent;