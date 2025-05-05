import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ReworkCost.css";

const BodyContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productionData, setProductionData] = useState([]);
  const [reworkCostData, setReworkCostData] = useState([]); // State for rework_cost data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Fetch production data from the backend
  useEffect(() => {
    const fetchProductionData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/api/cost-of-production/");
        setProductionData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch production data.");
        setLoading(false);
      }
    };

    const fetchReworkCostData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/rework-cost/");
        setReworkCostData(response.data);
      } catch (err) {
        console.error("Failed to fetch rework cost data.");
      }
    };

    fetchProductionData();
    fetchReworkCostData();
  }, []);

  // Filter data based on search query
  const filteredData = productionData.filter((item) => {
    const search = searchQuery.toLowerCase();
    return (
      (item.production_order_id && item.production_order_id.toLowerCase().includes(search)) ||
      (item.actual_quantity && item.actual_quantity.toString().includes(search)) ||
      (item.cost_of_production && item.cost_of_production.toString().includes(search)) ||
      (item.miscellaneous_costs && item.miscellaneous_costs.toString().includes(search)) ||
      (typeof item.rework_required === "boolean" &&
        (item.rework_required ? "yes" : "no").includes(search)) ||
      (item.rework_notes && item.rework_notes.toLowerCase().includes(search))
    );
  });

  return (
    <div className="rwprod">
      <div className="rwprodcolumn">
        <div className="rw-expanded">
          <div className="rwprodheader-section">
            <h1>Rework Cost</h1>
            <div className="costprodbutton-group">
              <div className="cpsearch-wrapper">
                <img src="/icons/search-icon.png" alt="Search" className="search-icon" />
                <input
                  type="text"
                  className="cpsearch-bar"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          <div className="rwprotable">
            <table>
              <thead>
                <tr>
                <th>Production Order ID</th>
                  <th>Project Name</th>
                  <th>Actual Quantity</th>
                  <th>Additional Cost</th>
                  <th>Additional Miscellaneous Cost</th>
                  <th>Total Rework Cost</th>
                  <th>Rework Required</th>
                  <th>Rework Notes</th>

                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6">{error}</td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => {
                    console.log(item); // Log the entire item object
                    return (
                      <tr key={index}>
                        
                        <td><h1>{item.production_order_id}</h1></td>
                        <td></td>
                        <td>{item.actual_quantity}</td>
                        <td><input type="text" defaultValue={item.additional_cost} /></td>
                        <td><input type="text" defaultValue={item.additional_misc} /></td>
                        <td><input type="text" defaultValue={item.total_rework_cost} /></td>
                        <td>{item.rework_required ? "Yes" : "No"}</td>
                        <td>{item.rework_notes}</td>
                      </tr>
                    );
                  }))};
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyContent;
