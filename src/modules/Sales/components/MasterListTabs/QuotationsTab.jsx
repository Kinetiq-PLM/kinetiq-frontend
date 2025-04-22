import { useEffect, useState } from "react";
import Table from "../Table";
import Dropdown from "../Dropdown";
import Button from "../Button";
import QUOTATION_LIST_DATA from "../../temp_data/quotation_list_data";
import { useQuery } from "@tanstack/react-query";
import { GET } from "../../api/api";
import { BASE_API_URL } from "../../api/api";
import { useAlert } from "../Context/AlertContext";

import loading from "../Assets/kinetiq-loading.gif";

export default function QuotationsTab({
  loadSubModule,
  setActiveSubModule,
  setIsDocumentModalOpen,
  setDocument,
  employee_id,
}) {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter
  const [quotationList, setQuotationList] = useState([]);

  // const [filteredQuotations, setFilteredQuotations] = useState([]);

  const quotationQuery = useQuery({
    queryKey: ["quotations"],
    queryFn: async () => await GET(`sales/quotation?salesrep=${employee_id}`),
    retry: 2,
  });

  const columns = [
    { key: "id", label: "Quotation ID" },
    { key: "customer_id", label: "Customer ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "address", label: "Address" },
    { key: "total_price", label: "Total Price" },
    { key: "salesrep", label: "Sales Representative" }, // name of salesrep if available
    { key: "status", label: "Status" },
    { key: "date_issued", label: "Date Issued" },
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

  const handleRedirect = () => {
    loadSubModule("Quotation");
    setActiveSubModule("Quotation");
  };

  useEffect(() => {
    if (quotationQuery.status === "success") {
      const data = quotationQuery.data.map((quote) => ({
        id: quote.quotation_id,
        customer_id: quote.statement?.customer?.customer_id,
        customer_name: quote.statement?.customer?.name,
        address: `${quote.statement?.customer?.address_line1} ${quote.statement?.customer?.address_line2}`,
        type: quote.statement?.type,
        status: quote.status,
        salesrep: `${quote.statement?.salesrep?.first_name} ${quote.statement?.salesrep?.last_name}`,
        total_price: Number(quote.statement?.total_amount).toLocaleString(
          "en-US",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        ),
        date_issued: new Date(quote.date_issued).toLocaleString(),
        document: ["Approved", "Ready"].includes(quote.status),
        endpoint: `quotation/${quote.quotation_id}`,
      }));
      setQuotationList(data);
      setIsLoading(false);
    } else if (quotationQuery.status === "error") {
      showAlert({ type: "error", title: "Failed to fetch quotations." });
    }
  }, [quotationQuery.data, quotationQuery.status]);

  const filteredQuotations = quotationList.filter((quotation) => {
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
              onClick={handleRedirect}
              type="primary"
              className="w-full sm:w-[200px] py-2"
            >
              New Quotation
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
          <Table
            data={filteredQuotations}
            columns={columns}
            setIsDocumentModalOpen={setIsDocumentModalOpen}
            setDocument={setDocument}
          />
        </div>
      )}
    </section>
  );
}
