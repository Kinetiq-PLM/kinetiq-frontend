import React from "react";
import { useState, useEffect } from "react";
import "../styles/Index.css";
import Heading from "../../Sales/components/Heading";
import Button from "../../Sales/components/Button";
import Table from "../../Sales/components/Table";
import {
  AlertProvider,
  useAlert,
} from "../../Sales/components/Context/AlertContext";
import TicketInfo from "../components/TicketInfo";
import InputField from "./../../Sales/components/InputField";
import TextField from "./../components/TextField";
import CustomerListModal from "./../../Sales/components/Modals/Lists/CustomerList";
import NewCustomerModal from "./../../Sales/components/Modals/NewCustomer";

const Ticket = ({ loadSubModule, setActiveSubModule }) => {
  const { showAlert } = useAlert();

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);

  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [ticketInfo, setTicketInfo] = useState({
    customer_id: "",
    ticket_id: "",
    subject: subject,
    description: description,
    status: "",
    priority: "",
    created_at: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    setTicketInfo((prev) => ({
      ...prev,
      customer_id: selectedCustomer.customer_id,
    }));
  }, [selectedCustomer]);

  const handleSubmit = () => {
    if (ticketInfo.priority === "") {
      showAlert({
        type: "error",
        message: "Please select a priority.",
      });
      return;
    } else if (ticketInfo.status === "") {
      showAlert({
        type: "error",
        message: "Please select a status.",
      });
      return;
    } else {
      showAlert({
        type: "success",
        message: "Ticket created successfully.",
      });
    }
  };

  return (
    <div className="ticket">
      <div className="body-content-container">
        <TicketInfo
          type={"Ticket"}
          customer={selectedCustomer}
          customerListModal={setIsCustomerListOpen}
          setTicketInfo={setTicketInfo}
          operationID={ticketInfo.ticket_id}
          date={ticketInfo.created_at}
          ticket={ticketInfo}
        />
        <CustomerListModal
          isOpen={isCustomerListOpen}
          onClose={() => setIsCustomerListOpen(false)}
          newCustomerModal={setIsNewCustomerModalOpen}
          setCustomer={setSelectedCustomer}
        ></CustomerListModal>
        <NewCustomerModal
          isOpen={isNewCustomerModalOpen}
          onClose={() => setIsNewCustomerModalOpen(false)}
        ></NewCustomerModal>
        <main className="mt-4">
          <div className="text-sm flex gap-10 flex-wrap">
            <h3 className="font-bold">Create Ticket Issue</h3>
            <h3 className="opacity-50">Create Ticket Product Renewal</h3>
          </div>
          <div className="flex flex-col flex-wrap my-4">
            <InputField
              label={"Ticket Subject"}
              value={subject}
              setValue={setSubject}
            />

            <TextField
              label={"Description"}
              value={description}
              setValue={setDescription}
            />
          </div>

          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={subject && description ? false : true}
          >
            Submit
          </Button>
        </main>
      </div>
    </div>
  );
};

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  return (
    <AlertProvider>
      <Ticket
        loadSubModule={loadSubModule}
        setActiveSubModule={setActiveSubModule}
      />
    </AlertProvider>
  );
};

export default BodyContent;
