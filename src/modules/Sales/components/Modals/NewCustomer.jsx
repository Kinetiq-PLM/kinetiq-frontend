"use client";

import { useState, useEffect, useRef } from "react";

import { CountryData, CustomerTypes } from "../../temp_data/new_customer_data";
import { useAlert } from "../Context/AlertContext.jsx";

import Button from "../Button";
import generateRandomID from "../GenerateID.jsx";
import InputField from "../InputField.jsx";
import Dropdown from "../Dropdown.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { POST } from "../../api/api.jsx";

const NewCustomerModal = ({ isOpen, onClose }) => {
  const { showAlert } = useAlert();

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const [countries, setCountries] = useState(
    CountryData.map((country) => country.country)
  );
  const [cities, setCities] = useState([]);
  const [isValidationVisible, setIsValidationVisible] = useState(false);

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

  const queryClient = useQueryClient();
  const customerMutation = useMutation({
    mutationFn: async (data) => await POST("sales/customer/", data),
    onError: (error) => {
      showAlert({
        type: "error",
        title: "Failed to add Customer: " + error.message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["customers", "customerPartners"]);
      queryClient.refetchQueries(["customers", "customerPartners"]);
    },
  });

  const handleConfirm = () => {
    setIsValidationVisible(true);

    const validators = [
      validateCompanyName,
      validateContactPerson,
      validateContactNumber,
      validateEmail,
      validateCountry,
      validateCity,
      validatePostalCode,
      validateMainAddress,
      validateSecondaryAddress,
      // validateCustomerType,
    ];

    const errorCount = validators.reduce(
      (count, validate) => count + (validate() ? 1 : 0),
      0
    );

    console.log(errorCount === 0 ? "NO ERRORS" : errorCount);

    if (errorCount === 0) {
      // Add new customer HERE to database
      const request = {
        name: companyName,
        email_address: email,
        phone_number: contactNumber,
        country,
        city,
        postal_code: postalCode,
        address_line1: mainAddress,
        address_line2: secondaryAddress,
        customer_type: customerType,
        status: "Active",
        contact_person: contactPerson,
        customer_type: "Lead",
      };
      customerMutation.mutate(request);

      // Reset form fields
      setCustomerID(generateRandomID("C"));
      setCompanyName("");
      setContactPerson("");
      setContactNumber("");
      setEmail("");
      setCountry("");
      setCity("");
      setPostalCode("");
      setMainAddress("");
      setSecondaryAddress("");
      setCustomerType("");
      setIsValidationVisible(false);

      showAlert({
        type: "success",
        title: "Customer Created",
      });
      onClose();
    }
  };

  const validateCompanyName = () => {
    if (!companyName.trim()) {
      return "Company name is required.";
    }
    return "";
  };

  const validateContactPerson = () => {
    if (!contactPerson.trim()) {
      return "Contact person is required.";
    }
    return "";
  };

  const validateContactNumber = () => {
    const phoneRegex = /^[0-9]{11}$/;
    if (!contactNumber.trim()) {
      return "Contact number is required.";
    }
    if (!phoneRegex.test(contactNumber)) {
      return "Invalid contact number. Use only digits (11 characters).";
    }
    return "";
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Email is required.";
    }
    if (!emailRegex.test(email)) {
      return "Invalid email format.";
    }
    return "";
  };

  const validateCountry = () => {
    if (!country.trim()) {
      return "Country is required.";
    }
    return "";
  };

  const validateCity = () => {
    if (!city.trim()) {
      return "City is required.";
    }
    return "";
  };

  const validatePostalCode = () => {
    const postalCodeRegex = /^[0-9]+$/;
    if (!postalCode.trim()) {
      return "Postal code is required.";
    }
    if (!postalCodeRegex.test(postalCode)) {
      return "Invalid postal code. Use only digits.";
    }
    return "";
  };

  const validateMainAddress = () => {
    if (!mainAddress.trim()) {
      return "Main address is required.";
    }
    return "";
  };

  const validateSecondaryAddress = () => {
    if (!secondaryAddress.trim()) {
      return "Main address is required.";
    }
    return "";
  };

  const validateCustomerType = () => {
    if (!customerType.trim()) {
      return "Customer type is required.";
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
    setCustomerID(generateRandomID("C"));
  }, [isOpen]);

  useEffect(() => {
    if (!country) return;
    setCities(
      CountryData.find((c) => c.country === country).cities.map((c) => c.city)
    );
    setCity("");
  }, [country]);

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
            <InputField
              label={"Company Name"}
              value={companyName}
              setValue={setCompanyName}
              validation={validateCompanyName}
              isValidationVisible={isValidationVisible}
            />
            <InputField
              label={"Contact Person"}
              value={contactPerson}
              setValue={setContactPerson}
              validation={validateContactPerson}
              isValidationVisible={isValidationVisible}
            />
            <InputField
              label={"Contact Number"}
              value={contactNumber}
              setValue={setContactNumber}
              validation={validateContactNumber}
              isValidationVisible={isValidationVisible}
            />
            <InputField
              label={"Email"}
              value={email}
              setValue={setEmail}
              validation={validateEmail}
              isValidationVisible={isValidationVisible}
            />
            <Dropdown
              label="Country"
              options={countries}
              onChange={setCountry}
              value={country}
              validation={validateCountry}
              isValidationVisible={isValidationVisible}
            />
            {/* cities dropdown and postal code input field */}
            <div className="flex flex-row space-x-2">
              <Dropdown
                label="City"
                options={cities}
                onChange={setCity}
                value={city}
                validation={validateCity}
                isValidationVisible={isValidationVisible}
              />
              <InputField
                label={"Postal Code"}
                value={postalCode}
                setValue={setPostalCode}
                validation={validatePostalCode}
                isValidationVisible={isValidationVisible}
              />
            </div>
            <InputField
              label={"Address 1"}
              value={mainAddress}
              setValue={setMainAddress}
              validation={validateMainAddress}
              isValidationVisible={isValidationVisible}
            />
            <InputField
              label={"Address 2"}
              value={secondaryAddress}
              setValue={setSecondaryAddress}
              validation={validateSecondaryAddress}
              isValidationVisible={isValidationVisible}
            />
            {/* <Dropdown
              label="Customer Type"
              options={CustomerTypes}
              onChange={setCustomerType}
              value={customerType}
              validation={validateCustomerType}
              isValidationVisible={isValidationVisible}
            /> */}
          </form>

          <div className="flex justify-between">
            <div>
              <Button
                type="primary"
                className={"mr-2"}
                onClick={handleConfirm}
                submit={true}
              >
                Add
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
