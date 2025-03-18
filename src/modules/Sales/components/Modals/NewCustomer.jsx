"use client";

import { useState, useEffect, useRef } from "react";

import { CountryData, CustomerTypes } from "../../temp_data/new_customer_data";

import Button from "../Button";
import generateRandomID from "../GenerateID.jsx";
import InputField from "../InputField.jsx";
import Dropdown from "../Dropdown.jsx";

const NewCustomerModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const countryNames = CountryData.map((country) => country.country);

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
  const [customerType, setCustomerType] = useState("");

  const handleConfirm = () => {
    onClose();
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
    setCustomerID(generateRandomID("C"));
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
            New Business Partner
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
            <div>
              <p className="text-sm">Customer ID</p>
              <div className="mt-2 bg-[#F9FAFA] w-full py-2 px-3 rounded">
                <p className="text-sm">{customerID}</p>
              </div>
            </div>
            <InputField
              label={"Company Name"}
              value={companyName}
              setValue={setCompanyName}
            />
            <InputField
              label={"Contact Person"}
              value={contactPerson}
              setValue={setContactPerson}
            />
            <InputField
              label={"Contact Number"}
              value={contactNumber}
              setValue={setContactNumber}
            />
            <InputField label={"Email"} value={email} setValue={setEmail} />
            <Dropdown
              label="Country"
              options={countryNames}
              onChange={setCountry}
              value={country}
            />
            {/* cities dropdown and postal code input field */}
            <div className="flex flex-row space-x-2">
              <Dropdown
                label="City"
                options={countryNames}
                onChange={setCountry}
                value={country}
              />
              <InputField
                label={"Postal Code"}
                value={mainAddress}
                setValue={setMainAddress}
              />
            </div>
            <InputField
              label={"Main Address"}
              value={mainAddress}
              setValue={setMainAddress}
            />
            <InputField
              label={"Secondary Address"}
              value={secondaryAddress}
              setValue={setSecondaryAddress}
            />
            <Dropdown
              label="Customer Type"
              options={CustomerTypes}
              onChange={setCustomerType}
              value={customerType}
            />
          </form>

          <div className="mt-4 flex justify-between">
            <div>
              <Button type="primary" className={"mr-2"} onClick={handleConfirm}>
                Add
              </Button>
              <Button
                type="primary"
                className={"mr-2"}
                onClick={() => {
                  console.log(countryNames);
                }}
              >
                Countries
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

export default NewCustomerModal;
