import { useEffect, useState } from "react";
import Table from "../../../Sales/components/Table";
import Button from "../../../Sales/components/Button";
import CampaignInfo from "../CampaignInfo";

import CampaignListModal from "./../CampaignListModal";
import CustomerListModal from "./../../../Sales/components/Modals/Lists/CustomerList";
import { useAlert } from "../../../Sales/components/Context/AlertContext.jsx";
import { GET } from "../../../Sales/api/api.jsx";
import { useMutation } from "@tanstack/react-query";
export default function CampaignContactTab() {
  const { showAlert } = useAlert();

  const [isCampaignListOpen, setIsCampaignListOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState("");

  const [contactList, setContactList] = useState([]); // Customers part of the campaign

  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(""); // table data that is selected
  const [selectedCustomer, setSelectedCustomer] = useState(""); // customer selected from modal
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);

  const columns = [
    { key: "lead_id", label: "Contact ID" },
    { key: "lead_name", label: "Name" },
    { key: "lead_email", label: "Email" },
    { key: "lead_phonenum", label: "Phone" },
    // { key: "contact_person", label: "Contact Person" },
  ];

  const contactsMutation = useMutation({
    mutationFn: async (data) => await GET(`crm/campaigns/${data.campaign}`),
    onSuccess: (data) => {
      console.log(data);
      const contacts = data.contacts.map((contact) => ({
        contact_id: contact.customer_id,
        customer_id: contact.lead,
      }));
      setContactList(contacts);
    },
  });

  useEffect(() => {
    if (selectedCustomer) {
      setContactList((prevList) => [...prevList, selectedCustomer]);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    // setContactList([]); // Fetch contacts based on selectedCampaign
    if (selectedCampaign)
      contactsMutation.mutate({ campaign: selectedCampaign.campaign_id });
  }, [selectedCampaign]);

  const handleDelete = () => {
    if (selectedContact === "") {
      showAlert({
        type: "error",
        title: "Select a contact to remove.",
      });
      return;
    }

    setContactList(
      contactList.filter(
        (contact) => contact.customer_id != selectedContact.customer_id
      )
    );
    setSelectedContact("");

    showAlert({
      type: "success",
      title: "Contact removed.",
    });
  };

  return (
    <section className="h-full">
      {/* Header Section */}
      <div className="flexflex-col justify-between mb-4 flex-wrap gap-4">
        <CustomerListModal
          isOpen={isCustomerListOpen}
          onClose={() => setIsCustomerListOpen(false)}
          newCustomerModal={setIsNewCustomerModalOpen}
          setCustomer={setSelectedCustomer}
          duplicates={contactList}
        ></CustomerListModal>

        <CampaignListModal
          isOpen={isCampaignListOpen}
          onClose={() => setIsCampaignListOpen(false)}
          setCampaign={setSelectedCampaign}
          campaign={selectedCampaign}
        ></CampaignListModal>

        <div>
          <CampaignInfo
            campaignListModal={setIsCampaignListOpen}
            campaign={selectedCampaign}
          ></CampaignInfo>
        </div>
        <div className="border border-[#CBCBCB] w-full min-h-[350px] rounded-md mt-2 table-layout overflow-auto">
          <Table
            onSelect={setSelectedContact}
            data={contactList}
            columns={columns}
          />
        </div>
        <section className="mt-4 flex justify-between flex-col lg:flex-row space-x-4">
          <div className="h-full flex flex-col gap-3 w-full">
            {/* Buttons Row */}
            <div className="flex gap-2">
              <Button
                type="primary"
                onClick={() => setIsCustomerListOpen(true)}
              >
                Add Contact
              </Button>
              <Button type="outline" onClick={() => handleDelete()}>
                Delete Item
              </Button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
