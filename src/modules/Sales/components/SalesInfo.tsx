import React, { useEffect } from "react";
import { useState } from "react";

const InputCustomer = ({
  label,
  value = "",
  customerListModal,
  enabled = true,
}) => {
  return (
    <div className="flex justify-between mb-2 w-full flex-col sm:flex-row">
      <p className="flex-1">{label}</p>
      <div
        className="border border-[#9a9a9a] flex-1 cursor-pointer p-1 flex hover:border-[#969696] transition-all duration-300 justify-between transform hover:opacity-60 items-center min-h-[30px] rounded"
        onClick={() => {
          if (enabled) {
            customerListModal(true);
          }
        }}
      >
        <p className="text-sm truncate overflow-hidden whitespace-nowrap flex-1">
          {value}
        </p>
        <img
          src="/icons/information-icon.svg"
          className="h-[15px] ml-2 flex-shrink-0"
          alt="info icon"
        />
      </div>
    </div>
  );
};
const Information = ({ label, value = "" }) => {
  return (
    <div className="flex justify-between mb-2 w-full flex-col sm:flex-row">
      <p className="flex-1">{label}</p>
      <div
        className={`border border-[#9a9a9a] flex-1 p-1 min-h-[30px] rounded overflow-x-auto whitespace-nowrap ${
          value === "" ? "bg-[#f7f7f7]" : ""
        }`}
      >
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
};

const AddressDropbar = ({ label, customer, setCustomerAddress }) => {
  const [address, setAddress] = useState(
    customer.address_line1 || customer.address_line2 || ""
  );

  const addresses = [customer.address_line1, customer.address_line2].filter(
    Boolean
  );

  const handleAddressChange = (event) => {
    const selectedAddress = event.target.value;
    setAddress(selectedAddress);
    setCustomerAddress(selectedAddress);
  };

  useEffect(() => {
    setAddress(customer.address_line1);
    setCustomerAddress(customer.address_line1);
  }, [customer]);

  return (
    <div className="flex justify-between mb-2 w-full flex-col sm:flex-row">
      <p className="flex-1">{label}</p>
      {customer ? (
        <select
          className="border border-[#9a9a9a] flex-1 p-1 h-[30px] bg-white rounded cursor-pointer text-sm"
          onChange={handleAddressChange}
          value={address || ""}
        >
          {addresses.map((addr, index) => (
            <option key={index} value={addr}>
              {addr}
            </option>
          ))}
        </select>
      ) : (
        <div
          className={`border border-[#9a9a9a] flex-1 p-1 min-h-[30px] bg-[#f7f7f7]`}
        ></div>
      )}
    </div>
  );
};

const DateSelector = ({ label, customer, setDeliveryDate, disabled }) => {
  // Calculate the default date (3 days from today)
  const defaultDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Initialize state with the customer's delivery date or default date
  const [date, setDate] = useState(customer.delivery_date || defaultDate);

  // Effect to set the default date when the component mounts
  useEffect(() => {
    if (!customer.delivery_date) {
      setDeliveryDate(defaultDate);
    }
  }, []); // Runs only once on mount

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
    setDeliveryDate(selectedDate);
  };

  return (
    <div className="flex justify-between mb-2 w-full flex-col sm:flex-row">
      <p className="flex-1">{label}</p>
      <input
        type="date"
        className="border border-[#9a9a9a] flex-1 p-1 min-h-[30px] rounded cursor-pointer disabled:cursor-default disabled:bg-[#f7f7f7]"
        onChange={handleDateChange}
        value={date}
        min={defaultDate} // Restrict to at least 3 days from now
        disabled={disabled}
      />
    </div>
  );
};

const SalesInfo = ({
  type,
  customerListModal,
  customer,
  setCustomerInfo,
  operationID,
  setAddress,
  setDeliveryDate,
  enabled = true,
}) => {
  let id = "";
  if (type === "Quotation") {
    id = "quotation_id";
  } else if (type === "Order") {
    id = "order_id";
  } else if (type === "Delivery") {
    id = "Delivery_id";
  } else if (type === "Invoice") {
    id = "invoice_id";
  }

  return (
    <section className="flex justify-between gap-6 flex-col md:flex-row">
      <div className="h-full w-full flex flex-col items-center">
        {type === "Delivery" ? (
          <Information label={"Customer ID"} value={customer.customer_id} />
        ) : (
          <InputCustomer
            label={"Customer"}
            value={customer.customer_id}
            customerListModal={customerListModal}
            enabled={enabled}
          />
        )}
        <Information label={"Name"} value={customer.name} />
        <Information label={"Country"} value={customer.country} />
        <Information label={"Number"} value={customer.phone_number} />
      </div>
      <div className="w-full hidden xl:block"></div>
      <div className="h-full w-full flex flex-col items-center">
        <Information label={`${type} ID`} value={operationID} />
        {/* Generate a random ID */}
        <Information label={"Status"} value={customer.status} />
        {/* Current status of the customer: Active or Inactive, after a transaction update to Active  */}
        <AddressDropbar
          label={"Address"}
          customer={customer}
          setCustomerAddress={setAddress}
        />
        {/* Dropdown to select address 1 or 2 */}
        <DateSelector
          customer={customer}
          setDeliveryDate={setDeliveryDate}
          label={
            ["Quotation", "Order"].includes(type)
              ? "Date Issued"
              : "Delivery Date"
          }
          disabled={["Quotation", "Order"].includes(type)}
        />
        {/* Date Selector*/}
      </div>
    </section>
  );
};

export default SalesInfo;
