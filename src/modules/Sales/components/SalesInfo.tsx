import React from "react";
import { useState } from "react";
import CustomerListModal from "./Modals/Lists/CustomerList";

const InputCustomer = ({ label, value = "", customerListModal }) => {
  return (
    <div className="flex justify-between mb-2 w-full">
      <p className="flex-1">{label}</p>
      <div
        className="border border-[#9a9a9a] flex-1"
        onClick={() => customerListModal(true)}
      >
        {value}
      </div>
    </div>
  );
};
const Information = ({ label, value = "" }) => {
  return (
    <div className="flex justify-between mb-2 w-full">
      <p className="flex-1">{label}</p>
      <div className="border border-[#9a9a9a] flex-1">{value}</div>
    </div>
  );
};

const SalesInfo = ({ type, customerListModal, customer }) => {
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
      <div className="w-full">
        <InputCustomer
          label={"Customer"}
          value={customer.customer_id}
          customerListModal={customerListModal}
        />
        <Information label={"Name"} value={customer.name} />
        <Information label={"Email"} value={customer.country} />
        <Information label={"Number"} value={customer.phone_number} />
      </div>
      <div className="w-full hidden lg:block"></div>
      <div className="w-full">
        <Information label={`${type} ID`} /> {/* Generate a random ID */}
        <Information label={"Status"} value={customer.status} />{" "}
        {/* Dropdown for status */}
        <Information label={"Address"} />
        <Information label={"Delivery Date"} /> {/* Date Selector*/}
      </div>
    </section>
  );
};

export default SalesInfo;
