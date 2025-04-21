import React from "react";
import { useState } from "react";
import "../styles/Index.css";
import Heading from "../../Sales/components/Heading";
import Button from "../../Sales/components/Button";
import Table from "../../Sales/components/Table";
import { AlertProvider } from "../../Sales/components/Context/AlertContext";
import Dropdown from "../../Sales/components/Dropdown";

import OpportunityInfo from "../components/OpportunityInfo";
import NewCustomerModal from "./../../Sales/components/Modals/NewCustomer";
import CustomerListModal from "./../../Sales/components/Modals/Lists/CustomerList";
import OpportunityTab from "./../components/OpportunityTabs/OpportunityTab";
import MainTab from "../components/OpportunityTabs/MainTab";

const Opportunity = ({ loadSubModule, setActiveSubModule, employee_id }) => {
  const [activeTab, setActiveTab] = useState("Opportunity");
  const tabs = [
    {
      name: "Opportunity",
      component: (
        <OpportunityTab setActiveTab={setActiveTab} employee_id={employee_id} />
      ),
    },
    {
      name: "Main Page",
      component: <MainTab employee_id={employee_id} />,
    },
  ];

  return (
    <div className="opportunity">
      <div className="body-content-container">
        <Heading
          Title="Opportunity"
          SubTitle="Tracking and nurturing sales opportunities to drive business success."
        />
        <main className="">
          {/* Tab Selector */}
          <div className="mt-4 flex flex-col md:flex-row lg:hidden md:justify-between md:items-center gap-4">
            <div>
              <h4 className="font-medium">Select Data:</h4>
            </div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-medium text-gray-400">View:</h4>
              <div className="w-64">
                <Dropdown
                  label=""
                  options={tabs.map((tab) => tab.name)}
                  onChange={setActiveTab}
                  value={activeTab}
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:flex mt-4 border-b border-[#E8E8E8] w-fit gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.name}
                type={activeTab === tab.name ? "active" : "link"}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.name}
              </Button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="mt-6">
            {tabs.find((tab) => tab.name === activeTab)?.component}
          </div>
        </main>
      </div>
    </div>
  );
};

const BodyContent = ({ loadSubModule, setActiveSubModule, employee_id }) => {
  return (
    <AlertProvider>
      <Opportunity
        loadSubModule={loadSubModule}
        setActiveSubModule={setActiveSubModule}
        employee_id={employee_id}
      />
    </AlertProvider>
  );
};

export default BodyContent;
