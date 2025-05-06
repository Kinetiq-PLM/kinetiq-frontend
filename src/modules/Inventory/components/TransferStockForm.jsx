// TransferStockForm.jsx
import React, { useState, useEffect } from "react";
import "../styles/TransferStockForm.css";

const TransferStockForm = ({ onClose, transferItems, warehouseList, settransferItems }) => {
  const [quantities, setQuantities] = useState({}); // Store quantities for each item
  const [warehouseDestination, setWarehouseDestination] = useState("");
  const [comments, setComments] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize quantities when transferItems change
  useEffect(() => {
    const initialQuantities = transferItems.reduce((acc, item) => {
      acc[item.inventory_item_id] = "";
      return acc;
    }, {});
    setQuantities(initialQuantities);
  }, [transferItems]);

  // Handle quantity change for a specific item
  const handleQuantityChange = (inventoryItemId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [inventoryItemId]: value,
    }));
  };

  // Remove an item from transferItems
  const handleRemoveItem = (inventoryItemId) => {
    settransferItems((prevItems) =>
      prevItems.filter((item) => item.inventory_item_id !== inventoryItemId)
    );
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[inventoryItemId];
      return newQuantities;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (transferItems.length === 0) {
      setErrorMessage("No items selected. Please select at least one item.");
      return;
    }

    if (!warehouseDestination) {
      setErrorMessage("Please select a destination warehouse.");
      return;
    }

    // Validate quantities
    for (const item of transferItems) {
      const quantity = quantities[item.inventory_item_id];
      if (!quantity || quantity <= 0) {
        setErrorMessage(`Please enter a valid quantity for ${item.item_name}.`);
        return;
      }
      if (parseInt(quantity) > parseInt(item.current_quantity)) {
        setErrorMessage(
          `Quantity for ${item.item_name} must be equal to or less than the current quantity (${item.current_quantity}).`
        );
        return;
      }
    }

    try {
      // Create warehouse movement
      const warehouseMovementData = {
        source: transferItems[0].warehouse_id, // Assuming all items are from the same source
        destination: warehouseDestination,
        comments: comments,
      };

      const warehouseMovementResponse = await fetch(
        "http://127.0.0.1:8000/api/warehousemovement-transfer/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(warehouseMovementData),
        }
      );

      if (!warehouseMovementResponse.ok) {
        const errorData = await warehouseMovementResponse.json();
        throw new Error(`Failed to create transfer request: ${JSON.stringify(errorData)}`);
      }

      const warehouseMovement = await warehouseMovementResponse.json();
      console.log("Warehouse Movement created:", warehouseMovement);

      // Prepare array of movement items
      const warehouseMovementItemsData = transferItems.map((item) => ({
        movement_id: warehouseMovement.movement_id,
        inventory_item_id: item.inventory_item_id,
        quantity: parseInt(quantities[item.inventory_item_id]), // Ensure quantity is an integer
      }));

      // Send all movement items in a single POST request
      const warehouseMovementItemResponse = await fetch(
        "http://127.0.0.1:8000/api/warehousemovement-items/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(warehouseMovementItemsData), // Send as an array
        }
      );

      if (!warehouseMovementItemResponse.ok) {
        const errorData = await warehouseMovementItemResponse.json();
        throw new Error(`Failed to create transfer item: ${JSON.stringify(errorData)}`);
      }

      const warehouseMovementItems = await warehouseMovementItemResponse.json();
      console.log("Warehouse Movement Items created:", warehouseMovementItems);

      setSuccessMessage("Transfer request created successfully!");
      setTimeout(() => {
        settransferItems([]); // Clear transferItems after successful submission
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting transfer request:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-items">
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

        <form onSubmit={handleSubmit}>

 {/* Destination Warehouse */}
 <div className="mt-3">
                <label>Destination Warehouse</label>
                <select
                  value={warehouseDestination}
                  onChange={(e) => setWarehouseDestination(e.target.value)}
                  required
                >
                  <option value="">Select Destination</option>
                  {warehouseList.map((warehouse) => (
                    <option
                      key={warehouse.warehouse_id}
                      value={warehouse.warehouse_id}
                    >
                      {warehouse.warehouse_location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Comments */}
              <div className="mt-3">
                <label>Comments</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Optional comments"
                />
              </div>

          {transferItems.length > 0 ? (
            <>
              {/* Display all selected items */}
              {transferItems.map((item) => (
                <div
                  key={item.inventory_item_id}
                  className="border border-gray-300 rounded-lg p-2 flex justify-between gap-2 mt-5"
                >
                  <div className=" flex-col justify-between">
                    <label>Item Name: {item.item_name}</label>
                    <input type="hidden" value={item.item_name} disabled />

                    <label>Item No: {item.item_no}</label>
                    <input type="hidden" value={item.item_no} disabled />

                    <label>Current Warehouse: {item.warehouse_location}</label>
                    <input
                      type="hidden"
                      value={item.warehouse_location}
                      disabled
                    />
                  </div>

                  <div className=" flex gap-5 w-[200px]">
                    <span className="w-[80px]">
                      <label>Quantity</label>
                    <input
                    className="quantity"
                      type="number"
                      placeholder="00"
                      value={quantities[item.inventory_item_id] || ""}
                      onChange={(e) =>
                        handleQuantityChange(item.inventory_item_id, e.target.value)
                      }
                      required
                    />
                    </span>

                    <span className="mt-auto mb-auto">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.inventory_item_id)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </span>
                    
                  </div>


                </div>
              ))}

             
            </>
          ) : (
            <div className="text-center mt-6 text-red-500 font-medium">
              No items selected. Please add items to transfer.
            </div>
          )}

          <div className="form-actions mt-3">
            <button type="submit" className="submit-btn">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferStockForm;