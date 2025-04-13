import { useEffect, useState } from "react";
import Table from "../../../Sales/components/Table";
import Dropdown from "../../../Sales/components/Dropdown";
import Button from "../../../Sales/components/Button";
import { CUSTOMER_DATA } from "./../../../Sales/temp_data/customer_data";
import { GET } from "../../../Sales/api/api";
import { useQuery } from "@tanstack/react-query";
import { useAlert } from "../../../Sales/components/Context/AlertContext";
export default function SupplierTab() {
  const { showAlert } = useAlert();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter
  const [customers, setCustomers] = useState([]);
  const customersQuery = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => await GET("misc/business-partners?category=Supplier"),
    retry: 2,
  });
  const columns = [
    { key: "partner_id", label: "Partner ID" },
    { key: "vendor_code", label: "Supplier Code" },
    { key: "partner_name", label: "Supplier Name" },
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

  const handleClick = () => {
    console.log("CLICKED");
  };

  useEffect(() => {
    if (customersQuery.status === "success") {
      const data = customersQuery.data.map((customer) => ({
        partner_id: customer.partner_id,
        vendor_code: customer.vendor_code,
        partner_name: customer.partner_name,
        contact_info: customer.contact_info,
      }));
      setCustomers(data);
    } else if (customersQuery.status === "error") {
      showAlert({ type: "error", title: "Failed to fetch Customers." });
    }
  }, [customersQuery.data, customersQuery.status]);

  return (
    <section className="h-full">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        {/* Filters */}
        <div className="flex flex-1/2 items-center space-x-2 gap-2 w-fit flex-wrap">
          {/* Date Filter Dropdown */}
          <div className="w-full max-w-[200px]">
            <Dropdown
              options={dateFilters}
              onChange={setDateFilter}
              value={dateFilter}
            />
          </div>

          {/* Search By Dropdown */}
          <div className="w-full max-w-[200px]">
            <Dropdown
              options={searchFields.map((field) => field.label)}
              onChange={(selected) => {
                const field = searchFields.find((f) => f.label === selected);
                if (field) setSearchBy(field.key);
              }}
              value={searchFields.find((f) => f.key === searchBy)?.label}
            />
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full max-w-[600px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-[#CBCBCB] w-full min-h-[350px] h-[500px] rounded-md mt-2 table-layout overflow-auto">
        <Table data={filteredQuotations} columns={columns} />
      </div>
    </section>
  );
}
