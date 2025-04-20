import React, { useState, useEffect } from "react";
import "../styles/TransferStockForm.css";

const NoSelectedItemModal = ({ onClose }) => {

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">YOU MUEST SELECT AN ITEM FIRST!</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
      </div>
    </div>
  );
};

export default NoSelectedItemModal;