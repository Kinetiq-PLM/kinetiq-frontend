import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CostOfProduction.css";

const BodyContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productionData, setProductionData] = useState([]);
  const [reworkCostData, setReworkCostData] = useState([]); // State for rework_cost data
  const [bomData, setBomData] = useState([]); // State for BOM data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extraRows, setExtraRows] = useState({});

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Fetch production data from the backend and merge with cost-of-production data
  useEffect(() => {
    const fetchAndMergeData = async () => {
      try {
        setLoading(true);
        // Fetch all production orders
        const prodRes = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/production/");
        const allProductionOrders = prodRes.data;

        // Fetch all cost-of-production rows
        const copRes = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/cost-of-production/");
        const allCostOfProduction = copRes.data;

        // Fetch BOM data
        const bomRes = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/bom/");
        const bomDataFetched = bomRes.data;
        setBomData(bomDataFetched);

        // Merge: for each production_order_id, use cost-of-production data if exists, else blank fields
        const merged = allProductionOrders.map(prod => {
          const cop = allCostOfProduction.find(
            c => c.production_order_id === prod.production_order_id
          );
          const bom = bomDataFetched.find(
            b => b.bom_id === prod.bom_id
          );
          // If BOM row doesn't exist, add a blank one
          if (!bom && prod.bom_id) {
            setBomData(prev => [
              ...prev,
              {
                bom_id: prod.bom_id,
                production_order_detail_id: cop ? cop.production_order_detail_id : `POD-${prod.production_order_id}-${Date.now()}`,
                total_cost_of_raw_materials: "",
                // ...other BOM fields as needed
              }
            ]);
          }
          return cop
            ? cop
            : {
                production_order_id: prod.production_order_id,
                bom_id: prod.bom_id,
                actual_quantity: "",
                miscellaneous_costs: "",
                cost_of_production: "",
                rework_required: "",
                rework_notes: "",
                production_order_detail_id: cop ? cop.production_order_detail_id : `POD-${prod.production_order_id}-${Date.now()}`
              };
        });

        setProductionData(merged);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch and merge production data.");
        setLoading(false);
      }
    };

    fetchAndMergeData();
  }, []);

  useEffect(() => {
    const fetchReworkCostData = async () => {
      try {
        const response = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/rework-cost/");
        setReworkCostData(response.data);
      } catch (err) {
        console.error("Failed to fetch rework cost data.");
      }
    };

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
  const handleActualQuantityChange = async (production_order_detail_id, value) => {
    const updatedData = productionData.map((item) =>
      item.production_order_detail_id === production_order_detail_id
        ? { ...item, actual_quantity: value }
        : item
    );
    setProductionData(updatedData);
    const itemToUpdate = updatedData.find(
      (item) => item.production_order_detail_id === production_order_detail_id
    );
    try {
      await axios.put(
        `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/cost-of-production/${production_order_detail_id}/`,
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
        `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/cost-of-production/${production_order_id}/`,
        itemToUpdate
      );
      console.log("Cost of production updated successfully");
    } catch (error) {
      console.error("Failed to update cost of production", error);
    }
  };

  // Handler for Miscellaneous Costs change
  const handleMiscellaneousCostsChange = async (production_order_detail_id, value) => {
    const updatedData = productionData.map((item) =>
      item.production_order_detail_id === production_order_detail_id
        ? { ...item, miscellaneous_costs: value }
        : item
    );
    setProductionData(updatedData);
    const itemToUpdate = updatedData.find(
      (item) => item.production_order_detail_id === production_order_detail_id
    );
    try {
      await axios.put(
        `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/cost-of-production/${production_order_detail_id}/`,
        itemToUpdate
      );
      console.log("Miscellaneous costs updated successfully");
    } catch (error) {
      console.error("Failed to update miscellaneous costs", error);
    }
  };

  // Handler for Raw Material Cost change
  const handleRawMaterialCostChange = async (production_order_detail_id, value) => {
    // Update local state
    const updatedBOM = bomData.map(bom =>
      bom.production_order_detail_id === production_order_detail_id
        ? { ...bom, total_cost_of_raw_materials: value }
        : bom
    );
    setBomData(updatedBOM);

    // Update backend
    const itemToUpdate = updatedBOM.find(
      bom => bom.production_order_detail_id === production_order_detail_id
    );
    try {
      await axios.put(
        `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/bom/${itemToUpdate.bom_id}/`,
        itemToUpdate
      );
      console.log("Total cost of raw materials updated successfully");
    } catch (error) {
      console.error("Failed to update total cost of raw materials", error);
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
                  <th>Equipment Cost per Use</th>
                  <th>Total Cost of Raw Materials</th>
                  <th>Cost of Production</th>
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
                          onChange={e =>
                            handleActualQuantityChange(item.production_order_detail_id, e.target.value)
                          }
                        />
                      </td>
                      <td className="miscellaneous-costs">
                        <input
                          type="text"
                          value={item.miscellaneous_costs || ""}
                          onChange={e =>
                            handleMiscellaneousCostsChange(item.production_order_detail_id, e.target.value)
                          }
                        />
                      </td>
                      <td className="total-cost-per-raw-material">
                        {
                          bomData.find(
                            bom => bom.production_order_detail_id === item.production_order_detail_id
                          )?.total_cost_of_raw_materials || ""
                        }
                        </td>
                      <td className="cost-of-production">
                        <strong>
                          {
                            (() => {
                              const misc = parseFloat(item.miscellaneous_costs) || 0;
                              const bom = parseFloat(
                                bomData.find(
                                  bom =>
                                    (item.production_order_detail_id && bom.production_order_detail_id === item.production_order_detail_id) ||
                                    (!item.production_order_detail_id && item.bom_id && bom.bom_id === item.bom_id)
                                )?.total_cost_of_raw_materials || ""
                              ) || 0;
                              const qty = parseFloat(item.actual_quantity) || 0;
                              return ((misc + bom) * qty).toFixed(2);
                            })()
                          }
                        </strong>
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
  );
};

export default BodyContent;