"use client";

import { useState, useEffect, useRef } from "react";
import Table from "../../Table";
import { CUSTOMER_DATA } from "./../../../temp_data/customer_data";
import Button from "../../Button";

const CustomerListModal = ({ isOpen, onClose, setCustomer }) => {
  // setCustomer is used to set the selected customer in the parent component
  // setSelectedCustomer is used to set the selected customer in this component
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const columns = [
    { key: "customer_id", label: "Customer ID" },
    { key: "name", label: "Name" }, // Company Name
    { key: "country", label: "Country" }, // Country
  ];

  const handleConfirm = () => {
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
      onClose();
      setSelectedCustomer(null);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    // Focus the close button when modal opens
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    // Prevent scrolling on body when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-1000"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          ref={closeButtonRef}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 text-2xl cursor-pointer transition-all duration-200"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* HEADER */}
        <h2 id="modal-title" className="text-xl font-semibold">
          List Of Business Partners
        </h2>

        {/* BODY */}
        <div className="max-h-[300px] overflow-auto border border-[#CBCBCB] rounded-md">
          <Table
            columns={columns}
            data={CUSTOMER_DATA}
            onSelect={setSelectedCustomer}
          />
        </div>
        <div className="mt-2 flex justify-between">
          <div>
            <Button
              type="primary"
              className={"mr-2"}
              onClick={handleConfirm}
              disabled={!selectedCustomer}
            >
              Select
            </Button>
            <Button type="primary" onClick={handleConfirm}>
              New
            </Button>
          </div>
          <div>
            <Button type="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerListModal;
