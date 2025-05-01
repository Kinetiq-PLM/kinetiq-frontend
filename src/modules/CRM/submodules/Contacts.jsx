import React, { useEffect } from "react";
import { useState } from "react";
import "../styles/Index.css";
import Heading from "../../Sales/components/Heading";
import Button from "../../Sales/components/Button";
import Table from "../../Sales/components/Table";
import Dropdown from "../../Sales/components/Dropdown";
import { AlertProvider } from "../../Sales/components/Context/AlertContext";

import CustomerTab from "../components/ContactTabs/ClosedTab";
import ProspectTab from "../components/ContactTabs/ProspectTab";
import ViewCustomerModal from "../../Sales/components/Modals/ViewCustomer";
import MessageModal from "../components/MessageModal.jsx";

const PartnerMasterData = () => {
  const [selected, setSelected] = useState("");
  const [isViewCustomerModalOpen, setIsViewCustomerModalOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false); // Message modal open state

  const tabs = [
    {
      name: "Customers",
      component: <CustomerTab setSelected={setSelected} />,
    },
    {
      name: "Prospects",
      component: <ProspectTab setSelected={setSelected} />,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].name); // Default to first tab

  useEffect(() => {
    console.log("Selected customer:", selected);
    setSelected("");
  }, [activeTab]);

  return (
    <div className="partner-master-data">
      <ViewCustomerModal
        isOpen={isViewCustomerModalOpen}
        onClose={() => setIsViewCustomerModalOpen(false)}
        data={selected}
        action={() => setIsMessageOpen(true)}
      ></ViewCustomerModal>

      <MessageModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        contacts={[selected]}
      ></MessageModal>

      <div className="body-content-container">
        <Heading
          Title="Contacts"
          SubTitle="Further nurturing and maintaining of business connections."
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

          <div className="mt-4 flex gap-4">
            <Button
              onClick={() => setIsViewCustomerModalOpen(true)}
              type="primary"
              className="w-full sm:w-[200px] py-2"
              disabled={!selected}
            >
              View
            </Button>

            <Button
              onClick={() => setIsMessageOpen(true)}
              type="primary"
              className="w-full sm:w-[200px] py-2"
              disabled={!selected}
            >
              Contact
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

const BodyContent = () => {
  return (
    <AlertProvider>
      <PartnerMasterData />
    </AlertProvider>
  );
};

export default BodyContent;
