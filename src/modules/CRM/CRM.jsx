import React from "react";
import "./styles/Index.css";
import Heading from "../Sales/components/Heading";

const BodyContent = ({ loadSubModule, setActiveSubModule, employee_id }) => {
  const crmSubModule = {
    Leads: "Leads",
    Opportunity: "Opportunity",
    Campaign: "Campaign",
    Contacts: "Contacts",
    Cases: "Cases",
  };

  return (
    <div className="crm">
      <div className="body-content-container">
        <Heading
          Title="CRM Dashboard"
          SubTitle="Your shortcut to all CRM operations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mb-4">
          {Object.entries(crmSubModule).map(([key, value], index) => {
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
        </div>
      </div>
    </div>
  );
};

export default BodyContent;
