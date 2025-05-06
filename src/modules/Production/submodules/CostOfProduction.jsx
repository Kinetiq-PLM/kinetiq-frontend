import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CostOfProduction.css";

const BodyContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productionData, setProductionData] = useState([]);
  const [reworkCostData, setReworkCostData] = useState([]); // State for rework_cost data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extraRows, setExtraRows] = useState({});

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

  // Filter data based on search query and sort by production_order_id
  const filteredData = productionData
    .filter((item) => {
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
    })
    .sort((a, b) => a.production_order_id.localeCompare(b.production_order_id)); // Sort by production_order_id

  // When an "Add Row" button is clicked for a given production_order_id,
  // append a blank row (with empty material, quantity, cost)
  const handleAddRow = (production_order_id) => {
    setExtraRows((prev) => ({
      ...prev,
      [production_order_id]: [
        ...(prev[production_order_id] || []),
        { material: "", quantity: "", cost: "" },
      ],
    }));
  };

  // Update an extra row's field; this is used onChange for the new rows
  const handleExtraRowChange = (production_order_id, index, field, value) => {
    const updatedRows = [...(extraRows[production_order_id] || [])];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setExtraRows((prev) => ({ ...prev, [production_order_id]: updatedRows }));
  };

  // Handler for Actual Quantity change
  const handleActualQuantityChange = async (production_order_id, value) => {
    const updatedData = productionData.map((item) =>
      item.production_order_id === production_order_id
        ? { ...item, actual_quantity: value }
        : item
    );
    setProductionData(updatedData);
    const itemToUpdate = updatedData.find(
      (item) => item.production_order_id === production_order_id
    );
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/cost-of-production/${production_order_id}/`,
        itemToUpdate
      );
      console.log("Actual quantity updated successfully");
    } catch (error) {
      console.error("Failed to update actual quantity", error);
    }
  };

  // Handler for Cost of Production change
  const handleCostChange = async (production_order_id, value) => {
    const updatedData = productionData.map((item) =>
      item.production_order_id === production_order_id
        ? { ...item, cost_of_production: value }
        : item
    );
    setProductionData(updatedData);
    const itemToUpdate = updatedData.find(
      (item) => item.production_order_id === production_order_id
    );
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/cost-of-production/${production_order_id}/`,
        itemToUpdate
      );
      console.log("Cost of production updated successfully");
    } catch (error) {
      console.error("Failed to update cost of production", error);
    }
  };

  // Handler for Miscellaneous Costs change
  const handleMiscellaneousCostsChange = async (production_order_id, value) => {
    const updatedData = productionData.map((item) =>
      item.production_order_id === production_order_id
        ? { ...item, miscellaneous_costs: value }
        : item
    );
    setProductionData(updatedData);
    const itemToUpdate = updatedData.find(
      (item) => item.production_order_id === production_order_id
    );
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/cost-of-production/${production_order_id}/`,
        itemToUpdate
      );
      console.log("Miscellaneous costs updated successfully");
    } catch (error) {
      console.error("Failed to update miscellaneous costs", error);
    }
  };

  return (
    <div className="costprod">
      <div className="costprodcolumns">
        <div className="column-expanded">
          <div className="costprodheader-section">
            <h1>Cost of Production</h1>
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

          <div className="costprotable">
            <table>
              <thead>
                <tr>
                  <th>Production Order ID</th>
                  <th>Actual Quantity</th>
                  <th>Cost of Production</th>
                  <th>Miscellaneous Cost</th>
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
                  filteredData.map((item) => (
                    <tr key={item.production_order_id}>
                      <td>
                        <h1>{item.production_order_id}</h1>
                      </td>
                      <td className="actual-quantity">
                        <input
                          type="text"
                          value={item.actual_quantity || ""}
                          onChange={(e) =>
                            handleActualQuantityChange(item.production_order_id, e.target.value)
                          }
                        />
                      </td>
                      <td className="cost-of-production">
                        <input
                          type="text"
                          value={item.cost_of_production || ""}
                          onChange={(e) =>
                            handleCostChange(item.production_order_id, e.target.value)
                          }
                        />
                      </td>
                      <td className="miscellaneous-costs">
                        <input
                          type="text"
                          value={item.miscellaneous_costs || ""}
                          onChange={(e) =>
                            handleMiscellaneousCostsChange(item.production_order_id, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="raw-cost-material">
          <div className="raw-material-header ">Raw Materials </div>
          <div className="raw-material-table">
            {filteredData.map((item) => (
              <div key={item.production_order_id} className="rawmaterial-content">
                <table>
                  <tr>
                    <h1>{item.production_order_id}</h1>
                    <table className="raw-material-details">
                      <thead>
                        <th>Raw Material</th>
                        <th>Quantity</th>
                        <th>Cost</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="text"
                              value="Medical-grade Plastic" // Replace with dynamic value if needed
                              onChange={(e) => console.log(e.target.value)}
                              className="rawmaterial-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value="93" // Replace with dynamic value if needed
                              onChange={(e) => console.log(e.target.value)}
                              className="rawmaterial-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value="5000" // Replace with dynamic value if needed
                              onChange={(e) => console.log(e.target.value)}
                              className="rawmaterial-input"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input
                              type="text"
                              value="LED Light" // Replace with dynamic value if needed
                              onChange={(e) => console.log(e.target.value)}
                              className="rawmaterial-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value="102" // Replace with dynamic value if needed
                              onChange={(e) => console.log(e.target.value)}
                              className="rawmaterial-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value="200" // Replace with dynamic value if needed
                              onChange={(e) => console.log(e.target.value)}
                              className="rawmaterial-input"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input
                              type="text"
                              value="Acrylic" // Replace with dynamic value if needed
                              onChange={(e) => console.log(e.target.value)}
                              className="rawmaterial-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value="93" // Replace with dynamic value if needed
                              onChange={(e) => console.log(e.target.value)}
                              className="rawmaterial-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value="5000" // Replace with dynamic value if needed
                              onChange={(e) => console.log(e.target.value)}
                              className="rawmaterial-input"
                            />
                          </td>
                        </tr>
                        {extraRows[item.production_order_id] &&
                          extraRows[item.production_order_id].map((row, idx) => (
                            <tr key={idx}>
                              <td>
                                <input
                                  type="text"
                                  value={row.material}
                                  onChange={(e) =>
                                    handleExtraRowChange(
                                      item.production_order_id,
                                      idx,
                                      "material",
                                      e.target.value
                                    )
                                  }
                                  className="rawmaterial-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={row.quantity}
                                  onChange={(e) =>
                                    handleExtraRowChange(
                                      item.production_order_id,
                                      idx,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  className="rawmaterial-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={row.cost}
                                  onChange={(e) =>
                                    handleExtraRowChange(
                                      item.production_order_id,
                                      idx,
                                      "cost",
                                      e.target.value
                                    )
                                  }
                                  className="rawmaterial-input"
                                />
                              </td>
                            </tr>
                          ))}
                        <tr>
                          <td colSpan="3" style={{ textAlign: "center" }}>
                            <button
                              onClick={() => handleAddRow(item.production_order_id)}
                              className="add-rowprod-button"
                            >
                              Add Row
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </tr>
                  <tr>
                    <div className="prodtotal-cost">
                      <td>
                        <h3>Total Cost</h3>
                      </td>
                      <td>
                        <input
                          type="totalcostofrawmaterial"
                          value="5000" // Replace with dynamic value if needed
                          onChange={(e) => console.log(e.target.value)}
                          className="totalcostofrawmaterial-input"
                        />
                      </td>
                    </div>
                  </tr>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyContent;