import { useEffect, useState } from "react";
import Table from "../../../Sales/components/Table";
import Dropdown from "../../../Sales/components/Dropdown";
import Button from "../../../Sales/components/Button";
import { CUSTOMER_DATA } from "../../../Sales/temp_data/customer_data";
import { GET } from "../../../Sales/api/api";
import { useQuery } from "@tanstack/react-query";
import { useAlert } from "../../../Sales/components/Context/AlertContext";

import loading from "../../../Sales/components/Assets/kinetiq-loading.gif";

export default function ProspectTab({ setSelected }) {
  const [isLoading, setIsLoading] = useState(true);

  const { showAlert } = useAlert();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter
  const [customers, setCustomers] = useState([]);

  const customersQuery = useQuery({
    queryKey: ["prospects"],
    queryFn: async () => await GET("sales/customer?type=Prospect"),
    retry: 2,
  });
  const columns = [
    { key: "customer_id", label: "Customer ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "contact_person", label: "Contact Person" },
    { key: "email_address", label: "Email Address" },
    { key: "phone_number", label: "Phone" },
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
        customer_id: customer.customer_id,
        customer_name: customer.name,
        phone_number: customer.phone_number,
        email_address: customer.email_address,
        contact_person: customer.contact_person,
        postal_code: customer.postal_code,
        address_line1: customer.address_line1,
        address_line2: customer.address_line2,
        city: customer.city,
        country: customer.country,
      }));
      setCustomers(data);
      setIsLoading(false);
    } else if (customersQuery.status === "error") {
      showAlert({ type: "error", title: "Failed to fetch Customers." });
    }
  }, [customersQuery.data, customersQuery.status]);

  return (
    <section className="h-full">
      {/* Header Section */}
      <div className="mb-4">
        {/* Filters & Action */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start w-full">
          <div className="flex flex-col md:flex-row sm:flex-wrap gap-3 flex-1 justify-between">
            {/* Search Input */}
            <div className="w-full sm:flex-1 min-w-[250px] max-w-[600px]">
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full h-[40px]"
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
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="w-full min-h-[350px] h-[500px] rounded-md mt-2 table-layout overflow-auto justify-center items-center flex">
          <img src={loading} alt="loading" className="h-[100px]" />
        </div>
      ) : (
        <div className="border border-[#CBCBCB] w-full min-h-[350px] h-[500px] rounded-md mt-2 table-layout overflow-auto">
          <Table
            data={filteredQuotations}
            columns={columns}
            onSelect={setSelected}
          />
        </div>
      )}
    </section>
  );
}
