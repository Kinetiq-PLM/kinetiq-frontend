"use client"

import { useState } from "react"
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
  
  const [customerId, setCustomerId] = useState("")
  const [name, setName] = useState("")
  const [technicianId, setTechnicianId] = useState("")
  const [priority, setPriority] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [createdAt, setCreatedAt] = useState(() => {
    return new Date().toISOString().split("T")[0]; // yyyy/mm/dd
  });

  // fetches a list of customers
  const fetchCustomers = async () => {
    try {
      const response = await GET("/customers/");
      console.log("asdasd", response)
      setCustomers(response);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleToggleDropdown = () => {
    if (!isDropdownOpen) {
      fetchCustomers(); 
    }
    setDropdownOpen(!isDropdownOpen);
  };

  const handleSelectCustomer = (customer) => {
    setCustomerId(customer.customer_id); 
    setName(customer.name); 
    setDropdownOpen(false); 
};

const handleCustomerInput = (input) => {
  setCustomerId(input); 

  const matchedCustomer = customers.find(customer => customer.customer_id === input);

  if (matchedCustomer) {
    handleSelectCustomer(matchedCustomer); 
  } else {
    setName(""); 
  }
};

// fetches a list of techs
const fetchTechnicians = async () => {
  try {
    const response = await GET("/technicians/");
    console.log("techs", response)
    setTechnicians(response);
  } catch (error) {
    console.error("Error fetching technicians:", error);
  }
};

const handleToggleDropdownTech = () => {
  if (!isDropdownOpenT) {
    fetchTechnicians(); 
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

  const handleSubmit = async () => {
    onSubmit({
      customer_id: customerId,  
      priority: priority,
      subject: subject,
      description: description
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
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="customerId"
                    value={customerId}
                    //readOnly
                    onChange={(e) => handleCustomerInput(e.target.value)}
                    placeholder="Select customer ID"
                  />
                  <span className="select-arrow" onClick={handleToggleDropdown}>▼</span>
                {/* Dropdown List */}
                {isDropdownOpen && (
                  <ul className="dropdown-list">
                    {customers.length > 0 ? (
                      customers.map((customer) => (
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
                <label htmlFor="ticketSubject">
                  Ticket Subject <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="ticketSubject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter ticket subject"
                />
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
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="technicianId"
                    value={technicianId}
                    //readOnly
                    onChange={(e) => setTechnicianId(e.target.value)}
                    placeholder="Select technician ID"
                  />
                  <span className="select-arrow" onClick={handleToggleDropdownTech}>▼</span>
                    { /* Dropdown List */}
                    {isDropdownOpenT && (
                      <ul className="dropdown-list">
                        {technicians.length > 0 ? (
                          technicians.map((technician) => (
                            <li key={technician.employee_id} onClick={() => handleSelectTechnician(technician)}>
                              {technician.employee_id}
                            </li>
                          ))
                        ) : (
                          <li>No technicians found</li>
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
                <div className="select-wrapper">
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
              <div className="form-group" style={{ flex: "1 1 100%" }}>
                <label htmlFor="ticketDescription">
                  Ticket Description <span className="required">*</span>
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
          <button className="submit-button" onClick={handleSubmit}>
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmitTicketModal

