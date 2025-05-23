"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceTicket.css"
import ServiceTicketIcon from "/icons/SupportServices/ServiceTicket.png"
import SubmitTicketModal from "../components/ServiceTicket/SubmitTicketModal"
import QueueTicketModal from "../components/ServiceTicket/QueueTicketModal"
import ServTickInputField from "../components/ServiceTicket/ServTickInputField"
import ServTickTable from "../components/ServiceTicket/ServTickTable"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

import { GET } from "../api/api"
import { POST } from "../api/api"
import { PATCH } from "../api/api"
import { POST_NOTIF } from "../api/api"

const ServiceTicket = ({ user_id, employee_id }) => {
  // State for form fields
  const [ticketId, setTicketId] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [subject, setSubject] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [tickets, setTickets] = useState([])
  const [filterBy, setFilterBy] = useState("open")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [selectedTicketStatus, setSelectedTicketStatus] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Modal states
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showQueueModal, setShowQueueModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState("")

  const fetchTickets = async () => {
    try {
      // this filters out tickets so that only the tickets assigned to the one currently logged in will show:
      // const data = await GET(`ticket/tickets/salesrep/HR-EMP-2025-de92df/`);
      const data = await GET(`ticket/tickets/salesrep/${employee_id}/`);
      
      // all tix version:
      // const data = await GET("ticket/");
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error)
    }
  }

  // Fetch tickets from API (mock function)
  useEffect(() => {
    fetchTickets();
  }, []);

  // table row clicking func
  const handleRowClick = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const data = await GET(`ticket/${ticket.ticket_id}`); // this fetches specific ticket info from clicked ticket row
      console.log("Fetched data:", data);

      // for null customer_id
      const customer = data.customer || {};

      setTicketId(data.ticket_id || "");
      setCustomerId(customer.customer_id || "null"); 
      setSubject(data.subject || "");
      setName(customer.name || "Unknown");
      setDescription(data.description || "");
      setEmail(customer.email_address || "Unknown");
      setPhone(customer.phone_number || "Unknown");

      setSelectedTicketStatus(data.status || "");  

    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
};

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowSubmitModal(true)
  }

  // Handle submit from modal
  const handleSubmitTicket = async (ticketData) => {
    console.log("Submitting ticket:", ticketData)

    const notifData = {
      module: "Support & Services",
      submodule: "Service Ticket",
      recipient_id: ticketData.userId,
      msg: "New ticket submitted for you to review."
    }

    const { userId, ...ticketPayload } = ticketData;
    console.log("Sending notif:", notifData)
    try {
        const data = await POST("ticket/", ticketPayload);
        console.log("Ticket created successfully:", data);

        const notif_data = await POST_NOTIF("send-notif/", notifData);
        console.log("Notification sent successfully:", notif_data);

        setShowSubmitModal(false);
        fetchTickets();
    } catch (error) {
        let firstError = "An unknown error occurred.";
        if (error && typeof error === "object") {
          const keys = Object.keys(error);
          if (keys.length > 0) {
            const firstKey = keys[0];
            const firstValue = error[firstKey];
            if (Array.isArray(firstValue)) {
              firstError = `${firstKey}: ${firstValue[0]}`;
            }
          } else if (typeof error.detail === "string") {
            firstError = error.detail;
          }
        }
    
        console.error("Error submitting ticket:", firstError);
        setErrorModalMessage(firstError); 
        setShowErrorModal(true);          
    }
  }

  // Handle submit from modal
  const inProgTix = async (ticketId) => {
    console.log("Updating ticket:", ticketId)

    const ticketData = {
      status: "In Progress"
    }

    try {
        const data = await PATCH (`ticket/${ticketId}/`, ticketData);
        console.log("Ticket updated successfully:", data);
        
        fetchTickets();
    } catch (error) {
        let firstError = "An unknown error occurred.";
        if (error && typeof error === "object") {
          const keys = Object.keys(error);
          if (keys.length > 0) {
            const firstKey = keys[0];
            const firstValue = error[firstKey];
            if (Array.isArray(firstValue)) {
              firstError = `${firstKey}: ${firstValue[0]}`;
            }
          } else if (typeof error.detail === "string") {
            firstError = error.detail;
          }
        }
    
        console.error("Error updating ticket:", firstError);
        setErrorModalMessage(firstError); 
        setShowErrorModal(true);          
    }
  }

  const handleQueueTicket = () => {
    setShowQueueModal(true)
  }

  // Handle queue from modal
  const handleQueueCall = async (queueData) => {
    console.log("Queueing ticket:", queueData)

    const notifData = {
      module: "Support & Services",
      submodule: "Service Call",
      recipient_id: queueData.userId,
      msg: "New queued call for you to review."
    }

    const { userId, ...queuePayload } = queueData;
    console.log("Sending notif:", notifData)

    try {
      const data = await POST("call/", queuePayload);
      console.log("Service call created successfully:", data);

      const notif_data = await POST_NOTIF("send-notif/", notifData);
      console.log("Notification sent successfully:", notif_data);

      inProgTix(ticketId);
      setShowQueueModal(false);
      setSuccessModalMessage(`Email sent to customer ${data.customer.name}!`); 
      setShowSuccessModal(true);  
    } catch (error) {
      let firstError = "An unknown error occurred.";
      if (error && typeof error === "object") {
        const keys = Object.keys(error);
        if (keys.length > 0) {
          const firstKey = keys[0];
          const firstValue = error[firstKey];
          if (Array.isArray(firstValue)) {
            firstError = `${firstKey}: ${firstValue[0]}`;
          }
        } else if (typeof error.detail === "string") {
          firstError = error.detail;
        }
      }
    
        console.error("Error creating service call:", error.message);
        setErrorModalMessage(firstError); 
        setShowErrorModal(true);          
    }
  }

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successModalMessage, setSuccessModalMessage] = useState("")

  const handleFilterChange = (value) => {
    setFilterBy(value)
    setShowFilterOptions(false)
  }

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "in progress", label: "In Progress" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ]

  // Filter tickets based on selected filter
  const filteredTickets = tickets.filter((ticket) => {
    let matchesFilter = true
    if (filterBy === "open" && ticket.status !== "Open") matchesFilter = false
    if (filterBy === "closed" && ticket.status !== "Closed") matchesFilter = false
    if (filterBy === "in progress" && ticket.status !== "In Progress") matchesFilter = false
    if (filterBy === "low" && ticket.priority !== "Low") matchesFilter = false
    if (filterBy === "medium" && ticket.priority !== "Medium") matchesFilter = false
    if (filterBy === "high" && ticket.priority !== "High") matchesFilter = false
    if (filterBy === "urgent" && ticket.priority !== "Urgent") matchesFilter = false
    
    let matchesSearch = true
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matchesSearch =
        (ticket.ticket_id?.toString().toLowerCase().includes(query) ?? false) ||  
        (ticket.customer?.name?.toLowerCase().includes(query) ?? false);
      }
    return matchesFilter && matchesSearch
  })

  return (
    <div className="serv servtick">
      <div className="body-content-container">
        <div className="header">
          <div className="icon-container">
            <img src={ServiceTicketIcon || "/placeholder.svg?height=24&width=24"} alt="Service Ticket" />
          </div>
          <div className="title-container">
            <h2>Service Ticket</h2>
            <p className="subtitle">Track and update the status of this service ticket.</p>
          </div>
        </div>

        <div className="divider"></div>

        <div className="content-scroll-area">
          {/* Input Fields Component */}
          <ServTickInputField
            ticketId={ticketId}
            setTicketId={setTicketId}
            customerId={customerId}
            setCustomerId={setCustomerId}
            subject={subject}
            setSubject={setSubject}
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
          />
          <div className="section-divider"></div>
          <div className="filter-submit-container">
            <div className="search-filter-container">
              <div className="search-container">
                  <img src={SearchIcon || "/placeholder.svg?height=16&width=16"} alt="Search" className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search or type a command (Ctrl + G)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="filter-dropdown" >
                  <button className="filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                  {filterOptions.find(opt => opt.value === filterBy)?.label || "Filter by"}
                    <span className="arrow">▼</span>
                  </button>
                  {showFilterOptions && (
                    <div className="filter-options">
                      {filterOptions.map((option) => (
                        <div key={option.value} className="filter-option" onClick={() => handleFilterChange(option.value)}>
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
            </div>
            <button className="submit-button" onClick={handleSubmit}>
              Submit a Ticket
            </button>
          </div>
          
          {/*Table Component */}
          <ServTickTable 
            filteredTickets={filteredTickets} 
            onRowClick={handleRowClick} 
            selectedTicket={selectedTicket}
          />

          <div className="queue-container">
            <button
              type="button"
              onClick={handleQueueTicket}
              className={`queue-button ${selectedTicketStatus === "Open" ? "clickable" : "disabled"}`}
              disabled={selectedTicketStatus !== "Open"} // disable if status not open
            >
              Queue Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SubmitTicketModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmitTicket}
        user_id={user_id}
        employee_id={employee_id}
      />

      <QueueTicketModal isOpen={showQueueModal} onClose={() => setShowQueueModal(false)} onQueue={handleQueueCall} ticket={selectedTicket} />
    
      {showErrorModal && (
        <div className="alert-modal-overlay">
          <div className="alert-modal-content">
            <h2>ERROR</h2>
            <p>{errorModalMessage}</p>
            <button className="alert-okay-button" onClick={() => setShowErrorModal(false)}>OK</button>
          </div>
        </div>
      )}          

      {showSuccessModal && (
        <div className="alert-modal-overlay">
          <div className="alert-modal-content">
            <p>{successModalMessage}</p>
            <button className="alert-okay-button" onClick={() => setShowSuccessModal(false)}>OK</button>
          </div>
        </div>
      )}         
    </div>
  )
}

export default ServiceTicket

