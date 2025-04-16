"use client"

import { useRef, useEffect, useState } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"
import ServiceTicketIcon from "/icons/SupportServices/ServiceTicket.png"

import { GET } from "../../api/api"

const SubmitTicketModal = ({ isOpen, onClose, onSubmit }) => {
  const [customers, setCustomers] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [isDropdownOpenT, setDropdownOpenT] = useState(false);
  const [isDropdownOpenP, setDropdownOpenP] = useState(false);
  const [isDropdownOpenType, setDropdownOpenType] = useState(false);
  
  const [customerId, setCustomerId] = useState("")
  const [name, setName] = useState("")
  const [technicianId, setTechnicianId] = useState("")
  const [priority, setPriority] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [createdAt, setCreatedAt] = useState(() => {
    return new Date().toISOString().split("T")[0]; // yyyy/mm/dd
  });
  const [ticketType, setTicketType] = useState("")

  // fetches a list of customers
  const fetchCustomers = async () => {
    try {
      const response = await GET("ticket/tickets/customers/");
      console.log("asdasd", response)
      setCustomers(response);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleToggleDropdown = () => {
    if (!isDropdownOpen) {
      fetchCustomers(); 
      setDropdownOpen(true)
    }
    setDropdownOpen(!isDropdownOpen);
  };

  const handleSelectCustomer = (customer) => {
    setCustomerId(customer.customer_id); 
    setName(customer.name); 
    setDropdownOpen(false); 
};

// fetches a list of techs
const fetchTechnicians = async () => {
  try {
    const response = await GET("call/calls/technicians/");
    console.log("techs", response)
    setTechnicians(response);
  } catch (error) {
    console.error("Error fetching technicians:", error);
  }
};

const handleToggleDropdownTech = () => {
  if (!isDropdownOpenT) {
    fetchTechnicians(); 
    setDropdownOpenT(true)
  }
  setDropdownOpenT(!isDropdownOpenT);
};

const handleSelectTechnician = (technician) => {
  setTechnicianId(technician.employee_id); 
  setDropdownOpenT(false); 
};

// handle prio 
const handlePrioDropdown = () => {
  setDropdownOpenP((prev) => !prev); 
};

const handleSelectPriority = (selectedPrio) => {
  setPriority(selectedPrio); 
  setDropdownOpenP(false); 
};

// handle type 
const handleTypeDropdown = () => {
  setDropdownOpenType((prev) => !prev); 
};

const handleSelectType = (selectedType) => {
  setTicketType(selectedType); 
  setDropdownOpenType(false); 
};

  const customerRef = useRef(null);
  const typeRef = useRef(null);
  const techRef = useRef(null);
  const prioRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customerRef.current && !customerRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setDropdownOpenType(false); // Close the dropdown
      }
      if (techRef.current && !techRef.current.contains(event.target)) {
        setDropdownOpenT(false); // Close the dropdown
      }
      if (prioRef.current && !prioRef.current.contains(event.target)) {
        setDropdownOpenP(false); // Close the dropdown
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async () => {
    onSubmit({
      customer_id: customerId,  
      priority: priority,
      subject: subject,
      description: description,
      type: ticketType
    })
    setCustomerId("");
    setName("");
    setTechnicianId("");
    setPriority("");
    setSubject("");
    setDescription("");
    setCreatedAt(new Date().toISOString().split("T")[0]); // reset 2 today
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container submit-ticket-modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <img src={ServiceTicketIcon || "/placeholder.svg"} alt="Service Ticket" className="modal-header-icon" />
            <h2>Submit a Ticket</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg"} alt="Close" />
          </button>
        </div>
        <div className="modal-header-divider"></div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerId">
                  Customer ID <span className="required">*</span>
                </label>
                <div className="select-wrapper"  ref={customerRef}>
                  <input
                    type="text"
                    id="customerId"
                    value={customerId}
                    onChange={(e) => {
                      setCustomerId(e.target.value);
                      setDropdownOpen(true);
                    }}
                    onClick = {handleToggleDropdown}
                    placeholder="Select customer ID"
                  />
                  <span className="select-arrow" onClick={handleToggleDropdown}>▼</span> 
                  {isDropdownOpen && (
                        <ul className="dropdown-list">
                          {customers.length > 0 ? (
                            customers
                              .filter((customer) =>
                              customer.customer_id.toLowerCase().includes(customerId.toLowerCase())
                              )
                              .map((customer) => (
                                <li key={customer.customer_id} onClick={() => handleSelectCustomer(customer)}>
                                  {customer.customer_id}
                                </li>
                              ))
                          ) : (
                            <li>No customers found</li>
                          )}
                        </ul>
                      )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="ticketType">
                  Ticket Type <span className="required">*</span>
                </label>
                <div className="select-wrapper"  ref={typeRef}>
                  <input
                    type="text"
                    id="ticketType"
                    value={ticketType}
                    readOnly
                    onChange={(e) => setTicketType(e.target.value)}
                    placeholder="Select ticket type"
                  />
                  <span className="select-arrow" onClick={handleTypeDropdown}>▼</span>
                  {isDropdownOpenType && (
                    <ul className="dropdown-list">
                      {["Service", "Sales"].map((type) => (
                        <li key={type} onClick={() => handleSelectType(type)}>
                          {type}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>   
              </div>         
              
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  readOnly
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>
             
              { /* technician id field should be auto-filled by the one currently logged in but this works for now */}     
              <div className="form-group">
                <label htmlFor="technicianId">
                  Technician ID <span className="required">*</span>
                </label>
                <div className="select-wrapper"  ref={techRef}>
                  <input
                    type="text"
                    id="technicianId"
                    value={technicianId}
                    onChange={(e) => {
                      setTechnicianId(e.target.value);
                      setDropdownOpenT(true);
                    }}
                    onClick = {handleToggleDropdownTech}
                    placeholder="Select technician ID"
                  />
                  <span className="select-arrow" onClick={handleToggleDropdownTech}>▼</span>
                    {isDropdownOpenT && (
                        <ul className="dropdown-list">
                          {technicians.length > 0 ? (
                            technicians
                              .filter((technician) =>
                                technician.employee_id.toLowerCase().includes(technicianId.toLowerCase())
                              )
                              .map((technician) => (
                                <li key={technician.employee_id} onClick={() => handleSelectTechnician(technician)}>
                                  {technician.employee_id}
                                </li>
                              ))
                          ) : (
                            <li>No technicians ID found</li>
                          )}
                        </ul>
                      )}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="createdAt">Created at</label>
                <div className="date-input-wrapper">
                  <input
                    type="text"
                    id="createdAt"
                    value={createdAt}
                    readOnly
                    onChange={(e) => setCreatedAt(e.target.value)}
                    placeholder="dd/mm/yy"
                  />
                  {/* <img src={CalendarInputIcon || "/placeholder.svg"} alt="Calendar" className="calendar-icon" /> */}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="priority">
                  Priority <span className="required">*</span>
                </label>
                <div className="select-wrapper" ref={prioRef}>
                  <input
                    type="text"
                    id="priority"
                    value={priority}
                    readOnly
                    onChange={(e) => setPriority(e.target.value)}
                    placeholder="Select priority"
                  />
                  <span className="select-arrow" onClick={handlePrioDropdown}>▼</span>

                  {isDropdownOpenP && (
                    <ul className="dropdown-list">
                      {["Low", "Medium", "High", "Urgent"].map((prio) => (
                        <li key={prio} onClick={() => handleSelectPriority(prio)}>
                          {prio}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" >
                  <label htmlFor="ticketSubject">
                    Ticket Subject <span className="required">*</span>
                  </label>
                  <textarea
                    type="text"
                    id="ticketSubject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter ticket subject"
                  />
                </div>
            </div>
            <div className="form-row">
              <div className="form-group desc" style={{ flex: "1 1 100%" }}>
                <label htmlFor="ticketDescription">
                  Ticket Description
                </label>
                <textarea
                  id="ticketDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter ticket description"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            className={`update-button ${
              customerId && ticketType && technicianId && priority && subject ? "clickable" : "disabled"
            }`}
            onClick={handleSubmit}
            disabled={!(customerId && ticketType && technicianId && priority && subject)}
          >
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmitTicketModal

