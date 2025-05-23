"use client";

import { useState, useEffect, useRef, useMemo } from "react";

import { useAlert } from "../../Context/AlertContext.jsx";

import Table from "../../Table";
import Button from "../../Button";
import { useQuery } from "@tanstack/react-query";
import { GET } from "../../../api/api";

import Dropdown from "../../Dropdown.jsx";

import loading from "../../Assets/kinetiq-loading.gif";

const CustomerListModal = ({
  isOpen,
  isNewCustomerModalOpen,
  onClose,
  setCustomer,
  employee = null,
  duplicates = [],
}) => {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerFilter, setCustomerFilter] = useState("Clients"); // Default date filter
  const customerTypes = ["Client", "Prospect"];

  // setSelectedCustomer is used to set the selected customer in this component
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Filtered data is used to filter the data based on the search term
  const [filteredData, setFilteredData] = useState([]);

  const [customers, setCustomers] = useState([]);

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // USE employee to fetch the customer data if employee is not null
  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: async () =>
      await GET("sales/customer?status=Active&type=Client,Prospect"),
    enabled: isOpen || isNewCustomerModalOpen,
    retry: 2,
  });

  const columns = [
    { key: "customer_id", label: "Customer ID" },
    { key: "name", label: "Name" }, // Company Name
    { key: "country", label: "Country" }, // Country
  ];

  useEffect(() => {
    // Exclude products that are already in the customer list
    if (duplicates.length === 0) return;

    setFilteredData(
      customers.filter(
        (customer) =>
          !duplicates.some((c) => c.customer_id === customer.customer_id)
      )
    );
  }, [duplicates]);

  const handleConfirm = () => {
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
      onClose();
      showAlert({
        type: "success",
        title: "Customer selected.",
      });
      setSelectedCustomer(null);
    }
  };

  // === FETCH ===
  useEffect(() => {
    if (customersQuery.status === "success") {
      setFilteredData(customersQuery.data);
      setCustomers(customersQuery.data);
      setIsLoading(false);
    } else if (customersQuery.status === "error") {
      showAlert({
        type: "error",
        title:
          "An error occurred while fetching the data: " +
          customersQuery.error?.message,
      });
    }
  }, [customersQuery.data, customersQuery.status]);

  const handleSearchAndFilter = () => {
    if (customersQuery.status !== "success") return;
    const filteredData = customers
      .filter((customer) => customer.name.toLowerCase().includes(searchTerm))
      .filter(
        (customer) =>
          customer.customer_type.toLowerCase() == customerFilter.toLowerCase()
      );

    setFilteredData(filteredData);
  };

  useEffect(() => {
    handleSearchAndFilter();
  }, [customerFilter]);

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
            List of Business Partners
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
          <div className="mb-4 flex items-center gap-4">
            <p className="mr-2">Search:</p>
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-2 py-1 border border-gray-300 rounded-md max-w-[300px]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearchAndFilter();
              }}
            />
            <div className="w-full sm:w-[200px]">
              <Dropdown
                options={customerTypes}
                onChange={setCustomerFilter}
                value={customerFilter}
              />
            </div>
          </div>
          {isLoading ? (
            <div className="h-[300px] rounded-md flex justify-center items-center">
              <img src={loading} alt="loading" className="h-[100px]" />
            </div>
          ) : (
            <div className="h-[300px] overflow-auto border border-[#CBCBCB] rounded-md">
              <Table
                columns={columns}
                data={filteredData}
                onSelect={setSelectedCustomer}
              />
            </div>
          )}
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
              {/* <Button type="primary" onClick={() => newCustomerModal(true)}>
                New
              </Button> */}
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
