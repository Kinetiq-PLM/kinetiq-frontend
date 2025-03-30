import React, { useEffect } from "react";
import { useState } from "react";

const InputCustomer = ({ label, value = "", customerListModal }) => {
  return (
    <div className="flex justify-between mb-2 w-full">
      <p className="flex-1 text-sm">{label}</p>
      <div
        className="border border-[#9a9a9a] flex-1 cursor-pointer p-1 flex hover:border-[#969696] transition-all duration-300 justify-between transform hover:opacity-60 items-center h-[30px] rounded"
        onClick={() => customerListModal(true)}
      >
        <p className="text-sm">{value}</p>
        <img
          src="/icons/information-icon.svg"
          className="h-[15px]"
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
        className={`border border-[#9a9a9a] flex-1 p-1 h-[30px] rounded ${
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
    <div className="flex justify-between mb-2 w-full">
      <p className="flex-1 text-sm">{label}</p>
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
          className={`border border-[#9a9a9a] flex-1 p-1 h-[30px] bg-[#f7f7f7]`}
        ></div>
      )}
    </div>
  );
};

const TicketInfo = ({
  type,
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
        <Information label={"Email"} value={customer.country} />
        <Information label={"Number"} value={customer.phone_number} />
      </div>
      <div className="w-full hidden xl:block"></div>
      <div className="h-full w-full flex flex-col items-center">
        <Information label={`${type} ID`} value={operationID} />
        <AddressDropbar
          label={"Status"}
          customer={customer}
          setCustomerAddress={setAddress}
        />
        <AddressDropbar
          label={"Priority"}
          customer={customer}
          setCustomerAddress={setAddress}
        />
        <Information label={"Date"} value={date} />
      </div>
    </section>
  );
};

export default TicketInfo;
