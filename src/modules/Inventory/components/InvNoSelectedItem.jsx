import React, { useState, useEffect } from "react";
import "../styles/TransferStockForm.css";

const InvTransferStockForm = ({ onClose}) => {
 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Transfer Item</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>



          <div className="text-center mt-6 text-red-500 font-medium">
            You must select an item first, to make a transfer.
          </div>



      </div>
    </div>
  );
};

export default InvTransferStockForm;