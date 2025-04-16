"use client"

import { useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceAnalysisIcon from "/icons/SupportServices/ServiceAnalysisIcon.png"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

import { GET } from "../../api/api"

const ViewInventoryModal = ({ isOpen, onClose, onSelectItem }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [inventoryItems, setInventoryItems] = useState([])

  const fetchItems = async () => {
    try {
      const data = await GET("order/inventory/items/");
      setInventoryItems(data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = inventoryItems.filter((inventoryItem) => {
    const matchesSearch =
    searchQuery === "" ||
    inventoryItem.item_md_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    inventoryItem.item?.item_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    inventoryItem.item?.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) 
    return matchesSearch;
  });  

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
          <div className="search-container" style={{ marginBottom: "1rem" }}>
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
                  <th>Available Stock</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.item_md_id} onClick={() => handleSelectItem(item)} style={{ cursor: "pointer" }}>
                    <td>{item.item_md_id}</td>
                    <td>{item.item?.item_id || ""}</td>
                    <td>{item.item?.item_name}</td>
                    <td>{item.available_stock}</td>
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

