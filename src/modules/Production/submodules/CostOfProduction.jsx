import React, { useState } from "react";
import "../styles/CostOfProduction.css";

const BodyContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTable, setActiveTable] = useState("costProduction");

 

  return (
    <div className="costprod">
      <div className="costprodcolumns">
        <div className="column-expanded">
          <div className="costprodheader-section">
            <h1>Cost of Production & Miscellaneous Costs</h1>
            <div className="costprodbutton-group">
              <div className="costprods-bar">
                <img
                  src="/icons/search-icon.png"
                  alt="Search Icon"
                  className="search-icon"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="costprodrefresh-button">Refresh</button>
            </div>
          </div>

          <div className="costprotable">
            <table>
              <thead>
                <tr>
                  <th>Production Order ID</th>
                  <th>Project ID</th>
                  <th>Actual Quantity</th>
                  <th>Cost of Production</th>
                  <th>Miscellaneous Cost</th>
                </tr>
              </thead>
              <tbody>
                {Array(7)
                  .fill()
                  .map((_, index) => (
                    <tr key={index}>
                      <td>
                        <h1>PO00{index + 1}</h1>
                      </td>
                      <td>111201</td>
                      <td>10</td>
                      <td>1,500.00</td>
                      <td>50.00</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>


      <div className="rework-cost-container">
  <div className="rework-cost">
    <table className="rework-cost-table">
      <thead>
        <tr>
          <th>Production Order Details ID</th>
          <th>Rework Cost</th>
          <th>Total Additional Cost</th>
          <th>Total Additional Miscellaneous Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><h1>PO001</h1></td>
          <td><input type="text" value="1,500.00" /></td>
          <td><input type="text" value="50.00" /></td>
          <td><input type="text" value="50.00" /></td>
        </tr>

        <tr>
          <td><h1>PO001</h1></td>
          <td><input type="text" value="1,500.00" /></td>
          <td><input type="text" value="50.00" /></td>
          <td><input type="text" value="50.00" /></td>
        </tr>

        <tr>
          <td><h1>PO001</h1></td>
          <td><input type="text" value="1,500.00" /></td>
          <td><input type="text" value="50.00" /></td>
          <td><input type="text" value="50.00" /></td>
        </tr>
        
      </tbody>
    </table>
  </div>
</div>


      </div>
    </div>
  );
};





export default BodyContent;
