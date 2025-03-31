"use client"

import { useState } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceAnalysisIcon from "/icons/SupportServices/ServiceAnalysisIcon.png"

const EditItemModal = ({ isOpen, onClose, onEdit, item, onViewInventory }) => {
  const [itemId, setItemId] = useState("")
  const [principalItemId, setPrincipalItemId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [markupPrice, setMarkupPrice] = useState("")
  const [itemName, setItemName] = useState("")
  const [unitPrice, setUnitPrice] = useState("")
  const [totalPrice, setTotalPrice] = useState("")

  const handleEdit = () => {
    onEdit({
      ...item,
      itemId,
      principalItemId,
      quantity,
      markupPrice,
      itemName,
      unitPrice,
      totalPrice,
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
            <h2>Edit Item</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg?height=20&width=20"} alt="Close" />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="itemId">Item ID *</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="itemId"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    placeholder="Enter item ID"
                  />
                  <span className="select-arrow">▼</span>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="principalItemId">Principal Item ID</label>
                <input
                  type="text"
                  id="principalItemId"
                  value={principalItemId}
                  onChange={(e) => setPrincipalItemId(e.target.value)}
                  placeholder="Enter principal item ID"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
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
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Enter item name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="totalPrice">Total Price</label>
                <input
                  type="text"
                  id="totalPrice"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                  placeholder="Enter total price"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="unitPrice">Unit Price</label>
                <input
                  type="text"
                  id="unitPrice"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="Enter unit price"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="inventory-request-section">
          <p>Item not in stock? Request here:</p>
          <div className="inventory-buttons-left">
            <button className="view-inventory-button" onClick={onViewInventory}>
              View Inventory
            </button>
            <button className="purchase-request-button">Purchase Request</button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="update-modal-button" onClick={handleEdit}>
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditItemModal

