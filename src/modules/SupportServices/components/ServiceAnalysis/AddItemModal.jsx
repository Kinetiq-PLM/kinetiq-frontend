"use client"

import { useState } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceAnalysisIcon from "/icons/SupportServices/ServiceAnalysisIcon.png"
import ViewInventoryModal from "./ViewInventoryModal"

import { GET } from "../../api/api"

const AddItemModal = ({ isOpen, onClose, onAdd, order }) => {
  const [itemId, setItemId] = useState("")
  const [principalItemId, setPrincipalItemId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [markupPrice, setMarkupPrice] = useState("")
  const [itemName, setItemName] = useState("")

  const [items, setItems] = useState([]);
  const [isItemsDropdown, setItemsDropdown] = useState(false)
  const [showViewInventoryModal, setShowViewInventoryModal] = useState(false)

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

  const [principals, setPrincipals] = useState([]);
  const [isPrincipalDropdown, setPrincipalDropdown] = useState(false)

  const fetchPrincipals = async (itemId) => {
    try {
      const data = await GET(`principal-items/${itemId}/`);
      setPrincipals(data);
    } catch (error) {
      console.error("Error fetching principal items:", error);
    }
  };

  const handleTogglePrincipals = () => {
    if (!isPrincipalDropdown) {
      fetchPrincipals(itemId); 
    }
    setPrincipalDropdown(!isPrincipalDropdown);
  };

  const handleSelectPrincipal = (principal) => {
    setPrincipalItemId(principal.principal_item_id);
    setMarkupPrice(principal.unit_price || "");

    setPrincipalDropdown(false);
  };

  const handleViewInventory = () => {
    setShowViewInventoryModal(true)
  }

  const handleAdd = () => {
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
              <div className="select-wrapper">
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
                  <ul className="dropdown-list">
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
                <label htmlFor="principalItemId">Principal Item ID</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="principalItemId"
                    readOnly
                    value={principalItemId}
                    onChange={(e) => setPrincipalItemId(e.target.value)}
                    placeholder="Enter principal item ID"
                  />
                  <span className="select-arrow" onClick={handleTogglePrincipals} >▼</span>
                  {isPrincipalDropdown && (
                    <ul className="dropdown-list">
                      {principals.length > 0 ? (
                        principals.map((principal) => (
                              <li key={principal.principal_item_id} onClick={() => handleSelectPrincipal(principal)}>
                                {principal.principal_item_id}
                              </li>
                            ))
                          ) : (
                            <li>No principal ID found</li>
                          )}
                        </ul>
                  )} 
                </div>
              </div>
            </div>

            <div className="form-row">
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
              <div className="form-group">
                <label htmlFor="markupPrice">Markup Price</label>
                <input
                  type="text"
                  id="markupPrice"
                  readOnly
                  value={markupPrice}
                  onChange={(e) => setMarkupPrice(e.target.value)}
                  placeholder="Enter markup price"
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
              <button className="update-modal-button" onClick={handleAdd}>
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
      </div>
    </div>
  )
}

export default AddItemModal

