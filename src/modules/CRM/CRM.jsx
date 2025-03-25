import React from "react";
import "./styles/index.css";
import Heading from "../Sales/components/Heading";

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  const crmSubModule = {
    Ticket: "Ticket",
    Campaign: "Campaign",
    "Partner Master Data": "PartnerMasterData",
    Opportunity: "Opportunity",
  };

  return (
    <div className="crm">
      <div className="body-content-container">
        <Heading
          Title="CRM Dashboard"
          SubTitle="Your shortcut to all CRM operations."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {Object.entries(crmSubModule).map(([key, value]) => (
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
