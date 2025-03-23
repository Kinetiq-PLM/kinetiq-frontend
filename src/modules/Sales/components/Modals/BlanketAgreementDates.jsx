"use client";

import { useState, useEffect, useRef } from "react";
import { useAlert } from "../Context/AlertContext.jsx";

import Button from "../Button";
import generateRandomID from "../GenerateID.jsx";
import DateInputField from "../DateInputField.jsx";

const BlanketAgreementDateModal = ({ isOpen, onClose, quotationInfo }) => {
  const { showAlert } = useAlert();

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const [agreementID, setAgreementID] = useState(generateRandomID("B"));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isValidationVisible, setIsValidationVisible] = useState(false);

  const handleConfirm = () => {
    setIsValidationVisible(true);

    const validators = [validateStartDate, validateEndDate];
    const errorCount = validators.reduce(
      (count, validate) => count + (validate() ? 1 : 0),
      0
    );

    if (errorCount === 0) {
      // Add new blanket agreement HERE to database
      // w agreementID and quotationInfo

      // Reset Fields
      setStartDate("");
      setEndDate("");
      setIsValidationVisible(false);
      showAlert({
        type: "success",
        title: "New Agreement Created",
      });
      onClose();
    }
  };

  const validateStartDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    if (!startDate.trim()) {
      return "Start date is required.";
    }

    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return "Invalid start date format.";
    }

    return "";
  };

  const validateEndDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    if (!endDate.trim()) {
      return "End date is required.";
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(end.getTime())) {
      return "Invalid end date format.";
    }

    if (end < today) {
      return "End date cannot be in the past.";
    }

    if (end < start) {
      return "End date cannot be earlier than start date.";
    }

    return "";
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
        setCustomerID("");
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

  useEffect(() => {
    setAgreementID(generateRandomID("B"));
  }, [isOpen]);

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
        className="bg-white pb-6 my-6 overflow-auto rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* HEADER */}
        <div className="w-full bg-[#EFF8F9] py-[20px] px-[30px] border-b border-[#cbcbcb]">
          <h2 id="modal-title" className="text-xl font-semibold">
            Blanket Agreement Dates
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
          <form action="" className="space-y-4">
            <DateInputField
              label={"Start Date"}
              value={startDate}
              setValue={setStartDate}
              validation={validateStartDate}
              isValidationVisible={isValidationVisible}
            />
            <DateInputField
              label={"End Date"}
              value={endDate}
              setValue={setEndDate}
              validation={validateEndDate}
              isValidationVisible={isValidationVisible}
            />
          </form>
          <div className="mt-4 flex justify-between">
            <div>
              <Button
                type="primary"
                className={"mr-2"}
                onClick={handleConfirm}
                submit={true}
              >
                Continue
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

export default BlanketAgreementDateModal;
