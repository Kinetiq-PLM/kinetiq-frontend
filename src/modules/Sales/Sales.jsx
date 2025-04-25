"use client";

import "./styles/Index.css";
import Heading from "./components/Heading";

const BodyContent = ({ loadSubModule, setActiveSubModule, employee_id }) => {
  console.log(employee_id);
  const salesSubModule = {
    Quotation: "Quotation",
    Order: "Order",
    Delivery: "Delivery",
    Transactions: "Transactions",
    Reporting: "Reporting",
  };

  return (
    <div className="sales">
      <div className="body-content-container">
        <Heading
          Title="Sales Dashboard"
          SubTitle="Your shortcut to all sales operations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mb-4">
          {Object.entries(salesSubModule).map(([key, value], index) => {
            return (
              <button
                key={value}
                className="h-[170px] transition-all duration-300 ease-in-out transform flex items-center justify-center rounded-lg p-10 shadow-md cursor-pointer font-bold text-2xl text-[#00A8A8] bg-[#E4FDFB] hover:scale-105 hover:shadow-lg"
                onClick={() => {
                  loadSubModule(key);
                  setActiveSubModule(key);
                  console.log(key);
                }}
              >
                <span className="font-medium">{key}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BodyContent;
