"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceTicket.css"
import ServiceTicketIcon from "/icons/SupportServices/ServiceTicket.png"

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

    // Create ticket object
    const newTicket = {
      ticketId,
      customerId,
      subject,
      name,
      description,
      email,
      phone,
    }

    // Replace with actual API call
    try {
      // const response = await fetch('your-api-endpoint', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newTicket),
      // });

      console.log("Submitting ticket:", newTicket)

      // Reset form for demonstration
      setTicketId("")
      setCustomerId("")
      setSubject("")
      setName("")
      setDescription("")
      setEmail("")
      setPhone("")
    } catch (error) {
      console.error("Error submitting ticket:", error)
    }
  }

  const handleQueueTicket = () => {
    // Implement queue ticket functionality
    console.log("Queue ticket clicked")
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
          <div className="input-fields-container">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="ticketId">Ticket ID</label>
                <input
                  type="text"
                  id="ticketId"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="1321"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Ticket Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. MRI Machine Maintenance"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Ticket Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Scheduled preventive maintenance for MRI scanner."
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label htmlFor="customerId">Customer ID</label>
                <input
                  type="text"
                  id="customerId"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="CID#89423"
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@gmail.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Phone Number"
                />
              </div>
            </div>
          </div>

          <div className="filter-submit-container">
            <div className="filter-dropdown">
              <button className="filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                Filter by {filterBy ? `: ${filterOptions.find((opt) => opt.value === filterBy)?.label}` : ""}{" "}
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

          <div className="table-container">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Customer Name</th>
                  <th>Created at</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket, index) => (
                  <tr key={ticket.id} className={index % 2 === 0 ? "" : "alternate-row"}>
                    <td>{ticket.id}</td>
                    <td>{ticket.customerName}</td>
                    <td>{ticket.createdAt}</td>
                    <td className={`priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</td>
                    <td>{ticket.status}</td>
                  </tr>
                ))}
                {/* Empty rows to match the design */}
                {Array(5 - filteredTickets.length)
                  .fill()
                  .map((_, index) => (
                    <tr
                      key={`empty-${index}`}
                      className={`empty-row ${(index + filteredTickets.length) % 2 === 0 ? "" : "alternate-row"}`}
                    >
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="queue-container">
            <button type="button" onClick={handleQueueTicket} className="queue-button">
              Queue Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceTicket

