import { useEffect, useState } from "react";
import Table from "../../../Sales/components/Table";
import Dropdown from "../../../Sales/components/Dropdown";
import Button from "../../../Sales/components/Button";
import { GET } from "../../../Sales/api/api";
import { useQuery } from "@tanstack/react-query";

import CAMPAIGN_LIST_DATA from "./../../../Sales/temp_data/campaign_list_data";
import NewCampaignModal from "../NewCampaignModal";

import loading from "../../../Sales/components/Assets/kinetiq-loading.gif";

export default function CampaignListTab({ employee_id }) {
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter
  const [campaignList, setCampaignList] = useState([]);
  const campaignQuery = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => await GET("crm/campaigns"),
  });

  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);

  const columns = [
    { key: "campaign_id", label: "Campaign ID" },
    { key: "campaign_name", label: "Campaign Name" },
    { key: "type", label: "Type" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
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
  const filteredCampaigns = campaignList.filter((quotation) => {
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
    (async () => {
      try {
        const res = await GET(`misc/employee/${employee_id}`);
        if (
          [
            "REG-2504-fd99",
            "CTR-2504-d25f",
            "REG-2504-8f19",
            "REG-2504-aaf5",
            "REG-2504-fd68",
            "SEA-2504-8d37",
            "SEA-2504-cc4a",
          ].includes(res.position_id)
        ) {
          setBtnDisabled(true);
        }
      } catch (err) {
        showAlert({
          type: "error",
          title: "An error occurred while fetching employee data.",
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (campaignQuery.status === "success") {
      const data = campaignQuery.data.map((campaign) => ({
        campaign_id: campaign.campaign_id,
        campaign_name: campaign.campaign_name,
        type: campaign.type,
        start_date: new Date(campaign.start_date).toLocaleDateString(),
        end_date: new Date(campaign.end_date).toLocaleDateString(),
        status: campaign.status,
      }));
      setCampaignList(data);
      setIsLoading(false);
    }
  }, [campaignQuery.data]);

  return (
    <section className="h-full">
      <NewCampaignModal
        isOpen={isNewCampaignOpen}
        onClose={() => setIsNewCampaignOpen(false)}
      ></NewCampaignModal>
      {/* Header Section */}
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

            {/* Search By Dropdown */}
            <div className="w-full sm:w-[200px]">
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
          <div className="w-full sm:w-auto">
            <Button
              onClick={() => setIsNewCampaignOpen(true)}
              type="primary"
              className="w-full sm:w-[200px] py-2"
              disabled={btnDisabled || isLoading}
            >
              New Campaign
            </Button>
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
          <Table data={filteredCampaigns} columns={columns} />
        </div>
      )}
    </section>
  );
}
