import React from "react";
<<<<<<< HEAD
import "./styles/Sales.css";

const BodyContent = () => {
    return (
        <div className="sales">
            <div className="body-content-container">
                <p>Hello Sales Module!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.sales' at the start.</p>
            </div>
        </div>
    );
=======
import "./styles/Index.css";
import Heading from "./components/Heading";

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  const salesSubModule = {
    Quotation: "Quotation",
    Order: "Order",
    Delivery: "Delivery",
    Invoice: "Invoice",
    "Master List": "MasterList",
    Dunning: "Dunning",
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
>>>>>>> 0ea579597449a2ca3b3eba2bd8b608765dcc3044
};

export default BodyContent;
