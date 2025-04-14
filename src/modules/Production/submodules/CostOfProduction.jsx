<<<<<<< HEAD
import React, { useState } from "react";
=======
import React, { useState, useEffect } from "react";
import axios from "axios";
>>>>>>> 39a3d91 (updated code with database)
import "../styles/CostOfProduction.css";

const BodyContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
<<<<<<< HEAD
  const [activeTable, setActiveTable] = useState("costProduction");
=======
  const [productionData, setProductionData] = useState([]);
  const [reworkCostData, setReworkCostData] = useState([]); // State for rework_cost data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
>>>>>>> 39a3d91 (updated code with database)

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

<<<<<<< HEAD

  const productionData = Array(7).fill().map((_, index) => ({
    id: `PO00${index + 1}`,
    actualQuantity: 10,
    costProduction: "1,500.00",
    miscCost: "50.00",
    reworkRequired: "null",
    reworkNotes: "null",
  }));
=======
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
>>>>>>> 39a3d91 (updated code with database)

  return (
    <div className="costprod">
      <div className="costprodcolumns">
        <div className="column-expanded">
          <div className="costprodheader-section">
            <h1>Cost of Production & Rework Cost</h1>
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
<<<<<<< HEAD

=======
>>>>>>> 39a3d91 (updated code with database)
              </div>
            </div>
          </div>

          <div className="costprotable">
            <table>
              <thead>
                <tr>
                  <th>Production Order ID</th>
                  <th>Actual Quantity</th>
                  <th>Cost of Production</th>
                  <th>Miscellaneous Cost</th>
                  <th>Rework Required</th>
                  <th>Rework Notes</th>
                </tr>
              </thead>
              <tbody>
<<<<<<< HEAD
                {productionData.map((item, index) => (
                  <tr key={index}>
                    <td><h1>{item.id}</h1></td>
                    <td>{item.actualQuantity}</td>
                    <td>{item.costProduction}</td>
                    <td>{item.miscCost}</td>
                    <td>{item.reworkRequired}</td>
                    <td>{item.reworkNotes}</td>
                  </tr>
                ))}
=======
                {loading ? (
                  <tr>
                    <td colSpan="6">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6">{error}</td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td><h1>{item.production_order_id}</h1></td>
                      <td>{item.actual_quantity}</td>
                      <td>{item.cost_of_production}</td>
                      <td>{item.miscellaneous_costs}</td>
                      <td>{item.rework_required ? "Yes" : "No"}</td>
                      <td>{item.rework_notes}</td>
                    </tr>
                  ))
                )}
>>>>>>> 39a3d91 (updated code with database)
              </tbody>
            </table>
          </div>
        </div>

        <div className="rework-cost-container">
          <div className="rework-header">Additional Cost </div>
          <div className="rework-cost">
            <table className="rework-cost-table">
              <thead>
                <tr>
                  <th>Production Order ID</th>
                  <th>Additional Cost</th>
                  <th>Additional Miscellaneous Cost</th>
                  <th>Total Rework Cost</th>
                </tr>
              </thead>
              <tbody>
<<<<<<< HEAD
                {productionData.map((item, index) => (
                  <tr key={index}>
                    <td><h1>{item.id}</h1></td>
                    <td><input type="text" defaultValue={item.costProduction} /></td>
                    <td><input type="text" defaultValue={item.miscCost} /></td>
                    <td>
                      <input
                        type="text"
                        defaultValue={(parseFloat(item.costProduction.replace(/,/g, "")) + parseFloat(item.miscCost)).toFixed(2)}
=======
                {reworkCostData.map((item, index) => (
                  <tr key={index}>
                    <td><h1>{item.production_order_id}</h1></td>
                    <td><input type="text" defaultValue={item.additional_cost} /></td>
                    <td><input type="text" defaultValue={item.additional_misc} /></td>
                    <td>
                      <input
                        type="text"
                        defaultValue={item.total_rework_cost}
>>>>>>> 39a3d91 (updated code with database)
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
<<<<<<< HEAD

=======
>>>>>>> 39a3d91 (updated code with database)
      </div>
    </div>
  );
};

export default BodyContent;
<<<<<<< HEAD
=======

>>>>>>> 39a3d91 (updated code with database)
