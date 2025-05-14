import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Labor.css";

// Labor table with backend logic
const LaborTable = ({ searchTerm }) => {
  const [laborData, setLaborData] = useState([]);
  const [employeeMap, setEmployeeMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch labor data
  useEffect(() => {
    const fetchLaborData = async () => {
      try {
        const response = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/labor/");
        setLaborData(response.data);
      } catch (err) {
        setError("Failed to fetch labor data.");
      } finally {
        setLoading(false);
      }
    };
    fetchLaborData();
  }, []);

  // Fetch employee data and create a mapping: employee_id -> full_name
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/employees/");
        const map = {};
        response.data.forEach((emp) => {
          map[emp.employee_id] = `${emp.first_name} ${emp.last_name}`;
        });
        setEmployeeMap(map);
      } catch (err) {
        console.error("Failed to fetch employee data.", err);
      }
    };
    fetchEmployeeData();
  }, []);

  const handleDatesWorkedChange = async (labor_id, value) => {
    const updatedData = laborData.map((item) =>
      item.labor_id === labor_id ? { ...item, date_worked: value } : item
    );
    setLaborData(updatedData);
    try {
      await axios.patch(
        `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/labor/${labor_id}/`,
        { date_worked: value },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Date worked updated successfully");
    } catch (error) {
      console.error("Failed to update date worked", error);
    }
  };

  const handleDaysWorkedChange = async (labor_id, value) => {
    const updatedData = laborData.map((item) =>
      item.labor_id === labor_id ? { ...item, days_worked: value } : item
    );
    setLaborData(updatedData);
    try {
      await axios.patch(
        `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/labor/${labor_id}/`,
        { days_worked: value },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Days worked updated successfully");
    } catch (error) {
      console.error("Failed to update days worked", error);
    }
  };

  const filteredData = laborData
    .filter((labor) => {
      const search = searchTerm.toLowerCase();
      return (
        (labor.labor_id && labor.labor_id.toLowerCase().includes(search)) ||
        (labor.production_order_id && labor.production_order_id.toLowerCase().includes(search)) ||
        (employeeMap[labor.employee_id] &&
          employeeMap[labor.employee_id].toLowerCase().includes(search)) ||
        (labor.date_worked &&
          new Date(labor.date_worked)
            .toISOString()
            .split("T")[0]
            .toLowerCase()
            .includes(search)) ||
        (labor.days_worked && labor.days_worked.toString().includes(search))
      );
    })
    .sort((a, b) => a.production_order_id.localeCompare(b.production_order_id)); // Sort by production_order_id

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="equila-labor-container">
      <table className="equila-labor-table">
        <thead>
          <tr>
            <th>Production Order ID</th>
            <th>Employee Name</th>
            <th>Project Duration</th>
            <th>Days Worked</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((labor) => (
            <tr key={labor.labor_id}>
              <td className="labor-cell order-id">
                <h1>{labor.production_order_id || ""}</h1>
              </td>
              <td className="labor-cell employee-id">
                {/* Replace employee_id with full name */}
                {employeeMap[labor.employee_id] || labor.employee_id || ""}
              </td>
              <td className="labor-cell-date-worked">
                <input
                  type="date"
                  value={
                    labor.date_worked
                      ? new Date(labor.date_worked).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleDatesWorkedChange(labor.labor_id, e.target.value)}
                />
              </td>
              <td className="labor-days-worked">
                <input
                  type="text"
                  value={labor.days_worked}
                  onChange={(e) => handleDaysWorkedChange(labor.labor_id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BodyContent = () => {
  const [searchQuery, setSearchQuery] = useState(""); // For Labor table

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="laborprod">
      <div className="laborprod-header-section">
        <h1>Labor</h1>
      </div>
      <div className="laborprodcolumns">
        <div className="prod-column-expanded">
          <div className="prodtop-section">
            <div className="laborprodsearch-wrapper">
              <img src="/icons/search-icon.png" alt="Search" className="search-icon" />
              <input
                type="text"
                className="laborprodsearch-bar"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="equila-EM-table">
            <LaborTable searchTerm={searchQuery} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyContent;