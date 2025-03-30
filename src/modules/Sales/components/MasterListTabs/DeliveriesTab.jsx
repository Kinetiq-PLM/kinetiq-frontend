import { useEffect, useState } from "react";
import Table from "../Table";
import Dropdown from "../Dropdown";
import Button from "../Button";
import DELIVERY_LIST_DATA from "../../temp_data/deliveries_list_data";
import { useQuery } from "@tanstack/react-query";
import { GET, BASE_API_URL } from "../../api/api";
export default function BlanketAgreementsTab({
  loadSubModule,
  setActiveSubModule,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter
  const [deliveryList, setDeliveryList] = useState([]);
  const columns = [
    { key: "shipping_id", label: "Shipping ID" },
    { key: "customer_id", label: "Customer ID" },
    { key: "order_id", label: "Order ID" },
    { key: "tracking_num", label: "Tracking Number" },
    { key: "shipping_method", label: "Shipping Method" },
    { key: "customer_name", label: "Customer Name" },
    { key: "delivery_status", label: "Status" },
    { key: "address", label: "Address" },
    { key: "type", label: "Type" },
    { key: "total_price", label: "Total Price" },
    { key: "shipping_date", label: "Shipping Date" },
    { key: "estimated_delivery", label: "Estimated Delivery" },
    { key: "document", label: "Document" },
  ];

  const deliveryQuery = useQuery({
    queryKey: ["deliveries"],
    queryFn: async () => await GET("sales/delivery"),
  });

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
  const filteredQuotations = deliveryList.filter((quotation) => {
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
    loadSubModule("Delivery");
    setActiveSubModule("Delivery");
  };

  useEffect(() => {
    if (deliveryQuery.status === "success") {
      const data = deliveryQuery.data.map((delivery) => ({
        shipping_id: delivery.shipping_id,
        customer_id: delivery.order.statement.customer.customer_id,
        order_id: delivery.order.order_id,
        tracking_num: delivery.tracking_num,
        shipping_method: delivery.shipping_method,
        customer_name: delivery.order.statement.customer.name,
        delivery_status: delivery.delivery_status,
        address: `${delivery.order.statement.customer.address_line1} ${delivery.order.statement.customer.address_line2}`,
        type: delivery.order.statement.type,
        total_price: Number(
          delivery.order.statement.total_amount
        ).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        shipping_date: new Date(delivery.shipping_date).toLocaleString(),
        estimated_delivery: new Date(
          delivery.estimated_delivery
        ).toLocaleString(),
        document: `${BASE_API_URL}sales/delivery/${delivery.shipping_id}/document`,
      }));
      setDeliveryList(data);
    }
  }, [deliveryQuery.data]);

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
          New Delivery
        </Button>
      </div>

      {/* Table Section */}
      <div className="border border-[#CBCBCB] w-full min-h-[350px] h-[500px] rounded-md mt-2 table-layout overflow-auto">
        <Table data={filteredQuotations} columns={columns} />
      </div>
    </section>
  );
}
