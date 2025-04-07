import React, { act } from "react";
import { useState, useEffect } from "react";
import "../styles/Index.css";
import Dropdown from "../../Sales/components/Dropdown";
import Button from "../../Sales/components/Button";
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

import SalesTicketTab from "../components/TicketTabs/SalesTicketTab";
import ServiceTicketTab from "../components/TicketTabs/ServiceTicketTab";

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
    type: "",
    status: "",
    priority: "",
    salesrep: "",
    created_at: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    setTicketInfo((prev) => ({
      ...prev,
      customer: selectedCustomer.customer_id,
    }));
  }, [selectedCustomer]);

  useEffect(() => {
    setTicketInfo((prev) => ({
      ...prev,
      salesrep: selectedEmployee.employee_id,
    }));
  }, [selectedEmployee]);

  const tabs = [
    {
      name: "Sales Ticket",
      component: (
        <SalesTicketTab
          setIsEmployeeListOpen={setIsEmployeeListOpen}
          selectedEmployee={selectedEmployee}
          selectedCustomer={selectedCustomer}
          ticketInfo={ticketInfo}
          setTicketInfo={setTicketInfo}
          setTicketID={setTicketID}
        />
      ),
    },
    {
      name: "Service Ticket",
      component: (
        <ServiceTicketTab
          setIsEmployeeListOpen={setIsEmployeeListOpen}
          selectedEmployee={selectedEmployee}
          selectedCustomer={selectedCustomer}
          ticketInfo={ticketInfo}
          setTicketInfo={setTicketInfo}
          setTicketID={setTicketID}
        />
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].name);

  useEffect(() => {
    setTicketInfo((prev) => ({
      ...prev,
      type: activeTab === "Sales Ticket" ? "sales" : "service",
    }));
  }, [activeTab]);

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

        <main className="">
          {/* Tab Selector */}
          <div className="mt-4 flex flex-col md:flex-row lg:hidden md:justify-between md:items-center gap-4">
            <div>
              <h4 className="font-medium">Action:</h4>
            </div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-medium text-gray-400">View:</h4>
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
