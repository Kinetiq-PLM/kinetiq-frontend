"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceTicket.css"
import ServiceTicketIcon from "/icons/SupportServices/ServiceTicket.png"
import SubmitTicketModal from "../components/ServiceTicket/SubmitTicketModal"
import QueueTicketModal from "../components/ServiceTicket/QueueTicketModal"
import ServTickInputField from "../components/ServiceTicket/ServTickInputField"
import ServTickTable from "../components/ServiceTicket/ServTickTable"

const ServiceTicket = () => {
  // State for form fields
  const [ticketId, setTicketId] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [subject, setSubject] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [tickets, setTickets] = useState([])
  const [filterBy, setFilterBy] = useState("")
  const [showFilterOptions, setShowFilterOptions] = useState(false)

  // Modal states
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showQueueModal, setShowQueueModal] = useState(false)

  // Fetch tickets from API (mock function)
  useEffect(() => {
    // Replace with actual API call
    const fetchTickets = async () => {
      try {
        // const response = await fetch('your-api-endpoint');
        // const data = await response.json();
        // setTickets(data);

        // Mock data for demonstration
        setTickets([
          { id: "123", customerName: "Paula Manalo", createdAt: "2025-03-20", priority: "High", status: "Open" },
          {
            id: "124",
            customerName: "Samantha Hospital",
            createdAt: "2025-03-21",
            priority: "Critical",
            status: "Open",
          },
        ])
      } catch (error) {
        console.error("Error fetching tickets:", error)
      }
    }

    fetchTickets()
  }, [])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowSubmitModal(true)
  }

  // Handle submit from modal
  const handleSubmitTicket = (ticketData) => {
    console.log("Submitting ticket:", ticketData)

    // Here you would typically make an API call to submit the ticket
    // For now, we'll just close the modal
    setShowSubmitModal(false)

    // Optionally refresh the ticket list
    // fetchTickets()
  }

  const handleQueueTicket = () => {
    setShowQueueModal(true)
  }

  // Handle queue from modal
  const handleQueueCall = (queueData) => {
    console.log("Queueing ticket:", queueData)

    // Here you would typically make an API call to queue the ticket
    // For now, we'll just close the modal
    setShowQueueModal(false)
  }

  const handleFilterChange = (value) => {
    setFilterBy(value)
    setShowFilterOptions(false)
  }

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "pending", label: "Pending" },
    { value: "high", label: "High Priority" },
    { value: "critical", label: "Critical Priority" },
  ]

  // Filter tickets based on selected filter
  const filteredTickets = tickets.filter((ticket) => {
    if (!filterBy || filterBy === "all") return true
    if (filterBy === "open" && ticket.status === "Open") return true
    if (filterBy === "closed" && ticket.status === "Closed") return true
    if (filterBy === "pending" && ticket.status === "Pending") return true
    if (filterBy === "high" && ticket.priority === "High") return true
    if (filterBy === "critical" && ticket.priority === "Critical") return true
    return false
  })

  return (
    <div className="servtick">
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

          <div className="filter-submit-container">
            <div className="filter-dropdown">
              <button className="filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                Filter by
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
            <button className="submit-button" onClick={handleSubmit}>
              Submit a Ticket
            </button>
          </div>

          {/* Table Component */}
          <ServTickTable filteredTickets={filteredTickets} />

          <div className="queue-container">
            <button type="button" onClick={handleQueueTicket} className="queue-button">
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
      />

      <QueueTicketModal isOpen={showQueueModal} onClose={() => setShowQueueModal(false)} onQueue={handleQueueCall} />
    </div>
  )
}

export default ServiceTicket

