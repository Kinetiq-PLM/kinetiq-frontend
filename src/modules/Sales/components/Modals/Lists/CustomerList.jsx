"use client";

import { useState, useEffect, useRef } from "react";

import { useAlert } from "../../Context/AlertContext.jsx";

import Table from "../../Table";
import { CUSTOMER_DATA } from "./../../../temp_data/customer_data";
import Button from "../../Button";
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../../../api/api";

const CustomerListModal = ({
  isOpen,
  onClose,
  setCustomer,
  newCustomerModal,
}) => {
  const { showAlert } = useAlert();

  const customer_data = CUSTOMER_DATA;

  // setCustomer is used to set the selected customer in the parent component
  // setSelectedCustomer is used to set the selected customer in this component
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Filtered data is used to filter the data based on the search term
  const [filteredData, setFilteredData] = useState([]);
  const [customers, setCustomers] = useState([]);

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: async () => await getCustomers(),
    enabled: isOpen,
  });

  const columns = [
    { key: "customer_id", label: "Customer ID" },
    { key: "name", label: "Name" }, // Company Name
    { key: "country", label: "Country" }, // Country
  ];

  const handleConfirm = () => {
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
      onClose();
      showAlert({
        type: "success",
        title: "Customer Selected",
      });
      setSelectedCustomer(null);
    }
  };

  useEffect(() => {
    if (customersQuery.status === "success") {
      setFilteredData(customersQuery.data);
      setCustomers(customersQuery.data);
    } else if (customersQuery.status === "error") {
      alert(
        "An error occurred while fetching the data: " +
          customersQuery.error?.message
      );
    }
  }, [customersQuery.status]);

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
        className="bg-white pb-6 overflow-auto rounded-lg shadow-lg max-w-lg w-full relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* HEADER */}
        <div className="w-full bg-[#EFF8F9] py-[20px] px-[30px] border-b border-[#cbcbcb]">
          <h2 id="modal-title" className="text-xl font-semibold">
            List Of Business Partners
          </h2>
        </div>

        {/* Close button */}
        <button
          ref={closeButtonRef}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 rounded-full p-1 text-3xl cursor-pointer transition-all duration-200"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* BODY */}
        <div className="px-6 mt-4">
          <div className="mb-4 flex items-center">
            <p className="mr-2">Search:</p>
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-2 py-1 border border-gray-300 rounded-md max-w-[300px]"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredData = customers.filter((customer) =>
                  customer.name.toLowerCase().includes(searchTerm)
                );
                setFilteredData(filteredData);
              }}
            />
          </div>
          <div className="h-[300px] overflow-auto border border-[#CBCBCB] rounded-md">
            <Table
              columns={columns}
              data={filteredData}
              onSelect={setSelectedCustomer}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <Button
                type="primary"
                className={"mr-2"}
                onClick={handleConfirm}
                disabled={!selectedCustomer}
              >
                Select
              </Button>
              <Button type="primary" onClick={() => newCustomerModal(true)}>
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
    </div>
  );
};

export default CustomerListModal;
