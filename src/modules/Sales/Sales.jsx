"use client";

import { useEffect } from "react";
import "./styles/Index.css";
import Heading from "./components/Heading";

import { useState } from "react";
import RequestModal from "./components/Modals/RequestModal";

const BodyContent = ({ loadSubModule, setActiveSubModule, employee_id }) => {
  console.log(employee_id);
  const salesSubModule = {
    Quotation: "Quotation",
    Order: "Order",
    Delivery: "Delivery",
    // Invoice: "Invoice",
    // "Blanket Agreement": "BlanketAgreement",
    "Master List": "MasterList",
    Reporting: "Reporting",
    // Return: "Return",
  };

  const [requestModal, setRequestModal] = useState("");
  const [action, setAction] = useState("");

  useEffect(() => {
    // ADD HERE LOGIC FOR Purchase Request, Project Request, Workforce Request
  }, [action]);

  const type1 =
    "h-[200px] min-w-[200px] transition-all duration-300 ease-in-out transform flex items-center justify-center rounded-lg border p-10 shadow-md cursor-pointer font-bold text-2xl text-white bg-[#00A8A8] hover:scale-105 hover:shadow-md";
  const type2 =
    "h-[200px] min-w-[200px] transition-all duration-300 ease-in-out transform flex items-center justify-center rounded-lg p-10 shadow-md cursor-pointer font-bold text-2xl text-[#00A8A8] bg-[#E4FDFB] hover:scale-105 hover:shadow-lg";

  return (
    <div className="sales">
      <RequestModal
        isOpen={requestModal}
        onClose={() => setRequestModal(false)}
        setAction={setAction}
      ></RequestModal>
      <div className="body-content-container">
        <Heading
          Title="Sales Dashboard"
          SubTitle="Your shortcut to all sales operations."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mb-4">
          {Object.entries(salesSubModule).map(([key, value], index) => {
            const buttonStyle = index % 2 === 0 ? type1 : type2;
            return (
              <button
                key={value}
                className={buttonStyle}
                onClick={() => {
                  loadSubModule(key);
                  setActiveSubModule(key);
                }}
              >
                <span className="font-medium">{key}</span>
              </button>
            );
          })}

          <button
            className={type2}
            onClick={() => {
              setRequestModal(true);
            }}
          >
            <span className="font-medium">Request</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BodyContent;
