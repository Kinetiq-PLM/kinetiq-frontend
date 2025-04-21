import React, { useEffect, useState } from "react";
import "../styles/Index.css";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";

import QuotationsTab from "./../components/MasterListTabs/QuotationsTab";
import OrdersTab from "./../components/MasterListTabs/OrdersTab";
import DeliveriesTab from "./../components/MasterListTabs/DeliveriesTab";
import InvoicesTab from "./../components/MasterListTabs/InvoicesTab";
import BlanketAgreementsTab from "./../components/MasterListTabs/BlanketAgreementsTab";
import { AlertProvider } from "../components/Context/AlertContext";
import BlanketAgreementDetailsModal from "../components/Modals/BlanketAgreementDetails";
import QuotationListModal from "../components/Modals/Lists/QuotationList";
import ViewDocumentModal from "../components/Modals/ViewDocumentModal";

const BodyContent = ({
  setActiveModule,
  loadSubModule,
  setActiveSubModule,
  newBlanketAgreement,
  employee_id,
}) => {
  console.log(employee_id);
  const [isBlanketAgreementDetailsOpen, setIsBlanketAgreementDetailsOpen] =
    useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [isQuotationListOpen, setIsQuotationListOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [documentToView, setDocument] = useState(null);

  const tabs = [
    {
      name: "Quotations",
      component: (
        <QuotationsTab
          loadSubModule={loadSubModule}
          setActiveSubModule={setActiveSubModule}
          setIsDocumentModalOpen={setIsDocumentModalOpen}
          setDocument={setDocument}
        />
      ),
    },
    {
      name: "Orders",
      component: (
        <OrdersTab
          loadSubModule={loadSubModule}
          setActiveSubModule={setActiveSubModule}
          setIsDocumentModalOpen={setIsDocumentModalOpen}
          setDocument={setDocument}
        />
      ),
    },
    {
      name: "Deliveries",
      component: (
        <DeliveriesTab
          loadSubModule={loadSubModule}
          setActiveSubModule={setActiveSubModule}
          setIsDocumentModalOpen={setIsDocumentModalOpen}
          setDocument={setDocument}
        />
      ),
    },
    {
      name: "Invoices",
      component: (
        <InvoicesTab
          loadSubModule={loadSubModule}
          setActiveSubModule={setActiveSubModule}
          setIsDocumentModalOpen={setIsDocumentModalOpen}
          setDocument={setDocument}
        />
      ),
    },
    {
      name: "Blanket Agreements",
      component: (
        <BlanketAgreementsTab
          loadSubModule={loadSubModule}
          setActiveSubModule={setActiveSubModule}
          setIsQuotationListOpen={setIsQuotationListOpen}
          setIsDocumentModalOpen={setIsDocumentModalOpen}
          setDocument={setDocument}
        />
      ),
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].name); // Default to first tab

  useEffect(() => {
    if (selectedQuotation) {
      setIsBlanketAgreementDetailsOpen(true);
    }
  }, [selectedQuotation]);

  return (
    <AlertProvider>
      <div className="master-list">
        <div className="body-content-container">
          <Heading
            Title="Master List"
            SubTitle="Comprehensive lists regarding various information used in sales."
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
            <BlanketAgreementDetailsModal
              isOpen={isBlanketAgreementDetailsOpen}
              onClose={() => setIsBlanketAgreementDetailsOpen(false)}
              quotationInfo={selectedQuotation}
              employee_id={employee_id}
            ></BlanketAgreementDetailsModal>

            <QuotationListModal
              isOpen={isQuotationListOpen}
              onClose={() => setIsQuotationListOpen(false)}
              setQuotation={setSelectedQuotation}
              query={"get_null=True"}
            ></QuotationListModal>

            <ViewDocumentModal
              isOpen={isDocumentModalOpen}
              onClose={() => setIsDocumentModalOpen(false)}
              documentToView={documentToView}
            ></ViewDocumentModal>
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
    </AlertProvider>
  );
};

export default BodyContent;
