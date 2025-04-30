import React, { useState, useEffect } from "react";

const InputCustomer = ({
  label,
  value = "",
  customerListModal,
  enabled = true,
}) => {
  return (
    <div className="flex justify-between mb-2 w-full flex-col sm:flex-row">
      <p className="w-[150px]">{label}</p>
      <div
        className="border border-[#9a9a9a] flex-1 cursor-pointer p-1 flex hover:border-[#969696] transition-all duration-300 justify-between transform hover:opacity-60 items-center min-h-[30px] rounded overflow-hidden"
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
    <div className="flex justify-end mb-2 w-full flex-col sm:flex-row">
      <p className="w-[150px]">{label}</p>
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
      <p className="w-[150px]">{label}</p>
      {customer ? (
        <select
          className="border border-[#9a9a9a] flex-1 p-1 h-[30px] bg-white rounded cursor-pointer text-sm truncate"
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
          className={`border border-[#9a9a9a] flex-1 p-1 min-h-[30px] rounded bg-[#f7f7f7]`}
        ></div>
      )}
    </div>
  );
};

const DateIssuedSelector = ({
  label,
  customer,
  setDateIssued,
  disabled = true,
  defaultDate = new Date(Date.now() * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
}) => {
  // Calculate the default date (3 days from today)

  // Initialize state with the customer's delivery date or default date
  const [date, setDate] = useState(customer.issued_date || defaultDate);

  // Effect to set the default date when the component mounts
  useEffect(() => {
    if (!customer.issued_date) {
      setDateIssued(defaultDate);
    }
    console.log("customer.issued_date", defaultDate);
  }, []); // Runs only once on mount

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
    setDateIssued(selectedDate);
  };

  return (
    <div className="flex justify-between mb-2 w-full flex-col sm:flex-row">
      <p className="w-[150px]">{label}</p>
      <input
        type="date"
        className="border border-[#9a9a9a] flex-1 p-1 min-h-[30px] rounded cursor-pointer  text-sm disabled:cursor-default disabled:bg-[#f7f7f7]"
        onChange={handleDateChange}
        value={date}
        min={defaultDate} // Restrict to at least 3 days from now
        disabled={disabled}
      />
    </div>
  );
};

const DatePostedSelector = ({
  label,
  customer,
  setDatePosted,
  disabled = false,
}) => {
  // Calculate the default date (3 days from today)

  // Initialize state with the customer's delivery date or default date
  const [date, setDate] = useState(customer.posted_date);

  // Effect to set the default date when the component mounts
  useEffect(() => {
    if (!customer.delivery_date) {
      //setDatePosted(defaultDate);
    }
  }, []); // Runs only once on mount

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDatePosted(selectedDate);
    //setDatePosted(selectedDate);
  };

  return (
    <div className="flex justify-between mb-2 w-full flex-col sm:flex-row">
      <p className="w-[150px]">{label}</p>
      <input
        type="date"
        className="border border-[#9a9a9a] flex-1 p-1 min-h-[30px] rounded cursor-pointer  text-sm disabled:cursor-default disabled:bg-[#f7f7f7]"
        onChange={handleDateChange}
        value={date} // Restrict to at least 3 days from now
        disabled={disabled}
      />
    </div>
  );
};

const DateDeliverySelector = ({
  label,
  customer,
  setDateDelivery,
  disabled = false,
  dateIssued,
  defaultDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
}) => {
  const [date, setDate] = useState(customer.delivery_date || defaultDate);

  useEffect(() => {
    if (!customer.delivery_date) {
      setDateDelivery(defaultDate);
    }
  }, []);

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;

    if (new Date(selectedDate) < new Date(dateIssued)) {
      alert("Delivery Date cannot be before the Date Issued.");
      return; // Don't allow setting wrong date
    }

    setDate(selectedDate);
    setDateDelivery(selectedDate);
  };

  return (
    <div className="flex justify-between mb-2 w-full flex-col sm:flex-row">
      <p className="w-[150px]">{label}</p>
      <input
        type="date"
        className="border border-[#9a9a9a] flex-1 p-1 min-h-[30px] rounded cursor-pointer text-sm disabled:cursor-default disabled:bg-[#f7f7f7]"
        onChange={handleDateChange}
        value={date}
        min={dateIssued} // force user to pick at least issued date
        disabled={disabled}
      />
    </div>
  );
};

const SalesInfo = ({
  type,
  customerListModal,
  customer,
  operationID,
  setAddress,
  setDateIssued,
  setDatePosted = "",
  setDateDelivery = "",
  enabled = true,
  date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
}) => {
  const [issuedDateLocal, setIssuedDateLocal] = useState(
    customer.issued_date || date
  );

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
    <section className="flex flex-col md:flex-row md:gap-6">
      {/* Left Column */}
      <div className="flex flex-1 flex-col items-center space-y-2">
        {type === "Delivery" ? (
          <Information label="Customer ID" value={customer.customer_id} />
        ) : (
          <InputCustomer
            label="Customer"
            value={customer.customer_id}
            customerListModal={customerListModal}
            enabled={enabled}
          />
        )}
        <Information label="Name" value={customer.name} />
        <Information label="Country" value={customer.country} />
        <Information label="Number" value={customer.phone_number} />

        {type !== "Quotation" ? (
          <DateIssuedSelector
            customer={customer}
            setDateIssued={(value) => {
              setIssuedDateLocal(value);
              setDateIssued(value);
            }}
            label={"Date Issued"}
            defaultDate={date}
          />
        ) : (
          ""
        )}
      </div>

      <div className="lg:max-w-[100px] xl:max-w-none flex-1 hidden lg:block"></div>

      {/* Right Column */}
      <div className="flex flex-1 flex-col items-center space-y-2">
        <Information label={`${type} ID`} value={operationID} />
        <Information label="Status" value={customer.status} />
        <AddressDropbar
          label="Address"
          customer={customer}
          setCustomerAddress={setAddress}
        />

        {type == "Quotation" ? (
          <DateIssuedSelector
            customer={customer}
            setDateIssued={(value) => {
              setIssuedDateLocal(value);
              setDateIssued(value);
            }}
            label={"Date Issued"}
            defaultDate={date}
          />
        ) : (
          ""
        )}

        {setDatePosted !== "" ? (
          <DatePostedSelector
            customer={customer}
            setDatePosted={setDatePosted}
            label={"Date Posted"}
          />
        ) : (
          ""
        )}
        {setDateDelivery !== "" ? (
          <DateDeliverySelector
            customer={customer}
            setDateDelivery={setDateDelivery}
            label={"Date Delivery"}
            defaultDate={date}
            dateIssued={issuedDateLocal} // <-- use locally tracked issued date
          />
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

export default SalesInfo;
