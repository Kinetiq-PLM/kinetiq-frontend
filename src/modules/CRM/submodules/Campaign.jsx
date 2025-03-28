import React from "react";
import { useState } from "react";
import "../styles/Index.css";
import Heading from "../../Sales/components/Heading";
import Button from "../../Sales/components/Button";
import Table from "../../Sales/components/Table";
import Dropdown from "../../Sales/components/Dropdown";
import { AlertProvider } from "../../Sales/components/Context/AlertContext";

import CampaignListTab from "./../components/CampaignTabs/CampaignListTab";
import CampaignContactTab from "./../components/CampaignTabs/CampaignContactTab";

const Campaign = () => {
  const tabs = [
    {
      name: "Campaign",
      component: <CampaignListTab />,
    },
    {
      name: "Campaign Contact",
      component: <CampaignContactTab />,
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].name); // Default to first tab

  return (
    <div className="partner-master-data">
      <div className="body-content-container">
        <Heading
          Title="Campaign"
          SubTitle="Advertisements to enhance our sales and services."
        />
        <main className="">
          {/* Tab Selector */}
          <div className="mt-4 flex flex-col md:flex-row lg:hidden md:justify-between md:items-center gap-4">
            <div>
              <h4 className="font-medium">Select Action:</h4>
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

const BodyContent = () => {
  return (
    <AlertProvider>
      <Campaign />
    </AlertProvider>
  );
};

export default BodyContent;
