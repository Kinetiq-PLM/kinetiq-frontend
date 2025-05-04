"use client";

import { useState, useEffect, useRef } from "react";

import {
  CountryData,
  CustomerTypes,
} from "../../temp_data/new_customer_data.jsx";
import { useAlert } from "../Context/AlertContext.jsx";

import Button from "../Button.jsx";
import generateRandomID from "../GenerateID.jsx";
import InputField from "../InputField.jsx";
import Dropdown from "../Dropdown.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { POST } from "../../api/api.jsx";

const ViewCustomerModal = ({ isOpen, onClose, data, action }) => {
  const { showAlert } = useAlert();

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const [customerID, setCustomerID] = useState(generateRandomID("C"));
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [mainAddress, setMainAddress] = useState("");
  const [secondaryAddress, setSecondaryAddress] = useState("");

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

  useEffect(() => {
    if (!isOpen) return;
    console.log("Data received in modal:", data);

    // Search for their data and set states if modal is open
    setCustomerID(data.customer_id);
    setCompanyName(data.customer_name);
    setContactPerson(data.contact_person);
    setContactNumber(data.phone_number);
    setEmail(data.email_address);
    setCountry(data.country);
    setPostalCode(data.postal_code);
    setMainAddress(data.address_line1);
    setSecondaryAddress(data.address_line2);
    setCity(data.city);
  }, [isOpen, data]);

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
            View Details
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
          <form action="" className="space-y-4 mb-24">
            <InputField
              label={"Company ID"}
              value={customerID}
              setValue={setCustomerID}
              isDisabled={true}
            />
            <InputField
              label={"Company Name"}
              value={companyName}
              setValue={setCompanyName}
              isDisabled={true}
            />
            <InputField
              label={"Contact Person"}
              value={contactPerson}
              setValue={setContactPerson}
              isDisabled={true}
            />
            <InputField
              label={"Contact Number"}
              value={contactNumber}
              setValue={setContactNumber}
              isDisabled={true}
            />
            <InputField
              label={"Email"}
              value={email}
              setValue={setEmail}
              isDisabled={true}
            />
            <InputField
              label={"Country"}
              value={country}
              setValue={setCountry}
              isDisabled={true}
            />
            {/* cities dropdown and postal code input field */}
            <div className="flex flex-row space-x-2">
              <InputField
                label={"City"}
                value={city}
                setValue={setCity}
                isDisabled={true}
              />
              <InputField
                label={"Postal Code"}
                value={postalCode}
                setValue={setPostalCode}
                isDisabled={true}
              />
            </div>
            <InputField
              label={"Address 1"}
              value={mainAddress}
              setValue={setMainAddress}
              isDisabled={true}
            />
            <InputField
              label={"Address 2"}
              value={secondaryAddress}
              setValue={setSecondaryAddress}
              isDisabled={true}
            />
          </form>

          <div className="flex justify-between">
            <div>
              <Button type="primary" onClick={action}>
                Contact
              </Button>
            </div>
            <div>
              <Button type="outline" onClick={onClose}>
                Exit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerModal;
