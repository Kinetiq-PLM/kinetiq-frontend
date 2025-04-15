"use client";

import { useState, useEffect, useRef } from "react";

import Button from "../Button";
import Dropdown from "../Dropdown.jsx";

const RequestModal = ({ isOpen, onClose, setAction }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const [requestType, setRequestType] = useState("");
  const [isValidationVisible, setIsValidationVisible] = useState(false);

  const requestTypes = [
    "Project Request",
    "Purchase Request",
    "Workforce Request",
  ];

  const validateRequestType = () => {
    if (!requestType) {
      return "Please select a request type.";
    }
    return null;
  };

  const handleConfirm = () => {
    setIsValidationVisible(true);

    const validators = [validateRequestType];

    const errorCount = validators.reduce(
      (count, validate) => count + (validate() ? 1 : 0),
      0
    );

    console.log(errorCount === 0 ? "NO ERRORS" : errorCount);

    if (errorCount === 0) {
      // Reset form fields
      setAction(requestType);

      setRequestType("");
      onClose();
    }
  };

  useEffect(() => {
    setIsValidationVisible(false);
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
        className="bg-white pb-6 my-6 overflow-auto rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* HEADER */}
        <div className="w-full bg-[#EFF8F9] py-[20px] px-[30px] border-b border-[#cbcbcb]">
          <h2 id="modal-title" className="text-xl font-semibold">
            Choose Request
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
          <form action="" className="space-y-4  mb-12">
            <Dropdown
              label="Request Type"
              options={requestTypes}
              onChange={setRequestType}
              value={requestType}
              validation={validateRequestType}
              isValidationVisible={isValidationVisible}
            />
          </form>

          <div className="flex justify-between">
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

export default RequestModal;
