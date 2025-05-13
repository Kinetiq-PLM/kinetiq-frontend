import React, { useState, useEffect } from "react";
// import "../styles/CreateTransferForm.css";

const CreateTransferStockForm = ({ onClose, warehouseList, successCTD }) => {

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [warehouseDestination, setWarehouseDestination] = useState("");
  const [comments, setComments] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");


    try {


      // data for movement items
      const createTransferData = {
        destination: warehouseDestination,
        comments: comments
      }

      // post req sa movement_items muna 
      const createTransferResponse = await fetch("https://65umlgnumg.execute-api.ap-southeast-1.amazonaws.com/dev/api/warehousemovement-transfer/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createTransferData),
      });

      if (!createTransferResponse.ok) {
        const errorData = await createTransferResponse.json();
        throw new Error(`Failed to create transfer request: ${JSON.stringify(errorData)}`);
      }

      const warehouseMovement = await createTransferResponse.json();
      console.log("Warehouse Movement created:", warehouseMovement);
      console.log("Warehouse Movement created:", warehouseMovement?.movement_id);
      successCTD(warehouseMovement?.movement_id);


    } catch (error) {
      console.error("Error submitting transfer request:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };




  // Time Setup
  // Format time for Philippine Time Zone (UTC+8)
  const formatPhilippineTime = (date) => {
    // Adjust for Philippine time (UTC+8)
    const philippineDate = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours() + 8,
      date.getUTCMinutes(),
      date.getUTCSeconds()
    ));

    const hours24 = philippineDate.getUTCHours();
    const hours12 = hours24 % 12 || 12; // Convert to 12-hour format
    const minutes = philippineDate.getUTCMinutes().toString().padStart(2, '0');
    const seconds = philippineDate.getUTCSeconds().toString().padStart(2, '0');
    const amPm = hours24 < 12 ? 'AM' : 'PM';

    const year = philippineDate.getUTCFullYear();
    const month = (philippineDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = philippineDate.getUTCDate().toString().padStart(2, '0');

    return `${day}/${month}/${year}, ${hours12}:${minutes} ${amPm} PHT`;
  };
  const currentTime = new Date();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create a Stock Transfer</h2>
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

        <div className="text-sm text-gray-500 md:order-2 mb-5">
          {formatPhilippineTime(currentTime)}
        </div>
        <form onSubmit={handleSubmit} className="">

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
            <button onClick={onClose} className="submit-btn">
              Cancel
            </button>

            <button type="submit" className="submit-btn">
              Create Stock Transfer
            </button>
          </div>
        </form>



      </div>
    </div>
  );
};

export default CreateTransferStockForm;