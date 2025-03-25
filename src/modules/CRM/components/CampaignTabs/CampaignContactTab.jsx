import { useState } from "react";
import Table from "../../../Sales/components/Table";
import Dropdown from "../../../Sales/components/Dropdown";
import Button from "../../../Sales/components/Button";
import { CUSTOMER_DATA } from "./../../../Sales/temp_data/customer_data";

import CampaignListModal from "./../CampaignListModal";

export default function CampaignContactTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter

  const [isCampaignListOpen, setIsCampaignListOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const columns = [
    { key: "customer_id", label: "Customer ID" },
    { key: "customer_name", label: "Customer Name" },
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
  const filteredQuotations = CUSTOMER_DATA.filter((quotation) => {
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
        {/* Filters */}
        <CampaignListModal
          isOpen={isCampaignListOpen}
          onClose={() => setIsCampaignListOpen(false)}
          setCampaign={setSelectedCampaign}
          campaign={selectedCampaign}
        ></CampaignListModal>
        <Button type="primary" onClick={() => setIsCampaignListOpen(true)}>
          Open Campaign List
        </Button>
      </div>
    </section>
  );
}
