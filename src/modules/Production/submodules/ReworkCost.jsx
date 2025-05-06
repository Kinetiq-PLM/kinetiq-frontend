import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ReworkCost.css";

const BodyContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productionData, setProductionData] = useState([]);
  const [reworkCostData, setReworkCostData] = useState([]);
  const [mergedData, setMergedData] = useState([]); // State for merged data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Fetch production and rework cost data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productionResponse = await axios.get("http://127.0.0.1:8000/api/cost-of-production/");
        const reworkCostResponse = await axios.get("http://127.0.0.1:8000/api/rework-cost/");
        setProductionData(productionResponse.data);
        setReworkCostData(reworkCostResponse.data);

        // Merge production and rework cost data based on production_order_id
        const merged = productionResponse.data.map((prod) => {
          const rework = reworkCostResponse.data.find(
            (rew) => rew.production_order_id === prod.production_order_id
          );
          return {
            ...prod,
            additional_cost: rework ? rework.additional_cost : null,
            additional_misc: rework ? rework.additional_misc : null,
            total_rework_cost: rework ? rework.total_rework_cost : null,
          };
        });

        setMergedData(merged);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on search query
  const filteredData = mergedData.filter((item) => {
    const search = searchQuery.toLowerCase();
    return (
      (item.production_order_id && item.production_order_id.toLowerCase().includes(search)) ||
      (item.actual_quantity && item.actual_quantity.toString().includes(search)) ||
      (item.additional_cost && item.additional_cost.toString().includes(search)) ||
      (item.additional_misc && item.additional_misc.toString().includes(search)) ||
      (item.total_rework_cost && item.total_rework_cost.toString().includes(search)) ||
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
            <div className="rworkbutton-group">
              <div className="rwsearch-wrapper">
                <img src="/icons/search-icon.png" alt="Search" className="search-icon" />
                <input
                  type="text"
                  className="rwsearch-bar"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          <div className="rwprotable">
            <div className="rwprotable-scroll">
            <table>
             <thead>
                <tr>
                  <th>Production Order ID</th>
                  <th>Project Description</th>
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
                    <td colSpan="7">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7">{error}</td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.production_order_id}</td>
                      <td>{item.task_description}</td>
                      <td className="rework-actual-quantity">
                        <input
                          type="text"
                          value={item.actual_quantity || ""}
                          onChange={(e) =>
                            handleActualQuantityChange(item.production_order_id, e.target.value)
                          }
                        />
                      </td>
                      <td className="rework-additional-cost">
                        <input
                          type="text"
                          value={item.additional_cost || ""}
                          onChange={(e) =>
                            handleCostChange(item.production_order_id, e.target.value)
                          }
                        />
                      </td>
                      <td className="rework-additional-misc">
                        <input
                          type="text"
                          value={item.additional_misc || ""}
                          onChange={(e) =>
                            handleCostChange(item.production_order_id, e.target.value)
                          }
                        />
                      </td>
                      <td>{item.total_rework_cost || "N/A"}</td>
                      <td className="rw-rework-required">
                        <select
                          value={item.rework_required ? "Yes" : "No"}
                          onChange={e =>
                            handleReworkRequiredChange(item.production_order_id, e.target.value === "Yes")
                          }
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </td>
                      <td className="rework-notes">
                          <textarea
                              className="rework-notes-textarea"
                              value={item.rework_notes || ""}
                              onChange={(e) => handleFieldChange(order.production_order_id, "rework_notes", e.target.value)}
                          />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyContent;