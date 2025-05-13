import React, { useState, useEffect } from "react";
import "../styles/Forms.css"; 
import { POST } from "../api/api"; 

const tabs = ["Budget Submission Form", "Budget Request Form", "Budget Return Form"];

const InfoCard = ({ children, className }) => (
  <div className={`info-card ${className}`}>{children}</div>
);

const FormSubmit = ({ activeTab, departments, onFormSubmit, onClearForm, formSubmitted, onBackToForm }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFocus = (fieldName) => {
    setErrors({ ...errors, [fieldName]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    const requiredFields = {
      "Budget Submission Form": ["submitterName", "employeeId", "departmentName", "departmentId", "totalBudget", "usagePeriod", "endUsagePeriod"],
      "Budget Request Form": ["requestorName", "employeeId", "departmentName", "departmentId", "totalAmountNeeded", "usagePeriod", "endUsagePeriod", "requestReason", "urgencyLevel"],
      "Budget Return Form": ["requestorName", "employeeId", "departmentName", "departmentId", "requestId", "totalRequestAmount", "returnedAmount", "returnReason"],
    };

    requiredFields[activeTab].forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Please fill out this field";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onFormSubmit(formData, activeTab);
    }
  };

  const clearForm = () => {
    setFormData({});
    setErrors({});
    onClearForm();
  };

  return (
    <InfoCard className="form-container">
      {formSubmitted ? (
        <div className="submitted-message">
          <h3>Thank you</h3>
          <p>We have received your submission and will get back to you soon.</p>
          <p>You can check Validations and Approvals submodule under Financials for updates.</p>
          <button className="back-button" onClick={onBackToForm}>
            Back
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className="form-title">{activeTab}</h2>
          <div className="form-content">
            {activeTab === "Budget Submission Form" && (
              <>
                <div className="form-column">
                  <div className="form-group">
                    <label>Submitter Name: <span className="required">*</span></label>
                    <input type="text" name="submitterName" value={formData.submitterName || ""} onChange={handleChange} onFocus={() => handleFocus("submitterName")} />
                    {errors.submitterName && <p className="error">{errors.submitterName}</p>}
                  </div>
                  <div className="form-group">
                    <label>Employee ID: <span className="required">*</span></label>
                    <input type="text" name="employeeId" value={formData.employeeId || ""} onChange={handleChange} onFocus={() => handleFocus("employeeId")} />
                    {errors.employeeId && <p className="error">{errors.employeeId}</p>}
                  </div>
                  <div className="form-group">
                    <label>Department Name: <span className="required">*</span></label>
                    <select name="departmentName" value={formData.departmentName || ""} onChange={handleChange} onFocus={() => handleFocus("departmentName")}>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    {errors.departmentName && <p className="error">{errors.departmentName}</p>}
                  </div>
                  <div className="form-group">
                    <label>Department ID: <span className="required">*</span></label>
                    <input type="text" name="departmentId" value={formData.departmentId || ""} onChange={handleChange} onFocus={() => handleFocus("departmentId")} />
                    {errors.departmentId && <p className="error">{errors.departmentId}</p>}
                  </div>
                </div>
                <div className="form-column">
                  <div className="form-group">
                    <label>Proposed Total Budget for the Year: <span className="required">*</span></label>
                    <input type="number" name="totalBudget" value={formData.totalBudget || ""} onChange={handleChange} onFocus={() => handleFocus("totalBudget")} />
                    {errors.totalBudget && <p className="error">{errors.totalBudget}</p>}
                  </div>
                  <div className="form-group">
                    <label>Usage Period (start date): <span className="required">*</span></label>
                    <input type="text" name="usagePeriod" value={formData.usagePeriod || ""} onChange={handleChange} onFocus={() => handleFocus("usagePeriod")} />
                    {errors.usagePeriod && <p className="error">{errors.usagePeriod}</p>}
                  </div>
                  <div className="form-group">
                    <label>Usage Period (end date): <span className="required">*</span></label>
                    <input type="text" name="endUsagePeriod" value={formData.endUsagePeriod || ""} onChange={handleChange} onFocus={() => handleFocus("endUsagePeriod")} />
                    {errors.endUsagePeriod && <p className="error">{errors.endUsagePeriod}</p>}
                  </div>
                  <div className="form-group">
                    <label>Expense Breakdown for the Year: <span className="required">*</span></label>
                    <input type="file" name="expenseBreakdown" onChange={(e) => setFormData({ ...formData, expenseBreakdown: e.target.files[0] })} />
                  </div>
                </div>
              </>
            )}
            {activeTab === "Budget Request Form" && (
              <>
                <div className="form-column">
                  <div className="form-group">
                    <label>Requestor Name: <span className="required">*</span></label>
                    <input type="text" name="requestorName" value={formData.requestorName || ""} onChange={handleChange} onFocus={() => handleFocus("requestorName")} />
                    {errors.requestorName && <p className="error">{errors.requestorName}</p>}
                  </div>
                  <div className="form-group">
                    <label>Employee ID: <span className="required">*</span></label>
                    <input type="text" name="employeeId" value={formData.employeeId || ""} onChange={handleChange} onFocus={() => handleFocus("employeeId")} />
                    {errors.employeeId && <p className="error">{errors.employeeId}</p>}
                  </div>
                  <div className="form-group">
                    <label>Department Name: <span className="required">*</span></label>
                    <select name="departmentName" value={formData.departmentName || ""} onChange={handleChange} onFocus={() => handleFocus("departmentName")}>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    {errors.departmentName && <p className="error">{errors.departmentName}</p>}
                  </div>
                  <div className="form-group">
                    <label>Department ID: <span className="required">*</span></label>
                    <input type="text" name="departmentId" value={formData.departmentId || ""} onChange={handleChange} onFocus={() => handleFocus("departmentId")} />
                    {errors.departmentId && <p className="error">{errors.departmentId}</p>}
                  </div>
                  <div className="form-group">
                    <label>Total Amount Needed: <span className="required">*</span></label>
                    <input type="number" name="totalAmountNeeded" value={formData.totalAmountNeeded || ""} onChange={handleChange} onFocus={() => handleFocus("totalAmountNeeded")} />
                    {errors.totalAmountNeeded && <p className="error">{errors.totalAmountNeeded}</p>}
                  </div>
                </div>
                <div className="form-column">
                  <div className="form-group">
                    <label>Usage Period (start date): <span className="required">*</span></label>
                    <input type="text" name="usagePeriod" value={formData.usagePeriod || ""} onChange={handleChange} onFocus={() => handleFocus("usagePeriod")} />
                    {errors.usagePeriod && <p className="error">{errors.usagePeriod}</p>}
                  </div>
                  <div className="form-group">
                    <label>Usage Period (end date): <span className="required">*</span></label>
                    <input type="text" name="endUsagePeriod" value={formData.endUsagePeriod || ""} onChange={handleChange} onFocus={() => handleFocus("endUsagePeriod")} />
                    {errors.endUsagePeriod && <p className="error">{errors.endUsagePeriod}</p>}
                    <input type="text" name="endUsagePeriod" value={formData.endUsagePeriod || ""} onChange={handleChange} onFocus={() => handleFocus("endUsagePeriod")} />
                    {errors.endUsagePeriod && <p className="error">{errors.endUsagePeriod}</p>}
                  </div>
                  <div className="form-group">
                    <label>Reason for Request: <span className="required">*</span></label>
                    <input type="text" name="requestReason" value={formData.requestReason || ""} onChange={handleChange} onFocus={() => handleFocus("requestReason")} />
                    {errors.requestReason && <p className="error">{errors.requestReason}</p>}
                  </div>
                  <div className="form-group">
                    <label>Urgency Level of Request: <span className="required">*</span></label>
                    <select name="urgencyLevel" value={formData.urgencyLevel || ""} onChange={handleChange} onFocus={() => handleFocus("urgencyLevel")}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    {errors.urgencyLevel && <p className="error">{errors.urgencyLevel}</p>}
                  </div>
                  <div className="form-group">
                    <label>Expense Breakdown for the said Period: <span className="required">*</span></label>
                    <input type="file" name="expenseBreakdown" onChange={(e) => setFormData({ ...formData, expenseBreakdown: e.target.files[0] })} />
                  </div>
                </div>
              </>
            )}
            {activeTab === "Budget Return Form" && (
              <>
                <div className="form-column">
                  <div className="form-group">
                    <label>Requestor Name: <span className="required">*</span></label>
                    <input type="text" name="requestorName" value={formData.requestorName || ""} onChange={handleChange} onFocus={() => handleFocus("requestorName")} />
                    {errors.requestorName && <p className="error">{errors.requestorName}</p>}
                  </div>
                  <div className="form-group">
                    <label>Employee ID: <span className="required">*</span></label>
                    <input type="text" name="employeeId" value={formData.employeeId || ""} onChange={handleChange} onFocus={() => handleFocus("employeeId")} />
                    {errors.employeeId && <p className="error">{errors.employeeId}</p>}
                  </div>
                  <div className="form-group">
                    <label>Department Name: <span className="required">*</span></label>
                    <select name="departmentName" value={formData.departmentName || ""} onChange={handleChange} onFocus={() => handleFocus("departmentName")}>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    {errors.departmentName && <p className="error">{errors.departmentName}</p>}
                  </div>
                  <div className="form-group">
                    <label>Department ID: <span className="required">*</span></label>
                    <input type="text" name="departmentId" value={formData.departmentId || ""} onChange={handleChange} onFocus={() => handleFocus("departmentId")} />
                    {errors.departmentId && <p className="error">{errors.departmentId}</p>}
                  </div>
                  <div className="form-group">
                    <label>Request ID of the originating budget request of return amount: <span className="required">*</span></label>
                    <input type="text" name="requestId" value={formData.requestId || ""} onChange={handleChange} onFocus={() => handleFocus("requestId")} />
                    {errors.requestId && <p className="error">{errors.requestId}</p>}
                  </div>
                  <div className="form-group">
                    <label>Total Amount of originating budget request: <span className="required">*</span></label>
                    <input type="number" name="totalRequestAmount" value={formData.totalRequestAmount || ""} onChange={handleChange} onFocus={() => handleFocus("totalRequestAmount")} />
                    {errors.totalRequestAmount && <p className="error">{errors.totalRequestAmount}</p>}
                  </div>
                </div>
                <div className="form-column">
                  <div className="form-group">
                    <label>Returned Amount: <span className="required">*</span></label>
                    <input type="number" name="returnedAmount" value={formData.returnedAmount || ""} onChange={handleChange} onFocus={() => handleFocus("returnedAmount")} />
                    {errors.returnedAmount && <p className="error">{errors.returnedAmount}</p>}
                  </div>
                  <div className="form-group">
                    <label>Reason of Return: <span className="required">*</span></label>
                    <select name="returnReason" value={formData.returnReason || ""} onChange={handleChange} onFocus={() => handleFocus("returnReason")}>
                      <option value="Project Canceled">Project Canceled</option>
                      <option value="Unused Funds">Unused Funds</option>
                      <option value="Overestimation">Overestimation</option>
                      <option value="Miscalculation">Miscalculation</option>
                    </select>
                    {errors.returnReason && <p className="error">{errors.returnReason}</p>}
                  </div>
                  <div className="form-group">
                    <label>Expense History Breakdown: <span className="required">*</span></label>
                    <input type="file" name="expenseHistoryBreakdown" onChange={(e) => setFormData({ ...formData, expenseHistoryBreakdown: e.target.files[0] })} />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-button">
              Submit
            </button>
            <button type="button" className="clear-button" onClick={clearForm}>
              Clear form
            </button>
          </div>
        </form>
      )}
    </InfoCard>
  );
};

const BodyContent = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [formSubmitted, setFormSubmitted] = useState({
    "Budget Submission Form": false,
    "Budget Request Form": false,
    "Budget Return Form": false,
  });
  const [isCompact, setIsCompact] = useState(window.innerWidth < 768);

  const departments = [
    "Financials", "Project Management", "Marketing", "Human Resources",
    "Sales", "Distribution", "Information Technology",
    "Support and Services", "Operations", "Administration",
    "Purchasing", "Accounting", "Inventory", "MRP", "Production",
  ];

  useEffect(() => {
    const handleResize = () => setIsCompact(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = (direction) => {
    const currentIndex = tabs.indexOf(activeTab);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < tabs.length) {
      setActiveTab(tabs[newIndex]);
    }
  };

  // Function to handle budget submission submission
  // This function is called when the form is submitted
  const handleSubmitSubmission = async (subData) => {
    console.log("Submitting submission:", subData);
    try {
      const data = await POST("/form/budget-submission/", subData);
      console.log("Submission created successfully:", data);
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
      console.error(firstError);

      console.error("Error submitting submission: ", error);
    }
  };

  // Function to handle budget request submission
  // This function is called when the form is submitted
  const handleSubmitRequest = async (requestData) => {
    console.log("Submitting budget request:", requestData);
    try {
      const data = await POST("/form/budget-request-form/", requestData);
      console.log("Budget request created successfully:", data);
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

      console.error("Error creating budget request:", error.message);
      console.error(firstError);
      console.error("Error submitting budget request:", error);
    }
  };

  // Function to handle budget return submission
  // This function is called when the form is submitted
  const handleSubmitReturn = async (returnData) => {
    console.log("Submitting budget return:", returnData);
    try {
      const data = await POST("/form/budget-returns-form/", returnData); 
      console.log("Budget return created successfully:", data);
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
      console.error("Error creating budget return:", error.message);
      console.error(firstError);
      console.error("Error submitting budget return:", error);
    }
  };

  // It takes the form data and the name of the active tab as arguments
  const handleFormSubmit = (formData, tabName) => {
    setFormSubmitted({ ...formSubmitted, [tabName]: true });
    console.log(`Form data for ${tabName}:`, formData);
    let subData = {};
    if (tabName === "Budget Submission Form") {
      subData = {
        submitter_name: formData.submitterName,
        employee_id: formData.employeeId,
        dept_id: formData.departmentId,
        date_submitted: new Date().toISOString().split('T')[0],
        proposed_total_budget: formData.totalBudget,
        start_usage_period: formData.usagePeriod,
        end_usage_period: formData.endUsagePeriod,
        //expense_breakdown: formData.expenseBreakdown
      };
      handleSubmitSubmission(subData);
    } else if (tabName === "Budget Request Form") {
      subData = {
        requestor_name: formData.requestorName,
        employee_id: formData.employeeId,
        dept_id: formData.departmentId,
        requested_date: new Date().toISOString().split('T')[0],
        amount_requested: formData.totalAmountNeeded,
        expected_start_usage_period: formData.usagePeriod,
        expected_end_usage_period: formData.endUsagePeriod,
        reason_for_request: formData.requestReason,
        urgency_level_request: formData.urgencyLevel,
        //expense_breakdown_period: formData.expenseBreakdown
      };
      handleSubmitRequest(subData);
    } else if (tabName === "Budget Return Form") {
      subData = {
        returner_name: formData.requestorName,
        employee_id: formData.employeeId,
        dept_id: formData.departmentId,
        return_date: new Date().toISOString().split('T')[0],
        budget_request_id: formData.requestId,
        total_amount_requested: formData.totalRequestAmount,
        returned_amount: formData.returnedAmount,
        reason_returned: formData.returnReason,
        //expense_history_breakdown: formData.expenseBreakdown
      };
      handleSubmitReturn(subData);
    } else {
      console.error("Unknown tab name:", tabName);
    }
  };

  const handleClearForm = (tabName) => {
    setFormSubmitted({ ...formSubmitted, [tabName]: false });
  };

  const handleBackToForm = (tabName) => {
    setFormSubmitted({ ...formSubmitted, [tabName]: false });
  };


  return (
    <div className="forms">
      <div className="body-content-container">
        <div className="tabs">
          {isCompact ? (
            <div className="compact-tabs">
              <button className="tab-button active">{activeTab}</button>
              <button onClick={() => handlePageChange("prev")} className="nav-button" disabled={activeTab === tabs[0]}>&#60;</button>
              <button onClick={() => handlePageChange("next")} className="nav-button" disabled={activeTab === tabs[tabs.length - 1]}>&#62;</button>
            </div>
          ) : (
            <div className="full-tabs">
              {tabs.map((tab) => (
                <button key={tab} className={`tab-button ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                  {tab}
                </button>
              ))}
              <button className="nav-button" onClick={() => handlePageChange("prev")}>&#60;</button>
              {[1, 2, 3].map((num, index) => (
                <button key={num} className={`page-button ${activeTab === tabs[index] ? "active" : ""}`} onClick={() => setActiveTab(tabs[index])}>
                  {num}
                </button>
              ))}
              <button className="nav-button" onClick={() => handlePageChange("next")}>&#62;</button>
            </div>
          )}
        </div>
        {tabs.map((tab) => (
          <div key={tab} style={{ display: activeTab === tab ? "block" : "none" }}>
            <FormSubmit
              activeTab={tab}
              departments={departments}
              onFormSubmit={handleFormSubmit}
              onClearForm={() => handleClearForm(tab)}
              formSubmitted={formSubmitted[tab]}
              onBackToForm={() => handleBackToForm(tab)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BodyContent;