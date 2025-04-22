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
  const [editingReworkCell, setEditingReworkCell] = useState({ id: null, field: null });

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

  const handleReworkCellClick = (productionOrderId, field) => {
    setEditingReworkCell({ id: productionOrderId, field });
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
    return item.production_order_id && item.production_order_id.toLowerCase().includes(search);
  });

  const handleCellChange = (e, productionOrderId, field) => {
    const value = e.target.value;
  
    const updatedData = productionData.map((item) =>
      item.production_order_id === productionOrderId
        ? { ...item, [field]: field === "rework_required" ? value === "Yes" : value }
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
        { [field]: updatedValue },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(`${field} updated successfully`);
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  
    setEditingCell({ row: null, field: null });
  };
  
  const handleReworkCellChange = (e, productionOrderId, field) => {
    const updatedData = reworkCostData.map(item =>
      item.production_order_id === productionOrderId
        ? { ...item, [field]: e.target.value === "" ? null : e.target.value }
        : item
    );
    setReworkCostData(updatedData);
  };
  
  const handleReworkCellBlur = async () => {
    const { id: productionOrderId, field } = editingReworkCell;
    if (!productionOrderId || !field) return;
  
    const itemToUpdate = reworkCostData.find(item => item.production_order_id === productionOrderId);
    if (!itemToUpdate) return;
  
    const cost = parseFloat(itemToUpdate.additional_cost) || 0;
    const misc = parseFloat(itemToUpdate.additional_misc) || 0;
    const total = cost + misc;
  
    try {
      await axios.patch(
        `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/rework-cost/${productionOrderId}/`,
        { [field]: itemToUpdate[field], total_rework_cost: total },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(`${field} and total_rework_cost updated successfully`);
    } catch (error) {
      console.error(`Failed to update ${field} or total_rework_cost`, error);
    }
  
    setEditingReworkCell({ id: null, field: null });
  };
  
  return (
    <div className="costprod">
      <div className="prodcontainer">
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
                        <td><h1 style={{ textAlign: "left" }}>{item.production_order_id}</h1></td>

                        <td className="editable-cell" onClick={() => handleCellClick(item.production_order_id, 'actual_quantity')}>
                          <div className="cell-content">
                            {editingCell.row === item.production_order_id && editingCell.field === 'actual_quantity' ? (
                              <input
                                type="text"
                                className="actual-quantity-input"
                                value={item.actual_quantity}
                                onChange={(e) => handleCellChange(e, item.production_order_id, 'actual_quantity')}
                                onBlur={handleCellBlur}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.target.blur();
                                  }
                                }}
                                autoFocus
                              />
                            ) : (
                              item.actual_quantity || "N/A"
                            )}
                          </div>
                        </td>

                        <td className="editable-cell" onClick={() => handleCellClick(item.production_order_id, 'cost_of_production')}>
                          <div className="cell-content">
                            {editingCell.row === item.production_order_id && editingCell.field === 'cost_of_production' ? (
                              <input
                                type="text"
                                className="cost-of-production-input"
                                value={item.cost_of_production}
                                onChange={(e) => handleCellChange(e, item.production_order_id, 'cost_of_production')}
                                onBlur={handleCellBlur}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.target.blur();
                                  }
                                }}
                                autoFocus
                              />
                            ) : (
                              item.cost_of_production || "N/A"
                            )}
                          </div>
                        </td>

                        <td className="editable-cell" onClick={() => handleCellClick(item.production_order_id, 'miscellaneous_costs')}>
                          <div className="cell-content">
                            {editingCell.row === item.production_order_id && editingCell.field === 'miscellaneous_costs' ? (
                              <input
                                type="text"
                                className="miscellaneous-costs-input"
                                value={item.miscellaneous_costs}
                                onChange={(e) => handleCellChange(e, item.production_order_id, 'miscellaneous_costs')}
                                onBlur={handleCellBlur}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.target.blur();
                                  }
                                }}
                                autoFocus
                              />
                            ) : (
                              item.miscellaneous_costs || "N/A"
                            )}
                          </div>
                        </td>

                        <td className="editable-cell" onClick={() => handleCellClick(item.production_order_id, 'rework_required')}>
                          <div className="cell-content">
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
                                    e.target.blur();
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
                          </div>
                        </td>

                        <td className="editable-cell" onClick={() => handleCellClick(item.production_order_id, 'rework_notes')}>
                          <div className="cell-content">
                            {editingCell.row === item.production_order_id && editingCell.field === 'rework_notes' ? (
                              <textarea
                                className="rework-notes-input"
                                value={item.rework_notes === null ? "" : item.rework_notes}
                                onChange={(e) => handleCellChange(e, item.production_order_id, 'rework_notes')}
                                onBlur={handleCellBlur}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.target.blur();
                                  }
                                }}
                                autoFocus
                              />
                            ) : (
                              item.rework_notes || "N/A"
                            )}
                          </div>
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
                    <th><strong>Total Rework Cost</strong></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReworkData.map((item) => {
                    const cost = parseFloat(item.additional_cost) || 0;
                    const misc = parseFloat(item.additional_misc) || 0;
                    const liveTotal = cost + misc;

                    return (
                      <tr key={item.production_order_id}>
                        <td><strong>{item.production_order_id}</strong></td>
                        <td className="editable-rework-cell" onClick={() => handleReworkCellClick(item.production_order_id, 'additional_cost')}>
                          <div className="cell-content">
                            {editingReworkCell.id === item.production_order_id && editingReworkCell.field === 'additional_cost' ? (
                              <input
                                type="text"
                                className="additional-cost-input"
                                value={item.additional_cost === null ? "" : item.additional_cost}
                                onChange={(e) => handleReworkCellChange(e, item.production_order_id, 'additional_cost')}
                                onBlur={handleReworkCellBlur}
                                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                                autoFocus
                              />
                            ) : (
                              item.additional_cost || "N/A"
                            )}
                          </div>
                        </td>

                        <td className="editable-rework-cell" onClick={() => handleReworkCellClick(item.production_order_id, 'additional_misc')}>
                          <div className="cell-content">
                            {editingReworkCell.id === item.production_order_id && editingReworkCell.field === 'additional_misc' ? (
                              <input
                                type="text"
                                className="additional-misc-input"
                                value={item.additional_misc === null ? "" : item.additional_misc}
                                onChange={(e) => handleReworkCellChange(e, item.production_order_id, 'additional_misc')}
                                onBlur={handleReworkCellBlur}
                                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                                autoFocus
                              />
                            ) : (
                              item.additional_misc || "N/A"
                            )}
                          </div>
                        </td>

                        <td><strong>{liveTotal === 0 ? "N/A" : liveTotal}</strong></td>
                      </tr>
                    );
                  })}
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