"use client"

import { useState } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceAnalysisIcon from "/icons/SupportServices/ServiceAnalysisIcon.png"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

const ViewInventoryModal = ({ isOpen, onClose, onSelectItem }) => {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample inventory data
  const inventoryItems = [
    {
      mdId: "123",
      itemId: "999",
      itemName: "Battery",
      unitPrice: "₱ 18,900",
      availableStock: "None",
    },
    {
      mdId: "456",
      itemId: "888",
      itemName: "Power Supply",
      unitPrice: "₱ 12,500",
      availableStock: "5",
    },
    {
      mdId: "789",
      itemId: "777",
      itemName: "Circuit Board",
      unitPrice: "₱ 35,000",
      availableStock: "2",
    },
  ]

  const handleSelectItem = (item) => {
    onSelectItem(item)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header" style={{ borderBottom: "2px solid #00a8a8" }}>
          <div className="modal-header-left">
            <img
              src={ServiceAnalysisIcon || "/placeholder.svg?height=24&width=24"}
              alt="Service Analysis"
              className="modal-header-icon"
            />
            <h2>View Inventory</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg?height=20&width=20"} alt="Close" />
          </button>
        </div>

        <div className="modal-content">
          <div className="search-input-wrapper" style={{ marginBottom: "1rem" }}>
            <img src={SearchIcon || "/placeholder.svg?height=16&width=16"} alt="Search" className="search-icon" />
            <input
              type="text"
              placeholder="Enter search term"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="inventory-table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Item MD ID</th>
                  <th>Item ID</th>
                  <th>Item Name</th>
                  <th>Unit Price</th>
                  <th>Available Stock</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => (
                  <tr key={item.mdId} onClick={() => handleSelectItem(item)} style={{ cursor: "pointer" }}>
                    <td>{item.mdId}</td>
                    <td>{item.itemId}</td>
                    <td>{item.itemName}</td>
                    <td>{item.unitPrice}</td>
                    <td>{item.availableStock}</td>
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

export default ViewInventoryModal

