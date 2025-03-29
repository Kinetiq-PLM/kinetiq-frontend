import React from "react";
import { useState, useEffect } from "react";
import "../styles/Index.css";
import Heading from "../../Sales/components/Heading";
import Button from "../../Sales/components/Button";
import Table from "../../Sales/components/Table";
import { AlertProvider } from "../../Sales/components/Context/AlertContext";
import TicketInfo from "../components/TicketInfo";
import InputField from "./../../Sales/components/InputField";
import TextField from "./../components/TextField";
import CustomerListModal from "./../../Sales/components/Modals/Lists/CustomerList";
import NewCustomerModal from "./../../Sales/components/Modals/NewCustomer";

const Ticket = ({ loadSubModule, setActiveSubModule }) => {
  // ========== STOP HERE ==========
  //
  // wait lang raffy wag mo muna
  // integrate to ayusin ko pa onti,
  // pag wala na tong comment na to
  // saka mo na integrate HHAHAHAH
  //
  // ========== STOP HERE ==========

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);

  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [ticketInfo, setTicketInfo] = useState({
    // Customer information
    customer_id: "",
    ticket_id: "",
    selected_products: [],
    selected_address: "",
    selected_delivery_date: "",
    total_before_discount: 0,
    created_at: new Date().toISOString().split("T")[0],
  });
  const [address, setAddress] = useState("");

  useEffect(() => {
    setTicketInfo((prev) => ({
      ...prev,
      customer_id: selectedCustomer.customer_id,
    }));
  }, [selectedCustomer]);

  return (
    <div className="ticket">
      <div className="body-content-container">
        <TicketInfo
          type={"Ticket"}
          customer={selectedCustomer}
          customerListModal={setIsCustomerListOpen}
          setTicketInfo={setTicketInfo}
          operationID={ticketInfo.ticket_id}
          setAddress={setAddress}
          date={ticketInfo.created_at}
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

          <Button type="primary">Submit</Button>
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
