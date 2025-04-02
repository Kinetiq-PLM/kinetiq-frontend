import { useEffect, useState } from "react";
import Table from "../../../Sales/components/Table";
import Button from "../../../Sales/components/Button";

import CampaignListModal from "./../CampaignListModal";
import CustomerListModal from "./../../../Sales/components/Modals/Lists/CustomerList";
import NewCustomerModal from "./../../../Sales/components/Modals/NewCustomer";
import { useAlert } from "../../../Sales/components/Context/AlertContext.jsx";
import { GET, PATCH } from "../../../Sales/api/api.jsx";

import OpportunityInfo from "./../OpportunityInfo";
import NewOpportunityModal from "./../NewOpportunityModal";

export default function MainTab() {
  const { showAlert } = useAlert();

  const [canSave, setCanSave] = useState(false); // Save button state

  const [opportunityList, setOpportunityList] = useState([]); // Customers part of the campaign

  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isNewOpportunityModalOpen, setIsOpportunityModalOpen] =
    useState(false);
  const [selectedContact, setSelectedContact] = useState(""); // table data that is selected
  const [selectedCustomer, setSelectedCustomer] = useState(""); // customer selected from modal
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);

  const columns = [
    { key: "opportunity_id", label: "Opportunity ID" },
    { key: "description", label: "Description" },
    { key: "customer_id", label: "Customer ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "stage", label: "Stage" },
    { key: "status", label: "Status" },
    { key: "estimated_value", label: "Estimated Value" },
    { key: "gross_profit_total", label: "Gross Profit" },
    { key: "interest_level", label: "Interest Level" },
    { key: "reason_lost", label: "Reason Lost" },
  ];

  useEffect(() => {
    if (selectedCustomer) {
      // setOpportunityList([]); // insert opportunity list here
      setOpportunityList((prevList) => [...prevList, selectedCustomer]);
      setCanSave(true);
    }
  }, [selectedCustomer]);

  const handleDelete = () => {
    if (selectedContact === "") {
      showAlert({
        type: "error",
        title: "Select a contact to remove.",
      });
      return;
    }

    setOpportunityList(
      opportunityList.filter(
        (contact) => contact.customer_id != selectedContact.customer_id
      )
    );
    setCanSave(true);
    setSelectedContact("");

    showAlert({
      type: "success",
      title: "Contact removed.",
    });
  };

  const handleSendMessage = () => {
    if (opportunityList.length === 0) {
      showAlert({
        type: "error",
        title: "Add contact.",
      });
    }
  };

  return (
    <section className="h-full">
      {/* Header Section */}
      <div className="flexflex-col justify-between mb-4 flex-wrap gap-4">
        <CustomerListModal
          isOpen={isCustomerListOpen}
          onClose={() => setIsCustomerListOpen(false)}
          isNewCustomerModalOpen={isNewCustomerModalOpen}
          newCustomerModal={setIsNewCustomerModalOpen}
          setCustomer={setSelectedCustomer}
        ></CustomerListModal>

        <NewCustomerModal
          isOpen={isNewCustomerModalOpen}
          onClose={() => setIsNewCustomerModalOpen(false)}
        ></NewCustomerModal>

        <NewOpportunityModal
          isOpen={isNewOpportunityModalOpen}
          onClose={() => setIsOpportunityModalOpen(false)}
        ></NewOpportunityModal>

        <div>
          <OpportunityInfo
            customerListModal={setIsCustomerListOpen}
            customer={selectedCustomer}
          ></OpportunityInfo>
        </div>
        <div className="border border-[#CBCBCB] w-full min-h-[350px] rounded-md mt-2 table-layout overflow-auto">
          <Table
            onSelect={setSelectedContact}
            data={opportunityList}
            columns={columns}
          />
        </div>
        <section className="mt-4 flex justify-between flex-col lg:flex-row space-x-4">
          <div className="h-full flex flex-col gap-3 w-full justify-between">
            {/* Buttons Row 1*/}
            <div className="flex flex-row flex-wrap justify-between mb-20 sm:mb-10 gap-2">
              <div className="flex gap-2 flex-wrap ">
                <Button
                  type="primary"
                  onClick={() => setIsOpportunityModalOpen(true)}
                >
                  Create Opportunity
                </Button>
                <Button type="outline" onClick={() => handleDelete()}>
                  Remove
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button type="primary" onClick={handleSendMessage}>
                  Reminders
                </Button>
              </div>
            </div>
            <div>
              <div className="flex">
                <Button type="primary" disabled={!canSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
