import { useEffect, useState } from "react";
import Table from "../Table";
import Dropdown from "../Dropdown";
import Button from "../Button";
import INVOICE_LIST_DATA from "../../temp_data/invoice_list_data";
import { GET } from "../../api/api";
import { useQuery } from "@tanstack/react-query";
import { BASE_API_URL } from "../../api/api";

export default function InvoicesTab({ loadSubModule, setActiveSubModule }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("Last 30 days"); // Default date filter

  const columns = [
    { key: "invoice_id", label: "Invoice ID" },
    { key: "delivery_note_id", label: "Delivery ID" },
    { key: "customer_id", label: "Customer ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "delivery_status", label: "Delivery Status" },
    { key: "invoice_date", label: "Invoice Date" },
    { key: "total_amount", label: "Total Price" },
    { key: "total_amount_paid", label: "Amount Paid" },
    { key: "remaining_balance", label: "Remaining Balance" },
    { key: "payment_status", label: "Payment Status" },
    { key: "document", label: "Document" },
  ];

  const [invoiceList, setInvoiceList] = useState([]);
  const invoiceQuery = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => await GET("sales/invoice"),
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
  const filteredQuotations = invoiceList.filter((quotation) => {
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
    loadSubModule("Invoice");
    setActiveSubModule("Invoice");
  };

  useEffect(() => {
    if (invoiceQuery.status === "success") {
      const data = invoiceQuery.data.map((invoice) => ({
        invoice_id: invoice.invoice_id,
        delivery_note_id: invoice.delivery_note.delivery_note_id,
        customer_id: invoice.delivery_note.statement.customer.customer_id,
        customer_name: invoice.delivery_note.statement.customer.name,
        invoice_date: new Date(invoice.invoice_date).toLocaleString(),
        delivery_status: invoice.delivery_note.shipment_status,
        total_amount: Number(invoice.total_amount).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        total_amount_paid: Number(invoice.total_amount_paid).toLocaleString(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ),
        remaining_balance: Number(invoice.remaining_balance).toLocaleString(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ),
        payment_status: invoice.payment_status,
        document: `${BASE_API_URL}sales/invoice/${invoice.invoice_id}/document`,
      }));
      setInvoiceList(data);
    }
  }, [invoiceQuery.data]);

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
          New Invoice
        </Button>
      </div>

      {/* Table Section */}
      <div className="border border-[#CBCBCB] w-full min-h-[350px] h-[500px] rounded-md mt-2 table-layout overflow-auto">
        <Table data={filteredQuotations} columns={columns} />
      </div>
    </section>
  );
}
