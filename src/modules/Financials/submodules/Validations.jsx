import React, { useState, useEffect } from "react";
import "../styles/Validations.css";
import { GET, PATCH } from "../api/api";

const tabs = ["Budget Submission List", "Budget Request List", "Returns List"];

const departmentIds = {
  "HR-DEPT-2025-105fd9": "Report Generator",
  "HR-DEPT-2025-60cafa": "CRM",
  "HR-DEPT-2025-7a126": "Financials",
  "HR-DEPT-2025-84ee38": "Sales",
  "HR-DEPT-2025-8cc307": "Accounting",
  "HR-DEPT-2025-8f325e": "Inventory",
  "HR-DEPT-2025-8fe431": "Distribution",
  "HR-DEPT-2025-9f99d0": "Support & Services",
  "HR-DEPT-2025-a5da8b": "Operations",
  "HR-DEPT-2025-a73184": "Administration",
  "HR-DEPT-2025-b2c9fd": "MRP",
  "HR-DEPT-2025-e56f4d": "Project Management",
  "HR-DEPT-2025-e8572a": "Management",
  "HR-DEPT-2025-e9fa93": "Human Resources",
  "HR-DEPT-2025-eee3c0": "Purchasing",
  "HR-DEPT-2025-fe9854": "Production",
};

const InfoCard = ({ title, value, color, children, className }) => (
  <div className={`info-card ${className}`}>{children}</div>
);

const BodyContent = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isCompact, setIsCompact] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [filterBy, setFilterBy] = useState("All");
  const [originalData, setOriginalData] = useState([]);
  const [originalRequestData, setOriginalRequestData] = useState([]);
  const [originalReturnsData, setOriginalReturnsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Initialize as empty arrays
  const [filteredRequestData, setFilteredRequestData] = useState([]);
  const [filteredReturnsData, setFilteredReturnsData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [editedDataForConfirmation, setEditedDataForConfirmation] = useState([]);
  const [validationTableData, setValidationTableData] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [isWarningPopupVisible, setIsWarningPopupVisible] = useState(false);
  const [validatedByError, setValidatedByError] = useState({});
  const [approvedAmountError, setApprovedAmountError] = useState({});
  const [departmentBudgets, setDepartmentBudgets] = useState({});
  const [isReviewConfirmationVisible, setIsReviewConfirmationVisible] = useState(false);
  const [returnRemarks, setReturnRemarks] = useState({});
  const [returnComments, setReturnComments] = useState({});

  const closeWarningPopup = () => {
    setIsWarningPopupVisible(false);
  };

  useEffect(() => {
    console.log("Date Range:", dateRange);
    console.log("Search Term:", searchTerm);
    console.log("Filter By:", filterBy);
    console.log("Original Data (Submissions):", originalData);

    let tempData = filterDataByDate(originalData, dateRange);
    tempData = filterDataBySearch(tempData, searchTerm);
    tempData = sortData(tempData, filterBy);
    setFilteredData(tempData);
    console.log("Filtered Data (Submissions):", tempData);

    console.log("Original Data (Requests):", originalRequestData);
    let tempRequestData = filterDataByDate(originalRequestData, dateRange, 'requestDate');
    tempRequestData = filterDataBySearch(tempRequestData, searchTerm, 'reqID');
    tempRequestData = sortData(tempRequestData, filterBy, 'reqID', 'requestDate');
    setFilteredRequestData(tempRequestData);
    console.log("Filtered Data (Requests):", tempRequestData);

    console.log("Original Data (Returns):", originalReturnsData);
    let tempReturnsData = filterDataByDate(originalReturnsData, dateRange, 'returnDate');
    tempReturnsData = filterDataBySearch(tempReturnsData, searchTerm, 'returnsId');
    tempReturnsData = sortData(tempReturnsData, filterBy, 'returnsId', 'returnDate');
    setFilteredReturnsData(tempReturnsData);
    console.log("Filtered Data (Returns):", tempReturnsData);
  }, [dateRange, searchTerm, filterBy, originalData, originalRequestData, originalReturnsData]);

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePageChange = (direction) => {
    const currentIndex = tabs.indexOf(activeTab);
    if (direction === "next" && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const filterDataByDate = (data, range, dateField = 'submissionDate') => {
    try {
      const today = new Date();
      let startDate;
      if (range === "Last 7 days") {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
      } else if (range === "Last 30 days") {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
      } else {
        return data;
      }
      return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        return !isNaN(itemDate) && itemDate >= startDate && itemDate <= today;
      });
    } catch (error) {
      console.error("Error in filterDataByDate:", error);
      return [];
    }
  };

  const filterDataBySearch = (data, term, requestIdField = 'requestId') => {
    try {
      if (!term) return data;
      const lowerTerm = term.toLowerCase();
      return data.filter(item => {
        return (
          item[requestIdField]?.toLowerCase().includes(lowerTerm) ||
          item.departmentId?.toLowerCase().includes(lowerTerm) ||
          item.amount?.toLowerCase().includes(lowerTerm) ||
          (item.submissionDate ? item.submissionDate.toLowerCase().includes(lowerTerm) : false) ||
          (item.requestDate ? item.requestDate.toLowerCase().includes(lowerTerm) : false) ||
          (item.returnDate ? item.returnDate.toLowerCase().includes(lowerTerm) : false) ||
          item.validatedBy?.toLowerCase().includes(lowerTerm) ||
          item.remarks?.toLowerCase().includes(lowerTerm) ||
          item.approvedAmount?.toLowerCase().includes(lowerTerm) ||
          item.validationStatus?.toLowerCase().includes(lowerTerm) ||
          (item.validationDate ? item.validationDate.toLowerCase().includes(lowerTerm) : false) ||
          item.comments?.toLowerCase().includes(lowerTerm)
        );
      });
    } catch (error) {
      console.error("Error in filterDataBySearch:", error);
      return [];
    }
  };

  const sortData = (data, sortBy, requestIdField = 'requestId', dateField = 'submissionDate') => {
    try {
      if (sortBy === "All") return data;
      const sortedData = [...data];
      sortedData.sort((a, b) => {
        let comparison = 0;
        if (sortBy === "lowest amount") {
          const amountA = parseFloat(a.amount?.replace(/,/g, '')) || parseFloat(a.returnedAmount?.replace(/,/g, '')) || 0;
          const amountB = parseFloat(b.amount?.replace(/,/g, '')) || parseFloat(b.returnedAmount?.replace(/,/g, '')) || 0;
          comparison = amountA - amountB;
        } else if (sortBy === "highest amount") {
          const amountA = parseFloat(a.amount?.replace(/,/g, '')) || parseFloat(a.returnedAmount?.replace(/,/g, '')) || 0;
          const amountB = parseFloat(b.amount?.replace(/,/g, '')) || parseFloat(b.returnedAmount?.replace(/,/g, '')) || 0;
          comparison = amountB - amountA;
        } else if (sortBy === "oldest requests") {
          comparison = new Date(a[dateField]) - new Date(b[dateField]);
        } else if (sortBy === "latest requests") {
          comparison = new Date(b[dateField]) - new Date(a[dateField]);
        }
        return comparison;
      });
      return sortedData;
    } catch (error) {
      console.error("Error in sortData:", error);
      return [];
    }
  };

  const updateValidationTable = (updatedData) => {
    const departmentTotals = {};
    let totalAllocated = 0;
    updatedData.forEach(item => {
      if (item.validationStatus === "Validated" && item.approvedAmount) {
        const departmentName = departmentIds[item.departmentId] || item.departmentId;
        const amount = parseFloat(item.approvedAmount.replace(/,/g, '')) || 0;
        if (departmentTotals[departmentName]) {
          departmentTotals[departmentName] += amount;
        } else {
          departmentTotals[departmentName] = amount;
        }
        totalAllocated += amount;
      }
    });
    const tableData = Object.keys(departmentTotals).map(dept => ({
      department: dept,
      allocatedBudget: departmentTotals[dept].toLocaleString(undefined, { minimumFractionDigits: 2 }),
      totalSpent: "N/A",
      remainingBudget: departmentTotals[dept].toLocaleString(undefined, { minimumFractionDigits: 2 })
    }));
    setValidationTableData(tableData);
    setTotalBudget(totalAllocated);
  };

  const updateRequestValidationTable = (requestData) => {
    const departmentApproved = {};
    let totalApproved = 0;

    // Calculate total approved for each department
    requestData.forEach(item => {
      if (item.validationStatus === "Validated" && item.approvedAmount) {
        const departmentName = departmentIds[item.departmentId] || item.departmentId;
        const approvedAmount = parseFloat(item.approvedAmount.replace(/,/g, '')) || 0;
        if (departmentApproved[departmentName]) {
          departmentApproved[departmentName] += approvedAmount;
        } else {
          departmentApproved[departmentName] = approvedAmount;
        }
        totalApproved += approvedAmount;
      }
    });

    // Calculate allocated and spent for each department based on submission and request data
    const departmentData = {};
    originalData.forEach(item => {
      const departmentName = departmentIds[item.departmentId] || item.departmentId;
      if (!departmentData[departmentName]) {
        departmentData[departmentName] = { allocatedBudget: 0, totalSpent: 0 };
      }
      if (item.validationStatus === "Validated" && item.approvedAmount) {
        departmentData[departmentName].allocatedBudget += parseFloat(item.approvedAmount.replace(/,/g, '')) || 0;
      }
    });

    originalRequestData.forEach(item => {
      const departmentName = departmentIds[item.departmentId] || item.departmentId;
      if (item.validationStatus === "Validated" && item.approvedAmount) {
        if (!departmentData[departmentName]) {
          departmentData[departmentName] = { allocatedBudget: 0, totalSpent: 0 };
        }
        departmentData[departmentName].totalSpent += parseFloat(item.approvedAmount.replace(/,/g, '')) || 0;
      }
    });

    // Create table data with calculated values
    const tableData = Object.keys(departmentData).map(deptName => {
      const allocated = departmentData[deptName].allocatedBudget;
      const spent = departmentData[deptName].totalSpent;
      const remaining = allocated - spent;
      return {
        department: deptName,
        allocatedBudget: allocated.toLocaleString(undefined, { minimumFractionDigits: 2 }),
        totalSpent: spent.toLocaleString(undefined, { minimumFractionDigits: 2 }),
        remainingBudget: remaining.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      };
    });

    setValidationTableData(tableData);
    setTotalBudget(totalApproved);
  };

  const updateTotalReturns = (returnsData) => {
    const totalReturned = returnsData.reduce((acc, item) => {
      if (item.validationStatus === "Validated") {
        return acc + parseFloat(item.returnedAmount?.replace(/,/g, '')) || 0;
      }
      return acc;
    }, 0);
    setTotalBudget(totalReturned);
  };

  useEffect(() => {
    if (activeTab === "Budget Submission List") {
      updateValidationTable(filteredData); // Use filtered data
    } else if (activeTab === "Budget Request List") {
      updateRequestValidationTable(filteredRequestData); // Use filtered data
    } else if (activeTab === "Returns List") {
      updateTotalReturns(filteredReturnsData);  // Use filtered data
    }
  }, [filteredData, filteredRequestData, filteredReturnsData, activeTab]);

  const handleRowSelect = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter(id => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  const handleEditClick = () => {
    if (selectedRows.length === 0) {
      setIsWarningPopupVisible(true);
      return;
    }
    setIsEditModalOpen(true);
  };

  const handleEditChange = (rowId, field, value) => {
    if (activeTab === "Returns List" && field === "remarks") {
      setReturnRemarks(prevRemarks => ({ ...prevRemarks, [rowId]: value, }));
      setReturnComments(prevComments => ({ ...prevComments, [rowId]: value, }));
    } else {
      setEditedData(prevData => ({
        ...prevData,
        [rowId]: {
          ...prevData[rowId],
          [field]: value,
        },
      }));
    }
  };

  const handleCommitChanges = () => {
    let hasEmptyFields = false;
    let newValidatedByError = {};
    let newApprovedAmountError = {};
    selectedRows.forEach(rowId => {
      if (!editedData[rowId]?.validatedBy) {
        hasEmptyFields = true;
        newValidatedByError[rowId] = true;
      }
      if (!editedData[rowId]?.approvedAmount && activeTab !== "Returns List") {
        hasEmptyFields = true;
        newApprovedAmountError[rowId] = true;
      }
    });
    if (hasEmptyFields) {
      setValidatedByError(newValidatedByError);
      setApprovedAmountError(newApprovedAmountError);
      return;
    }
    const editedDataForConfirmation = selectedRows.map(rowId => {
      const activeRow =
        activeTab === "Budget Submission List" ?
          originalData.find(row => row.requestId === rowId) :
          activeTab === "Budget Request List" ?
            originalRequestData.find(row => row.reqID === rowId) :
            originalReturnsData.find(row => row.returnsId === rowId);
      return {
        ...(activeTab === "Budget Submission List" ?
          originalData.find(row => row.requestId === rowId) :
          activeTab === "Budget Request List" ?
            originalRequestData.find(row => row.reqID === rowId) :
            originalReturnsData.find(row => row.returnsId === rowId)),
        validatedBy: editedData[rowId]?.validatedBy || "",
        approvedAmount: editedData[rowId]?.approvedAmount || "",
        remarks: activeTab === "Returns List" ? returnRemarks[rowId] || "" : activeRow?.remarks || "",
        comments: activeTab === "Returns List" ? returnComments[rowId] || "" : "N/A",
      };
    });
    setEditedDataForConfirmation(editedDataForConfirmation);
    setIsConfirmationVisible(true);
  };

  const handleConfirmSubmit = () => {
    patchEditedRows();
    setIsConfirmationVisible(false);
  };

  const fetchReturns = async () => {
    try {
      const data = await GET("/validation/budget-returns/");
      const mappedData = data.map(sub => ({
        validationId: sub.validation_id,
        returnsId: sub?.budget_return?.budget_return_id || "",
        departmentId: sub?.budget_return?.dept?.dept_name || "",
        returnDate: sub?.budget_return?.return_date || "",
        originTotalBudget: sub.final_approved_amount || "",
        returnedAmount: sub?.budget_return?.returned_amount || "",
        attachedFile: sub?.budget_return?.expense_history_breakdown || "",
        remarks: sub.remarks || "",
        comments: sub.comments || "",
        validationStatus: sub.validation_status || "",
        validationDate: sub.validation_date || "",
        validatedBy: sub.validated_by || "",
      }));
      setOriginalReturnsData(mappedData);
    } catch (error) {
      console.error("Error fetching returns:", error);
    }
  }

  const fetchRequests = async () => {
    try {
      const data = await GET("/validation/budget-requests/");
      const mappedData = data.map(sub => ({
        validationId: sub.validation_id,
        reqID: sub?.budget_request?.budget_request_id || "",
        departmentId: sub?.budget_request?.dept?.dept_name || "",
        amount: sub?.budget_request?.amount_requested || "",
        requestDate: sub?.budget_request?.requested_date || "",
        validatedBy: sub?.validated_by || "",
        remarks: sub.remarks || "",
        approvedAmount: sub.final_approved_amount || "",
        validationStatus: sub.validation_status || "",
        validationDate: sub.validation_date || "",
      }));
      setOriginalRequestData(mappedData);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }

  const fetch = async () => {
    try {
      const data = await GET("/validation/budget-submissions/");
      const mappedData = data.map(sub => ({
        validationId: sub.validation_id,
        requestId: sub?.budget_submission?.budget_submission_id || "",
        departmentId: sub?.budget_submission?.dept?.dept_name || "",
        amount: sub.amount_requested || "",
        submissionDate: sub?.budget_submission?.date_submitted || "",
        validatedBy: sub.validated_by || "",
        remarks: sub.remarks || "",
        approvedAmount: sub.final_approved_amount || "",
        validationStatus: sub.validation_status || "",
        validationDate: sub.validation_date || "",
      }));
      setOriginalData(mappedData);
    } catch (error) {
      console.error("Error fetching budget validations:", error);
    }
  }

  useEffect(() => {
    fetch();
    fetchRequests();
    fetchReturns();
  }, []);

  const patchEditedRows = async () => {
    try {
      for (const row of editedDataForConfirmation) {
        const requestId = row.requestId || row.reqID || row.returnsId;
        if (!requestId) {
          console.error("Error: ID is undefined for row:", row);
          continue;
        }
        let endpoint = "";
        let payload = {};
        let dateValidated = new Date().toISOString().split('T')[0];
        console.log("Date Validated:", dateValidated);
        if (activeTab === "Budget Submission List" && row.requestId) {
          endpoint = `/validation/budget-submissions/${row.validationId}/`;
          payload = {
            validated_by: editedData[row.requestId]?.validatedBy || "",
            final_approved_amount: editedData[row.requestId]?.approvedAmount || "",
            validation_date: dateValidated || "",
            remarks: 'Approved' || "",
            validation_status: 'Validated' || "",
          };
        } else if (activeTab === "Budget Request List" && row.reqID) {
          endpoint = `/validation/budget-requests/${row.validationId}/`;
          payload = {
            validated_by: editedData[row.reqID]?.validatedBy || "",
            final_approved_amount: editedData[row.reqID]?.approvedAmount || "",
            validation_date: dateValidated || "",
            remarks: 'Approved' || "",
            validation_status: 'Validated' || "",
          };
        } else if (activeTab === "Returns List" && row.returnsId) {
          endpoint = `/validation/budget-returns/${row.validationId}/`;
          payload = {
            validated_by: editedData[row.returnsId]?.validatedBy || "",
            remarks: row.remarks || "",
            validation_date: dateValidated || "",
            comments: row.comments || "N/A",
            expense_history_breakdown: row.attachedFile || "",
          };
        } else {
          console.error("Unsupported tab or missing ID:", row);
          continue;
        }
        console.log("Updating row with endpoint:", endpoint, "and payload:", payload);
        try {
          const response = await PATCH(endpoint, payload);
          console.log("Row updated successfully:", response);
        } catch (error) {
          console.error("Error updating row:", error);
        }
      }
      setIsConfirmationVisible(false);
      fetch();
      fetchRequests();
      fetchReturns();
    } catch (error) {
      console.error("Error in patching rows:", error);
      alert("An error occurred while updating rows. Please try again.");
    }
  };

  const handleRequestReview = () => {
    setIsReviewConfirmationVisible(true);
  };

  const handleProceedReview = () => {
    // Logic to handle proceeding with the review process
    setIsConfirmationVisible(false);
    alert("Review process initiated.");
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setValidatedByError({});
    setApprovedAmountError({});
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationVisible(false);
  };

  const handleCancelReviewConfirmation = () => {
    setIsReviewConfirmationVisible(false);
  };

  return (
    <div className="valid">
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
              {tabs.map(tab => (
                <button key={tab} className={`tab-button ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>
              ))}
              <button className="nav-button" onClick={() => handlePageChange("prev")}>&#60;</button>
              {[1, 2, 3].map((num, index) => (
                <button key={num} className={`page-button ${activeTab === tabs[index] ? "active" : ""}`} onClick={() => setActiveTab(tabs[index])}>{num}</button>
              ))}
              <button className="nav-button" onClick={() => handlePageChange("next")}>&#62;</button>
            </div>
          )}
        </div>
        {activeTab === "Budget Submission List" && (
          <div className="content-container">
            <InfoCard className="summary-infocard">
              <div className="summary-container">
                <div className="summary-date-range">August 2025 - August 2026</div>
                <div className="summary-details">
                  <div className="summary-total-budget">
                    Total Budget
                    <p>₱{totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="summary-status">
                    <div className="summary-validated">Validated <span className="status-circle validated"></span>
                      <p>{originalData.filter(item => item.validationStatus === "Validated").length}</p>
                    </div>
                    <div className="summary-pending">
                      Pending <span className="status-circle pending"></span>
                      <p>{originalData.filter(item => item.validationStatus=== "Pending").length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </InfoCard>
            <InfoCard className="infocard-validation-table">
              <table className="validation-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Allocated Budget</th>
                    <th>Total Spent</th>
                    <th>Remaining Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {validationTableData.map(row => (
                    <tr key={row.department}>
                      <td>{row.department}</td>
                      <td>{row.allocatedBudget}</td>
                      <td>{row.totalSpent}</td>
                      <td>{row.remainingBudget}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </InfoCard>
            <InfoCard className="filter-infocard">
              <div className="filter-controls">
                <input className="search" type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <div className="filter-group">
                  <select className="select-day" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                    <option value="Last 30 days">Last 30 days</option>
                    <option value="Last 7 days">Last 7 days</option>
                    <option value="All Time">All Time</option>
                  </select>
                  <select className="select-type" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                    <option value="All">Filter By</option>
                    <option value="lowest amount">Lowest Amount</option>
                    <option value="highest amount">Highest Amount</option>
                    <option value="oldest requests">Oldest Requests</option>
                    <option value="latest requests">Latest Requests</option>
                  </select>
                </div>
              </div>
              <InfoCard className="table-infocard">
                <table className="validation-table-2">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Submission ID</th>
                      <th>Department ID</th>
                      <th>Amount Requested</th>
                      <th>Submission Date</th>
                      <th>Validation Date</th>
                      <th>Validated By</th>
                      <th>Remarks</th>
                      <th>Approved Amount</th>
                      <th>Validation Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, index) => ( // Use filteredData here
                      <tr key={index} onClick={() => handleRowSelect(row.requestId)} className={selectedRows.includes(row.requestId) ? "selected" : ""} style={{ backgroundColor: row.validationStatus === "Validated" ? "#f0f0f0" : "white" }}>
                        <td>
                          <div className="row-wrapper">
                            <input type="checkbox" checked={selectedRows.includes(row.requestId)} readOnly />
                          </div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.requestId}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.departmentId}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.amount}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.submissionDate}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.validationDate ? row.validationDate : "N/A"}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.validationStatus === "Pending" ? "N/A" : row.validatedBy}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.remarks}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.validationStatus === "Pending" ? "N/A" : row.approvedAmount}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">
                            <span className={`status-label ${row.validationStatus.toLowerCase()}`}>{row.validationStatus}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="edit-button" onClick={handleEditClick}>Edit</button>
              </InfoCard>
            </InfoCard>
          </div>
        )}
        {activeTab === "Budget Request List" && (
          <div className="content-container">
            <InfoCard className="summary-infocard">
              <div className="summary-container">
                <div className="summary-date-range">August 2025-August 2026</div>
                <div className="summary-details">
                  <div className="summary-total-budget">
                    Total Approved Amount
                    <p>₱{totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="summary-status">
                    <div className="summary-validated">
                      Validated <span className="status-circle validated"></span>
                      <p>{originalRequestData.filter(item => item.validationStatus === "Validated").length}</p>
                    </div>
                    <div className="summary-pending">
                      Pending <span className="status-circle pending"></span>
                      <p>{originalRequestData.filter(item => item.validationStatus === "Pending").length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </InfoCard>
            <InfoCard className="infocard-validation-table">
              <table className="validation-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Allocated Budget</th>
                    <th>Total Spent</th>
                    <th>Remaining Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {validationTableData.map(row => ( // Use validationTableData
                    <tr key={row.department}>
                      <td>{row.department}</td>
                      <td>{row.allocatedBudget}</td>
                      <td>{row.totalSpent}</td>
                      <td>{row.remainingBudget}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </InfoCard>
            <InfoCard className="filter-infocard">
              <div className="filter-controls">
                <input className="search" type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <div className="filter-group">
                  <select className="select-day" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                    <option value="Last 30 days">Last 30 days</option>
                    <option value="Last 7 days">Last 7 days</option>
                    <option value="All Time">All Time</option>
                  </select>
                  <select className="select-type" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                    <option value="All">Filter By</option>
                    <option value="lowest amount">Lowest Amount</option>
                    <option value="highest amount">Highest Amount</option>
                    <option value="oldest requests">Oldest Requests</option>
                    <option value="latest requests">Latest Requests</option>
                  </select>
                </div>
              </div>
              <InfoCard className="table-infocard">
                <table className="validation-table-2">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Request ID</th>
                      <th>Department ID</th>
                      <th>Amount Requested</th>
                      <th>Request Date</th>
                      <th>Validation Date</th>
                      <th>Validated By</th>
                      <th>Remarks</th>
                      <th>Approved Amount</th>
                      <th>Validation Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequestData.map((row, index) => (  
                      <tr key={index} onClick={() => handleRowSelect(row.reqID)} className={selectedRows.includes(row.reqID) ? "selected" : ""} style={{ backgroundColor: row.validationStatus === "Validated" ? "#f0f0f0" : "white" }}>
                        <td>
                          <div className="row-wrapper">
                            <input type="checkbox" checked={selectedRows.includes(row.reqID)} readOnly />
                          </div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.reqID}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.departmentId}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.amount}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.requestDate}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.validationDate ? row.validationDate : "N/A"}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.validationStatus === "Pending" ? "N/A" : row.validatedBy}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.remarks}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.validationStatus === "Pending" ? "N/A" : row.approvedAmount}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">
                            <span className={`status-label ${row.validationStatus.toLowerCase()}`}>{row.validationStatus}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="edit-button" onClick={handleEditClick}>Edit</button>
              </InfoCard>
            </InfoCard>
          </div>
        )}
        {activeTab === "Returns List" && (
          <div className="content-container">
            <InfoCard className="summary-infocard">
              <div className="summary-container">
                <div className="summary-date-range">August 2025 - August 2026</div>
                <div className="summary-details">
                  <div className="summary-total-budget">
                    Total Returned Amount
                    <p>₱{totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="summary-status">
                    <div className="summary-validated">
                      Validated <span className="status-circle validated"></span>
                      <p>{filteredReturnsData.filter(item => item.validationStatus === "Validated").length}</p>
                    </div>
                    <div className="summary-pending">
                      Pending <span className="status-circle pending"></span>
                      <p>{filteredReturnsData.filter(item => item.validationStatus === "Pending").length}</p>
                    </div>
                    <div className="summary-toreview">
                      To Review <span className="status-circle toreview"></span>
                      <p>{filteredReturnsData.filter(item => item.validationStatus === "To Review").length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </InfoCard>
            <InfoCard className="filter-infocard">
              <div className="filter-controls">
                <input className="search" type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <div className="filter-group">
                  <select className="select-day" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                    <option value="Last 30 days">Last 30 days</option>
                    <option value="Last 7 days">Last 7 days</option>
                    <option value="All Time">All Time</option>
                  </select>
                  <select className="select-type" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                    <option value="All">Filter By</option>
                    <option value="lowest amount">Lowest Amount</option>
                    <option value="highest amount">Highest Amount</option>
                    <option value="oldest requests">Oldest Requests</option>
                    <option value="latest requests">Latest Requests</option>
                  </select>
                </div>
              </div>
              <InfoCard className="table-infocard">
                <table className="validation-table-2">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Returns ID</th>
                      <th>Department ID</th>
                      <th>Return Date</th>
                      <th>Origin Budget</th>
                      <th>Returned Amount</th>
                      <th>Attached File</th>
                      <th>Validation Date</th>
                      <th>Validated By</th>
                      <th>Remarks</th>
                      <th>Comments</th>
                      <th>Validation Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReturnsData.map((row, index) => ( // Use filteredReturnsData
                      <tr key={index} onClick={() => handleRowSelect(row.returnsId)} className={selectedRows.includes(row.returnsId) ? "selected" : ""} style={{ backgroundColor: row.validationStatus === "Validated" ? "#f0f0f0" : "white" }}>
                        <td>
                          <div className="row-wrapper">
                            <input type="checkbox" checked={selectedRows.includes(row.returnsId)} readOnly />
                          </div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.returnsId}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.departmentId}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.returnDate}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.originTotalBudget}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.returnedAmount}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">
                            {row.attachedFile ? <a href={row.attachedFile} target="_blank" rel="noopener noreferrer">View File</a> : "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.validationDate ? row.validationDate : "N/A"}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.validationStatus === "Pending" ? "N/A" : row.validatedBy}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">
                            {row.validationStatus === "Validated" ? "Approved" : row.validationStatus === "Pending" ? "Awaiting Validation" : row.validationStatus === "To Review" ? "For Resubmission" : "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="row-wrapper">{row.comments || "N/A"}</div>
                        </td>
                        <td>
                          <div className="row-wrapper">
                          <span className={`status-label ${row.validationStatus.toLowerCase()} ${row.validationStatus.trim().toLowerCase() === 'to review' ? 'status-toreview' : ''}`}>{row.validationStatus}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="edit-button" onClick={handleEditClick}>Edit</button>
              </InfoCard>
            </InfoCard>
          </div>
        )}
        {isEditModalOpen && (
          <InfoCard className="edit-modal">
            <div className="edit-modal-content">
              <div className="edit-modal-header">
                <h3>Validate Submission</h3>
              </div>
              {selectedRows.map(rowId => {
                const row = originalData.find(r => r.requestId === rowId);
                const rowRequest = originalRequestData.find(r => r.reqID === rowId);
                const rowReturns = originalReturnsData.find(r => r.returnsId === rowId);
                const activeRow = activeTab === "Budget Submission List" ? row : activeTab === "Budget Request List" ? rowRequest : rowReturns;
                return (
                  <div key={rowId} className="edit-modal-item">
                    <div className="edit-modal-left">
                      <div className="edit-modal-select-icon">
                        <input type="checkbox" style={{ transform: 'scale(1.5)' }} checked={selectedRows.includes(rowId)} readOnly />
                      </div>
                      <div className="edit-modal-details">
                        <p>
                          <strong>{activeTab === "Budget Submission List" ? "Submission ID:" : activeTab === "Budget Request List" ? "Request ID:" : "Returns ID:"}</strong>
                          {activeRow?.requestId || activeRow?.reqID || activeRow?.returnsId}
                        </p>
                        <p>
                          <strong> Department ID:</strong>{activeRow?.departmentId}
                        </p>
                        <p>
                          <strong>Amount:</strong> {activeRow?.amount || activeRow?.returnedAmount}
                        </p>
                        <p>
                          <strong>{activeTab === "Budget Submission List" ? "Submission Date:" : activeTab === "Budget Request List" ? "Request Date:" : "Return Date:"} </strong>
                          {activeRow?.submissionDate ? activeRow.submissionDate : activeRow?.requestDate ? activeRow.requestDate : activeRow?.returnDate}
                        </p>
                        <div className="edit-modal-input-group validated-by-group">
                          <label>
                            <strong>Validated By:</strong>
                          </label>
                          <input
                            type="text"
                            value={editedData[rowId]?.validatedBy || ""}
                            onChange={(e) => {
                              handleEditChange(rowId, "validatedBy", e.target.value);
                              setValidatedByError(prevErrors => ({ ...prevErrors, [rowId]: false }));
                            }}
                          />
                          {validatedByError[rowId] && <p className="error-message">Validated By is required</p>}
                        </div>
                        {activeTab === "Returns List" ? (
                          <div className="edit-modal-input-group remarks-group">
                            <label>
                              <strong>Remarks:</strong>
                            </label>
                            <select
                              value={returnRemarks[rowId] || ""}
                              onChange={(e) => handleEditChange(rowId, "remarks", e.target.value)}
                            >
                              <option value="">Select Remarks</option>
                              <option value="Exact Amount Returned">Exact Amount Returned</option>
                              <option value="Budget Mismatched">Budget Mismatched</option>
                              <option value="Overreturned">Overreturned</option>
                              <option value="Underreturned">Underreturned</option>
                              <option value="Revalidation Needed">Revalidation Needed</option>
                              <option value="Document Issue">Document Issue</option>
                            </select>
                          </div>
                        ) : (
                          <div className="edit-modal-input-group approved-amount-group">
                            <label>
                              <strong>Approved Amount:</strong>
                            </label>
                            <input
                              type="text"
                              value={editedData[rowId]?.approvedAmount || ""}
                              onChange={(e) => {
                                handleEditChange(rowId, "approvedAmount", e.target.value);
                                setApprovedAmountError(prevErrors => ({ ...prevErrors, [rowId]: false }));
                              }}
                            />
                            {approvedAmountError[rowId] && <p className="error-message">Please fill out this field</p>}
                          </div>
                        )}
                        {activeTab === "Returns List" && (
                          <p>
                            <strong>Attached File:</strong>
                            {activeRow?.attachedFile ? (
                              <a href={activeRow.attachedFile} target="_blank" rel="noopener noreferrer">View File</a>
                            ) : (
                              "N/A"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="edit-modal-buttons">
                <button className="modal-cancel-button" onClick={handleCancelEdit}>Cancel</button>
                {activeTab === 'Returns List' && <button className="modal-review-button" onClick={handleRequestReview}>Request Review</button>}
                <button className="modal-commit-button" onClick={handleCommitChanges}>Commit Changes</button>
              </div>
            </div>
          </InfoCard>
        )}
        {isConfirmationVisible && (
          <InfoCard className="popup-overlay">
            <div className="popup-content">
              <div className="popup-title">
                <h3>Confirm Changes</h3>
              </div>
              <div className="popup-message">
                <p>Are you sure you want to proceed with the following changes?</p>
                <ul>
                  {editedDataForConfirmation.map(item => (
                    <li key={item.requestId || item.reqID || item.returnsId}>
                      {activeTab === "Budget Submission List" ? `Submission ID:${item.requestId}` : activeTab === "Budget Request List" ? `Request ID: ${item.reqID}` : `Returns ID:${item.returnsId}`} - Validated By: {item.validatedBy},
                      {activeTab === "Returns List" ? `Remarks: ${item.remarks}` : `Approved Amount:${item.approvedAmount}`}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="popup-buttons">
                <button className="cancel-button" onClick={handleCancelConfirmation}>Cancel</button>
                <button className="proceed-button" onClick={handleConfirmSubmit}>Proceed</button>
              </div>
            </div>
          </InfoCard>
        )}
        {isWarningPopupVisible && (
          <div className="warning-popup">
            <div className="warning-popup-content">
              <h3>Warning</h3>
              <p>Please select at least one row to edit.</p>
              <button className="close-popup-button" onClick={closeWarningPopup}>OK</button>
            </div>
          </div>
        )}
        {isReviewConfirmationVisible && (
          <InfoCard className="popup-overlay">
            <div className="popup-content">
              <div className="popup-title">
                <h3>Request Review</h3>
              </div>
              <div className="popup-message">
                <p>Are you sure you want to request a review for the selected returns?</p>
              </div>
              <div className="popup-buttons">
                <button className="cancel-button" onClick={handleCancelReviewConfirmation}>Cancel</button>
                <button className="proceed-button" onClick={handleProceedReview}>Proceed</button>
              </div>
            </div>
          </InfoCard>
        )}
      </div>
    </div>
  );
};

export default BodyContent;

