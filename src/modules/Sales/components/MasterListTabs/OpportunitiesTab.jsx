import { useState, useEffect } from "react";
import Table from "../Table";
import Dropdown from "../Dropdown";
import Button from "../Button";
import BLANKET_AGREEMENT_LIST_DATA from "../../temp_data/ba_list_data";
import { GET } from "../../api/api";
import { useQuery } from "@tanstack/react-query";

export default function OpportunitiesTab({
  setActiveModule,
  loadSubModule,
  setActiveSubModule,
}) {
  const [toTransfer, setToTransfer] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter
  const [opportunities, setOpportunities] = useState([]);
  const opportunitiesQuery = useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => await GET("crm/opportunities"),
  });

  const columns = [
    { key: "opportunity_id", label: "Opportunity ID" },
    { key: "customer_id", label: "Customer ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "selected_address", label: "Address" },
    { key: "estimated_value", label: "Estimated Value" },
    { key: "salesrep", label: "Sales Representative" }, // name of salesrep if available
    { key: "stage", label: "Stage" }, // signed date
    { key: "expected_closed_date", label: "Expected Closed Date" }, // signed date
    { key: "status", label: "Status" },
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
  const filteredQuotations = opportunities.filter((quotation) => {
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

  const handleRedirect = () => {
    setActiveModule("CRM");
    setActiveSubModule("Opportunity", "CRM");
    loadSubModule("Opportunity", "CRM");
  };

  useEffect(() => {
    if (opportunitiesQuery.status === "success") {
      const data = opportunitiesQuery.data.map((opp) => ({
        opportunity_id: opp.opportunity_id,
        customer_id: opp.customer.customer_id,
        customer_name: opp.customer.name,
        selected_address: `${opp.customer.address_line1} ${opp.customer.address_line2}`,
        estimated_value: Number(opp.estimated_value).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        salesrep: opp.salesrep.employee_id,
        stage: opp.stage,
        expected_closed_date: new Date(
          opp.expected_closed_date
        ).toLocaleDateString(),
        status: opp.status,
      }));
      setOpportunities(data);
    }
  }, [opportunitiesQuery.data]);

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
            className="border border-gray-300 px-3 py-2 rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* New Quotation Button (No onClick) */}
        <Button
          onClick={handleRedirect}
          type="primary"
          className={"w-[200px] py-2"}
        >
          New Opportunity
        </Button>
      </div>

      {/* Table Section */}
      <div className="border border-[#CBCBCB] w-full min-h-[350px] h-[500px] rounded-md mt-2 table-layout overflow-auto">
        <Table data={filteredQuotations} columns={columns} />
      </div>
    </section>
  );
}
