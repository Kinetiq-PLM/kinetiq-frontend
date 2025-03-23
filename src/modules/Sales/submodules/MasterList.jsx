import React, { useState } from "react";
import "../styles/Index.css";
import Heading from "../components/Heading";
import Button from "../components/Button";

const tabs = [
  "Quotations",
  "Orders",
  "Deliveries",
  "Invoices",
  "Blanket Agreements",
  "Opportunities",
];

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]); // Default to first tab

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (setActiveSubModule) setActiveSubModule(tab); // Update parent state if provided
  };

  return (
    <div className="master-list">
      <div className="body-content-container">
        <Heading
          Title="Master List"
          SubTitle="Comprehensive lists regarding various information used in sales."
        />

        {/* Tab Selector */}
        <div className="mt-4 border-b border-[#E8E8E8] w-fit">
          {tabs.map((tab) => (
            <Button
              key={tab}
              type={activeTab === tab ? "active" : "link"}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BodyContent;
