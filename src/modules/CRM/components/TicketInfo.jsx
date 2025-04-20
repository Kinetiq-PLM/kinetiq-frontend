import React, { useEffect } from "react";
import { useState } from "react";

const InputCustomer = ({ label, value = "", customerListModal }) => {
  return (
    <div className="flex justify-between mb-2 w-full flex-col sm:flex-row">
      <p className="flex-1 text-sm">{label}</p>
      <div
        className="border border-[#9a9a9a] flex-1 cursor-pointer p-1 flex hover:border-[#969696] transition-all duration-300 justify-between transform hover:opacity-60 items-center min-h-[30px] rounded"
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
    <div className="flex justify-between mb-2 w-full">
      <p className="flex-1 text-sm">{label}</p>
      <div
        className={`border border-[#9a9a9a] flex-1 p-1 h-[30px] rounded whitespace-nowrap overflow-x-auto ${
          value === "" ? "bg-[#f7f7f7]" : ""
        }`}
      >
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
};

const PriorityDropbar = ({ label, setTicketInfo }) => {
  const priorityType = ["Low", "Medium", "High", "Urgent"];

  const [priority, setPriority] = useState();

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
    setTicketInfo((prev) => ({
      ...prev,
      priority: event.target.value,
    }));
    // console.log("Priority: ", event.target.value);
  };

  return (
    <div className="flex justify-between mb-2 w-full">
      <p className="flex-1 text-sm">{label}</p>
      <select
        className="border border-[#9a9a9a] flex-1 p-1 h-[30px] bg-white rounded cursor-pointer text-sm"
        onChange={handlePriorityChange}
        value={priority || ""}
      >
        <option value="" disabled defaultValue={true}>
          Select priority
        </option>
        {priorityType.map((addr, index) => (
          <option key={index} value={addr}>
            {addr}
          </option>
        ))}
      </select>
    </div>
  );
};
const StatusDropbar = ({ label, setTicketInfo }) => {
  const statusType = ["Open", "In Progress", "Closed"];

  const [status, setStatus] = useState();

  const handlePriorityChange = (event) => {
    setStatus(event.target.value);
    setTicketInfo((prev) => ({
      ...prev,
      status: event.target.value,
    }));
    // console.log("Priority: ", event.target.value);
  };

  return (
    <div className="flex justify-between mb-2 w-full">
      <p className="flex-1 text-sm">{label}</p>
      <select
        className="border border-[#9a9a9a] flex-1 p-1 h-[30px] bg-white rounded cursor-pointer text-sm"
        onChange={handlePriorityChange}
        value={status || ""}
      >
        <option value="" disabled defaultValue={true}>
          Select status
        </option>
        {statusType.map((addr, index) => (
          <option key={index} value={addr}>
            {addr}
          </option>
        ))}
      </select>
    </div>
  );
};

const TicketInfo = ({
  type,
  ticket,
  customer,
  date,
  customerListModal,
  setTicketInfo,
  operationID,
  setAddress,
}) => {
  //   let id = "";
  //   if (type === "Quotation") {
  //     id = "quotation_id";
  //   } else if (type === "Order") {
  //     id = "order_id";
  //   } else if (type === "Delivery") {
  //     id = "Delivery_id";
  //   } else if (type === "Invoice") {
  //     id = "invoice_id";
  //   }

  return (
    <section className="flex justify-between gap-6 flex-col md:flex-row">
      <div className="h-full w-full flex flex-col items-center">
        <InputCustomer
          label={"Customer ID"}
          value={customer.customer_id}
          customerListModal={customerListModal}
        />
        <Information label={"Name"} value={customer.name} />
        <Information label={"Country"} value={customer.country} />
        <Information label={"Number"} value={customer.phone_number} />
      </div>
      <div className="w-full hidden xl:block"></div>
      <div className="h-full w-full flex flex-col items-center">
        <Information label={`${type} ID`} value={operationID} />
        {/* <PriorityDropbar
          label={"Status"}
          customer={customer}
          setCustomerAddress={setAddress}
        /> */}
        <PriorityDropbar label={"Priority"} setTicketInfo={setTicketInfo} />
        <StatusDropbar label={"Status"} setTicketInfo={setTicketInfo} />
        <Information label={"Date"} value={date} />
      </div>
    </section>
  );
};

export default TicketInfo;
