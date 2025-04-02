import React from "react";
import Button from "./Button";

const InputCustomer = ({ label, value = "", customerListModal }) => {
  return (
    <div className="flex justify-between mb-2 w-full flex-col sm:flex-row">
      <p className="flex-1">{label}</p>
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

const InputDelivery = ({ label, value = "", deliveredListModal }) => {
  return (
    <div className="flex justify-between mb-2 w-full flex-col sm:flex-row">
      <p className="flex-1">{label}</p>
      <div
        className="border border-[#9a9a9a] flex-1 cursor-pointer p-1 flex hover:border-[#969696] transition-all duration-300 justify-between transform hover:opacity-60 items-center h-[30px] rounded"
        onClick={() => deliveredListModal(true)}
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
    <div className="flex justify-between mb-2 w-full flex-col sm:flex-row">
      <p className="flex-1">{label}</p>
      <div
        className={`border border-[#9a9a9a] flex-1 p-1 h-[30px] rounded overflow-x-auto whitespace-nowrap ${
          value === "" ? "bg-[#f7f7f7]" : ""
        }`}
      >
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
};

const ReturnInfo = ({
  customerListModal,
  deliveredListModal,
  customer,
  delivery,
  returnID,
}) => {
  return (
    <section className="flex justify-between gap-6 flex-col md:flex-row">
      <div className="h-full w-full flex flex-col items-center">
        <InputCustomer
          label={"Customer"}
          value={customer.customer_id}
          customerListModal={customerListModal}
        />
        <Information label={"Name"} value={customer.name} />
        <Information label={"Country"} value={customer.country} />
        <Information label={"Number"} value={customer.phone_number} />
      </div>
      <div className="w-full hidden xl:block"></div>
      <div className="h-full w-full flex flex-col items-center">
        {customer.customer_id != undefined ? (
          <InputDelivery
            label={"Delivery ID"}
            value={delivery.delivery_note_id}
            deliveredListModal={deliveredListModal}
          />
        ) : (
          <Information
            label={"Delivery ID"}
            value={delivery.delivery_note_id}
          />
        )}

        <Information label={"Date Delivered"} value={delivery.delivered_date} />
        <Information
          label={"Address"}
          value={
            delivery.statement
              ? `${delivery.statement.customer.address_line1} ${delivery.statement.customer.address_line2}`
              : ""
          }
        />
        <Information label={"Return ID"} value={returnID} />
      </div>
    </section>
  );
};

export default ReturnInfo;
