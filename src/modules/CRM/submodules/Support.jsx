import React from "react";
import { useState, useEffect } from "react";
import "../styles/Index.css";
import Heading from "../../Sales/components/Heading";
import Button from "../../Sales/components/Button";
import Table from "../../Sales/components/Table";
import Dropdown from "../../Sales/components/Dropdown";
import { AlertProvider } from "../../Sales/components/Context/AlertContext";

import TicketDetail from "../components/TicketDetail";
import TicketResolve from "../components/TicketResolve";
import TICKET_LIST_DATA from "../../Sales/temp_data/ticket_list";
import { GET } from "../../Sales/api/api";
import { useQuery } from "@tanstack/react-query";
import { useAlert } from "../../Sales/components/Context/AlertContext";
const Support = () => {
  const showAlert = useAlert();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("customer_name"); // Default search field
  const [dateFilter, setDateFilter] = useState("All Time"); // Default date filter
  const [ticketList, setTicketList] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [isTicketDetailOpen, setIsTicketDetailOpen] = useState(false);
  const [isTicketResolveOpen, setIsTicketResolveOpen] = useState(false);
  const ticketQuery = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => await GET("crm/ticket"),
  });
  const columns = [
    { key: "ticket_id", label: "Ticket ID" },
    { key: "customer_id", label: "Customer ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "created_at", label: "Created At" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
    { key: "employee_id", label: "Employee ID" },
    { key: "employee_name", label: "Employee Name" },
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

  const filteredTickets = ticketList.filter((ticket) => {
    // Filter by search term
    if (searchTerm) {
      const fieldValue = ticket[searchBy]?.toString().toLowerCase() || "";
      if (!fieldValue.includes(searchTerm.toLowerCase())) return false;
    }

    // Filter by date (assuming date_issued is in YYYY-MM-DD format)
    if (dateFilter !== "All Time") {
      const today = new Date();
      const pastDate = new Date();
      const days = parseInt(dateFilter.match(/\d+/)[0], 10); // Extract number from filter
      pastDate.setDate(today.getDate() - days);

      const issuedDate = new Date(ticket.created_at);
      if (issuedDate < pastDate) return false;
    }

    return true;
  });

  useEffect(() => {
    if (ticketQuery.status === "success") {
      const data = ticketQuery.data.map((ticket) => ({
        ticket_id: ticket.ticket_id,
        customer_id: ticket.customer.customer_id,
        customer_name: ticket.customer.name,
        subject: ticket.subject,
        description: ticket.description,
        created_at: new Date(ticket.created_at).toLocaleString(),
        priority: ticket.priority,
        status: ticket.status,
        employee_id: ticket.salesrep.employee_id,
        employee_name: `${ticket.salesrep.first_name} ${ticket.salesrep.last_name}`,
      }));
      setTicketList(data);
    } else if (ticketQuery.status === "error") {
      showAlert({
        type: "error",
        title:
          "An error occurred while fetching tickets: " +
          ticketQuery.error.message,
      });
    }
  }, [ticketQuery.data]);

  return (
    <div className="partner-master-data">
      <TicketDetail
        isOpen={isTicketDetailOpen}
        onClose={() => setIsTicketDetailOpen(false)}
        ticket={selectedTicket}
        setIsTicketResolveOpen={setIsTicketResolveOpen}
      ></TicketDetail>

      <TicketResolve
        isOpen={isTicketResolveOpen}
        onClose={() => setIsTicketResolveOpen(false)}
        ticket={selectedTicket}
        setIsTicketDetailOpen={setIsTicketDetailOpen}
      ></TicketResolve>

      <div className="body-content-container">
        <Heading
          Title="Support"
          SubTitle="A comprehensive list of all support tickets, monitor their status, and efficiently manage responses and resolutions."
        />

        <main className="mt-4">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            {/* Filters */}
            <div className="flex flex-1/2 items-center space-x-2 gap-2 w-fit flex-wrap-reverse">
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
                    const field = searchFields.find(
                      (f) => f.label === selected
                    );
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

            {/* Action Button */}
            <Button
              type="primary"
              onClick={() => setIsTicketDetailOpen(true)}
              className={"w-[200px] py-2"}
              disabled={!selectedTicket}
            >
              View Details
            </Button>
          </div>

          {/* Table Section */}
          <div className="border border-[#CBCBCB] w-full min-h-[350px] h-[570px] rounded-md mt-2 table-layout overflow-auto">
            <Table
              data={filteredTickets}
              columns={columns}
              onSelect={setSelectedTicket}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

const BodyContent = () => {
  return (
    <AlertProvider>
      <Support />
    </AlertProvider>
  );
};

export default BodyContent;
