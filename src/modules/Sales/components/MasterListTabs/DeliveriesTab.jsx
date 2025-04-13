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
    { key: "delivery_note_id", label: "Delivery ID" },
    { key: "order_id", label: "Order ID" },
    { key: "type", label: "Type" },
    { key: "customer_id", label: "Customer ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "address", label: "Address" },
    { key: "tracking_num", label: "Tracking Number" },
    { key: "shipping_method", label: "Shipping Method" },
    { key: "shipment_status", label: "Status" },
    { key: "preferred_delivery_date", label: "Preferred Delivery Date" },
    { key: "shipping_date", label: "Shipping Date" },
    { key: "estimated_delivery", label: "Estimated Delivery Date" },
    { key: "actual_delivery_date", label: "Actual Delivery Date" },
    { key: "total_price", label: "Total Price" },
    { key: "created_at", label: "Created At" },
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
        delivery_note_id: delivery.delivery_note_id,
        customer_id: delivery.statement?.customer?.customer_id,
        order_id: delivery.order ? delivery.order?.order_id : null,
        tracking_num: delivery.tracking_num,
        shipping_method: delivery.shipping_method,
        customer_name: delivery.statement?.customer?.name,
        shipment_status: delivery.shipment_status,
        address: `${delivery.statement?.customer?.address_line1} ${delivery.statement?.customer?.address_line2}`,
        type: delivery.order?.order_type,
        total_price: Number(delivery.statement?.total_amount).toLocaleString(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ),
        preferred_delivery_date: new Date(
          delivery.preferred_delivery_date
        ).toLocaleDateString(),
        shipping_date: delivery.shipping_date
          ? new Date(delivery.shipping_date).toLocaleString()
          : null,
        estimated_delivery: delivery.estimated_delivery
          ? new Date(delivery.estimated_delivery).toLocaleString()
          : null,
        actual_delivery_date: delivery.actual_delivery_date
          ? new Date(delivery.actual_delivery_date).toLocaleString()
          : null,
        created_at: new Date(delivery.created_at).toLocaleString(),
        document: `${BASE_API_URL}sales/delivery/${delivery.delivery_note_id}/document`,
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
