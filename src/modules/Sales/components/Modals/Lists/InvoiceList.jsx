"use client";

import { useState, useEffect, useRef } from "react";

import { useAlert } from "../../Context/AlertContext.jsx";

import INVOICE_LIST_DATA from "./../../../temp_data/invoice_list_data";

import Table from "../../Table";
import Button from "../../Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GET } from "../../../api/api.jsx";

import loading from "../../Assets/kinetiq-loading.gif";

const InvoiceListModal = ({ isOpen, onClose, setOrder }) => {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);

  const [invoiceList, setInvoiceList] = useState([]);

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Filtered data is used to filter the data based on the search term
  const [filteredData, setFilteredData] = useState([]);
  const invoiceQuery = useQuery({
    queryKey: ["invoicesList"],
    queryFn: async () => await GET("sales/invoice"),
    enabled: isOpen,
    retry: 2,
  });
  const queryClient = useQueryClient();

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const columns = [
    { key: "invoice_id", label: "Order ID" },
    { key: "customer_name", label: "Name" },
    { key: "date_issued", label: "Date" },
    { key: "invoice_status", label: "Status" },
  ];

  const handleConfirm = () => {
    if (selectedInvoice) {
      setOrder(selectedInvoice); // Properly update the array
      onClose();
      showAlert({
        type: "success",
        title: "Order Selected",
      });
      setSelectedInvoice(null);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        queryClient.invalidateQueries({ queryKey: ["invoicesList"] });
        onClose();
      }
    };

    // Focus the close button when modal opens
    if (isOpen && closeButtonRef.current) {
      queryClient.invalidateQueries({ queryKey: ["invoicesList"] });
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

  useEffect(() => {
    if (invoiceQuery.status === "success") {
      const data = invoiceQuery.data;
      const formattedData = data.map((invoice) => ({
        ...invoice,
        customer_name: invoice.order?.statement?.customer?.name,
        date_issued: new Date(invoice.invoice_date).toLocaleString(),
      }));
      setInvoiceList(formattedData);
      setFilteredData(formattedData);
    } else if (invoiceQuery.status === "error") {
      showAlert({ type: "error", title: "Failed to fetch Invoices." });
    }
  }, [invoiceQuery.data, invoiceQuery.status]);
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
            List Of Invoices
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
                const filtered = invoiceList.filter((item) =>
                  item.customer_name.toLowerCase().includes(searchTerm)
                );
                setFilteredData(filtered);
              }}
            />
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
                onSelect={setSelectedInvoice}
              />
            </div>
          )}
          <div className="mt-4 flex justify-between">
            <div>
              <Button
                type="primary"
                onClick={handleConfirm}
                disabled={!selectedInvoice}
              >
                Select
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

export default InvoiceListModal;
