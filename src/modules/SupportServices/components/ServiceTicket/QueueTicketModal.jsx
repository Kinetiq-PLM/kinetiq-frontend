"use client"

import { useRef, useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceTicketIcon from "/icons/SupportServices/ServiceTicket.png"

import { GET } from "../../api/api"

const QueueTicketModal = ({ isOpen, onClose, onQueue, ticket }) => {
  console.log("aaaa tx data", ticket)
  const [technicians, setTechnicians] = useState([]);
  const [isTechDropdown, setOpenTechDD] = useState(false);
  const [products, setProducts] = useState([]);
  const [isProdDropdown, setOpenProdDD] = useState(false);
  const [isOpenTypeDD, setOpenTypeDD] = useState(false);

  const [ticketId, setTicketId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [productId, setProductId] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [technicianName, setTechnicianName] = useState("");
  const [callType, setCallType] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    if (ticket) {
      setTicketId(ticket.ticket_id || "");
      setCustomerId(ticket.customer?.customer_id || ""); 
      setName(ticket.customer?.name || ""); 
      setEmailAddress(ticket.customer?.email_address || ""); 
      setPriority(ticket.priority || ""); 
    }
  }, [ticket]);

  const handleQueue = async () => {
    onQueue({
      service_ticket_id: ticketId,  
      product_id: productId,
      customer_id: customerId,
      technician: technicianId,
      call_type: callType, 
      priority_level: priority
    })

    // reset form
    setTicketId("")
    setCustomerId("")
    setName("")
    setEmailAddress("")
    setProductId("")
    setTechnicianId("")
    setTechnicianName("")
    setCallType("")
  }

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
    if (!isTechDropdown) {
      fetchTechnicians(); 
      setOpenTechDD(true);
    }
    setOpenTechDD(!isTechDropdown);
  };

  const handleSelectTechnician = (technician) => {
    setTechnicianId(technician.employee_id); 
    setTechnicianName(technician.first_name + " " + technician.last_name); 
    setOpenTechDD(false); 
  };

  const handletechnicianInput = (input) => {
    setTechnicianId(input); 
  
    const matchedTechnician = technicians.find(technician => technician.employee_id === input);
  
    if (matchedTechnician) {
      handleSelectTechnician(matchedTechnician); 
    } else {
      setTechnicianName(""); 
    }
  };

  // fetches a list of products
  const fetchProducts = async () => {
    try {
      const response = await GET("call/calls/products/");
      console.log("prods", response)
      setProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleToggleDropdownProd = () => {
    if (!isProdDropdown) {
      fetchProducts(); 
      setOpenProdDD(true);
    }
    setOpenProdDD(!isProdDropdown);
  };

  const handleSelectProduct = (product) => {
    setProductId(product.product_id); 
    setOpenProdDD(false); 
  };

  // handle type
  const handleTypeDropdown = () => {
    setOpenTypeDD((prev) => !prev); 
  };

  const handleSelectType = (selectedType) => {
    setCallType(selectedType); 
    setOpenTypeDD(false); 
  };

  const prodRef = useRef(null);
  const typeRef = useRef(null);
  const techRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (prodRef.current && !prodRef.current.contains(event.target)) {
        setOpenProdDD(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setOpenTypeDD(false); // Close the dropdown
      }
      if (techRef.current && !techRef.current.contains(event.target)) {
        setOpenTechDD(false); // Close the dropdown
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container queue-ticket-modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <img src={ServiceTicketIcon || "/placeholder.svg"} alt="Service Ticket" className="modal-header-icon" />
            <h2>Queue Ticket</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg"} alt="Close" />
          </button>
        </div>
        <div className="modal-header-divider"></div>

        <div className="modal-content">
          <div className="modal-form two-column">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="ticketId">Ticket ID</label>
                <input
                  type="text"
                  id="ticketId"
                  value={ticketId}
                  readOnly
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="Enter ticket ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="queueCustomerId">Customer ID</label>
                <input
                  type="text"
                  id="queueCustomerId"
                  value={customerId}
                  readOnly
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Enter customer ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="queueName">Name</label>
                <input
                  type="text"
                  id="queueName"
                  value={name}
                  readOnly
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emailAddress">Email Address</label>
                <input
                  type="email"
                  id="emailAddress"
                  value={emailAddress}
                  readOnly
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="productId">
                  Product ID <span className="required">*</span>
                </label>
                <div className="select-wrapper" ref={prodRef}>
                  <input
                    type="text"
                    id="productId"
                    value={productId}
                    onChange={(e) => {
                      setProductId(e.target.value);
                      setOpenProdDD(true);
                    }}
                    onClick = {handleToggleDropdownProd}
                    placeholder="Select product ID"
                  />
                  <span className="select-arrow"  onClick={handleToggleDropdownProd}>▼</span>
                    {isProdDropdown && (
                        <ul className="dropdown-list prod-dropdown-list">
                          {products.length > 0 ? (
                            products
                              .filter((product) =>
                              product.product_id.toLowerCase().includes(productId.toLowerCase())
                              )
                              .map((product) => (
                                <li key={product.product_id} onClick={() => handleSelectProduct(product)}>
                                  {product.product_id}
                                </li>
                              ))
                          ) : (
                            <li>No products found</li>
                          )}
                        </ul>
                      )}
                </div>
              </div>
            </div>

            <div className="form-column">
              <h3 className="column-header">Assign To:</h3>

              <div className="form-group">
                <label htmlFor="assignTechnicianId">
                  Technician ID <span className="required">*</span>
                </label>
                <div className="select-wrapper" ref={techRef}>
                  <input
                    type="text"
                    id="assignTechnicianId"
                    value={technicianId}
                    onChange={(e) => {
                      setTechnicianId(e.target.value);
                      setOpenTechDD(true);
                    }}
                    onClick = {handleToggleDropdownTech}
                    placeholder="Select technician ID"
                  />
                  <span className="select-arrow" onClick={handleToggleDropdownTech}>▼</span>
                  {isTechDropdown && (
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

              <div className="form-group">
                <label htmlFor="technicianName">Technician Name</label>
                <input
                  type="text"
                  id="technicianName"
                  value={technicianName}
                  readOnly
                  onChange={(e) => setTechnicianName(e.target.value)}
                  placeholder="Enter technician name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="callType">
                  Call Type <span className="required">*</span>
                </label>
                <div className="select-wrapper" ref={typeRef}>
                  <input
                    type="text"
                    id="callType"
                    value={callType}
                    readOnly
                    onChange={(e) => setCallType(e.target.value)}
                    placeholder="Select call type"
                  />
                  <span className="select-arrow" onClick={handleTypeDropdown}>▼</span>
                  {isOpenTypeDD && (
                    <ul className="dropdown-list">
                      {["Inquiry", "Request", "Other"].map((type) => (
                        <li key={type} onClick={() => handleSelectType(type)}>
                          {type}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="notification-message">
                <p>
                  An automated email will be sent to the customer notifying them that a call will happen within 24
                  hours.
                </p>
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
              productId && technicianId && callType ? "clickable" : "disabled"
            }`}
            onClick={handleQueue}
            disabled={!(productId && technicianId && callType)}
          >
            Queue Call
          </button>
        </div>
      </div>
    </div>
  )
}

export default QueueTicketModal

