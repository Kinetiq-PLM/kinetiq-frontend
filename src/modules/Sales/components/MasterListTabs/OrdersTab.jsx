import { useEffect, useState } from "react";
import Table from "../Table";
import Dropdown from "../Dropdown";
import Button from "../Button";
import ORDER_LIST_DATA from "../../temp_data/order_list_data";
import { useQuery } from "@tanstack/react-query";
import { BASE_API_URL, GET } from "../../api/api";
import { useAlert } from "../Context/AlertContext";

import loading from "../Assets/kinetiq-loading.gif";
export default function OrdersTab({
  loadSubModule,
  setActiveSubModule,
  setIsDocumentModalOpen,
  setDocument,
}) {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter
  const [orderList, setOrderList] = useState([]); // Default date filter
  const orderQuery = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await GET("sales/order"),
    retry: 2,
  });
  const columns = [
    { key: "id", label: "Order ID" },
    { key: "customer_id", label: "Customer ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "address", label: "Address" },
    { key: "order_type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "total_price", label: "Total Price" },
    { key: "salesrep", label: "Sales Representative" }, // name of salesrep if available
    { key: "order_date", label: "Date Issued" },
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
  const filteredQuotations = orderList.filter((quotation) => {
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
    loadSubModule("Order");
    setActiveSubModule("Order");
  };

  useEffect(() => {
    if (orderQuery.status === "success") {
      const data = orderQuery.data.map((order) => ({
        id: order.order_id,
        customer_id: order.statement?.customer?.customer_id,
        customer_name: order.statement?.customer?.name,
        address: `${order.statement?.customer?.address_line1} ${order.statement?.customer?.address_line2}`,
        order_type: order.order_type,
        status: order.completion_status,
        ext_project_request: order.ext_project_request,
        salesrep: `${order.statement?.salesrep?.first_name} ${order.statement?.salesrep?.last_name}`,
        total_price: Number(order.statement?.total_amount).toLocaleString(
          "en-US",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        ),
        order_date: new Date(order.order_date).toLocaleString(),
        document: [
          "Open for Delivery",
          "Partially Delivered",
          "Completed",
        ].includes(order.completion_status),
        endpoint: `order/${order.order_id}`,
      }));
      setOrderList(data);
      setIsLoading(false);
    } else if (orderQuery.status === "error") {
      showAlert({ type: "error", title: "Failed to fetch Orders" });
    }
  }, [orderQuery.data, orderQuery.status]);

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
            onClick={handleRedirect}
            type="primary"
            className={"!max-w-[200px] py-2 flex-1"}
          >
            New Orders
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
