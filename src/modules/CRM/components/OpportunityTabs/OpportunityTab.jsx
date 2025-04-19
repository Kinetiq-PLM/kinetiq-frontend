import { useEffect, useState } from "react";
import Table from "../../../Sales/components/Table";
import Dropdown from "../../../Sales/components/Dropdown";
import Button from "../../../Sales/components/Button";
import { CUSTOMER_DATA } from "./../../../Sales/temp_data/customer_data";
import { GET } from "../../../Sales/api/api";
import { useQuery } from "@tanstack/react-query";
import { useAlert } from "../../../Sales/components/Context/AlertContext";

import loading from "../../../Sales/components/Assets/kinetiq-loading.gif";

export default function OpportunityTab({ setActiveTab }) {
  const [isLoading, setIsLoading] = useState(true);

  const showAlert = useAlert();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter
  const [customers, setCustomers] = useState([]);
  const opportunityQuery = useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => await GET("crm/opportunities"),
    retry: 2,
  });

  const columns = [
    { key: "opportunity_id", label: "Opportunity ID" },
    { key: "customer_id", label: "Customer ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "description", label: "Description" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "stage", label: "Stage" },
    { key: "status", label: "Status" },
    { key: "estimated_value", label: "Estimated Value" },
    { key: "gross_profit_total", label: "Gross Profit" },
    { key: "interest_level", label: "Interest Level" },
    { key: "reason_lost", label: "Reason Lost" },
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
    if (opportunityQuery.status === "success") {
      const data = opportunityQuery.data.map((opp) => ({
        ...opp,
        opportunity_id: opp.opportunity_id,
        description: opp.description,
        customer_id: opp.customer?.customer_id,
        customer_name: opp.customer?.name,
        start_date: new Date(opp.starting_date).toLocaleString(),
        end_date: new Date(opp.expected_closed_date).toLocaleDateString(),
        stage: opp.stage,
        status: opp.status,
        estimated_value: Number(opp.estimated_value).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        gross_profit_total: Number(opp.gross_profit_total).toLocaleString(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ),
        interest_level: opp.interest_level,
        reason_lost: opp.reason_lost || "-",
      }));
      setCustomers(data);
      setIsLoading(false);
    } else if (opportunityQuery.status === "error") {
      showAlert({
        type: "error",
        title:
          "An error occurred while fetching data: " +
          opportunityQuery.error.message,
      });
    }
  }, [opportunityQuery.data, opportunityQuery.status]);
  return (
    <section className="h-full">
      {/* Header Section */}
      <div className="mb-4">
        {/* Filters */}
        <div className="flex justify-between gap-2 w-full flex-wrap">
          <div className="h-fit items-center flex flex-row flex-1 space-x-4">
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
            <div className="flex items-center w-full max-w-[600px]">
              <div className="h-[40px] w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* New Quotation Button (No onClick) */}
          <Button
            onClick={() => setActiveTab("Main Page")}
            type="primary"
            className={"!max-w-[200px] py-2 flex-1"}
          >
            New Opportunity
          </Button>
        </div>
      </div>

      {/* Table Section */}

      {isLoading ? (
        <div className="w-full min-h-[350px] h-[500px] rounded-md mt-2 table-layout overflow-auto justify-center items-center flex">
          <img src={loading} alt="loading" className="h-[100px]" />
        </div>
      ) : (
        <div className="border border-[#CBCBCB] w-full min-h-[350px] h-[500px] rounded-md mt-2 table-layout overflow-auto">
          <Table data={filteredQuotations} columns={columns} />
        </div>
      )}
    </section>
  );
}
