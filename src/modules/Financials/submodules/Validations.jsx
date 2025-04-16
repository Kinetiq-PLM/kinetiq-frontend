import React, { useState, useEffect } from "react";
import "../styles/Validations.css";
import { GET, PATCH } from "../api/api";

const tabs = ["Budget Submission List", "Budget Request List", "Returns List"];
const initialDepartmentBudgets = {
  "MAR016": { allocatedBudget: 1500000, totalSpent: 0, remainingBudget: 1500000 },
  "OPER015": { allocatedBudget: 1000000, totalSpent: 0, remainingBudget: 1000000 },
  "IT014": { allocatedBudget: 1300000, totalSpent: 0, remainingBudget: 1300000 },
  "ACC013": { allocatedBudget: 1200000, totalSpent: 0, remainingBudget: 1200000 },
  "PUR012": { allocatedBudget: 1900000, totalSpent: 0, remainingBudget: 1900000 },
  "SUP011": { allocatedBudget: 1100000, totalSpent: 0, remainingBudget: 1100000 },
  "MAN010": { allocatedBudget: 3200000, totalSpent: 0, remainingBudget: 3200000 },
  "MRP009": { allocatedBudget: 2300000, totalSpent: 0, remainingBudget: 2300000 },
  "INV008": { allocatedBudget: 1200000, totalSpent: 0, remainingBudget: 1200000 },
  "PM007": { allocatedBudget: 2500000, totalSpent: 0, remainingBudget: 2500000 },
  "HR006": { allocatedBudget: 3700000, totalSpent: 0, remainingBudget: 3700000 },
  "SAL001": { allocatedBudget: 5100000, totalSpent: 0, remainingBudget: 5100000 },
  "ADM002": { allocatedBudget: 6200000, totalSpent: 0, remainingBudget: 6200000 },
  "FIN003": { allocatedBudget: 2400000, totalSpent: 0, remainingBudget: 2400000 },
  "PRO004": { allocatedBudget: 1500000, totalSpent: 0, remainingBudget: 1500000 },
  "DIS005": { allocatedBudget: 2200000, totalSpent: 0, remainingBudget: 2200000 },
};
const InfoCard = ({ title, value, color, children, className }) => (
  <div className={`info-card ${className}`}>{children}</div>
);

const formatNumber = (number) => {
  if (typeof number !== 'number') return 'N/A';
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'N/A';
  }
};

const BodyContent = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isCompact, setIsCompact] = useState(window.innerWidth < 768);
  const [submissionSearchTerm, setSubmissionSearchTerm] = useState("");
  const [requestSearchTerm, setRequestSearchTerm] = useState("");
  const [returnsSearchTerm, setReturnsSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [submissionFilterBy, setSubmissionFilterBy] = useState("All");
  const [requestFilterBy, setRequestFilterBy] = useState("All");
  const [returnsFilterBy, setReturnsFilterBy] = useState("All");
  const [originalData, setOriginalData] = useState([]);
  const [originalRequestData, setOriginalRequestData] = useState([]);
  const [originalReturnsData, setOriginalReturnsData] = useState([]);
  const [departmentNameMap, setDepartmentNameMap] = useState({});

  const [filteredData, setFilteredData] = useState(originalData);
  const [filteredRequestData, setFilteredRequestData] = useState(originalRequestData);
  const [filteredReturnsData, setFilteredReturnsData] = useState(originalReturnsData);
  const [selectedSubmissionRows, setSelectedSubmissionRows] = useState([]);
  const [selectedRequestRows, setSelectedRequestRows] = useState([]);
  const [selectedReturnsRows, setSelectedReturnsRows] = useState([]);
  const [isSubmissionEditModalOpen, setIsSubmissionEditModalOpen] = useState(false);
  const [isRequestEditModalOpen, setIsRequestEditModalOpen] = useState(false);
  const [isReturnsEditModalOpen, setIsReturnsEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [editedDataForConfirmation, setEditedDataForConfirmation] = useState([]);
  const [validationTableData, setValidationTableData] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [isWarningPopupVisible, setIsWarningPopupVisible] = useState(false);
  const [validatedByError, setValidatedByError] = useState({});
  const [approvedAmountError, setApprovedAmountError] = useState({});
  const [departmentBudgets, setDepartmentBudgets] = useState(initialDepartmentBudgets);
  const [isReviewConfirmationVisible, setIsReviewConfirmationVisible] = useState(false);
  const [returnRemarks, setReturnRemarks] = useState({});
  const [returnComments, setReturnComments] = useState({});

  const closeWarningPopup = () => { setIsWarningPopupVisible(false); };
  useEffect(() => {
    let currentSubmissionFilter = activeTab === "Budget Submission List" ? submissionFilterBy : "All";
    let tempData = filterDataByDate(originalData, dateRange, 'submissionDate');
    tempData = filterDataBySearch(tempData, submissionSearchTerm, 'requestId');
    tempData = sortData(tempData, currentSubmissionFilter, 'requestId', 'submissionDate', activeTab);
    setFilteredData(tempData);

    let currentRequestFilter = activeTab === "Budget Request List" ? requestFilterBy : "All";
    let tempRequestData = filterDataByDate(originalRequestData, dateRange, 'requestDate');
    tempRequestData = filterDataBySearch(tempRequestData, requestSearchTerm, 'reqID');
    tempRequestData = sortData(tempRequestData, currentRequestFilter, 'reqID', 'requestDate', activeTab);
    setFilteredRequestData(tempRequestData);

    let currentReturnsFilter = activeTab === "Returns List" ? returnsFilterBy : "All";
    let tempReturnsData = filterDataByDate(originalReturnsData, dateRange, 'returnDate');
    tempReturnsData = filterDataBySearch(tempReturnsData, returnsSearchTerm, 'returnsId');
    tempReturnsData = sortData(tempReturnsData, currentReturnsFilter, 'returnsId', 'returnDate', activeTab);
    setFilteredReturnsData(tempReturnsData);
  }, [dateRange, submissionSearchTerm, requestSearchTerm, returnsSearchTerm, submissionFilterBy, requestFilterBy, returnsFilterBy, originalData, originalRequestData, originalReturnsData, activeTab]);

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

  const filterDataByDate = (data, range, dateField) => {
    try {
      if (!dateField) return data; // If no dateField is provided, return all data

      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today

      let startDate;
      if (range === "Last 7 days") {
        startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        startDate.setHours(0, 0, 0, 0); // Start of the day 7 days ago
      } else if (range === "Last 30 days") {
        startDate = new Date();
        startDate.setDate(today.getDate() - 30);
        startDate.setHours(0, 0, 0, 0); // Start of the day 30 days ago
      } else if (range === "All Time") {
        return data;
      } else {
        return data; // Default to all time if no valid range
      }

      return data.filter(item => {
        try {
          const itemDate = new Date(item[dateField]);
          itemDate.setHours(0, 0, 0, 0); // Consider only the date part

          const isInRange = itemDate >= startDate && itemDate <= today;
          return isInRange;
        } catch (error) {
          console.error(`Error parsing date for item ${item.requestId || item.reqID || item.returnsId}:`, item[dateField], error);
          return false;
        }
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
        return (String(item[requestIdField] || '').toLowerCase().includes(lowerTerm) ||
          String(item.departmentId || '').toLowerCase().includes(lowerTerm) ||
          String(item.amount || '').toLowerCase().includes(lowerTerm) ||
          (item.submissionDate ? formatDate(item.submissionDate).toLowerCase().includes(lowerTerm) : false) ||
          (item.requestDate ? formatDate(item.requestDate).toLowerCase().includes(lowerTerm) : false) ||
          (item.returnDate ? formatDate(item.returnDate).toLowerCase().includes(lowerTerm) : false) ||
          String(item.validatedBy || '').toLowerCase().includes(lowerTerm) ||
          String(item.remarks || '').toLowerCase().includes(lowerTerm) ||
          String(item.approvedAmount || '').toLowerCase().includes(lowerTerm) ||
          String(item.validationStatus || '').toLowerCase().includes(lowerTerm) ||
          (item.validationDate ? formatDate(item.validationDate).toLowerCase().includes(lowerTerm) : false) ||
          String(item.comments || '').toLowerCase().includes(lowerTerm));
      });
    } catch (error) {
      console.error("Error in filterDataBySearch:", error);
      return [];
    }
  };
  const sortData = (data, sortBy, requestIdField = 'requestId', dateField = 'submissionDate', activeTab) => {
    try {
      if (sortBy === "All") return data;
      const sortedData = [...data];
      sortedData.sort((a, b) => {
        let comparison = 0;
        if (sortBy === "lowest amount") {
          const amountA = parseFloat(
            (activeTab === "Returns List" ? a.returnedAmount : a.approvedAmount)?.replace(/,/g, '') || 0
          );
          const amountB = parseFloat(
            (activeTab === "Returns List" ? b.returnedAmount : b.approvedAmount)?.replace(/,/g, '') || 0
          );
          comparison = amountA - amountB;
        } else if (sortBy === "highest amount") {
          const amountA = parseFloat(
            (activeTab === "Returns List" ? a.returnedAmount : a.approvedAmount)?.replace(/,/g, '') || 0
          );
          const amountB = parseFloat(
            (activeTab === "Returns List" ? b.returnedAmount : b.approvedAmount)?.replace(/,/g, '') || 0
          );
          comparison = amountB - amountA;
        } else if (sortBy === "oldest requests") {
          const dateA = new Date(
            activeTab === "Budget Submission List" ? a.submissionDate : activeTab === "Budget Request List" ? a.requestDate : a.returnDate
          );
          const dateB = new Date(
            activeTab === "Budget Submission List" ? b.submissionDate : activeTab === "Budget Request List" ? b.requestDate : b.returnDate
          );
          comparison = dateA - dateB;
        } else if (sortBy === "latest requests") {
          const dateA = new Date(
            activeTab === "Budget Submission List" ? a.submissionDate : activeTab === "Budget Request List" ? a.requestDate : a.returnDate
          );
          const dateB = new Date(
            activeTab === "Budget Submission List" ? b.submissionDate : activeTab === "Budget Request List" ? b.requestDate : b.returnDate
          );
          comparison = dateB - dateA;
        }
        return comparison;
      });
      return sortedData;
    } catch (error) {
      console.error("Error in sortData:", error);
      return [];
    }
  };
  const updateValidationTable = (validatedData) => {
    if (activeTab === "Budget Submission List") {
      setValidationTableData(validatedData.map(item => ({
        department: departmentNameMap[item.departmentId] || item.departmentId,
        allocatedBudget: formatNumber(parseFloat(item.approvedAmount?.replace(/,/g, '') || 0)),
        totalSpent: "N/A",
        remainingBudget: formatNumber(parseFloat(item.approvedAmount?.replace(/,/g, '') || 0)),
      })));
    } else if (activeTab === "Budget Request List") {
      setValidationTableData(validatedData.map(item => ({
        department: item.departmentId,
        allocatedBudget: formatNumber(initialDepartmentBudgets[item.departmentId]?.allocatedBudget || 0),
        totalSpent: formatNumber(parseFloat(item.approvedAmount?.replace(/,/g, '') || 0)),
        remainingBudget: formatNumber(initialDepartmentBudgets[item.departmentId]?.remainingBudget || 0), // You might need to recalculate this based on total spent
      })));
    } else {
      // For Returns List or other tabs, keep the original logic if needed
      setValidationTableData(validatedData.map(item => ({
        department: item.departmentId,
        allocatedBudget: formatNumber(initialDepartmentBudgets[item.departmentId]?.allocatedBudget || 0),
        totalSpent: "N/A",
        remainingBudget: "N/A",
      })));
    }
  };

  useEffect(() => {
    if (activeTab === "Budget Submission List") {
      const validatedSubmissions = originalData.filter(item => item.validationStatus === "Validated");
      updateValidationTable(validatedSubmissions);
      setTotalBudget(originalData.reduce((sum, item) => sum + parseFloat(item.approvedAmount?.replace(/,/g, '') || 0), 0));
    } else if (activeTab === "Budget Request List") {
      const validatedRequests = originalRequestData.filter(item => item.validationStatus === "Validated");
      updateValidationTable(validatedRequests);
      setTotalBudget(originalRequestData.reduce((sum, item) => sum + parseFloat(item.approvedAmount?.replace(/,/g, '') || 0), 0));
    } else if (activeTab === "Returns List") {
      setTotalBudget(originalReturnsData.reduce((sum, item) => sum + parseFloat(item.returnedAmount?.replace(/,/g, '') || 0), 0));
    }
  }, [originalData, originalRequestData, originalReturnsData, activeTab, departmentNameMap]);

  const handleRowSelect = (rowId) => {
    if (activeTab === "Budget Submission List") {
      if (selectedSubmissionRows.includes(rowId)) {
        setSelectedSubmissionRows(selectedSubmissionRows.filter(id => id !== rowId));
      } else {
        setSelectedSubmissionRows([...selectedSubmissionRows, rowId]);
      }
    } else if (activeTab === "Budget Request List") {
      if (selectedRequestRows.includes(rowId)) {
        setSelectedRequestRows(selectedRequestRows.filter(id => id !== rowId));
      } else {
        setSelectedRequestRows([...selectedRequestRows, rowId]);
      }
    } else if (activeTab === "Returns List") {
      if (selectedReturnsRows.includes(rowId)) {
        setSelectedReturnsRows(selectedReturnsRows.filter(id => id !== rowId));
      } else {
        setSelectedReturnsRows([...selectedReturnsRows, rowId]);
      }
    }
  };

  const getSelectedRows = () => {
    if (activeTab === "Budget Submission List") {
      return selectedSubmissionRows;
    } else if (activeTab === "Budget Request List") {
      return selectedRequestRows;
    } else if (activeTab === "Returns List") {
      return selectedReturnsRows;
    }
    return [];
  };

  const handleEditClick = () => {
    const selected = getSelectedRows();
    if (selected.length === 0) {
      setIsWarningPopupVisible(true);
      return;
    }
    if (activeTab === "Budget Submission List") {
      setIsSubmissionEditModalOpen(true);
    } else if (activeTab === "Budget Request List") {
      setIsRequestEditModalOpen(true);
    } else if (activeTab === "Returns List") {
      setIsReturnsEditModalOpen(true);
    }
  };

  const handleEditChange = (rowId, field, value) => {
    setEditedData(prevData => ({
      ...prevData,
      [rowId]: {
        ...prevData[rowId],
        [field]: value,
      },
    }));
    if (activeTab === "Returns List" && field === "remarks") {
      setReturnRemarks(prevRemarks => ({
        ...prevRemarks,
        [rowId]: value,
      }));
      setReturnComments(prevComments => ({
        ...prevComments,
        [rowId]: value,
      }));
    }
  };
  const handleCommitChanges = () => {
    const selected = getSelectedRows();
    let hasEmptyFields = false;
    let newValidatedByError = {};
    let newApprovedAmountError = {};
    selected.forEach(rowId => {
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

    let currentOriginalData;
    if (activeTab === "Budget Submission List") {
      currentOriginalData = originalData;
    } else if (activeTab === "Budget Request List") {
      currentOriginalData = originalRequestData;
    } else if (activeTab === "Returns List") {
      currentOriginalData = originalReturnsData;
    }

    const editedDataForConfirmation = selected.map(rowId => {
      const activeRow = currentOriginalData.find(row =>
        (activeTab === "Budget Submission List" && row.requestId === rowId) ||
        (activeTab === "Budget Request List" && row.reqID === rowId) ||
        (activeTab === "Returns List" && row.returnsId === rowId)
      );
      return {
        ...activeRow,
        validatedBy: editedData[rowId]?.validatedBy || "",
        approvedAmount: editedData[rowId]?.approvedAmount || "",
        remarks: activeTab === "Returns List" ? returnRemarks[rowId] || "" : activeRow?.remarks,
        comments: activeTab === "Returns List" ? returnComments[rowId] || "" : "N/A",
      };
    });
    setIsConfirmationVisible(true);
  };

  const handleConfirmSubmit = () => {
    patchEditedRows();
    setIsConfirmationVisible(false);
  };

  const getSortedFilteredData = () => {
    const validated = filteredData.filter(item => item.validationStatus === "Validated");
    const pending = filteredData.filter(item => item.validationStatus === "Pending");
    return [...validated, ...pending];
  };
  const getSortedFilteredRequestData = () => {
    const validated = filteredRequestData.filter(item => item.validationStatus === "Validated");
    const pending = filteredRequestData.filter(item => item.validationStatus === "Pending");
    return [...validated, ...pending];
  };
  const getSortedFilteredReturnsData = () => {
    const validated = filteredReturnsData.filter(item => item.validationStatus === "Validated");
    const pending = filteredReturnsData.filter(item => item.validationStatus === "Pending");
    const toReview = filteredReturnsData.filter(item => item.validationStatus === "To Review");
    return [...validated, ...pending, ...toReview];
  };
  const handleCancelEdit = () => {
    if (activeTab === "Budget Submission List") {
      setIsSubmissionEditModalOpen(false);
      setSelectedSubmissionRows([]);
    } else if (activeTab === "Budget Request List") {
      setIsRequestEditModalOpen(false);
      setSelectedRequestRows([]);
    } else if (activeTab === "Returns List") {
      setIsReturnsEditModalOpen(false);
      setSelectedReturnsRows([]);
    }
    setEditedData({});
    setReturnRemarks({});
    setReturnComments({});
  };
  const handleCancelConfirmation = () => {
    setIsConfirmationVisible(false);
  };
  const handleCancelReviewConfirmation = () => {
    setIsReviewConfirmationVisible(false);
  }

  const handleRequestReview = () => {
    setIsReviewConfirmationVisible(true);
  };

  const handleProceedReview = () => {
    // Implement the logic to handle the review request
    const selected = getSelectedRows();
    console.log("Review requested for selected rows:", selected);
    setIsReviewConfirmationVisible(false);
    if (activeTab === "Returns List") {
      setIsReturnsEditModalOpen(false);
      setSelectedReturnsRows([]);
    }
  };

  const fetchDepartmentNames = async () => {
    try {
      const data = await GET("/departments/"); // Replace with your actual API endpoint
      const nameMap = {};
      data.forEach(dept => {
        nameMap[dept.dept_id] = dept.dept_name;
      });
      setDepartmentNameMap(nameMap);
    } catch (error) {
      console.error("Error fetching department names:", error);
    }
  };

  const fetchReturns = async () => {
    try {
      const data = await GET("/validation/budget-validations/");
      setOriginalReturnsData(data.map(sub => ({
        returnsId: sub.budget_return?.budget_return_id,
        departmentId: sub.budget_return?.dept_id || "",
        returnDate: sub.budget_return?.return_date || "",
        originTotalBudget: sub.final_approved_amount || "",
        returnedAmount: sub.budget_return?.returned_amount || "",
        attachedFile: sub.budget_return?.expense_history_breakdown || "",
        remarks: sub.remarks || "",
        comments: sub.comments || "",
        validationStatus: sub.validation_status || "",
        validationDate: sub.validation_date || "",
      })));
    } catch (error) {
      console.error("Error fetching returns:", error)
    }
  }

  const fetchRequests = async () => {
    try {
      const data = await GET("/validation/budget-validations/");
      setOriginalRequestData(data.map(sub => ({
        reqID: sub.budget_request?.budget_request_id,
        departmentId: sub.budget_request?.dept_id || "",
        amount: sub.budget_request?.amount_requested || "",
        requestDate: sub.budget_request?.requested_date || "",
        validatedBy: sub.validated_by || "",
        remarks: sub.remarks || "",
        approvedAmount: sub.final_approved_amount || "",
        validationStatus: sub.validation_status || "",
        validationDate: sub.validation_date || "",
      })));
    } catch (error) {
      console.error("Error fetching requests:", error)
    }
  }

  const fetch = async () => {
    try {
      const data = await GET("/validation/budget-validations/");
      setOriginalData(data.map(sub => ({
        requestId: sub.budget_submission?.budget_submission_id,
        departmentId: sub.budget_submission?.dept_id || "",
        amount: sub.budget_submission?.proposed_total_budget || "",
        submissionDate: sub.budget_submission?.date_submitted || "",
        validatedBy: sub.validated_by || "",
        remarks: sub.remarks || "",
        approvedAmount: sub.final_approved_amount || "",
        validationStatus: sub.validation_status || "",
        validationDate: sub.validation_date || "",
      })));
    } catch (error) {
      console.error("Error fetching budget validations:", error)
    }
  }
  useEffect(() => {
    fetch();
    fetchRequests();
    fetchReturns();
    fetchDepartmentNames();
  }, []);

  const patchEditedRows = async () => {
    try {
      const selected = getSelectedRows();
      const patchPromises = editedDataForConfirmation.map(async (row) => {
        const requestId = row.requestId || row.reqID || row.returnsId;
        if (!requestId) {
          console.error("Error: ID is undefined for row:", row);
          return null;
        }

        let endpoint = "";
        let payload = {};

        if (activeTab === "Budget Submission List" && row.requestId) {
          endpoint = `/validation/update-submission/${row.requestId}/`;
          payload = {
            validated_by: row.validatedBy || "",
            final_approved_amount: row.approvedAmount || "",
          };
        } else if (activeTab === "Budget Request List" && row.reqID) {
          endpoint = `/validation/update-request/${row.reqID}/`;
          payload = {
            validated_by: row.validatedBy || "",
            final_approved_amount: row.approvedAmount || "",
          };
        } else if (activeTab === "Returns List" && row.returnsId) {
          endpoint = `/validation/update-return/${row.returnsId}/`;
          payload = {
            validated_by: row.validatedBy || "",
            remarks: row.remarks || "",
            comments: row.comments || "N/A",
            // Include the expense history breakdown if needed
            expense_history_breakdown: row.attachedFile || "",
          };
        } else {
          console.error("Unsupported tab or missing ID:", row);
          return null;
        }

        console.log("Updating row with endpoint:", endpoint, "and payload:", payload);

        try {
          const response = await PATCH(endpoint, payload);
          return response;
        } catch (error) {
          console.error("Error updating row:", error);
          throw error;
        }
      });

      const results = await Promise.all(patchPromises);
      console.log("Patch results:", results);

      // Close the modal and refresh data
      setIsConfirmationVisible(false);
      if (activeTab === "Budget Submission List") {
        setIsSubmissionEditModalOpen(false);
        setSelectedSubmissionRows([]);
      } else if (activeTab === "Budget Request List") {
        setIsRequestEditModalOpen(false);
        setSelectedRequestRows([]);
      } else if (activeTab === "Returns List") {
        setIsReturnsEditModalOpen(false);
        setSelectedReturnsRows([]);
      }
      fetch(); // Refresh the data after successful updates
      fetchRequests();
      fetchReturns();
    } catch (error) {
      console.error("Error in patching rows:", error);
      alert("An error occurred while updating rows. Please try again.");
    }
  };

  const handleProceedEdit = () => {
    patchEditedRows();
  };

  const getSelectedRowsForModal = () => {
    if (activeTab === "Budget Submission List") {
      return selectedSubmissionRows;
    } else if (activeTab === "Budget Request List") {
      return selectedRequestRows;
    } else if (activeTab === "Returns List") {
      return selectedReturnsRows;
    }
    return [];
  };

  const isEditModalOpenForTab = () => {
    if (activeTab === "Budget Submission List") {
      return isSubmissionEditModalOpen;
    } else if (activeTab === "Budget Request List") {
      return isRequestEditModalOpen;
    } else if (activeTab === "Returns List") {
      return isReturnsEditModalOpen;
    }
    return false;
  };

  return (
    <div className="valid">
      <div className="body-content-container">
        <div className="tabs">{isCompact ? (
          <div className="compact-tabs">
            <button className="tab-button active">{activeTab}</button>
            <button onClick={() => handlePageChange("prev")} className="nav-button" disabled={activeTab === tabs[0]}>&#60;</button>
            <button onClick={() => handlePageChange("next")} className="nav-button" disabled={activeTab === tabs[tabs.length - 1]}>&#62;</button></div>) : (
          <div className="full-tabs">{tabs.map(tab => (<button key={tab} className={`tab-button ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>))}
            <button className="nav-button" onClick={() => handlePageChange("prev")}>&#60;</button>{[1, 2, 3].map((num, index) => (<button key={num} className={`page-button ${activeTab === tabs[index] ? "active" : ""}`} onClick={() => setActiveTab(tabs[index])}>{num}</button>))}
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
                    <p>₱{formatNumber(totalBudget)}</p>
                  </div>
                  <div className="summary-status">
                    <div className="summary-validated">
                      Validated <span className="status-circle validated"></span>
                      <p>{originalData.filter(item => item.validationStatus === "Validated").length}</p>
                    </div>
                    <div className="summary-pending">
                      Pending <span className="status-circle pending"></span>
                      <p>{originalData.filter(item => item.validationStatus === "Pending").length}</p>
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
                <input className="search" type="text" placeholder="Search..." value={submissionSearchTerm} onChange={(e) => setSubmissionSearchTerm(e.target.value)} />
                <div className="filter-group">
                  <select className="select-day" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                    <option value="Last 30 days">Last 30 days</option>
                    <option value="Last 7 days">Last 7 days</option>
                    <option value="All Time">All Time</option>
                  </select>
                  <select className="select-type" value={submissionFilterBy} onChange={(e) => setSubmissionFilterBy(e.target.value)}>
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
                    {getSortedFilteredData().map((row, index) => (
                      <tr key={index} onClick={() => handleRowSelect(row.requestId)} className={selectedSubmissionRows.includes(row.requestId) ? "selected" : ""} style={{ backgroundColor: row.validationStatus === "Validated" ? "#f0f0f0" : "white" }}>
                        <td><div className="row-wrapper"><input type="checkbox" checked={selectedSubmissionRows.includes(row.requestId)} readOnly /></div></td>
                        <td><div className="row-wrapper">{row.requestId}</div></td>
                        <td><div className="row-wrapper">{row.departmentId}</div></td>
                        <td><div className="row-wrapper">{row.amount}</div></td>
                        <td><div className="row-wrapper">{formatDate(row.submissionDate)}</div></td>
                        <td><div className="row-wrapper">{row.validationDate ? formatDate(row.validationDate) : "N/A"}</div></td>
                        <td><div className="row-wrapper">{row.validationStatus === "Pending" ? "N/A" : row.validatedBy}</div></td>
                        <td><div className="row-wrapper">{row.remarks}</div></td>
                        <td><div className="row-wrapper">{row.validationStatus === "Pending" ? "N/A" : row.approvedAmount}</div></td>
                        <td><div className="row-wrapper"><span className={`status-label ${row.validationStatus.toLowerCase()}`}>{row.validationStatus}</span></div></td>
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
                <div className="summary-date-range">August 2025 - August 2026</div>
                <div className="summary-details">
                  <div className="summary-total-budget">
                    Total Budget
                    <p>₱{formatNumber(totalBudget)}</p>
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
                <input className="search" type="text" placeholder="Search..." value={requestSearchTerm} onChange={(e) => setRequestSearchTerm(e.target.value)} />
                <div className="filter-group">
                  <select className="select-day" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                    <option value="Last 30 days">Last 30 days</option>
                    <option value="Last 7 days">Last 7 days</option>
                    <option value="All Time">All Time</option>
                  </select>
                  <select className="select-type" value={requestFilterBy} onChange={(e) => setRequestFilterBy(e.target.value)}>
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
                    {getSortedFilteredRequestData().map((row, index) => (
                      <tr key={index} onClick={() => handleRowSelect(row.reqID)} className={selectedRequestRows.includes(row.reqID) ? "selected" : ""} style={{ backgroundColor: row.validationStatus === "Validated" ? "#f0f0f0" : "white" }}>
                        <td><div className="row-wrapper"><input type="checkbox" checked={selectedRequestRows.includes(row.reqID)} readOnly /></div></td>
                        <td><div className="row-wrapper">{row.reqID}</div></td>
                        <td><div className="row-wrapper">{row.departmentId}</div></td>
                        <td><div className="row-wrapper">{row.amount}</div></td>
                        <td><div className="row-wrapper">{formatDate(row.requestDate)}</div></td>
                        <td><div className="row-wrapper">{row.validationDate ? formatDate(row.validationDate) : "N/A"}</div></td>
                        <td><div className="row-wrapper">{row.validationStatus === "Pending" ? "N/A" : row.validatedBy}</div></td>
                        <td><div className="row-wrapper">{row.remarks}</div></td>
                        <td><div className="row-wrapper">{row.validationStatus === "Pending" ? "N/A" : row.approvedAmount}</div></td>
                        <td><div className="row-wrapper"><span className={`status-label ${row.validationStatus.toLowerCase()}`}>{row.validationStatus}</span></div></td>
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
                    <p>₱{formatNumber(totalBudget)}</p>
                  </div>
                  <div className="summary-status">
                    <div className="summary-validated">
                      Validated <span className="status-circle validated"></span>
                      <p>{originalReturnsData.filter(item => item.validationStatus === "Validated").length}</p>
                    </div>
                    <div className="summary-pending">
                      Pending <span className="status-circle pending"></span>
                      <p>{originalReturnsData.filter(item => item.validationStatus === "Pending").length}</p>
                    </div>
                    <div className="summary-toreview">
                      To Review <span className="status-circle toreview"></span>
                      <p>{originalReturnsData.filter(item => item.validationStatus === "To Review").length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </InfoCard>
            <InfoCard className="filter-infocard">
              <div className="filter-controls">
                <input className="search" type="text" placeholder="Search..." value={returnsSearchTerm} onChange={(e) => setReturnsSearchTerm(e.target.value)} />
                <div className="filter-group">
                  <select className="select-day" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                    <option value="Last 30 days">Last 30 days</option>
                    <option value="Last 7 days">Last 7 days</option>
                    <option value="All Time">All Time</option>
                  </select>
                  <select className="select-type" value={returnsFilterBy} onChange={(e) => setReturnsFilterBy(e.target.value)}>
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
                    {getSortedFilteredReturnsData().map((row, index) => (
                      <tr key={index} onClick={() => handleRowSelect(row.returnsId)} className={selectedReturnsRows.includes(row.returnsId) ? "selected" : ""} style={{ backgroundColor: row.validationStatus === "Validated" ? "#f0f0f0" : "white" }}>
                        <td><div className="row-wrapper"><input type="checkbox" checked={selectedReturnsRows.includes(row.returnsId)} readOnly /></div></td>
                        <td><div className="row-wrapper">{row.returnsId}</div></td>
                        <td><div className="row-wrapper">{row.departmentId}</div></td>
                        <td><div className="row-wrapper">{formatDate(row.returnDate)}</div></td>
                        <td><div className="row-wrapper">{row.originTotalBudget}</div></td>
                        <td><div className="row-wrapper">{row.returnedAmount}</div></td>
                        <td><div className="row-wrapper">PDF</div></td>
                        <td><div className="row-wrapper">{row.validationDate ? formatDate(row.validationDate) : "N/A"}</div></td>
                        <td><div className="row-wrapper">{row.validationStatus === "Pending" ? "N/A" : row.validatedBy}</div></td>
                        <td>
                          <div className="row-wrapper">
                            {row.validationStatus === "Validated"
                              ? "Approved"
                              : row.validationStatus === "Pending"
                                ? "Awaiting Validation"
                                : row.validationStatus === "To Review"
                                  ? "For Resubmission"
                                  : "N/A"}
                          </div>
                        </td>
                        <td><div className="row-wrapper">{row.comments || "N/A"}</div></td>
                        <td><div className="row-wrapper"><span className={`status-label ${row.validationStatus.toLowerCase()}`}>{row.validationStatus}</span></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="edit-button" onClick={handleEditClick}>Edit</button>
              </InfoCard>
            </InfoCard>
          </div>
        )}
        {isSubmissionEditModalOpen && activeTab === "Budget Submission List" && (
          <InfoCard className="edit-modal">
            <div className="edit-modal-content">
              <div className="edit-modal-header">
                <h3>Validate Submission</h3>
              </div>
              {getSelectedRowsForModal().map(rowId => {
                const row = originalData.find(r => r.requestId === rowId);
                return (
                  <div key={rowId} className="edit-modal-item">
                    <div className="edit-modal-left">
                      <div className="edit-modal-select-icon">
                        <input type="checkbox" style={{ transform: 'scale(1.5)' }} checked={selectedSubmissionRows.includes(rowId)} readOnly />
                      </div>
                      <div className="edit-modal-details">
                        <p><strong>Submission ID:</strong> {row.requestId}</p>
                        <p><strong> Department ID:</strong> {row.departmentId}</p>
                        <p> <strong>Amount:</strong> {row.amount}</p>
                        <p><strong>Submission Date: </strong>{formatDate(row.submissionDate)}</p>
                        <div className="edit-modal-input-group validated-by-group">
                          <div className="edit-modal-label-input">
                            <label><strong>Validated By:</strong></label>
                            <input type="text" value={editedData[rowId]?.validatedBy || ""} onChange={(e) => { handleEditChange(rowId, "validatedBy", e.target.value); setValidatedByError(prevErrors => ({ ...prevErrors, [rowId]: false })); }} />
                          </div>
                          {validatedByError[rowId] && <p className="error-message">Please fill out this field.</p>}
                        </div>
                        <div className="edit-modal-input-group approved-amount-group">
                          <div className="edit-modal-label-input">
                            <label><strong>Approved Amount:</strong></label>
                            <input type="text" value={editedData[rowId]?.approvedAmount || ""} onChange={(e) => { handleEditChange(rowId, "approvedAmount", e.target.value); setApprovedAmountError(prevErrors => ({ ...prevErrors, [rowId]: false })); }} />
                          </div>
                          {approvedAmountError[rowId] && <p className="error-message">Please fill out this field.</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="edit-modal-buttons">
                <button className="modal-cancel-button" onClick={handleCancelEdit}>Cancel</button>
                <button className="modal-commit-button" onClick={handleCommitChanges}>Commit Changes</button>
              </div>
            </div>
          </InfoCard>
        )}
        {isRequestEditModalOpen && activeTab === "Budget Request List" && (
          <InfoCard className="edit-modal">
            <div className="edit-modal-content">
              <div className="edit-modal-header">
                <h3>Validate Request</h3>
              </div>
              {getSelectedRowsForModal().map(rowId => {
                const row = originalRequestData.find(r => r.reqID === rowId);
                return (
                  <div key={rowId} className="edit-modal-item">
                    <div className="edit-modal-left">
                      <div className="edit-modal-select-icon">
                        <input type="checkbox" style={{ transform: 'scale(1.5)' }} checked={selectedRequestRows.includes(rowId)} readOnly />
                      </div>
                      <div className="edit-modal-details">
                        <p><strong>Request ID:</strong> {row.reqID}</p>
                        <p><strong> Department ID:</strong> {row.departmentId}</p>
                        <p> <strong>Amount:</strong> {row.amount}</p>
                        <p><strong>Request Date: </strong>{formatDate(row.requestDate)}</p>
                        <div className="edit-modal-input-group validated-by-group">
                          <div className="edit-modal-label-input">
                            <label><strong>Validated By:</strong></label>
                            <input type="text" value={editedData[rowId]?.validatedBy || ""} onChange={(e) => { handleEditChange(rowId, "validatedBy", e.target.value); setValidatedByError(prevErrors => ({ ...prevErrors, [rowId]: false })); }} />
                          </div>
                          {validatedByError[rowId] && <p className="error-message">Please fill out this field.</p>}
                        </div>
                        <div className="edit-modal-input-group approved-amount-group">
                          <div className="edit-modal-label-input">
                            <label><strong>Approved Amount:</strong></label>
                            <input type="text" value={editedData[rowId]?.approvedAmount || ""} onChange={(e) => { handleEditChange(rowId, "approvedAmount", e.target.value); setApprovedAmountError(prevErrors => ({ ...prevErrors, [rowId]: false })); }} />
                          </div>
                          {approvedAmountError[rowId] && <p className="error-message">Please fill out this field.</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="edit-modal-buttons">
                <button className="modal-cancel-button" onClick={handleCancelEdit}>Cancel</button>
                <button className="modal-commit-button" onClick={handleCommitChanges}>Commit Changes</button>
              </div>
            </div>
          </InfoCard>
        )}
        {isReturnsEditModalOpen && activeTab === "Returns List" && (
          <InfoCard className="edit-modal">
            <div className="edit-modal-content">
              <div className="edit-modal-header">
                <h3>Process Return</h3>
              </div>
              {getSelectedRowsForModal().map(rowId => {
                const row = originalReturnsData.find(r => r.returnsId === rowId);
                return (
                  <div key={rowId} className="edit-modal-item">
                    <div className="edit-modal-left">
                      <div className="edit-modal-select-icon">
                        <input type="checkbox" style={{ transform: 'scale(1.5)' }} checked={selectedReturnsRows.includes(rowId)} readOnly />
                      </div>
                      <div className="edit-modal-details">
                        <p><strong>Returns ID:</strong> {row.returnsId}</p>
                        <p><strong> Department ID:</strong> {row.departmentId}</p>
                        <p> <strong>Returned Amount:</strong> {row.returnedAmount}</p>
                        <p><strong>Return Date: </strong>{formatDate(row.returnDate)}</p>
                        <div className="edit-modal-input-group validated-by-group">
                          <div className="edit-modal-label-input">
                            <label><strong>Validated By:</strong></label>
                            <input type="text" value={editedData[rowId]?.validatedBy || ""} onChange={(e) => { handleEditChange(rowId, "validatedBy", e.target.value); setValidatedByError(prevErrors => ({ ...prevErrors, [rowId]: false })); }} />
                          </div>
                          {validatedByError[rowId] && <p className="error-message">Please fill out this field.</p>}
                        </div>
                        <div className="edit-modal-input-group remarks-group">
                          <div className="edit-modal-label-input">
                            <label><strong>Remarks:</strong></label>
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
                        </div>
                        <p> <strong>Attached File:</strong> <a href={row.attachedFile} target="_blank" rel="noopener noreferrer">View File</a></p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="edit-modal-buttons">
                <button className="modal-cancel-button" onClick={handleCancelEdit}>Cancel</button>
                <button className="modal-review-button" onClick={handleRequestReview}>Request Review</button>
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
                      {activeTab === "Budget Submission List" ? `Submission ID: ${item.requestId}` : activeTab === "Budget Request List" ? `Request ID: ${item.reqID}` : `Returns ID: ${item.returnsId}`} - Validated By: {item.validatedBy}, {activeTab === "Returns List" ? `Remarks: ${item.remarks}` : `Approved Amount: ${item.approvedAmount}`}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="popup-buttons">
                <button className="cancel-button" onClick={handleCancelConfirmation}>Cancel</button>
                <button className="proceed-button" onClick={handleProceedEdit}>Proceed</button>
              </div>
            </div>
          </InfoCard>
        )}
        {isReviewConfirmationVisible && (
          <InfoCard className="popup-overlay">
            <div className="popup-content">
              <div className="popup-title">
                <h3>Confirm Review Request</h3>
              </div>
              <div className="popup-message">
                <p>Are you sure you want to request a review for the selected data?</p>
              </div>
              <div className="popup-buttons">
                <button className="cancel-button" onClick={handleCancelReviewConfirmation}>Cancel</button>
                <button className="proceed-button" onClick={handleProceedReview}>Proceed</button>
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
      </div>
    </div>
  );
};
export default BodyContent;