"use client";

import { useState, useEffect, useRef } from "react";

import { useAlert } from "../../Context/AlertContext.jsx";

import QUOTATION_LIST_DATA from "./../../../temp_data/quotation_list_data";
import BLANKET_AGREEMENT_LIST from "./../../../temp_data/ba_list_data";

import Table from "../../Table";
import Button from "../../Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBlanketAgreements } from "../../../api/api.jsx";
const BlanketAgreementListModal = ({
  isOpen,
  onClose,
  setBlanketAgreement,
}) => {
  const { showAlert } = useAlert();

  const [agreementList, setAgreementList] = useState([]);

  const [selectedBlanketAgreement, setSelectedBlanketAgreement] =
    useState(null);

  // Filtered data is used to filter the data based on the search term
  const [filteredData, setFilteredData] = useState([]);
  const agreementQuery = useQuery({
    queryKey: ["agreements"],
    queryFn: async () => await getBlanketAgreements(),
    enabled: isOpen,
  });
  const queryClient = useQueryClient();

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const columns = [
    { key: "agreement_id", label: "Agreement ID" },
    { key: "customer_name", label: "Name" }, // Company Name
    { key: "total_price", label: "Total Amount" },
    { key: "end_date", label: "End Date" },
  ];

  const handleConfirm = () => {
    if (selectedBlanketAgreement) {
      setBlanketAgreement(selectedBlanketAgreement); // Properly update the array
      onClose();
      showAlert({
        type: "success",
        title: "Added Product",
      });
      setSelectedBlanketAgreement(null);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        queryClient.invalidateQueries({ queryKey: ["agreements"] });
        onClose();
      }
    };

    // Focus the close button when modal opens
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
      queryClient.invalidateQueries({ queryKey: ["agreements"] });
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
    if (agreementQuery.status === "success") {
      const data = agreementQuery.data;
      const formattedData = data.map((agreement) => ({
        ...agreement,
        customer_name: agreement.statement?.customer.name,
        total_price:
          Number(agreement.statement?.total_amount).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || "0.00",
        end_date: new Date(agreement.end_date).toLocaleString(),
      }));
      setFilteredData(formattedData);
      setAgreementList(formattedData);
    }
  }, [agreementQuery.status]);
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
            List Of Blanket Agreements
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
                const today = new Date(); // Get the current date

                const filtered = agreementList.filter((item) => {
                  const endDate = new Date(item.end_date); // Convert end_date to a Date object

                  return (
                    item.customer_name.toLowerCase().includes(searchTerm) &&
                    endDate >= today // Only include items where end_date is in the future or today
                  );
                });

                setFilteredData(filtered);
              }}
            />
          </div>
          <div className="h-[300px] overflow-auto border border-[#CBCBCB] rounded-md">
            <Table
              columns={columns}
              data={filteredData}
              onSelect={setSelectedBlanketAgreement}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <Button
                type="primary"
                onClick={handleConfirm}
                disabled={!selectedBlanketAgreement}
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

export default BlanketAgreementListModal;
