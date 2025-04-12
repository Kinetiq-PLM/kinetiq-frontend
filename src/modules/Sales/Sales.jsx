import React from "react";
import "./styles/Index.css";
import Heading from "./components/Heading";

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  const salesSubModule = {
    Quotation: "Quotation",
    Order: "Order",
    Delivery: "Delivery",
    Invoice: "Invoice",
    "Master List": "MasterList",
    Reporting: "Reporting",
    Returns: "Returns",
  };

  return (
    <div className="sales">
      <div className="body-content-container">
        <Heading
          Title="Sales Dashboard"
          SubTitle="Your shortcut to all sales operations."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {Object.entries(salesSubModule).map(([key, value]) => (
            <button
              key={value}
              className="flex items-center justify-center bg-[#FAFAFA] rounded-lg border border-gray-200 p-10 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer font-bold text-xl"
              onClick={() => {
                loadSubModule(key);
                setActiveSubModule(key);
              }}
            >
              <span className="font-medium text-gray-800">{key}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BodyContent;
