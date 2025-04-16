"use client"

import { useRef, useEffect, useState } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceAnalysisIcon from "/icons/SupportServices/ServiceAnalysisIcon.png"
import ViewInventoryModal from "./ViewInventoryModal"

import { GET } from "../../api/api"

const AddItemModal = ({ isOpen, onClose, onAdd, order }) => {
  const [itemId, setItemId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [itemName, setItemName] = useState("")

  const [items, setItems] = useState([]);
  const [isItemsDropdown, setItemsDropdown] = useState(false)
  const [showViewInventoryModal, setShowViewInventoryModal] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchItems= async () => {
    try {
      const data = await GET("items/");
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleToggleItems = () => {
    if (!isItemsDropdown) {
      fetchItems(); 
      setItemsDropdown(true);
    }
    setItemsDropdown(!isItemsDropdown);
  };

  const handleSelectItem = (item) => {
    setItemId(item.item_id);
    setItemName(item.item_name || "");

    setItemsDropdown(false);
  };

  const handleSelectItemInventory = (item) => {
    setItemId(item.item?.item_id);
    setItemName(item.item?.item_name || "");
  };

  const handleViewInventory = () => {
    setShowViewInventoryModal(true)
  }

  const handleAdd = () => {
    if (!/^\d+$/.test(quantity)) {
      setErrorMessage("Invalid quantity, please enter a valid number.");
      setShowModal(true);
      return;
    }

    onAdd({
      item_id: itemId,
      principal_item_id: principalItemId,
      item_quantity: quantity,
      item_price: "0.00",
      total_price: "0.00",
      service_order_id: order,
      item_name: itemName,
    })
  }

  const itemRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (itemRef.current && !itemRef.current.contains(event.target)) {
        setItemsDropdown(false); // Close the dropdown
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container edit-item-modal">
        <div className="modal-header" style={{ borderBottom: "2px solid #00a8a8" }}>
          <div className="modal-header-left">
            <img
              src={ServiceAnalysisIcon || "/placeholder.svg?height=24&width=24"}
              alt="Service Analysis"
              className="modal-header-icon"
            />
            <h2>Add Item</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg?height=20&width=20"} alt="Close" />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
            <div className="form-group">
              <label htmlFor="itemId">
                Item ID <span className="required">*</span>
              </label>
              <div className="select-wrapper" ref={itemRef}>
                <input
                  type="text"
                  id="itemId"
                  value={itemId}
                  onChange={(e) => {
                    setItemId(e.target.value);
                    setItemsDropdown(true); // show dropdown on typing
                  }}
                  onClick={handleToggleItems}
                  placeholder="Enter item ID"
                />
                <span className="select-arrow" onClick={handleToggleItems}>▼</span>
                {isItemsDropdown && (
                  <ul className="dropdown-list item-list">
                    {items.length > 0 ? (
                      items
                        .filter((item) =>
                          item.item_id.toLowerCase().includes(itemId.toLowerCase())
                        )
                        .map((item) => (
                          <li key={item.item_id} onClick={() => handleSelectItem(item)}>
                            {item.item_id}
                          </li>
                        ))
                    ) : (
                      <li>No item ID found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
            <div className="form-group">
                <label htmlFor="quantity">Quantity <span className="required">*</span></label>
                <input
                  type="text"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="itemName">Item Name</label>
                <input
                  type="text"
                  id="itemName"
                  readOnly
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Enter item name"
                />
              </div>
              <div className="add-cancel-button">
              <button className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button 
                className={`update-button ${
                  itemId && quantity  ? "clickable" : "disabled"
                }`}
                onClick={handleAdd}
                disabled={!(itemId && quantity)}
              >
                Add
              </button>
              </div>
              
            </div>
          </div>
        </div>

        <div className="inventory-request-section">  
          <div className="request-group">
            <p>&nbsp;</p>
            <button className="view-inventory-button" onClick={handleViewInventory}>
              View Inventory
            </button>
          </div>
          <div className="request-group">
            <p>Item not in stock? Request here:</p>
            <button className="purchase-request-button">
              Purchase Request
            </button>
          </div>
        </div>

        {showViewInventoryModal && (
        <ViewInventoryModal
          isOpen={showViewInventoryModal}
          onClose={() => setShowViewInventoryModal(false)}
          onSelectItem={(item) => {
            console.log("Selected item:", item)
            handleSelectItemInventory(item)
            setShowViewInventoryModal(false)
          }}
        />
      )}

      {showModal && (
        <div className="alert-modal-overlay">
          <div className="alert-modal-content">
            <h2>⚠  WARNING</h2>
            <p>{errorMessage}</p>
            <button className="alert-okay-button" onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default AddItemModal

