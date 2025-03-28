import { useState } from "react";
import Table from "../../../Sales/components/Table";
import Dropdown from "../../../Sales/components/Dropdown";
import Button from "../../../Sales/components/Button";

import CAMPAIGN_LIST_DATA from "./../../../Sales/temp_data/campaign_list_data";
import NewCampaignModal from "../NewCampaignModal";

export default function CampaignListTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter

  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);

  const campaign_list = CAMPAIGN_LIST_DATA;

  const columns = [
    { key: "campaign_id", label: "Campaign ID" },
    { key: "campaign_name", label: "Campaign Name" },
    { key: "type", label: "Type" },
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
  const filteredCampaigns = campaign_list.filter((quotation) => {
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

  return (
    <section className="h-full">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <NewCampaignModal
          isOpen={isNewCampaignOpen}
          onClose={() => setIsNewCampaignOpen(false)}
        ></NewCampaignModal>

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

        {/* Campaign Button */}
        <Button
          type="primary"
          onClick={() => setIsNewCampaignOpen(true)}
          className={"w-[200px] py-2"}
        >
          New Campaign
        </Button>
      </div>

      {/* Table Section */}
      <div className="border border-[#CBCBCB] w-full min-h-[350px] h-[500px] rounded-md mt-2 table-layout overflow-auto">
        <Table data={filteredCampaigns} columns={columns} />
      </div>
    </section>
  );
}
