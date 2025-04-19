import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CostOfProduction.css";

const BodyContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productionData, setProductionData] = useState([]);
  const [reworkCostData, setReworkCostData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCell, setEditingCell] = useState({ row: null, field: null });
  const [editingReworkCell, setEditingReworkCell] = useState({ row: null, field: null });

  useEffect(() => {
    const fetchProductionData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/cost-of-production/");
        setProductionData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch production data.");
        setLoading(false);
      }
    };

    const fetchReworkCostData = async () => {
      try {
        const response = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/rework-cost/");
        setReworkCostData(response.data);
      } catch (err) {
        console.error("Failed to fetch rework cost data.");
      }
    };

    fetchProductionData();
    fetchReworkCostData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCellClick = (rowIndex, field) => {
    setEditingCell({ row: rowIndex, field });
  };

  const handleReworkCellClick = (rowIndex, field) => {
    setEditingReworkCell({ row: rowIndex, field });
  };

  const handleActualQuantityChange = async (index, value) => {
    const updatedData = productionData.map((item, i) =>
      i === index ? { ...item, actual_quantity: value } : item
    );
    setProductionData(updatedData);
    const prodToUpdate = updatedData[index];
  
    try {
      await axios.put(
        `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/cost-of-production/${prodToUpdate.production_order_id}/`,
        { actual_quantity: value },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Actual quantity updated successfully");
    } catch (error) {
      console.error("Failed to update actual quantity", error);
    }
  };

  const filteredReworkData = reworkCostData.filter((item) => {
  const search = searchQuery.toLowerCase();
  return item.production_order_id && item.production_order_id.toLowerCase().includes(search);
});

const filteredData = productionData.filter((item) => {
  const search = searchQuery.toLowerCase();
  return item.production_order_id && item.production_order_id.toLowerCase().includes(search)
});

  const handleCellChange = (e, productionOrderId, field) => {
    const value = e.target.value;
  
    const updatedData = productionData.map((item) =>
      item.production_order_id === productionOrderId
  ? {...item, [field]: field === "rework_required" ? value === "Yes" : value,
    }
        : item
    );
  
    setProductionData(updatedData);
  };
  
  const handleCellBlur = async () => {
    const { row: productionOrderId, field } = editingCell;
    if (!productionOrderId || !field) return;
  
    const item = productionData.find((item) => item.production_order_id === productionOrderId);
    if (!item) return;
  
    // Convert empty string to null before saving
    const updatedValue = item[field] === "" ? null : item[field];
  
    try {
      await axios.patch(
        `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/cost-of-production/${productionOrderId}/`,
        {
          [field]: updatedValue,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(`${field} updated successfully`);
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  
    setEditingCell({ row: null, field: null });
  };
  
  
  
  const handleReworkCellChange = (e, index, field) => {
    const updatedData = [...reworkCostData];
    updatedData[index] = {
      ...updatedData[index],
      [field]: e.target.value === "" ? null : e.target.value, // Update value or null if empty
    };
    setReworkCostData(updatedData);
  };
  
  const handleReworkCellBlur = async () => {
    const { row, field } = editingReworkCell;
    if (row === null || field === null) return;
  
    const updatedData = [...reworkCostData];
    const itemToUpdate = { ...updatedData[row] };
  
    // Sanitize input values
    itemToUpdate[field] =
      itemToUpdate[field] === "" || itemToUpdate[field] === null
        ? null
        : parseFloat(itemToUpdate[field]);
  
    // Calculate the total_rework_cost
    const cost = parseFloat(itemToUpdate.additional_cost) || 0;
    const misc = parseFloat(itemToUpdate.additional_misc) || 0;
    const total = cost + misc;
  
    itemToUpdate.total_rework_cost = total;
  
    try {
      await axios.patch(
        `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/rework-cost/${itemToUpdate.production_order_id}/`,
        {
          [field]: itemToUpdate[field],
          total_rework_cost: total,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(`${field} and total_rework_cost updated successfully`);
  
      // Update the local state
      updatedData[row] = itemToUpdate;
      setReworkCostData(updatedData);
    } catch (error) {
      console.error(`Failed to update ${field} or total_rework_cost`, error);
    }
  
    setEditingReworkCell({ row: null, field: null });
  };
  
  
  
  return (
    <div className="costprod">
      <div className = "prodcontainer">
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
              </div>
            </div>
          </div>

          <div className="costprotable">
            <table>
              <thead>
                <tr>
                  <th>Production Order ID</th>
                  <th>Actual<br />Quantity</th>
                  <th>Cost of Production</th>
                  <th className="wrap-header">Miscellaneous<br />Cost</th>
                  <th className="wrap-header">Rework<br />Required</th>
                  <th className="wrap-header">Rework<br />Notes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6">Loading...</td></tr>
                ) : error ? (
                  <tr><td colSpan="6">{error}</td></tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td><h1>{item.production_order_id}</h1></td>

                      <td onClick={() => handleCellClick(item.production_order_id, 'actual_quantity')}>
                        {editingCell.row === item.production_order_id && editingCell.field === 'actual_quantity' ? (
                          <input
                          type="text"
                          className="actual-quantity-input"
                          value={item.actual_quantity}
                          onChange={(e) => handleCellChange(e, item.production_order_id, 'actual_quantity')}
                          onBlur={handleCellBlur}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.target.blur(); // triggers onBlur which already saves the value
                            }
                          }}
                          autoFocus
                        />                        
                        ) : (
                          item.actual_quantity
                        )}
                      </td>

                      <td onClick={() => handleCellClick(item.production_order_id, 'cost_of_production')}>
                        {editingCell.row === item.production_order_id && editingCell.field === 'cost_of_production' ? (
                          <input
                          type="text"
                          className="cost-of-production-input"
                          value={item.cost_of_production}
                          onChange={(e) => handleCellChange(e, item.production_order_id, 'cost_of_production')}
                          onBlur={handleCellBlur}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.target.blur(); // triggers onBlur which already saves the value
                            }
                          }}
                          autoFocus
                        />                        
                        ) : (
                          item.cost_of_production
                        )}
                      </td>

                      <td onClick={() => handleCellClick(item.production_order_id, 'miscellaneous_costs')}>
                        {editingCell.row === item.production_order_id && editingCell.field === 'miscellaneous_costs' ? (
                          <input
                          type="text"
                          className="miscellaneous-costs-input"
                          value={item.miscellaneous_costs}
                          onChange={(e) => handleCellChange(e, item.production_order_id, 'miscellaneous_costs')}
                          onBlur={handleCellBlur}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.target.blur(); // triggers onBlur which already saves the value
                            }
                          }}
                          autoFocus
                        />
                        ) : (
                          item.miscellaneous_costs
                        )}
                      </td>

                      <td onClick={() => handleCellClick(item.production_order_id, 'rework_required')}>
                        {editingCell.row === item.production_order_id && editingCell.field === 'rework_required' ? (
                          <select
                          className="rework-required-select"
                          value={item.rework_required ? "Yes" : "No"}
                          onChange={(e) =>
                            handleCellChange(
                              { target: { value: e.target.value } },
                              item.production_order_id,
                              "rework_required"
                            )
                          }
                          onBlur={handleCellBlur}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.target.blur(); // triggers onBlur which already saves the value
                            }
                          }}
                          autoFocus
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        ) : (
                          item.rework_required ? "Yes" : "No"
                        )}
                      </td>

                      <td onClick={() => handleCellClick(item.production_order_id, 'rework_notes')}>
                        {editingCell.row === item.production_order_id && editingCell.field === 'rework_notes' ? (
                          <textarea
                            className="rework-notes-input"
                            value={item.rework_notes === null ? "" : item.rework_notes}
                            onChange={(e) => handleCellChange(e, item.production_order_id, 'rework_notes')}
                            onBlur={handleCellBlur}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault(); // prevent newline on textarea
                                e.target.blur();
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          item.rework_notes === null ? "" : item.rework_notes
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rework-cost-container">
          <div className="costrework-header">Additional Cost</div>
          <div className="costrework-cost">
            <table className="costrework-cost-table">
              <thead>
                <tr>
                  <th>Production Order ID</th>
                  <th>Additional Cost</th>
                  <th>Additional Miscellaneous Cost</th>
                  <th>Total Rework Cost</th>
                </tr>
              </thead>
              <tbody>
                {reworkCostData
                  .filter((item) => {
                    const search = searchQuery.toLowerCase();
                    return item.production_order_id &&
                      item.production_order_id.toLowerCase().includes(search);
                  })
                  .map((item, index) => (
                    <tr key={index}>
                      <td><strong>{item.production_order_id}</strong></td>

                      <td onClick={() => handleReworkCellClick(index, 'additional_cost')}>
                        {editingReworkCell.row === index && editingReworkCell.field === 'additional_cost' ? (
                          <input
                            type="text"
                            value={reworkCostData[index].additional_cost === null ? "" : item.additional_cost}
                            onChange={(e) => handleReworkCellChange(e, index, 'additional_cost')}
                            onBlur={handleReworkCellBlur}  // Triggers when the input loses focus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.target.blur(); // triggers onBlur which already saves the value
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          reworkCostData[index].additional_cost === null ? "N/A" : item.additional_cost
                        )}
                      </td>

                      <td onClick={() => handleReworkCellClick(index, 'additional_misc')}>
                        {editingReworkCell.row === index && editingReworkCell.field === 'additional_misc' ? (
                          <input
                            type="text"
                            value={reworkCostData[index].additional_misc === null ? "" : item.additional_misc}
                            onChange={(e) => handleReworkCellChange(e, index, 'additional_misc')}
                            onBlur={handleReworkCellBlur}  // Triggers when the input loses focus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.target.blur(); // triggers onBlur which already saves the value
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          reworkCostData[index].additional_misc === null ? "N/A" : item.additional_misc
                        )}
                      </td>

                      <td className="value">
                        <strong>
                          {item.total_rework_cost}
                        </strong>
                      </td>
                    </tr>
                  ))}
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
