import React from "react";
import { useEffect, useState } from "react";
import "../styles/Index.css";
import Heading from "../../Sales/components/Heading";
import Button from "../../Sales/components/Button";
import Table from "../../Sales/components/Table";
import Dropdown from "../../Sales/components/Dropdown";
import { GET } from "../../Sales/api/api";
import { useQuery } from "@tanstack/react-query";

import { useAlert } from "../../Sales/components/Context/AlertContext";

import { AlertProvider } from "../../Sales/components/Context/AlertContext";

import NewCustomerModal from "../../Sales/components/Modals/NewCustomer";
import ViewCustomerModal from "../../Sales/components/Modals/ViewCustomer";
import ConfirmQualify from "../../Sales/components/ConfirmQualify";
import MessageModal from "../components/MessageModal.jsx";

import loading from "../../Sales/components/Assets/kinetiq-loading.gif";

const Leads = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { showAlert } = useAlert();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter
  const [customers, setCustomers] = useState([]);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isViewCustomerModalOpen, setIsViewCustomerModalOpen] = useState(false);
  const [isConfirmQualifyOpen, setIsConfirmQualifyOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false); // Message modal open state

  const [selected, setSelected] = useState("");

  const customersQuery = useQuery({
    queryKey: ["customerPartners"],
    queryFn: async () => await GET("misc/business-partners?category=Customer"),
    retry: 2,
  });
  const columns = [
    { key: "partner_id", label: "Partner ID" },
    { key: "customer_id", label: "Customer ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "contact_info", label: "Contact Information" },
  ];

  const dateFilters = [
    "Last 30 days",
    "Last 60 days",
    "Last 90 days",
    "All Time",
  ];
  const searchFields = columns.map((col) => ({
    key: col.key,
    label: col.label,
  }));

  // Filter quotations based on search and date
  const filteredQuotations = customers.filter((quotation) => {
    // Filter by search term
    if (searchTerm) {
      const fieldValue = quotation[searchBy]?.toString().toLowerCase() || "";
      if (!fieldValue.includes(searchTerm.toLowerCase())) return false;
    }

    // Filter by date (assuming date_issued is in YYYY-MM-DD format)
    if (dateFilter !== "All Time") {
      const today = new Date();
      const pastDate = new Date();
      const days = parseInt(dateFilter.match(/\d+/)[0], 10); // Extract number from filter
      pastDate.setDate(today.getDate() - days);

      const issuedDate = new Date(quotation.date_issued);
      if (issuedDate < pastDate) return false;
    }

    return true;
  });

  useEffect(() => {
    if (customersQuery.status === "success") {
      const data = customersQuery.data.map((customer) => ({
        partner_id: customer.partner_id,
        customer_id: customer.customer_id,
        customer_name: customer.partner_name,
        contact_info: customer.contact_info,
      }));
      setCustomers(data);
      setIsLoading(false);
    } else if (customersQuery.status === "error") {
      showAlert({ type: "error", title: "Failed to fetch Customers." });
    }
  }, [customersQuery.data, customersQuery.status]);

  const handleQualification = () => {
    // Handle qualification logic here || remove from leads table
    showAlert({ type: "success", title: "Lead qualified successfully." });
  };

  return (
    <div className="partner-master-data">
      <NewCustomerModal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
      ></NewCustomerModal>

      <ViewCustomerModal
        isOpen={isViewCustomerModalOpen}
        onClose={() => setIsViewCustomerModalOpen(false)}
        data={selected}
        action={() => setIsMessageOpen(true)}
      ></ViewCustomerModal>

      <ConfirmQualify
        isOpen={isConfirmQualifyOpen}
        onClose={() => setIsConfirmQualifyOpen(false)}
        action={handleQualification}
      ></ConfirmQualify>

      <MessageModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        contacts={[selected]}
      ></MessageModal>

      <div className="body-content-container">
        <Heading
          Title="Leads"
          SubTitle="Contacting possible customers and nurturing  business connections."
        />
        <main className="">
          <div className="my-4">
            {/* Filters & Action */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start w-full">
              <div className="flex flex-col md:flex-row sm:flex-wrap gap-3 flex-1">
                {/* Search Input */}
                <div className="w-full sm:flex-1 min-w-[250px]">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full h-[40px] max-w-[600px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* Date Filter Dropdown */}
                <div className="w-full sm:w-[200px]">
                  <Dropdown
                    options={dateFilters}
                    onChange={setDateFilter}
                    value={dateFilter}
                  />
                </div>
              </div>

              {/* Right Side Button */}
              {/* <div className="w-full sm:w-auto">
                <Button
                  onClick={() => setIsNewCustomerModalOpen(true)}
                  type="primary"
                  className="w-full sm:w-[200px] py-2"
                >
                  New Customer
                </Button>
              </div> */}
            </div>
          </div>

          {isLoading ? (
            <div className="w-full min-h-[350px] h-[500px] rounded-md mt-2 table-layout overflow-auto justify-center items-center flex">
              <img src={loading} alt="loading" className="h-[100px]" />
            </div>
          ) : (
            <div className="border border-[#CBCBCB] w-full min-h-[350px] h-[550px] rounded-md mt-2 table-layout overflow-auto">
              <Table
                data={filteredQuotations}
                columns={columns}
                onSelect={setSelected}
              />
            </div>
          )}

          <div className="flex justify-between w-full mt-4">
            <div className="flex gap-4">
              <Button
                onClick={() => setIsNewCustomerModalOpen(true)}
                type="primary"
                className="w-full sm:w-[200px] py-2"
              >
                New Lead
              </Button>

              <Button
                onClick={() => setIsConfirmQualifyOpen(true)}
                type="primary"
                className="w-full sm:w-[200px] py-2"
              >
                Qualify
              </Button>
            </div>
            <Button
              onClick={() => setIsViewCustomerModalOpen(true)}
              type="outline"
              className="w-full sm:w-[200px] py-2"
              disabled={selected === ""}
            >
              View & Contact
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
      <Leads />
    </AlertProvider>
  );
};

export default BodyContent;
