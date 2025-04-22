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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mb-4">
          {Object.entries(salesSubModule).map(([key, value], index) => {
            return (
              <button
                key={value}
                className="h-[170px] transition-all duration-300 ease-in-out transform flex items-center justify-center rounded-lg p-10 shadow-md cursor-pointer font-bold text-2xl text-[#00A8A8] bg-[#E4FDFB] hover:scale-105 hover:shadow-lg"
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
            className="h-[170px] transition-all duration-300 ease-in-out transform flex items-center justify-center rounded-lg p-10 shadow-md cursor-pointer font-bold text-2xl text-[#00A8A8] bg-[#E4FDFB] hover:scale-105 hover:shadow-lg"
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
