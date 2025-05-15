import { useEffect, useState } from "react";
import Table from "../../../Sales/components/Table";
import Button from "../../../Sales/components/Button";
import CampaignInfo from "../CampaignInfo";

import CampaignListModal from "./../CampaignListModal";
import CustomerListModal from "./../../../Sales/components/Modals/Lists/CustomerList";
import NewCustomerModal from "./../../../Sales/components/Modals/NewCustomer";
import MessageModal from "../MessageModal.jsx";
import { useAlert } from "../../../Sales/components/Context/AlertContext.jsx";
import { GET, PATCH } from "../../../Sales/api/api.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CampaignContactTab({ employee_id }) {
  const [btnDisabled, setBtnDisabled] = useState(false);
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [isCampaignListOpen, setIsCampaignListOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [canSave, setCanSave] = useState(false); // Save button state
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const [isMessageOpen, setIsMessageOpen] = useState(false); // Message modal open state

  const [contactList, setContactList] = useState([]); // Customers part of the campaign

  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(""); // table data that is selected
  const [selectedCustomer, setSelectedCustomer] = useState(""); // customer selected from modal
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);

  const columns = [
    { key: "customer_id", label: "Customer ID" },
    { key: "name", label: "Name" },
    { key: "email_address", label: "Email" },
    { key: "phone_number", label: "Phone" },
    { key: "contact_person", label: "Contact Person" },
  ];
  const [toRemove, setToRemove] = useState([]);

  const contactsMutation = useMutation({
    mutationFn: async (data) => await GET(`crm/campaigns/${data.campaign}`),
    onSuccess: async (data) => {
      const contacts = data.contacts.map((contact) => ({
        customer_id: contact.customer.customer_id,
        name: contact.customer.name,
        email_address: contact.customer.email_address,
        phone_number: contact.customer.phone_number,
        contact_person: contact.customer.contact_person,
      }));
      setContactList(contacts);
      setIsLoading(false);
      await queryClient.refetchQueries(["campaigns"]);
    },
  });

  const campaignMutation = useMutation({
    mutationFn: async (data) =>
      await PATCH(`crm/campaigns/${data.campaign}/`, {
        contacts: data.contacts,
        remove: data.remove,
      }),
    onSuccess: (data) => {
      showAlert({
        type: "success",
        title: "Campaign saved.",
      });
      setCanSave(false);
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title: "An error occurred while saving the campaign.",
      });
    },
  });
  useEffect(() => {
    (async () => {
      try {
        const res = await GET(`misc/employee/${employee_id}`);
        if (
          [
            "REG-2504-fd99",
            "CTR-2504-d25f",
            "REG-2504-8f19",
            "REG-2504-aaf5",
            "REG-2504-fd68",
            "SEA-2504-8d37",
            "SEA-2504-cc4a",
          ].includes(res.position_id)
        ) {
          setBtnDisabled(true);
        }
      } catch (err) {
        showAlert({
          type: "error",
          title: "An error occurred while fetching employee data.",
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      setIsLoading(true);
      setContactList((prevList) => [...prevList, selectedCustomer]);
      setCanSave(true);
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
    setToRemove((prev) => [...prev, selectedContact.customer_id]);
    setCanSave(true);
    setSelectedContact("");

    showAlert({
      type: "success",
      title: "Contact removed.",
    });
  };

  const handleSendMessage = () => {
    if (contactList.length === 0) {
      showAlert({
        type: "error",
        title: "Add contact.",
      });
    } else {
      // SAVE CAMPAIGN DATA TO DB
      setIsMessageOpen(true);
    }
  };

  const handleSave = () => {
    const request = {
      campaign: selectedCampaign.campaign_id,
      contacts: contactList.map((contact) => contact.customer_id),
      remove: toRemove,
    };
    campaignMutation.mutate(request);
    setToRemove([]);
  };

  return (
    <section className="h-full">
      {/* Header Section */}
      <div className="flexflex-col justify-between mb-4 flex-wrap gap-4">
        <MessageModal
          isOpen={isMessageOpen}
          onClose={() => setIsMessageOpen(false)}
          campaign={selectedCampaign}
          contacts={contactList}
        ></MessageModal>

        <CustomerListModal
          isOpen={isCustomerListOpen}
          onClose={() => setIsCustomerListOpen(false)}
          isNewCustomerModalOpen={isNewCustomerModalOpen}
          newCustomerModal={setIsNewCustomerModalOpen}
          setCustomer={setSelectedCustomer}
          duplicates={contactList}
        ></CustomerListModal>

        <NewCustomerModal
          isOpen={isNewCustomerModalOpen}
          onClose={() => setIsNewCustomerModalOpen(false)}
        ></NewCustomerModal>

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
          <div className="h-full flex flex-col gap-3 w-full justify-between">
            {/* Buttons Row 1*/}
            <div className="flex flex-row flex-wrap justify-between mb-20 sm:mb-10 gap-2">
              <div className="flex gap-2 flex-wrap ">
                <Button
                  type="primary"
                  onClick={() => setIsCustomerListOpen(true)}
                  disabled={selectedCampaign === "" || btnDisabled || isLoading}
                >
                  Add Contact
                </Button>
                <Button
                  type="outline"
                  disabled={selectedCampaign === "" || btnDisabled}
                  onClick={() => handleDelete()}
                >
                  Remove
                </Button>
              </div>
              <div className="flex">
                <Button
                  type="primary"
                  disabled={selectedCampaign === ""}
                  onClick={handleSendMessage}
                >
                  Send Message
                </Button>
              </div>
            </div>
            <div>
              <div className="flex">
                <Button
                  type="primary"
                  disabled={!canSave || btnDisabled}
                  onClick={handleSave}
                >
                  Save Campaign
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
