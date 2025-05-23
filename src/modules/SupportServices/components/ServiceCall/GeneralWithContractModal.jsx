"use client"

import { useRef, useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceCallIcon from "/icons/SupportServices/ServiceCallIcon.png"

import { GET } from "../../api/api"

const GeneralWithContractModal = ({ isOpen, onClose, onUpdate, onShowResolution, callData }) => {
  const [customerId, setCustomerId] = useState("")
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [productId, setProductId] = useState("")
  const [productName, setProductName] = useState("")
  const [contractNo, setContractNo] = useState("")
  const [terminationDate, setTerminationDate] = useState("")
  const [callId, setCallId] = useState("")
  const [callType, setCallType] = useState("")
  const [ticketId, setTicketId] = useState("")
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")
  const [resolutionDetails, setResolutionDetails] = useState("")
  const [status, setStatus] = useState("")
  const [priority, setPriority] = useState("")
  const [activeTab, setActiveTab] = useState("general")

  const [products, setProducts] = useState([]);
  const [isProdDropdown, setOpenProdDD] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [isContractDropdown, setOpenContractDD] = useState(false);
  const [isOpenTypeDD, setOpenTypeDD] = useState(false);
  const [isOpenStatusDD, setOpenStatusDD] = useState(false);
  const [isDropdownOpenP, setDropdownOpenP] = useState(false);

  // Update form when callData changes
  useEffect(() => {
    if (callData) {
      // Reset all fields to empty to show placeholders
      setCallId(callData.service_call_id || "")
      setCustomerId(callData.customer?.customer_id || "")
      setName(callData.customer?.name || "");
      setStatus(callData.call_status || "")
      setPriority(callData.priority_level || "")
      setTicketId(callData.service_ticket?.ticket_id || "")
      setPhoneNumber(callData.customer?.phone_number || "");
      setProductId(callData.product?.item_id || "");
      setProductName(callData.product?.item_name || "");
      setContractNo(callData.contract?.contract_id || "")
      setTerminationDate(callData.contract?.end_date || "")
      setCallType(callData.call_type || "")
      setTicketSubject(callData.service_ticket?.subject || "")
      setTicketDescription(callData.service_ticket?.description || "")
      setResolutionDetails(callData.resolution || "")
      
    }
  }, [callData])

  const handleSubmit = () => {
    onUpdate({
      service_call_id: callId,
      customer_id: customerId,
      product_id: productId,
      contract_id: contractNo,
      call_type: callType,
      ticket_id: ticketId,
      call_status: status,
      priority_level: priority,
      resolution: resolutionDetails
    })
  }

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
      setOpenProdDD(true)
    }
    setOpenProdDD(!isProdDropdown);
  };

  const handleSelectProduct = (product) => {
    setProductId(product.item_id); 
    setProductName(product.item_name)
    setOpenProdDD(false); 
  };

  // fetches a list of contracts
  const fetchContracts = async () => {
    try {
      const response = await GET(`contract/contracts/${productId}/${customerId}`); 
      console.log("contracts", response)
      setContracts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleToggleDropdownContract = () => {
    if (!isContractDropdown) {
      fetchContracts(); 
      setOpenContractDD(true)
    }
    setOpenContractDD(!isContractDropdown);
  };

  const handleSelectContract = (contract) => {
    setContractNo(contract.contract_id); 
    setTerminationDate(contract.end_date)
    setOpenContractDD(false); 
  };

  // handle type
  const handleTypeDropdown = () => {
    setOpenTypeDD((prev) => !prev); 
  };

  const handleSelectType = (selectedType) => {
    setCallType(selectedType); 
    setOpenTypeDD(false); 
  };

  // handle status
  const handleStatusDropdown = () => {
    setOpenStatusDD((prev) => !prev); 
  };

  const handleSelectStatus = (selectedStatus) => {
    setStatus(selectedStatus); 
    setOpenStatusDD(false); 
  };

  // handle prio 
  const handlePrioDropdown = () => {
    setDropdownOpenP((prev) => !prev); 
  };

  const handleSelectPriority = (selectedPrio) => {
    setPriority(selectedPrio); 
    setDropdownOpenP(false); 
  };

  const prodRef = useRef(null);
  const typeRef = useRef(null);
  const contractRef = useRef(null);
  const statusRef = useRef(null);
  const prioRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (prodRef.current && !prodRef.current.contains(event.target)) {
        setOpenProdDD(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setOpenTypeDD(false); // Close the dropdown
      }
      if (contractRef.current && !contractRef.current.contains(event.target)) {
        setOpenContractDD(false); // Close the dropdown
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setOpenStatusDD(false); // Close the dropdown
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


  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container service-call-modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <img
              src={ServiceCallIcon || "/placeholder.svg?height=24&width=24"}
              alt="Service Call"
              className="modal-header-icon"
            />
            <h2>Service Call</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg?height=24&width=24"} alt="Close" />
          </button>
        </div>

        <div className="modal-header-divider"></div>

        <div className="modal-tabs">
          <div
            className={`modal-tab ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            General
          </div>
          <div className={`modal-tab ${activeTab === "resolution" ? "active" : ""}`} onClick={() => onShowResolution()}>
            Resolution
          </div>
        </div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerId">Customer ID</label>
                <input
                  type="text"
                  id="customerId"
                  value={customerId}
                  readOnly
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Enter customer ID"
                />
              </div>
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
              <div className="form-group">
                <label htmlFor="ticketSubject">Ticket Subject</label>
                <input
                  type="text"
                  id="ticketSubject"
                  value={ticketSubject}
                  readOnly
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Enter ticket subject"
                />
              </div>
            </div>

            <div className="form-row aligned-row-desc">
            <div className="form-row aligned-column">
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={phoneNumber}
                    readOnly
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productId">Product ID</label>
                  <div className="select-wrapper" ref={prodRef}>
                    <input
                      type="text"
                      id="productId"
                      value={productId}
                      onChange={(e) => {
                        setProductId(e.target.value);
                        setOpenProdDD(true); // show dropdown on typing
                      }}
                      onClick={handleToggleDropdownProd}
                      placeholder="Select product ID"
                    />
                    <span className="select-arrow" onClick={handleToggleDropdownProd}>▼</span>
                    {isProdDropdown && (
                      <ul className="dropdown-list prod-dropdown-list">
                        {products.length > 0 ? (
                          products
                            .filter((product) =>
                            product.item_id.toLowerCase().includes(productId.toLowerCase())
                            )
                            .map((product) => (
                              <li key={product.item_id} onClick={() => handleSelectProduct(product)}>
                                {product.item_id}
                              </li>
                            ))
                        ) : (
                          <li>No products found</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="productName">Product Name</label>
                  <input
                    type="text"
                    id="productName"
                    value={productName}
                    readOnly
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
              </div>

              <div className="form-group contract-desc">
                  <label htmlFor="ticketDescription">Ticket Description</label>
                  <textarea
                    id="ticketDescription"
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Enter ticket description"
                  />
              </div>
            </div>

            <div className="form-row aligned-row">
              <div className="form-group">
                <label htmlFor="contractNo">Contract No.</label>
                <div className="select-wrapper" ref={contractRef}>
                  <input
                    type="text"
                    id="contractNo"
                    value={contractNo}
                    onChange={(e) => {
                      setContractNo(e.target.value);
                      setOpenContractDD(true); // show dropdown on typing
                    }}
                    onClick={handleToggleDropdownContract}
                    placeholder="Select contract number"
                  />
                  <span className="select-arrow" onClick={handleToggleDropdownContract}>▼</span>
                    {isContractDropdown && (
                      <ul className="dropdown-list">
                        {contracts.length > 0 ? (
                          contracts
                            .filter((contract) =>
                              contract.contract_id.toLowerCase().includes(contractNo.toLowerCase())
                            )
                            .map((contract) => (
                              <li key={contract.contract_id} onClick={() => handleSelectContract(contract)}>
                                {contract.contract_id}
                              </li>
                            ))
                        ) : (
                          <li>No contracts found</li>
                        )}
                      </ul>
                    )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="terminationDate">Termination Date</label>
                <div className="date-input-wrapper">
                  <input
                    type="text"
                    id="terminationDate"
                    value={terminationDate}
                    readOnly
                    onChange={(e) => setTerminationDate(e.target.value)}
                    placeholder="dd/mm/yy"
                  />
                  {/* <img
                    src={CalendarInputIcon || "/placeholder.svg?height=16&width=16"}
                    alt="Calendar"
                    className="calendar-icon"
                  /> */}
                </div>
              </div>
            </div>

            <div className="form-divider"></div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="callId">Call ID</label>
                <input
                  type="text"
                  id="callId"
                  value={callId}
                  readOnly
                  onChange={(e) => setCallId(e.target.value)}
                  placeholder="Enter call ID"
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <div className="select-wrapper" ref={statusRef}>
                  <input
                    type="text"
                    id="status"
                    value={status}
                    readOnly
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="Select status"
                  />
                  <span className="select-arrow" onClick={handleStatusDropdown}>▼</span>
                  {isOpenStatusDD && (
                    <ul className="dropdown-list">
                      {["Open", "Closed", "In Progress"].map((status) => (
                        <li key={status} onClick={() => handleSelectStatus(status)}>
                          {status}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="callType">Call Type</label>
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
                    <ul className="dropdown-list type-dropdown-list">
                      {["Inquiry", "Request", "Other"].map((type) => (
                        <li key={type} onClick={() => handleSelectType(type)}>
                          {type}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
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
                    <ul className="dropdown-list prio-dropdown-list">
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
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="update-modal-button" onClick={handleSubmit}>
            Update
          </button>
        </div>
      </div>
    </div>
  )
}

export default GeneralWithContractModal

