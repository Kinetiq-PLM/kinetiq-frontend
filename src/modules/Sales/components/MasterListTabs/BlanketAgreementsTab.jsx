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
  setIsQuotationListOpen,
  setIsDocumentModalOpen,
  setDocument,
  employee_id,
}) {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter
  const [agreementList, setAgreementList] = useState([]);

  const agreementQuery = useQuery({
    queryKey: ["agreements"],
    queryFn: async () => await GET(`sales/agreement?salesrep=${employee_id}`),
    retry: 2,
  });
  const columns = [
    { key: "id", label: "Agreement ID" },
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
    setIsQuotationListOpen(true);
  };
  useEffect(() => {
    if (agreementQuery.status === "success") {
      const data = agreementQuery.data.map((agreement) => ({
        id: agreement.agreement_id,
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
        document: true,
        endpoint: `agreement/${agreement.agreement_id}`,
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
              New Agreement
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
