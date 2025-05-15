"use client"

import { useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceContractIcon from "/icons/SupportServices/ServiceContractIcon.png"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

import { GET } from "../../api/api"

const ViewStatementsModal = ({ isOpen, onClose, onSelectItem }) => {
  const [statementItems, setStatementItems] = useState([])

  const fetchStatementItems = async () => {
    try {
    const response = await GET(`contract/contracts/statement-items/`); 
    //console.log("statement-items", response)
    setStatementItems(response);
  } catch (error) {
    console.error("Error fetching statement items:", error);
  }
};

  useEffect(() => {
    fetchStatementItems();
  }, []);

  const [searchQuery, setSearchQuery] = useState("")

  const filteredStmtItems = statementItems.filter((stmtItem) => {
    const matchesSearch =
    searchQuery === "" ||
    stmtItem.statement_item_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    stmtItem?.inventory_item?.item?.item_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    stmtItem?.inventory_item?.item?.item_name.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    stmtItem?.statement?.customer?.name.toString().toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  });  

  const handleSelectItem = (stmtItem) => {
    onSelectItem(stmtItem)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header" style={{ borderBottom: "2px solid #00a8a8" }}>
          <div className="modal-header-left">
            <img
              src={ServiceContractIcon || "/placeholder.svg?height=24&width=24"}
              alt="Service Analysis"
              className="modal-header-icon"
            />
            <h2>View Statement Items</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg?height=20&width=20"} alt="Close" />
          </button>
        </div>

        <div className="modal-content">
        <div className="search-filter-container inventory-filter-container">
          <div className="search-container">
              <img src={SearchIcon || "/placeholder.svg?height=16&width=16"} alt="Search" className="search-icon" />
              <input
                type="text"
                placeholder="Enter search term"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
        </div>
          

          <div className="inventory-table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Statement Item ID</th>
                  <th>Item ID</th>
                  <th>Item Name</th>
                  <th>Customer Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredStmtItems
                  .map((stmtItem) => (
                    <tr
                      key={stmtItem.statement_item_id}
                      onClick={() => handleSelectItem(stmtItem)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{stmtItem.statement_item_id}</td>
                      <td>{stmtItem.inventory_item?.item?.item_id || ""}</td>
                      <td>{stmtItem.inventory_item?.item?.item_name || ""}</td>
                      <td>{stmtItem.statement?.customer?.name || ""}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewStatementsModal

