"use client"

import { useRef, useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"
import ServiceContractIcon from "/icons/SupportServices/ServiceContractIcon.png"

import { GET } from "../../api/api"

const CreateContractModal = ({ isOpen, onClose, onCreate }) => {
  const today = new Date().toISOString().split("T")[0];
  const [additionalServices, setAdditionalServices] = useState([{}]);
  const [isOpenStatusDD, setOpenStatusDD] = useState(false);
  const [statementItems, setStatementItems] = useState([]);
  const [isSTMDropdown, setOpenSTMDD] = useState(false);
  const [formData, setFormData] = useState({
    statementId: "",
    productId: "",
    productName: "",
    productQuantity: "",
    customerId: "",
    phoneNumber: "",
    name: "",
    emailAddress: "",
    dateIssued: today,
    terminationDate: "",
    contractDescription: "",
    contractStatus: "",
    additionalServiceId: "",
  });

  useEffect(() => {
    fetchStatementItems(); 
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "statementId") {
      const matchedStatement = statementItems.find(
        (statementItem) => statementItem.statement_item_id === value
      );
  
      setFormData((prev) => ({
        ...prev,
        statementId: value,
        productId: matchedStatement?.product?.product_id || "",
        productName: matchedStatement?.product?.product_name || "",
        productQuantity: matchedStatement?.quantity || "",
        customerId: matchedStatement?.statement?.customer?.customer_id || "",
        phoneNumber: matchedStatement?.statement?.customer?.phone_number || "",
        emailAddress: matchedStatement?.statement?.customer?.email_address || "",
        name: matchedStatement?.statement?.customer?.name || "",
        additionalServiceId: matchedStatement?.additional_service || ""
      }));
    }
  };

  // fetches additional services
  const fetchStatementItems = async () => {
    try {
    const response = await GET(`/statement-items/`); 
    //console.log("statement-items", response)
    setStatementItems(response);
  } catch (error) {
    console.error("Error fetching statement items:", error);
  }
};

const handleToggleDDStatements = () => {
  if (!isSTMDropdown) {
    fetchStatementItems(); 
  }
  setOpenSTMDD(!isSTMDropdown);
};

const handleSelectSTM = (statementItem) => {
  setFormData((prev) => ({
    ...prev,
    statementId: statementItem.statement_item_id || "",
    productId: statementItem.product?.product_id || "",
    productName: statementItem.product?.product_name || "",
    productQuantity: statementItem.quantity || "",
    customerId: statementItem.statement?.customer?.customer_id || "",
    phoneNumber: statementItem?.statement?.customer?.phone_number || "",
    emailAddress: statementItem?.statement?.customer?.email_address || "",
    name: statementItem?.statement?.customer?.name || "",
    additionalServiceId: statementItem?.additional_service || ""
  }));
  if (statementItem.additional_service) {
    fetchAddServices(statementItem.additional_service);
  } else {
    console.log("No additional service ID found.");
    setAdditionalServices([{}]); 
  }
  setOpenSTMDD(false);
};

const fetchAddServices = async (additionalServiceId) => {
  try {
    console.log("Fetching additional services for ID:", additionalServiceId);
    if (!additionalServiceId) return; 

    const response = await GET(`contracts/${additionalServiceId}/`);
    console.log("Fetched additional services:", response);
    setAdditionalServices(response);
  } catch (error) {
    console.error("Error fetching additional services:", error);
  }
};

const handleToggleDropdownStatus = () => {
  setOpenStatusDD(!isOpenStatusDD);
};

const handleSelectStatus = (status) => {
  setFormData((prev) => ({
    ...prev,
    contractStatus: status,
  }));
  setOpenStatusDD(false); 
};

  const handleCreate = () => {
    onCreate({
      statement_item_id: formData.statementId,
      customer_id: formData.customerId,
      renewal_id: formData.add,
      contract_description: formData.contractDescription,
      additional_service_id: formData.additionalServiceId,
      product_id: formData.productId,
      contract_status: formData.contractStatus,
      product_quantity: formData.productQuantity,
    })
    setFormData({
      statementId: "",
      productId: "",
      productName: "",
      productQuantity: "",
      customerId: "",
      phoneNumber: "",
      name: "",
      emailAddress: "",
      dateIssued: "",
      terminationDate: "",
      contractDescription: "",
      contractStatus: "",
    });
  }

  const statementItemRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statementItemRef.current && !statementItemRef.current.contains(event.target)) {
        setOpenSTMDD(false); // Close the dropdown
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setOpenStatusDD(false); // Close the dropdown
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
      <div className="modal-container">
        <div className="modal-header" style={{ borderBottom: "2px solid #00a8a8" }}>
          <div className="modal-header-left">
            <img src={ServiceContractIcon || "/placeholder.svg"} alt="Service Contract" className="modal-header-icon" />
            <h2>Create a Service Contract</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg"} alt="Close" />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="statementId">Sales Statement ID  <span className="required">*</span></label>
                <div className="select-wrapper" ref={statementItemRef}>
                <input
                  type="text"
                  id="statementId"
                  value={formData.statementId}
                  onChange={(e) => {
                    handleChange(e); 
                    setOpenSTMDD(true);
                  }}
                  onClick={handleToggleDDStatements}
                  placeholder="Enter sales statement ID"
                />
                <span className="select-arrow" onClick={handleToggleDDStatements}>▼</span>
                  {isSTMDropdown && (
                      <ul className="dropdown-list">
                        {statementItems.length > 0 ? (
                          statementItems
                            .filter((statementItem) =>
                            statementItem.statement_item_id.toLowerCase().includes(formData.statementId.toLowerCase())
                            )
                            .map((statementItem) => (
                              <li key={statementItem.statement_item_id} onClick={() => handleSelectSTM(statementItem)}>
                                {statementItem.statement_item_id}
                              </li>
                            ))
                        ) : (
                          <li>No statement item ID  found</li>
                        )}
                      </ul>
                    )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="productId">Product ID</label>
                <input
                  type="text"
                  id="productId"
                  readOnly
                  value={formData.productId}
                  onChange={handleChange}
                  placeholder="Enter product ID"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="productName">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  readOnly
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="productQuantity">Product Quantity</label>
                <input
                  type="text"
                  id="productQuantity"
                  readOnly
                  value={formData.productQuantity}
                  onChange={handleChange}
                  placeholder="Enter product quantity"
                />
              </div>
            </div>

            <div className="form-divider"></div>

             <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerId">Customer ID</label>
                <input
                  type="text"
                  id="customerId"
                  readOnly
                  value={formData.customerId}
                  onChange={handleChange}
                  placeholder="Enter customer ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  readOnly
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  readOnly
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emailAddress">Email Address</label>
                <input
                  type="email"
                  id="emailAddress"
                  readOnly
                  value={formData.emailAddress}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="additionalServices">Additional Services</label>
              <div className="additional-services-table-container">
                <table className="additional-services-table">
                  <thead>
                    <tr>
                      <th>Additional Service ID</th>
                      <th>Service Type</th>
                      <th>Date Issued</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                  {additionalServices.length > 0
                      ? additionalServices.slice(0, 3).map((service, index) => (
                          <tr key={index}>
                            <td>{service.additional_service || ""}</td>
                            <td>{service.service_type || ""}</td>
                            <td>{service.date_start || ""}</td>
                            <td>{service.duration || ""}</td>
                            <td>{service.status || ""}</td>
                          </tr>
                        ))
                      : null}
                    {Array.from({ length: 3 - additionalServices.length }).map((_, index) => (
                      <tr key={`empty-${index}`}>
                        <td colSpan="5" style={{ textAlign: "center", color: "#888" }}>
                          {index === 0 && additionalServices.length === 0
                            ? "No additional services available"
                            : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contractDescription">Contract Description</label>
                <textarea
                  id="contractDescription"
                  alue={formData.contractDescription}
                  onChange={handleChange}
                  placeholder="Enter contract description"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contractStatus">Contract Status  <span className="required">*</span></label>
                <div className="select-wrapper" ref={statusRef}>
                  <input
                    type="text"
                    id="contractStatus"
                    value={formData.contractStatus}
                    onChange={handleChange}
                    readOnly
                    placeholder="Select status"
                  />
                  <span className="select-arrow" onClick={handleToggleDropdownStatus}>▼</span>
                  {isOpenStatusDD && (
                    <ul className="status-dropdown-list dropdown-list">
                      {["Pending", "Active", "Expired", "Terminated"].map((status) => (
                        <li key={status} onClick={() => handleSelectStatus(status)}>
                          {status}
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
          <button 
            className={`update-button ${
              formData.statementId && formData.contractStatus  ? "clickable" : "disabled"
              }`}
              onClick={handleCreate}
              disabled={!(formData.statementId && formData.contractStatus)}
            >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateContractModal

