import React from "react";
import "./styles/index.css";
import Heading from "../Sales/components/Heading";

const BodyContent = ({ loadSubModule, setActiveSubModule, employee_id }) => {
  const crmSubModule = {
    Ticket: "Ticket",
    Campaign: "Campaign",
    "Partner Master Data": "PartnerMasterData",
    Opportunity: "Opportunity",
    Support: "Support",
  };

  const type1 =
    "h-[200px] min-w-[200px] transition-all duration-300 ease-in-out transform flex items-center justify-center rounded-lg border p-10 shadow-md cursor-pointer font-bold text-2xl text-white bg-[#00A8A8] hover:scale-105 hover:shadow-md";
  const type2 =
    "h-[200px] min-w-[200px] transition-all duration-300 ease-in-out transform flex items-center justify-center rounded-lg p-10 shadow-md cursor-pointer font-bold text-2xl text-[#00A8A8] bg-[#E4FDFB] hover:scale-105 hover:shadow-lg";

  return (
    <div className="crm">
      <div className="body-content-container">
        <Heading
          Title="CRM Dashboard"
          SubTitle="Your shortcut to all CRM operations."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mb-4">
          {Object.entries(crmSubModule).map(([key, value], index) => {
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
        </div>
      </div>
    </div>
  );
};

export default BodyContent;
