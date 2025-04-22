import React, { useEffect } from "react";
import { useState } from "react";

export const InputCustomer = ({ label, value = "", customerListModal }) => {
  return (
    <div className="flex justify-between mb-2 w-full flex-col sm:flex-row">
      <p className="flex-1 text-sm">{label}</p>
      <div
        className="border border-[#9a9a9a] flex-1 cursor-pointer p-1 flex hover:border-[#969696] transition-all duration-300 justify-between transform hover:opacity-60 items-center min-h-[30px] rounded truncate"
        onClick={() => {
          customerListModal(true);
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
      <p className="flex-1 text-sm">{label}</p>
      <div
        className={`border border-[#9a9a9a] flex-1 p-1 min-h-[30px] rounded truncate whitespace-nowrap ${
          value === "" ? "bg-[#f7f7f7]" : ""
        }`}
      >
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
};

const OpportunityInfo = ({ customerListModal, customer }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:gap-6">
      <div className="h-full w-full flex flex-col items-center  flex-1 ">
        <InputCustomer
          label={"Customer ID"}
          value={customer.customer_id}
          customerListModal={customerListModal}
        />
        <Information label={"Contact Person"} value={customer.contact_person} />
      </div>

      <div className="lg:max-w-[100px] xl:max-w-none flex-1 hidden lg:block"></div>

      <div className="h-full w-full flex flex-col items-center flex-1 ">
        <Information label={"Number"} value={customer.phone_number} />
        <Information label={"Email"} value={customer.email_address} />
      </div>
    </div>
  );
};

export default OpportunityInfo;
