import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ReworkCost.css";

const BodyContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productionData, setProductionData] = useState([]);
  const [reworkCostData, setReworkCostData] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productionResponse = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/cost-of-production/");
        const reworkCostResponse = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/rework-cost/");
        const prodApiResponse = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/production/");
        const tasksResponse = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/tasks/");

        // Build a map for quick lookup
        const costOfProdMap = {};
        productionResponse.data.forEach(prod => {
          costOfProdMap[prod.production_order_id] = prod;
        });
        const reworkCostMap = {};
        reworkCostResponse.data.forEach(rew => {
          reworkCostMap[rew.production_order_id] = rew;
        });

        // Merge: ensure every production_order_id from /api/production is present
        const merged = prodApiResponse.data.map(prod => {
          const prodCost = costOfProdMap[prod.production_order_id] || {};
          const rework = reworkCostMap[prod.production_order_id] || {};
          const task = tasksResponse.data.find(tsk => tsk.task_id === prod.task_id);

          return {
            production_order_id: prod.production_order_id,
            production_order_detail_id: prodCost.production_order_detail_id || "",
            task_description: task ? task.task_description : "",
            actual_quantity: prodCost.actual_quantity || "",
            rework_required: prodCost.rework_required ?? "",
            rework_notes: prodCost.rework_notes || "",
            additional_cost: rework.additional_cost || "",
            additional_misc: rework.additional_misc || "",
            total_rework_cost: rework.total_rework_cost || "",
            rework_cost_id: rework.rework_cost_id || null
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

  // Update production_order_details fields immediately
  const updateProductionDetails = async (production_order_detail_id, field, value) => {
    try {
      await axios.patch(`https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/cost-of-production/${production_order_detail_id}/`, { [field]: value });
    } catch (err) {
      console.error("Update production details failed:", err);
    }
  };

  // Update rework_cost fields immediately
  const updateReworkCost = async (rework_cost_id, field, valueOrPayload) => {
    try {
      const payload = field ? { [field]: valueOrPayload } : valueOrPayload;
      await axios.patch(`https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/rework-cost/${rework_cost_id}/`, payload);
    } catch (err) {
      console.error("Update rework cost failed:", err);
    }
  };

  const filteredData = mergedData.filter((item) => {
    const search = searchQuery.toLowerCase();
    return (
      (item.production_order_id &&
        item.production_order_id.toLowerCase().includes(search)) ||
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
                      <td colSpan="8">Loading...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="8">{error}</td>
                    </tr>
                  ) : (
                    filteredData
                      .slice() // create a shallow copy to avoid mutating state
                      .sort((a, b) => a.production_order_id.localeCompare(b.production_order_id))
                      .map((item, index) => (
                        <tr key={index}>
                          <td className="production-id-cell">
                            <h1 style={{ display: "inline", margin: 0 }}>{item.production_order_id}</h1>
                          </td>
                          <td>{item.task_description}</td>
                          <td className="rework-actual-quantity">
                            <input
                              type="text"
                              value={item.actual_quantity || ""}
                              onChange={e =>
                                setMergedData(prev =>
                                  prev.map(it =>
                                    it.production_order_id === item.production_order_id
                                      ? { ...it, actual_quantity: e.target.value }
                                      : it
                                  )
                                )
                              }
                              onBlur={e =>
                                updateProductionDetails(
                                  item.production_order_detail_id, // primary key for CostOfProduction
                                  "actual_quantity",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="rework-additional-cost">
  <input
    type="text"
    value={item.additional_cost !== null && item.additional_cost !== undefined ? item.additional_cost : ""}
    onChange={e =>
      setMergedData(prev =>
        prev.map(it =>
          it.production_order_id === item.production_order_id
            ? { ...it, additional_cost: e.target.value }
            : it
        )
      )
    }
    onBlur={e => {
      const cost = parseFloat(e.target.value);
      const misc = parseFloat(item.additional_misc);
      if (!isNaN(cost) || !isNaN(misc)) {
        const total = (isNaN(cost) ? 0 : cost) + (isNaN(misc) ? 0 : misc);
        if (item.rework_cost_id) {
          updateReworkCost(item.rework_cost_id, null, {
            additional_cost: isNaN(cost) ? 0 : cost,
            total_rework_cost: total
          });
        }
        setMergedData(prev =>
          prev.map(it =>
            it.production_order_id === item.production_order_id
              ? {
                  ...it,
                  additional_cost: e.target.value,
                  total_rework_cost: total.toFixed(2)
                }
              : it
          )
        );
      }
    }}
  />
</td>


<td className="rework-additional-misc">
  <input
    type="text"
    value={item.additional_misc !== null && item.additional_misc !== undefined ? item.additional_misc : ""}
    onChange={e =>
      setMergedData(prev =>
        prev.map(it =>
          it.production_order_id === item.production_order_id
            ? { ...it, additional_misc: e.target.value }
            : it
        )
      )
    }
    onBlur={e => {
      const misc = parseFloat(e.target.value);
      const cost = parseFloat(item.additional_cost);
      if (!isNaN(cost) || !isNaN(misc)) {
        const total = (isNaN(cost) ? 0 : cost) + (isNaN(misc) ? 0 : misc);
        if (item.rework_cost_id) {
          updateReworkCost(item.rework_cost_id, null, {
            additional_misc: isNaN(misc) ? 0 : misc,
            total_rework_cost: total
          });
        }
        setMergedData(prev =>
          prev.map(it =>
            it.production_order_id === item.production_order_id
              ? {
                  ...it,
                  additional_misc: e.target.value,
                  total_rework_cost: total.toFixed(2)
                }
              : it
          )
        );
      }
    }}
  />
</td>


                          <td>
                            <strong>
                              {item.total_rework_cost !== undefined
                                ? Number(item.total_rework_cost).toFixed(2)
                                : "N/A"}
                            </strong>
                          </td>
                          <td
  className={`rw-rework-required ${
    item.rework_required ? "rw-yes" : "rw-no"
  }`}
>
  <select
    value={item.rework_required ? "Yes" : "No"}
    onChange={e =>
      setMergedData(prev =>
        prev.map(it =>
          it.production_order_id === item.production_order_id
            ? { ...it, rework_required: e.target.value === "Yes" }
            : it
        )
      )
    }
    onBlur={e =>
      updateProductionDetails(
        item.production_order_detail_id,
        "rework_required",
        e.target.value === "Yes"
      )
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
                              onChange={e =>
                                setMergedData(prev =>
                                  prev.map(it =>
                                    it.production_order_id === item.production_order_id
                                      ? { ...it, rework_notes: e.target.value }
                                      : it
                                  )
                                )
                              }
                              onBlur={e =>
                                updateProductionDetails(
                                  item.production_order_detail_id, // primary key for CostOfProduction
                                  "rework_notes",
                                  e.target.value
                                )
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
        </div>
      </div>
    </div>
  );
};

export default BodyContent;