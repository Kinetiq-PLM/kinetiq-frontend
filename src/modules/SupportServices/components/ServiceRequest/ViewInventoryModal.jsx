"use client"

import { useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceAnalysisIcon from "/icons/SupportServices/ServiceAnalysisIcon.png"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

import { GET } from "../../api/api"

const ViewInventoryModal = ({ isOpen, onClose, onSelectItem }) => {
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

  const [searchQuery, setSearchQuery] = useState("")
  const [filterOption, setFilterOption] = useState("")
  const [showFilterOptions, setShowFilterOptions] = useState(false)

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "product", label: "Product" },
    { value: "raw material", label: "Raw Material" },
  ]

  const handleFilterSelect = (option) => {
    setFilterOption(option)
    setShowFilterOptions(false)
  }

  const filteredItems = inventoryItems.filter((inventoryItem) => {
    const matchesSearch =
    searchQuery === "" ||
    inventoryItem.inventory_item_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    inventoryItem?.item?.item_name?.toString().toLowerCase().includes(searchQuery.toLowerCase()) 
    
    const matchesType =
      !filterOption || filterOption === "all" ||
      (filterOption === "raw material" && inventoryItem.item_type === "Raw Material") ||
      (filterOption === "product" && inventoryItem.item_type === "Product");

    return matchesSearch && matchesType;
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
            <div className="filter-dropdown">
              <button className="filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
              {filterOptions.find(opt => opt.value === filterOption)?.label || "Item Type"}
                <span className="arrow">▼</span>
              </button>
              {showFilterOptions && (
                <div className="filter-options">
                  {filterOptions.map((option) => (
                    <div key={option.value} className="filter-option" onClick={() => handleFilterSelect(option.value)}>
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>
          

          <div className="inventory-table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Item Type</th>
                  <th>Item Name</th>
                  <th>Available Stock</th>
                  <th>Warehouse Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems
                  .slice() // avoid mutating original array
                  .sort((a, b) => {
                    const typeA = a.item?.item_type || "";
                    const typeB = b.item?.item_type || "";

                    if (typeA === "Product" && typeB !== "Product") return -1;
                    if (typeA !== "Product" && typeB === "Product") return 1;
                    return 0; // keep original order otherwise
                  })
                  .map((item) => (
                    <tr
                      key={item.inventory_item_id}
                      onClick={() => handleSelectItem(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{item.inventory_item_id}</td>
                      <td>{item.item?.item_type || ""}</td>
                      <td>{item.item?.item_name || ""}</td>
                      <td>{item.current_quantity}</td>
                      <td>{item.warehouse?.warehouse_name || ""}</td>
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

