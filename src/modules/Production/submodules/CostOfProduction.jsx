import React, { useState } from "react";
import "../styles/CostOfProduction.css";

const BodyContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTable, setActiveTable] = useState("costProduction");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
};


  const productionData = Array(7).fill().map((_, index) => ({
    id: `PO00${index + 1}`,
    actualQuantity: 10,
    costProduction: "1,500.00",
    miscCost: "50.00",
    reworkRequired: "null",
    reworkNotes: "null",
  }));

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
                {productionData.map((item, index) => (
                  <tr key={index}>
                    <td><h1>{item.id}</h1></td>
                    <td><input type="text" defaultValue={item.costProduction} /></td>
                    <td><input type="text" defaultValue={item.miscCost} /></td>
                    <td>
                      <input
                        type="text"
                        defaultValue={(parseFloat(item.costProduction.replace(/,/g, "")) + parseFloat(item.miscCost)).toFixed(2)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BodyContent;
