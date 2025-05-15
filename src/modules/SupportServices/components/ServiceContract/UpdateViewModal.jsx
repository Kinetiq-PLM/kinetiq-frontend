"use client"

import { useRef, useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceContractIcon from "/icons/SupportServices/ServiceContractIcon.png"

import { GET } from "../../api/api"

const UpdateViewModal = ({ isOpen, onClose, onUpdate, contract }) => {
  const [additionalServices, setAdditionalServices] = useState([{}]);
  const [isOpenStatusDD, setOpenStatusDD] = useState(false);
  const [renewals, setRenewals] = useState([]);
  const [isRenewalDropdown, setOpenRenewalDD] = useState(false);
  const [isRenewalChecked, setIsRenewalChecked] = useState(false);

  const [formData, setFormData] = useState({
    contractId: "",
    productId: "",
    productName: "",
    productQuantity: "",
    customerId: "",
    phoneNumber: "",
    name: "",
    emailAddress: "",
    dateIssued: "",
    terminationDate: "",
    approvedBy: "",
    approvedRemarks: "",
    approvalDate: "",
    contractStatus: "",
    contractDescription: "",
    contractDescription2: "",
    renewalId: "",
    renewalDate: "",
    renewalEndDate: "",
    additionalServiceId: "",
  });

  useEffect(() => {
    if (contract) {
      console.log("contract: ", contract)
      setFormData({
        contractId: contract.contract_id || "",
        productId: contract.product?.item_id || "",
        productName: contract.product?.item_name  || "",
        productQuantity: contract.product_quantity || "",
        customerId: contract.customer?.customer_id || "",
        phoneNumber: contract.customer?.phone_number || "",
        name: contract.customer?.name || "",
        emailAddress: contract.customer?.email_address  || "",
        dateIssued: contract.date_issued || ""  ,
        terminationDate: contract.end_date || "",
        contractStatus: contract.contract_status || "",
        contractDescription: contract.contract_description || "",
        renewalId: contract.renewal?.renewal_id || "",
        renewalDate: contract.renewal?.renewal_warranty_start || "",
        renewalEndDate: contract.renewal?.renewal_warranty_end  || "",
        additionalServiceId: contract.additional_service?.additional_service_id  || ""
      });
      fetchAddServices(contract.additional_service?.additional_service_id);
    }
  }, [contract]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "renewalId") {
      const matchedRenewal = renewals.find(
        (renewal) => renewal.renewal_id === value
      );
  
      setFormData((prev) => ({
        ...prev,
        renewalId: value,
        renewalDate: matchedRenewal
          ? matchedRenewal.renewal_warranty_start
          : "",
        renewalEndDate: matchedRenewal
          ? matchedRenewal.renewal_warranty_end
          : "",
      }));
    }
  };

  // fetches additional services
  const fetchAddServices = async (additionalServiceId) => {
    try {
      console.log("Fetching additional services for ID:", additionalServiceId);
      if (!additionalServiceId) return; 

      const response = await GET(`contract/contracts-add-services/${additionalServiceId}/`);
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

// fetches a list of renewals
const fetchRenewals = async () => {
  try {
    const response = await GET(`contract/contracts-renewals/${formData.contractId}/`); 
    console.log("renewals", response)
    setRenewals(response);
  } catch (error) {
    console.error("Error fetching renewals:", error);
  }
}

const handleToggleDDRenewals = () => {
  if (!isRenewalDropdown) {
    fetchRenewals(); 
  }
  setOpenRenewalDD(!isRenewalDropdown);
};

const handleSelectRenewal = (renewal) => {
  setFormData((prev) => ({
    ...prev,
    renewalId: renewal.renewal_id,
    renewalDate: renewal.renewal_warranty_start,
    renewalEndDate: renewal.renewal_warranty_end,
  }));
  setOpenRenewalDD(false);
};

const handleRenewalCheckbox = () => {
  setIsRenewalChecked((prev) => !prev);
};

  const handleUpdate = () => {
    onUpdate({
      ...contract,
      contract_id: formData.contractId,
      contract_status: formData.contractStatus,
      renewal_id: formData.renewalId,
      contract_description: formData.contractDescription
    })
  }

  const renewalRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (renewalRef.current && !renewalRef.current.contains(event.target)) {
        setOpenRenewalDD(false); // Close the dropdown
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
            <h2>Service Contract</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg"} alt="Close" />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contractId">Contract ID</label>
                <input
                  type="text"
                  id="contractId"
                  value={formData.contractId}
                  readOnly
                  onChange={handleChange}
                  placeholder="Enter contract ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="productId">Product ID</label>
                <input
                  type="text"
                  id="productId"
                  value={formData.productId}
                  readOnly
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
                  value={formData.productName}
                  readOnly
                  onChange={handleChange} 
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="productQuantity">Product Quantity</label>
                <input
                  type="text"
                  id="productQuantity"
                  value={formData.productQuantity}
                  readOnly
                  onChange={handleChange} 
                  placeholder="Enter product quantity"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerId">Customer ID</label>
                <input
                  type="text"
                  id="customerId"
                  value={formData.customerId}
                  readOnly
                  onChange={handleChange} 
                  placeholder="Enter customer ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  readOnly
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
                  value={formData.name}
                  readOnly
                  onChange={handleChange} 
                  placeholder="Enter name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emailAddress">Email Address</label>
                <input
                  type="email"
                  id="emailAddress"
                  value={formData.emailAddress}
                  readOnly
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
                    {additionalServices.length > 0 ? (
                      additionalServices.map((service, index) => (
                        <tr key={index}>
                          <td>{service.additional_service}</td>
                          <td>{service.service_type}</td>
                          <td>{service.date_start}</td>
                          <td>{service.duration}</td>
                          <td>{service.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>No additional services available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateIssued">Date Issued</label>
                <div className="date-input-wrapper">
                  <input
                    type="text"
                    id="dateIssued"
                    value={formData.dateIssued}
                    readOnly
                    onChange={handleChange} 
                    placeholder="dd/mm/yy"
                  />
                  {/* <img src={CalendarInputIcon || "/placeholder.svg"} alt="Calendar" className="calendar-icon" /> */}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="terminationDate">Termination Date</label>
                <div className="date-input-wrapper">
                  <input
                    type="text"
                    id="terminationDate"
                    value={formData.dateIssued}
                    readOnly
                    onChange={handleChange} 
                    placeholder="dd/mm/yy"
                  />
                  {/* <img src={CalendarInputIcon || "/placeholder.svg"} alt="Calendar" className="calendar-icon" /> */}
                </div>
              </div>
            </div>

            <div className="form-divider"></div>

            <div className="form-row" style={{ alignItems: "stretch" }}>
              <div className="form-column" style={{ flex: 1 }}>
                <div className="form-group">
                  <label htmlFor="contractStatus">Contract Status</label>
                  <div className="select-wrapper" ref={statusRef}>
                    <input
                      type="text"
                      id="contractStatus"
                      value={formData.contractStatus}
                      readOnly
                      onChange={handleChange} 
                      placeholder="Select status"
                    />
                    <span className="select-arrow" onClick={handleToggleDropdownStatus}>▼</span>
                    {isOpenStatusDD && (
                    <ul className="dropdown-list">
                      {["Pending", "Active", "Expired", "Terminated"].map((status) => (
                        <li key={status} onClick={() => handleSelectStatus(status)}>
                          {status}
                        </li>
                      ))}
                    </ul>
                  )}
                  </div>
                </div>

                <div className="renewal-container">
                  <input
                    type="checkbox"
                    id="renewal"
                    checked={isRenewalChecked}
                    onChange={handleRenewalCheckbox}
                  />
                  <label htmlFor="renewal">Renewal</label>
                </div>

                <div className="form-group">
                  <label htmlFor="renewalId">Renewal ID</label>
                  <div className="select-wrapper" ref={renewalRef}>
                    <input
                      type="text"
                      id="renewalId"
                      value={formData.renewalId}
                      onChange={(e) => {
                        handleChange(e); 
                        setOpenRenewalDD(true);
                      }}
                      onClick={handleToggleDDRenewals}
                      placeholder="Select renewal ID"
                      disabled={!isRenewalChecked}
                    />
                    <span className="select-arrow" onClick={handleToggleDDRenewals}>▼</span>
                    {isRenewalDropdown && (
                      <ul className="dropdown-list">
                        {renewals.length > 0 ? (
                          renewals
                            .filter((renewal) =>
                            renewal.renewal_id.toLowerCase().includes(formData.renewalId.toLowerCase())
                            )
                            .map((renewal) => (
                              <li key={renewal.renewal_id} onClick={() => handleSelectRenewal(renewal)}>
                                {renewal.renewal_id}
                              </li>
                            ))
                        ) : (
                          <li>No renewal ID found</li>
                        )}
                      </ul>
                    )}
                  </div>    
                </div>

                <div className="form-group">
                  <label htmlFor="renewalDate">Renewal Date</label>
                  <div className="date-input-wrapper">
                    <input
                      type="text"
                      id="renewalDate"
                      readOnly
                      value={formData.renewalDate}
                      onChange={handleChange}
                      placeholder="dd/mm/yy"
                      disabled={!isRenewalChecked}
                    />
                    {/* <img src={CalendarInputIcon || "/placeholder.svg"} alt="Calendar" className="calendar-icon" /> */}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="renewalEndDate">Renewal End Date</label>
                  <div className="date-input-wrapper">
                    <input
                      type="text"
                      id="renewalEndDate"
                      readOnly
                      value={formData.renewalEndDate}
                      onChange={handleChange}
                      placeholder="dd/mm/yy"
                      disabled={!isRenewalChecked}
                    />
                    {/* <img src={CalendarInputIcon || "/placeholder.svg"} alt="Calendar" className="calendar-icon" /> */}
                  </div>
                </div>
              </div>

              <div className="form-group view-cont-desc" style={{ flex: 1 }}>
                <label htmlFor="contractDescription">Contract Description</label>
                <textarea
                  id="contractDescription"
                  value={formData.contractDescription}
                  onChange={handleChange}
                  placeholder="Enter contract description"
                  style={{ height: "calc(100% - 1.5rem)" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="update-modal-button" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateViewModal

