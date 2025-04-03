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
import EmployeeListModal from "../../Sales/components/Modals/Lists/EmployeeListModal";
import InputField from "./../../Sales/components/InputField";
import TextField from "./../components/TextField";
import CustomerListModal from "./../../Sales/components/Modals/Lists/CustomerList";
import NewCustomerModal from "./../../Sales/components/Modals/NewCustomer";
import { POST } from "../../Sales/api/api";
import { useMutation } from "@tanstack/react-query";
const Ticket = ({ loadSubModule, setActiveSubModule }) => {
  const { showAlert } = useAlert();

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);

  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isEmployeeListOpen, setIsEmployeeListOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [ticketID, setTicketID] = useState("");
  const [ticketInfo, setTicketInfo] = useState({
    customer: "",
    subject: subject,
    description: description,
    status: "",
    priority: "",
    salesrep: "",
    created_at: new Date().toISOString().split("T")[0],
  });

  const ticketMutation = useMutation({
    mutationFn: async (data) => await POST("crm/ticket/", data),
    onSuccess: (data) => {
      setTicketID(data.ticket_id);
      showAlert({
        type: "success",
        message: "Ticket created successfully.",
      });
    },
    onError: (error) => {
      showAlert({
        type: "error",
        message: "An error occurred while creating a ticket: " + error.message,
      });
    },
  });

  useEffect(() => {
    setTicketInfo((prev) => ({
      ...prev,
      customer: selectedCustomer.customer_id,
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
      const request = { ...ticketInfo, created_at: new Date().toISOString() };
      ticketMutation.mutate(request);
    }
  };

  useEffect(() => {
    setTicketInfo((prev) => ({ ...prev, subject: subject }));
  }, [subject]);

  useEffect(() => {
    setTicketInfo((prev) => ({ ...prev, description: description }));
  }, [description]);

  useEffect(() => {
    setTicketInfo((prev) => ({
      ...prev,
      salesrep: selectedEmployee.employee_id,
    }));
  }, [selectedEmployee]);
  return (
    <div className="ticket">
      <div className="body-content-container">
        <TicketInfo
          type={"Ticket"}
          customer={selectedCustomer}
          customerListModal={setIsCustomerListOpen}
          setTicketInfo={setTicketInfo}
          operationID={ticketID}
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
        <EmployeeListModal
          isOpen={isEmployeeListOpen}
          onClose={() => setIsEmployeeListOpen(false)}
          setEmployee={setSelectedEmployee}
        ></EmployeeListModal>
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

          <div className="flex mb-2 w-[25%] mt-4 gap-4 items-center">
            <p className="">Employee ID</p>
            <div
              className="border border-[#9a9a9a] flex-1 cursor-pointer p-1 flex hover:border-[#969696] transition-all duration-300 justify-between transform hover:opacity-60 items-center h-[30px] rounded"
              onClick={() => setIsEmployeeListOpen(true)}
            >
              <p className="text-sm">
                {selectedEmployee ? selectedEmployee.employee_id : ""}
              </p>
              <img
                src="/icons/information-icon.svg"
                className="h-[15px]"
                alt="info icon"
              />
            </div>
          </div>

          <Button
            type="primary"
            onClick={handleSubmit}
            className={"mt-8"}
            disabled={
              subject && description && selectedEmployee && selectedCustomer
                ? false
                : true
            }
          >
            Submit Ticket
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
