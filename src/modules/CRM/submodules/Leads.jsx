import React from "react";
import { useState } from "react";
import "../styles/Index.css";
import Heading from "../../Sales/components/Heading";
import Button from "../../Sales/components/Button";
import Table from "../../Sales/components/Table";
import Dropdown from "../../Sales/components/Dropdown";
import { AlertProvider } from "../../Sales/components/Context/AlertContext";

import NewCustomerModal from "../../Sales/components/Modals/NewCustomer";
import loading from "../../Sales/components/Assets/kinetiq-loading.gif";

const Leads = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name");
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter

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

  const filteredData = customers.filter((customer) => {
    // Filter by search term
    if (searchTerm) {
      const fieldValue = customer[searchBy]?.toString().toLowerCase() || "";
      if (!fieldValue.includes(searchTerm.toLowerCase())) return false;
    }

    // Filter by date (assuming date_issued is in YYYY-MM-DD format)
    if (dateFilter !== "All Time") {
      const today = new Date();
      const pastDate = new Date();
      const days = parseInt(dateFilter.match(/\d+/)[0], 10); // Extract number from filter
      pastDate.setDate(today.getDate() - days);

      const issuedDate = new Date(customer.date_issued);
      if (issuedDate < pastDate) return false;
    }

    return true;
  });

  return (
    <div className="partner-master-data">
      <NewCustomerModal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
      ></NewCustomerModal>
      <div className="body-content-container">
        <Heading
          Title="Leads"
          SubTitle="Contacting possible customers and nurturing  business connections."
        />
        <main className="">
          <div className="mb-4">
            {/* Filters & Action */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start w-full">
              <div className="flex flex-col md:flex-row sm:flex-wrap gap-3 flex-1">
                {/* Date Filter Dropdown */}
                <div className="w-full sm:w-[200px]">
                  <Dropdown
                    options={dateFilters}
                    onChange={setDateFilter}
                    value={dateFilter}
                  />
                </div>

                {/* Search Input */}
                <div className="w-full sm:flex-1 min-w-[250px]">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full h-[40px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="border border-[#CBCBCB] w-full min-h-[350px] h-[500px] rounded-md mt-2 table-layout overflow-auto">
              <Table data={filteredData} columns={columns} />
            </div>
          )}
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
