import { useEffect, useState } from "react";
import Table from "../Table";
import Dropdown from "../Dropdown";
import Button from "../Button";
import BLANKET_AGREEMENT_LIST_DATA from "../../temp_data/ba_list_data";
import { GET, BASE_API_URL } from "../../api/api";
import { useQuery } from "@tanstack/react-query";
import { useAlert } from "../Context/AlertContext";

import loading from "../Assets/kinetiq-loading.gif";

export default function BlanketAgreementsTab({
  loadSubModule,
  setActiveSubModule,
}) {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter
  const [agreementList, setAgreementList] = useState([]);

  const agreementQuery = useQuery({
    queryKey: ["agreements"],
    queryFn: async () => await GET("sales/agreement"),
    retry: 2,
  });
  const columns = [
    { key: "agreement_id", label: "Agreement ID" },
    { key: "customer_id", label: "Customer ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "address", label: "Address" },
    { key: "total_price", label: "Total Price" },
    { key: "salesrep", label: "Sales Rep" }, // name of salesrep if available
    { key: "agreement_method", label: "Agreement Method" }, // signed date
    { key: "date_issued", label: "Signed Date" }, // signed date
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "status", label: "Status" },
    { key: "document", label: "Document" },
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
  const filteredQuotations = agreementList.filter((quotation) => {
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
    loadSubModule("Blanket Agreement");
    setActiveSubModule("Blanket Agreement");
  };
  useEffect(() => {
    if (agreementQuery.status === "success") {
      const data = agreementQuery.data.map((agreement) => ({
        agreement_id: agreement.agreement_id,
        customer_id: agreement.statement?.customer?.customer_id,
        customer_name: agreement.statement?.customer?.name,
        address: `${agreement.statement?.customer?.address_line1} ${agreement.statement?.customer?.address_line2}`,
        type: agreement.statement?.type,
        total_price: Number(agreement.statement?.total_amount).toLocaleString(
          "en-US",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        ),
        salesrep: `${agreement.statement?.salesrep?.first_name} ${agreement.statement?.salesrep?.last_name}`,
        agreement_method: agreement.agreement_method,
        date_issued: new Date(agreement.signed_date).toLocaleDateString(),
        start_date: new Date(agreement.start_date).toLocaleDateString(),
        end_date: new Date(agreement.end_date).toLocaleDateString(),
        status: agreement.status,
        document: `${BASE_API_URL}sales/agreement/${agreement.agreement_id}/document`,
      }));
      setAgreementList(data);
      setIsLoading(false);
    } else if (agreementQuery.status === "error") {
      showAlert({
        type: "error",
        title: "Failed to fetch Blanket Agreements.",
      });
    }
  }, [agreementQuery.data, agreementQuery.status]);
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

        {/* New Quotation Button (No onClick) */}
        <Button
          onClick={handleRedirect}
          type="primary"
          className={"w-[200px] py-2"}
        >
          New Agreement
        </Button>
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
