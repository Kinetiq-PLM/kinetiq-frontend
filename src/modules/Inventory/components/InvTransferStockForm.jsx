import React, { useState, useEffect } from "react";
import "../styles/TransferStockForm.css";

const InvTransferStockForm = ({ onClose, selectedItem, warehouseList }) => {
  const [inventoryItemID, setInventoryItemID] = useState("");
  const [inventoryItemName, setInventoryItemName] = useState("");
  const [inputQuantity, setinputQuantity] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [warehouseOrigin, setWarehouseOrigin] = useState("");
  const [warehouseSource, setWarehouseSource] = useState("");
  const [warehouseDestination, setWarehouseDestination] = useState("");
  const [comments, setComments] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    if (selectedItem) {
      setInventoryItemID(selectedItem.inventory_item_id || "");
      setInventoryItemName(selectedItem.item_name || "");
      setCurrentQuantity(selectedItem.current_quantity || "");
      setWarehouseOrigin(selectedItem.warehouse_location || "");
      setWarehouseSource(selectedItem.warehouse_id || "");
    } else {
      // Reset fields if no selectedItem
      setInventoryItemID("");
      setInventoryItemName("");
      setCurrentQuantity("");
      setWarehouseOrigin("");
      setWarehouseSource("");

    }
  }, [selectedItem]);


  const handleClear = () => {

  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedItem) {
      setErrorMessage("No item selected. Please select an item first.");
      return;
    }

    if (inputQuantity > currentQuantity) {
      setErrorMessage("Quantity Must be Equal to Current  or Less then the Item's Current Quantity");
      return;
    }

    try {
      // data for warehouse_movement first
      const warehouseMovementData = {
        source: warehouseSource,
        destination: warehouseDestination,
        comments: comments
      };

      // post req first sa warehouse movement 
      const warehouseMovementResponse = await fetch("http://127.0.0.1:8000/api/warehousemovement-transfer/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(warehouseMovementData),
      });

      if (!warehouseMovementResponse.ok) {
        const errorData = await warehouseMovementResponse.json();
        throw new Error(`Failed to create transfer request: ${JSON.stringify(errorData)}`);
      }

      const warehouseMovement = await warehouseMovementResponse.json();
      console.log("Warehouse Movement created:", warehouseMovement);

      // data for movement items
      const warehouseMovementItemData = {
        movement_id: warehouseMovement.movement_id,
        inventory_item_id: inventoryItemID,
        quantity: inputQuantity,
      }

      // post req first sa movement items
      const warehouseMovementItemResponse = await fetch("http://127.0.0.1:8000/api/warehousemovement-items/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(warehouseMovementItemData),
      });

      if (!warehouseMovementItemResponse.ok) {
        const errorData = await warehouseMovementItemResponse.json();
        throw new Error(`Failed to create transfer request: ${JSON.stringify(errorData)}`);
      }

      const warehouseMovementItem = await warehouseMovementItemResponse.json();
      console.log("Warehouse Movement Item created:", warehouseMovementItem);


      console.log("transfer request created:", warehouseMovementItemData);
      setTimeout(() => onClose(), 2000);

    } catch (error) {
      console.error("Error submitting transfer request:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Transfer Stock Form</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {successMessage && (
          <p style={{ color: "green", marginBottom: "0.5rem" }} className="text-sm">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p style={{ color: "red", marginBottom: "0.5rem" }} className="text-sm">
            {errorMessage}
          </p>
        )}

        {selectedItem ? (
          <form onSubmit={handleSubmit} className="">


            <label>Item ID</label>
            <input
              type="text"
              value={selectedItem.inventory_item_id}
              disabled
              className=""
            />

            <label>Inventory Item Name</label>
            <input
              type="text"
              value={inventoryItemName}
              disabled
            />

            <label>Quantity</label>
            <input
              type="number"
              placeholder=""
              value={inputQuantity}
              onChange={(e) => setinputQuantity(e.target.value)}
              required
            />

            <label>Current Warehouse</label>
            <input
              type="text"
              placeholder={selectedItem}
              value={warehouseOrigin}
              disabled

            />

            <label>Warehouse Destination <span className="text-red-500">*</span></label>
            <select name="" id="" className="border rounded-lg border-gray-300 h-[50px] text-gray-600 cursor-pointer p-1" onChange={(e) => setWarehouseDestination(e.target.value)}>
              <option value="" className="text-gray-600">Select Warehouse</option>
              {warehouseList.map((warehouse) => (
                <option className="text-gray-600 cursor-pointer" key={warehouse.warehouse_location} value={warehouse.warehouse_id} onChange={(e) => setWarehouseDestination(e.target.value)}>
                  {warehouse.warehouse_location}
                </option>
              ))}
            </select>

            <label>Comment</label>
            <textarea
              placeholder="Enter item description"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows="1"
            />



            <div className="form-actions">
              {/* <button
                type="button"
                onClick={handleClear}
                className="clear-btn"
              >
                Reset Forms
              </button> */}
              <button type="submit" className="submit-btn">
                Submit Request
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center mt-6 text-red-500 font-medium">
            You must select an item first, to make a transfer.
          </div>
        )}


      </div>
    </div>
  );
};

export default InvTransferStockForm;