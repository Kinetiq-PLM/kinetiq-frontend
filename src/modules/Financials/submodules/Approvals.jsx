import React, { useState, useEffect, useMemo } from "react";
import "../styles/Approvals.css";
import { GET } from "../api/api";
import { PATCH } from "../api/api";

const tabs = ["Budget Allocation Plan", "Budget Submission List", "Budget Request List"];
const departmentIds = {
"MAR016": "Marketing",
"OPER015": "Operations",
"IT014": "IT",
"ACC013": "Accounting",
"PUR012": "Purchasing",
"SUP011": "Support and Services",
"MAN010": "Management",
"MRP009": "MRP",
"INV008": "Inventory",
"PM007": "Project Management",
"HR006": "Human Resources",
"SAL001": "Sales",
"ADM002": "Administration",
"FIN003": "Financials",
"PRO004": "Production",
"DIS005": "Distribution",
};

const initialDepartmentBudgets = {};

const InfoCard = ({ title, value, color, children, className }) => (
<div className={`info-card ${className}`}>{children}</div>
);

const ApprovalContent = () => {
const [activeTab, setActiveTab] = useState(tabs[0]);
const [isCompact, setIsCompact] = useState(window.innerWidth < 768);
const [searchTerm, setSearchTerm] = useState("");
const [dateRange, setDateRange] = useState("Last 30 days");
const [filterBy, setFilterBy] = useState("All");

const [originalData, setOriginalData] = useState([]);
const [originalRequestData, setOriginalRequestData] = useState([]);

const [filteredData, setFilteredData] = useState(originalData);
const [filteredRequestData, setFilteredRequestData] = useState(originalRequestData);
const [selectedRows, setSelectedRows] = useState([]);
const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
const [confirmationMessage, setConfirmationMessage] = useState("");
const [validationTableData, setValidationTableData] = useState([]);
const [totalBudget, setTotalBudget] = useState(0);
const [isWarningPopupVisible, setIsWarningPopupVisible] = useState(false);
const [departmentBudgets, setDepartmentBudgets] = useState(initialDepartmentBudgets);
const [rejectedData, setRejectedData] = useState([]);
const [budgetPlanStatus, setBudgetPlanStatus] = useState('Tentative');
const [isEditModalVisible, setIsEditModalVisible] = useState(false);
const [editedApprovedBy, setEditedApprovedBy] = useState("");
const [editingRows, setEditingRows] = useState([]);
const [approvalStatus, setApprovalStatus] = useState(null);
const [isApprovedByWarningVisible, setIsApprovedByWarningVisible] = useState(false);
const [isAllocatedBudgetUpdated, setIsAllocatedBudgetUpdated] = useState(false);
const [initialBudgets, setInitialBudgets] = useState(initialDepartmentBudgets);
const [isRequestWarningVisible, setIsRequestWarningVisible] = useState(false);
const [editedDataForConfirmation, setEditedDataForConfirmation] = useState([]);
const [isSubmissionEditModalOpen, setIsSubmissionEditModalOpen] = useState(false);
const [selectedSubmissionRows, setSelectedSubmissionRows] = useState([]);
const [isRequestEditModalOpen, setIsRequestEditModalOpen] = useState(false);
const [selectedRequestRows, setSelectedRequestRows] = useState([]);
const [isReturnsEditModalOpen, setIsReturnsEditModalOpen] = useState(false);
const [selectedReturnsRows, setSelectedReturnsRows] = useState([]);

const closeWarningPopup = () => { setIsWarningPopupVisible(false); };
const closeApprovedByWarning = () => { setIsApprovedByWarningVisible(false); };

useEffect(() => {
  console.log("Active Tab:", activeTab);
  let tempData = filterDataByDate(originalData, dateRange, 'submissionDate');
  tempData = filterDataBySearch(tempData, searchTerm, 'requestId');
  tempData = sortData(tempData, filterBy, 'requestId', 'submissionDate', activeTab);
  setFilteredData(tempData);

  let tempRequestData = filterDataByDate(originalRequestData, dateRange, 'requestDate');
  tempRequestData = filterDataBySearch(tempRequestData, searchTerm, 'reqID');
  tempRequestData = sortData(tempRequestData, filterBy, 'reqID', 'requestDate', activeTab);
  setFilteredRequestData(tempRequestData);
}, [dateRange, searchTerm, filterBy, originalData, originalRequestData, activeTab]);

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
const sortData = (data, sortBy, requestIdField = 'requestId', dateField = 'submissionDate', activeTab) => {
  try {
    if (sortBy === "All") return data;
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      let comparison = 0;
      console.log("Sorting by:", sortBy, "Active Tab:", activeTab);
      if (sortBy === "lowest amount") {
        const amountA = parseFloat(
          (activeTab === "Budget Request List" ? a.amount : a.amount)?.replace(/,/g, '') || 0
        );
        const amountB = parseFloat(
          (activeTab === "Budget Request List" ? b.amount : b.amount)?.replace(/,/g, '') || 0
        );
        console.log("Amount A:", amountA, "Amount B:", amountB);
        comparison = amountA - amountB;
      } else if (sortBy === "highest amount") {
        const amountA = parseFloat(
          (activeTab === "Budget Request List" ? a.amount : a.amount)?.replace(/,/g, '') || 0
        );
        const amountB = parseFloat(
          (activeTab === "Budget Request List" ? b.amount : b.amount)?.replace(/,/g, '') || 0
        );
        console.log("Amount A:", amountA, "Amount B:", amountB);
        comparison = amountB - amountA;
      } else if (sortBy === "oldest requests") {
        let dateA, dateB;
        if (activeTab === "Budget Submission List") {
          dateA = new Date(a.submissionDate);
          dateB = new Date(b.submissionDate);
        } else if (activeTab === "Budget Request List") {
          dateA = new Date(a.requestDate);
          dateB = new Date(b.requestDate);
        }
        console.log("Date A:", dateA, "Date B:", dateB);
        comparison = dateA - dateB;
      } else if (sortBy === "latest requests") {
        let dateA, dateB;
        if (activeTab === "Budget Submission List") {
          dateA = new Date(a.submissionDate);
          dateB = new Date(b.submissionDate);
        } else if (activeTab === "Budget Request List") {
          dateA = new Date(a.requestDate);
          dateB = new Date(b.requestDate);
        }
        console.log("Date A:", dateA, "Date B:", dateB);
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
const filterDataByDate = (data, range, dateField) => {
  try {
    if (!dateField) return data; // If no dateField is provided, return all data

    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    console.log("Today:", today);

    let startDate;
    if (range === "Last 7 days") {
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
      startDate.setHours(0, 0, 0, 0); // Start of the day 7 days ago
      console.log("Start Date (Last 7 days):", startDate);
    } else if (range === "Last 30 days") {
      startDate = new Date();
      startDate.setDate(today.getDate() - 30);
      startDate.setHours(0, 0, 0, 0); // Start of the day 30 days ago
      console.log("Start Date (Last 30 days):", startDate);
    } else if (range === "All Time") {
      console.log("Filtering for All Time");
      return data;
    } else {
      console.log("No valid range selected, returning all data");
      return data; // Default to all time if no valid range
    }

    const filtered = data.filter(item => {
      try {
        const itemDate = new Date(item[dateField]);
        itemDate.setHours(0, 0, 0, 0); // Consider only the date part
        console.log("Item Date:", itemDate, "for field:", dateField, "Range:", range);
        const isInRange = itemDate >= startDate && itemDate <= today;
        console.log("Is in range:", isInRange);
        return isInRange;
      } catch (error) {
        console.error(`Error parsing date for item ${item.requestId || item.reqID || item.returnsId}:`, item[dateField], error);
        return false;
      }
    });
    console.log("Filtered data by date:", filtered.length);
    return filtered;
  } catch (error) {
    console.error("Error in filterDataByDate:", error);
    return [];
  }
};
const filterDataBySearch = (data, term, requestIdField = 'requestId') => {
  try {
    if (!term) return data;
    const lowerTerm = term.toLowerCase();
    console.log("Filtering by search term:", lowerTerm);
    const filtered = data.filter(item => {
      const includes = (String(item[requestIdField] || '').toLowerCase().includes(lowerTerm) ||
        String(item.departmentId || '').toLowerCase().includes(lowerTerm) ||
        String(item.amount || '').toLowerCase().includes(lowerTerm) ||
        (item.submissionDate ? formatDate(item.submissionDate).toLowerCase().includes(lowerTerm) : false) ||
        (item.requestDate ? formatDate(item.requestDate).toLowerCase().includes(lowerTerm) : false) ||
        String(item.approvedBy || '').toLowerCase().includes(lowerTerm) ||
        String(item.remarks || '').toLowerCase().includes(lowerTerm) ||
        String(item.approvedAmount || '').toLowerCase().includes(lowerTerm) ||
        String(item.approvalStatus || '').toLowerCase().includes(lowerTerm) ||
        (item.approvalDate ? formatDate(item.validationDate).toLowerCase().includes(lowerTerm) : false) ||
        String(item.comments || '').toLowerCase().includes(lowerTerm));
      console.log("Item:", item, "includes term:", includes);
      return includes;
    });
    console.log("Filtered data by search:", filtered.length);
    return filtered;
  } catch (error) {
    console.error("Error in filterDataBySearch:", error);
    return [];
  }
};

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

const patchEditedRows = async () => {
  try {
    const selected = getSelectedRows();
    const patchPromises = editedDataForConfirmation.map(async (row) => {
      const requestId = row.requestId || row.reqID;
      if (!requestId) {
        console.error("Error: ID is undefined for row:", row);
        return null;
      }

      let endpoint = "";
      let payload = {};

      if (activeTab === "Budget Allocation Plan" && row.requestId) {
        endpoint = `/validation/update-submission/${row.requestId}/`;
        payload = {
          validated_by: row.validatedBy || "",
          final_approved_amount: row.approvedAmount || "",
        };
      } else if (activeTab === "Budget Submission List" && row.reqID) {
        endpoint = `/validation/update-request/${row.reqID}/`;
        payload = {
          validated_by: row.validatedBy || "",
          final_approved_amount: row.approvedAmount || "",
        };
      } else if (activeTab === "Budget Request List" && row.returnsId) {
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

    setIsConfirmationVisible(false);
    if (activeTab === "Budget Submission List") {
      setIsSubmissionEditModalOpen(false);
      setSelectedSubmissionRows([]);
    } else if (activeTab === "Budget Request List") {
      setIsRequestEditModalOpen(false);
      setSelectedRequestRows([]);
    } 

    fetchApprovals(); // Refresh the data after successful updates
    fetchBudgetRequests();
    fetchRejectedApprovals();
  } catch (error) {
    console.error("Error in patching rows:", error);
    alert("An error occurred while updating rows. Please try again.");
  }
};

const handleProceedEdit = () => {
  patchEditedRows();
};


useEffect(() => {
  console.log("Date Range:", dateRange);
  console.log("Search Term:", searchTerm);
  console.log("Filter By:", filterBy);
  console.log("Original Data Length:", originalData.length);
  console.log("Original Request Data Length:", originalRequestData.length);
}, [dateRange, searchTerm, filterBy, originalData, originalRequestData]);

useEffect(() => {
const handleResize = () => {
setIsCompact(window.innerWidth < 768);
};
window.addEventListener("resize", handleResize);
return () => window.removeEventListener("resize", handleResize);
}, []);


const updateApprovalTable = (totalBudget) => {
const tableData = Object.keys(departmentBudgets).map(dept => ({
department: dept,
allocatedBudget: formatNumber(departmentBudgets[dept].allocatedBudget),
totalSpent: formatNumber(departmentBudgets[dept].totalSpent),
remainingBudget: formatNumber(departmentBudgets[dept].remainingBudget)
}));

//setValidationTableData(tableData);
setTotalBudget(totalBudget);
};

const updateSubmissionTable = (data) => {
const approved = data.filter(item => item.validationStatus === "Approved").length;
const pending = data.filter(item => item.validationStatus === "Pending").length;
const rejected = data.filter(item => item.validationStatus === "Rejected").length;

const totalApprovedAmount = data.reduce((acc, item) => {
if (item.validationStatus === "Approved") {
return acc + (parseFloat(item.approvedAmount?.replace(/,/g, '')) || 0);
}
return acc;
}, 0);

setTotalBudget({
approvedAmount: formatNumber(totalApprovedAmount)
});

const rejectedItems = data.filter(item => item.validationStatus === "Rejected");
setRejectedData(rejectedItems);
};

useEffect(() => {
if (activeTab === "Budget Allocation Plan") {
updateAllocatedBudgetAndTotalSpent();
} else if (activeTab === "Budget Submission List") {
updateSubmissionTable(originalData);
updateBudgetPlanStatus(originalData);
} else if (activeTab === "Budget Request List") {
if (budgetPlanStatus !== 'Final') {
setIsRequestWarningVisible(true);
} else {
updateSubmissionTable(originalRequestData);
updateAllocatedBudgetAndTotalSpent();
}
}
}, [originalData, originalRequestData, activeTab, budgetPlanStatus]);

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
}
};

const handleProcessClick = () => {
  let selected;
  if (activeTab === "Budget Submission List") {
    selected = originalData.filter(row => selectedSubmissionRows.includes(row.requestId));
    if (selected.length === 0) {
      setIsWarningPopupVisible(true);
      return;
    }
    setEditedDataForConfirmation(selected);
    setIsSubmissionEditModalOpen(true);
  } else if (activeTab === "Budget Request List") {
    selected = originalRequestData.filter(row => selectedRequestRows.includes(row.reqID));
    if (selected.length === 0) {
      setIsWarningPopupVisible(true);
      return;
    }
    setEditedDataForConfirmation(selected);
    setIsRequestEditModalOpen(true);
  }
};

const handleRejectClick = () => {
setApprovalStatus("Rejected");
setIsConfirmationVisible(true);
setConfirmationMessage(`Are you sure you want to reject the selected data?\n` +
`Submission ID(s): ${editingRows.map(row => row.requestId || row.reqID).join(', ')}\n` +
`Requested Amount(s): ${editingRows.map(row => row.amount).join(', ')}`
);
};

const handleApproveClick = () => {
setApprovalStatus("Approved");
setIsConfirmationVisible(true);
setConfirmationMessage(
`Are you sure you want to approve the selected data?\n` +
`Submission ID(s): ${editingRows.map(row => row.requestId || row.reqID).join(', ')}\n` +
`Requested Amount(s): ${editingRows.map(row => row.amount).join(', ')}\n` +
`Approved Amount(s): ${editingRows.map(row => row.approvedAmount || row.amount).join(', ')}`
);
};

const handleProceedApproval = (status) => {
if (status === "Approved" && !editedApprovedBy.trim()) {
setIsApprovedByWarningVisible(true);
return;
}

const currentDate = new Date();
let updatedData;
let dataToUpdate = activeTab === "Budget Submission List" ? originalData : originalRequestData;

updatedData = dataToUpdate.map(row => {
const editingRow = editingRows.find(editRow => (activeTab === "Budget Submission List" ? editRow.requestId === row.requestId : editRow.reqID === row.reqID));
if (editingRow) {
if (status === "Approved") {
const approvedAmount = parseFloat((row.approvedAmount || row.amount).replace(/,/g, ''));
const departmentName = departmentIds[row.departmentId];

if (departmentName) {
setDepartmentBudgets(prevBudgets => {
const updatedBudgets = {
...prevBudgets,
[departmentName]: {
...prevBudgets[departmentName],
allocatedBudget: prevBudgets[departmentName].allocatedBudget,
remainingBudget: prevBudgets[departmentName].remainingBudget - approvedAmount,
totalSpent: prevBudgets[departmentName].totalSpent + approvedAmount,
}
};
return updatedBudgets;
});
}

return {
...row,
validationStatus: "Approved",
approvedBy: editedApprovedBy,
approvalDate: currentDate,
remarks: "Approved",
validationDate: currentDate,
validatedBy: "Sexbomb Aiah",
approvedAmount: row.approvedAmount
};
} else if (status === "Rejected") {
return {
...row,
validationStatus: "Rejected",
approvedBy: editedApprovedBy,
approvalDate: currentDate,
remarks: "For Resubmission"
};
}
}
return row;
});

if (activeTab === "Budget Submission List") {
setOriginalData(updatedData);
updateSubmissionTable(updatedData);
} else if (activeTab === "Budget Request List") {
setOriginalRequestData(updatedData);
updateSubmissionTable(updatedData);
}
setIsConfirmationVisible(false);
setSelectedRows([]);
setIsEditModalVisible(false);
setEditingRows([]);
setEditedApprovedBy("");
setApprovalStatus(null);
};

const getSortedFilteredData = () => {
const dataToFilter = activeTab === "Budget Submission List" ? filteredData : filteredRequestData;
const approved = dataToFilter.filter(item => item.validationStatus === "Approved");
const pending = dataToFilter.filter(item => item.validationStatus === "Pending");
const rejected = dataToFilter.filter(item => item.validationStatus === "Rejected");
return [...approved, ...pending, ...rejected];
};

const handleCancelConfirmation = () => {
setIsConfirmationVisible(false);
};

const updateBudgetPlanStatus = (data) => {
const allApproved = data.every(item => item.validationStatus === "Approved");
setBudgetPlanStatus(allApproved ? 'Final' : 'Tentative');
};

useEffect(() => {
if(activeTab === "Budget Allocation Plan" || activeTab === "Budget Request List") {
updateAllocatedBudgetAndTotalSpent();
}
}, [originalData, originalRequestData, activeTab]);

const updateAllocatedBudgetAndTotalSpent = () => {
if (activeTab === "Budget Allocation Plan" || activeTab === "Budget Request List") {
const updatedDepartmentBudgets = { ...initialDepartmentBudgets };
let totalAllocated = 0;
let totalSpent = 0;

originalData.forEach(item => {
if (item.validationStatus === "Approved") {
const departmentName = departmentIds[item.departmentId];
if (departmentName) {
const approvedAmount = parseFloat((item.approvedAmount || item.amount).replace(/,/g, ''));
updatedDepartmentBudgets[departmentName] = {
...updatedDepartmentBudgets[departmentName],
allocatedBudget: updatedDepartmentBudgets[departmentName].allocatedBudget + approvedAmount,
remainingBudget: updatedDepartmentBudgets[departmentName].remainingBudget + approvedAmount,
totalSpent: updatedDepartmentBudgets[departmentName].totalSpent,
};
totalAllocated += approvedAmount;
}
}
});

originalRequestData.forEach(item => {
if (item.approvalStatus === "Approved") {
const departmentName = departmentIds[item.departmentId];
if (departmentName) {
const approvedAmount = parseFloat((item.approvedAmount || item.amount).replace(/,/g, ''));
updatedDepartmentBudgets[departmentName] = {
...updatedDepartmentBudgets[departmentName],
totalSpent: updatedDepartmentBudgets[departmentName].totalSpent + approvedAmount,
};
totalSpent += approvedAmount;
}
}
});

Object.keys(updatedDepartmentBudgets).forEach(dept => {
updatedDepartmentBudgets[dept].remainingBudget = updatedDepartmentBudgets[dept].allocatedBudget - updatedDepartmentBudgets[dept].totalSpent;
});

setDepartmentBudgets(updatedDepartmentBudgets);
updateApprovalTable({ allocated: totalAllocated, spent: totalSpent, remaining: totalAllocated - totalSpent });
}
};

useEffect(() => {
setIsAllocatedBudgetUpdated(false)
},[activeTab])

const fetchAllocation = async () => {
try {
  const data = await GET("/approvals/budget-allocation/");
  console.log("Fetched Budget Allocation:", data);
  setValidationTableData(data.map(item => ({
    budgetAllocationId: item.budget_allocation_id || "",
    department: item?.budget_approvals?.validation?.budget_submission.dept.dept_id,
    allocatedBudget: item?.allocated_budget || 0,
    totalSpent: item.total_allocated_spent || 0,
    remainingBudget: item.allocated_remaining || 0,
  })));
  } catch (error) {
    console.error("Error fetching allocation:", error);
  }
}

const fetchApprovals = async () => {
try {
const data = await GET("/approvals/budget-submissions/");
console.log("Fetched Budget Approvals:", data);
setOriginalData(data.map(sub => ({
approvalsId: sub.budget_approvals_id || "",
requestId: sub?.validation?.budget_submission?.budget_submission_id || "",
departmentId: sub?.validation?.budget_submission?.dept_id || "",
amount: sub?.validation?.amount_requested || "",
approvedAmount: sub?.validation?.final_approved_amount || "",
submissionDate: sub?.validation?.budget_submission?.date_submitted || "",
validatedBy: sub?.validation?.validated_by || "",
validationDate: sub?.validation?.validation_date || "",
approvedBy: sub?.approved_by || "",
approvalDate: sub?.approval_date || "",
remarks: sub?.remarks || "",
validationStatus: sub?.validation?.validation_status || ""
})));
} catch (error) {
console.error("Error fetching returns:", error);
}
};

const fetchBudgetRequests = async () => {
  try {
    const data = await GET("/approvals/budget-requests/");
    console.log("Fetched Budget Requests:", data);
    setOriginalRequestData(data.map(req => ({
      approvalsId: req.budget_approvals_id || "",
      reqID: req?.validation?.budget_request_id || "",
      departmentId: req.dept_id || "",
      amount: req.amount_requested || "",
      requestDate: req.date_requested || "",
      validatedBy: req.validated_by || "",
      validationDate: req.validation_date || "",
      approvedBy: req.approved_by || "",
      approvalDate: req.approval_date || "",
      remarks: req.remarks || "",
      approvalStatus: req.approval_status || ""
    })));
  } catch (error) {
    console.error("Error fetching budget requests:", error);
  }
};

useEffect(() => {
fetchAllocation();
fetchApprovals();
fetchBudgetRequests();
}, []);



const fetchRejectedApprovals = async () => {
try {
const data = await GET("/approvals/rejected-budget-submissions/");
const formattedData = data.map(item => ({
approvalsId: item.budget_approvals_id || "",
requestId: item?.validation?.budget_submission?.budget_submission_id || "",
amount: item?.validation?.budget_validation?.amount_requested || "",
requestDate: item?.validation?.budget_submission?.date_submitted || "",
approvedBy: item.approved_by || "",
remarks: item.remarks || "",
validationStatus: item.approval_status || "",
}));
setRejectedData(formattedData);
} catch (error) {
console.error("Failed to load rejected approvals:", error);
}
};

useEffect(() => {
fetchRejectedApprovals();
}, []);

const getSelectedRows = () => {
  if (activeTab === "Budget Submission List") {
    return originalData.filter(row => selectedSubmissionRows.includes(row.requestId));
  } else if (activeTab === "Budget Request List") {
    return originalRequestData.filter(row => selectedRequestRows.includes(row.reqID));
  } 
  return [];
};


return (
<div className="approvals">
<div className="body-content-container">
<div className="tabs">{isCompact ? (
<div className="compact-tabs">
<button className="tab-button active">{activeTab}</button>
<button onClick={() => handlePageChange("prev")} className="nav-button" disabled={activeTab ===tabs[0]}>&#60;</button>
<button onClick={() => handlePageChange("next")} className="nav-button"disabled={activeTab === tabs[tabs.length - 1]}>&#62;</button></div>) : (
<div className="full-tabs">{tabs.map(tab => (<button key={tab} className={`tab-button ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>))}
<button className="nav-button" onClick={() => handlePageChange("prev")}>&#60;</button>{[1, 2, 3].map((num, index) => (<button key={num} className={`page-button ${activeTab === tabs[index] ? "active" : ""}`} onClick={() => setActiveTab(tabs[index])}>{num}</button>))}
<button className="nav-button" onClick={() => handlePageChange("next")}>&#62;</button>
</div>
)}
</div>
{activeTab === "Budget Allocation Plan" && (
<div className="content-container">
<InfoCard className="summary-infocard">
<div className="summary-container">
<div className="date-status-container">
<div className="summary-date-range">August 2025 - August 2026</div>
<div className="summary-status">
<span className="status-prefix">Status:</span>
<span className={`summary-status-label ${budgetPlanStatus.toLowerCase()}`}>
{budgetPlanStatus}
</span>
</div>
</div>
<div className="date-range-border"></div>
<div className="summary-details">
<div className="summary-total-budget">
Total Budget
<p>₱{formatNumber(totalBudget.allocated)}</p>
</div>
<div className="summary-total-spent">
Total Spent
<p>₱{formatNumber(totalBudget.spent)}</p>
</div>
<div className="summary-total-remaining">
Total Remaining
<p>₱{formatNumber(totalBudget.remaining)}</p>
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
</div>
)}
{activeTab === "Budget Submission List" && (
<div className="content-container">
{/* Budget Submission List content */}
<InfoCard className="summary-infocard">
<div className="summary-container">
<div className="summary-date-range">August 2025 - August 2026</div>
<div className="date-range-border"></div>
<div className="summary-details">
<div className="summary-total-budget">
Total Approved Amount
<p>₱{totalBudget.approvedAmount}</p>
</div>

<div className="summary-status">
<div className="summary-approved">
Approved <span className="status-circle approved"></span>
<p>{originalData.filter(item => item.validationStatus === "Approved").length}</p>
</div>
<div className="summary-pending">
Pending <span className="status-circle pending"></span>
<p>{originalData.filter(item => item.validationStatus === "Pending").length}</p>
</div>
<div className="summary-rejected">
Rejected <span className="status-circle rejected"></span>
<p>{originalData.filter(item => item.validationStatus === "Rejected").length}</p>
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
<th>Submission ID</th>
<th>Department ID</th>
<th>Amount Requested</th>
<th>Approved Amount</th>
<th>Submission Date</th>
<th>Validation Date</th>
<th>Validated By</th>
<th>Approval Date</th>
<th>Approved By</th>
<th>Remarks</th>
<th>Validation Status</th>
</tr>
</thead>
<tbody>
{filteredData.map((row, index) => (
<tr key={index} onClick={() => handleRowSelect(row.requestId)} className={selectedSubmissionRows.includes(row.requestId) ? "selected" : ""} style={{ backgroundColor: row.validationStatus === "Approved" ? "#f0f0f0" : "white" }}>
<td><div className="row-wrapper"><input type="checkbox" checked={selectedSubmissionRows.includes(row.requestId)} readOnly /></div></td>
<td><div className="row-wrapper">{row.requestId}</div></td>
<td><div className="row-wrapper">{row.departmentId}</div></td>
<td><div className="row-wrapper">{row.amount}</div></td>
<td><div className="row-wrapper">{row.approvedAmount}</div></td>
<td><div className="row-wrapper">{formatDate(row.submissionDate)}</div></td>
<td><div className="row-wrapper">{formatDate(row.validationDate)}</div></td>
<td><div className="row-wrapper">{row.validatedBy}</div></td>
<td><div className="row-wrapper">{formatDate(row.approvalDate)}</div></td>
<td><div className="row-wrapper">{row.approvedBy}</div></td>
<td><div className="row-wrapper">{row.remarks}</div></td>
<td><div className="row-wrapper"><span className={`status-label ${row.validationStatus.toLowerCase()}`}>{row.validationStatus}</span></div></td>
</tr>
))}
</tbody>
</table>
<div className="button-container">
<button className="process-button" onClick={handleProcessClick}>Process</button>
</div>
</InfoCard>
{isSubmissionEditModalOpen && (
<InfoCard className="edit-modal">
<div className="edit-modal-content">
<div className="edit-modal-header">
<h3>Edit Submissions</h3>
</div>
{editedDataForConfirmation.map((row) => (
<div key={row.requestId} className="edit-modal-item">
<div className="edit-modal-left">
<div className="edit-modal-select-icon">
<input
type="checkbox"
style={{ transform: "scale(1.5)" }}
checked={selectedSubmissionRows.includes(row.requestId)}
readOnly
/>
</div>
<div className="edit-modal-details">
<p>
<strong>Submission ID:</strong> {row.requestId}
</p>
<p>
<strong>Department ID:</strong> {row.departmentId}
</p>
<p>
<strong>Amount Requested:</strong> {row.amount}
</p>
<p>
<strong>Approved Amount:</strong>
<input
type="number"
value={row.approvedAmount}
onChange={(e) => {
  const updatedData = editedDataForConfirmation.map(item =>
    item.requestId === row.requestId ? { ...item, approvedAmount: e.target.value } : item
  );
  setEditedDataForConfirmation(updatedData);
}}
/>
</p>
<p>
<strong>Validated By:</strong>
<input
type="text"
value={row.validatedBy}
onChange={(e) => {
  const updatedData = editedDataForConfirmation.map(item =>
    item.requestId === row.requestId ? { ...item, validatedBy: e.target.value } : item
  );
  setEditedDataForConfirmation(updatedData);
}}
/>
</p>
<p>
<strong>Validation Date:</strong> {formatDate(row.validationDate)}
</p>
</div>
</div>
</div>
))}
<div className="popup-buttons">
<button className="cancel-button" onClick={() => setIsSubmissionEditModalOpen(false)}>
Cancel
</button>
<button className="proceed-button" onClick={handleProceedEdit}>
Save Changes
</button>
</div>
</div>
</InfoCard>
)}
{isConfirmationVisible && (
<InfoCard className="popup-overlay">
<div className="popup-content">
<div className="popup-title">
<h3>Confirmation</h3>
</div>
<p>{confirmationMessage}</p>
<div className="popup-buttons">
<button className="cancel-button" onClick={handleCancelConfirmation}>Cancel</button>
<button className="proceed-button" onClick={() => handleProceedApproval(approvalStatus)}>Confirm</button>
</div>
</div>
</InfoCard>
)}
<InfoCard className="reject-table">
<div className="reject-title">
<h3> Rejected Submissions</h3>
</div>
<table className="validation-table-2-reject">
<thead>
<tr>
<th>Submission ID</th>
<th>Amount Requested</th>
<th>Date</th>
<th>Rejected By</th>
<th>Remarks</th>
<th>Approval Status</th>
</tr>
</thead>
<tbody>
{rejectedData.map((row, index) => (
<tr key={index}>
<td><div className="row-wrapper">{row.requestId}</div></td>
<td><div className="row-wrapper">{row.amount}</div></td>
<td><div className="row-wrapper">{formatDate(row.submissionDate)}</div></td>
<td><div className="row-wrapper">{row.approvedBy}</div></td>
<td><div className="row-wrapper">{row.remarks === "Rejected" ? "For Resubmission" : row.remarks}</div></td>
<td><div className="row-wrapper"><span className={`status-label ${row.validationStatus.toLowerCase()}`}>{row.validationStatus}</span></div></td>

</tr>
))}
</tbody>
</table>
</InfoCard>
</InfoCard>

</div>
)}
{activeTab === "Budget Request List" && (
<div className="content-container">
{isRequestWarningVisible ? (
<div className="warning-popup">
<div className="warning-popup-content">
<h3>Oops...</h3>
<p>Sorry, we're not yet accepting any budget request at the moment.</p>
<p>No records to show yet.</p>
</div>
</div>
) : (
<>
<InfoCard className="summary-infocard">
<div className="summary-container">
<div className="summary-date-range">August 2025 - August 2026</div>
<div className="date-range-border"></div>
<div className="summary-details">
<div className="summary-total-budget">
Total Approved Amount
<p>{totalBudget.approvedAmount || '₱0.00'}</p>
</div>
<div className="summary-status">
<div className="summary-approved">
Approved <span className="status-circle approved"></span>
<p>{originalRequestData.filter(item => item.approvalStatus === "Approved").length}</p>
</div>
<div className="summary-pending">
Pending <span className="status-circle pending"></span>
<p>{originalRequestData.filter(item => item.approvalStatus === "Pending").length}</p>
</div>
<div className="summary-rejected">
Rejected <span className="status-circle rejected"></span>
<p>{originalRequestData.filter(item => item.approvalStatus === "Rejected").length}</p>
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
<th>Request ID</th>
<th>Department ID</th>
<th>Amount Requested</th>
<th>Request Date</th>
<th>Validation Date</th>
<th>Validated By</th>
<th>Approval Date</th>
<th>Approved By</th>
<th>Remarks</th>
<th>Approval Status</th>
</tr>
</thead>
<tbody>
{filteredRequestData.map((row, index) => (
<tr key={index} onClick={() => handleRowSelect(row.reqID)} className={selectedRequestRows.includes(row.reqID) ? "selected" : ""} style={{ backgroundColor: row.approvalStatus === "Approved" ? "#f0f0f0" : "white" }}>
<td><div className="row-wrapper"><input type="checkbox" checked={selectedRequestRows.includes(row.reqID)} readOnly /></div></td>
<td><div className="row-wrapper">{row.reqID}</div></td>
<td><div className="row-wrapper">{row.departmentId}</div></td>
<td><div className="row-wrapper">{row.amount}</div></td>
<td><div className="row-wrapper">{formatDate(row.requestDate)}</div></td>
<td><div className="row-wrapper">{formatDate(row.validationDate)}</div></td>
<td><div className="row-wrapper">{row.validatedBy}</div></td>
<td><div className="row-wrapper">{formatDate(row.approvalDate)}</div></td>
<td><div className="row-wrapper">{row.approvedBy}</div></td>
<td><div className="row-wrapper">{row.remarks}</div></td>
<td><div className="row-wrapper"><span className={`status-label ${row.approvalStatus?.toLowerCase()}`}>{row.approvalStatus}</span></div></td>
</tr>
))}
</tbody>
</table>
<div className="button-container">
<button className="process-button" onClick={handleProcessClick}>Process</button>
</div>
</InfoCard>
{isRequestEditModalOpen && (
<InfoCard className="edit-modal">
<div className="edit-modal-content">
<div className="edit-modal-header">
<h3>Edit Requests</h3>
</div>
{editedDataForConfirmation.map((row) => (
<div key={row.reqID} className="edit-modal-item">
<div className="edit-modal-left">
<div className="edit-modal-select-icon">
<input
type="checkbox"
style={{ transform: "scale(1.5)" }}
checked={selectedRequestRows.includes(row.reqID)}
readOnly
/>
</div>
<div className="edit-modal-details">
<p><strong>Request ID:</strong> {row.reqID}</p>
<p><strong>Department ID:</strong> {row.departmentId}</p>
<p><strong>Amount Requested:</strong> {row.amount}</p>
<p>
<strong>Approved Amount:</strong>
<input
type="number"
value={row.approvedAmount || ''}
onChange={(e) => {
  const updatedData = editedDataForConfirmation.map(item =>
    item.reqID === row.reqID ? { ...item, approvedAmount: e.target.value } : item
  );
  setEditedDataForConfirmation(updatedData);
}}
/>
</p>
<p>
<strong>Validated By:</strong>
<input
type="text"
value={row.validatedBy || ''}
onChange={(e) => {
  const updatedData = editedDataForConfirmation.map(item =>
    item.reqID === row.reqID ? { ...item, validatedBy: e.target.value } : item
  );
  setEditedDataForConfirmation(updatedData);
}}
/>
</p>
<p>
<strong>Validation Date:</strong> {formatDate(row.validationDate)}
</p>
</div>
</div>
</div>
))}
<div className="popup-buttons">
<button className="cancel-button" onClick={() => setIsRequestEditModalOpen(false)}>
Cancel
</button>
<button className="proceed-button" onClick={handleProceedEdit}>
Save Changes
</button>
</div>
</div>
</InfoCard>
)}
{isConfirmationVisible && (
<InfoCard className="popup-overlay">
<div className="popup-content">
<div className="popup-title">
<h3>Confirmation</h3>
</div>
<p>{confirmationMessage}</p>
<div className="popup-buttons">
<button className="cancel-button" onClick={handleCancelConfirmation}>Cancel</button>
<button className="proceed-button" onClick={() => handleProceedApproval(approvalStatus)}>Confirm</button>
</div>
</div>
</InfoCard>
)}
<InfoCard className="reject-table">
<div className="reject-title">
<h3> Rejected Submissions</h3>
</div>
<table className="validation-table-2-reject">
<thead>
<tr>
<th>Request ID</th>
<th>Amount Requested</th>
<th>Date</th>
<th>Rejected By</th>
<th>Remarks</th>
<th>Approval Status</th>
</tr>
</thead>
<tbody>
{rejectedData.map((row, index) => (
<tr key={index}>
<td><div className="row-wrapper">{row.requestId}</div></td>
<td><div className="row-wrapper">{row.amount}</div></td>
<td><div className="row-wrapper">{formatDate(row.requestDate)}</div></td>
<td><div className="row-wrapper">{row.approvedBy}</div></td>
<td><div className="row-wrapper">{row.remarks}</div></td>
<td><div className="row-wrapper"><span className={`status-label ${row.validationStatus?.toLowerCase()}`}>{row.validationStatus}</span></div></td>
</tr>
))}
</tbody>
</table>
</InfoCard>
</InfoCard>

</>
)}
</div>
)}
{isWarningPopupVisible && (
<div className="warning-popup">
<div className="warning-popup-content">
<h3>Warning</h3>
<p>Please select at least one row to process.</p>
<button className="close-popup-button" onClick={closeWarningPopup}>OK</button>
</div>
</div>
)}
{isApprovedByWarningVisible && (
<div className="warning-popup">
<div className="warning-popup-content">
<h3>Warning</h3>
<p>Please fill out this field.</p>
<button className="close-popup-button" onClick={closeApprovedByWarning}>OK</button>
</div>
</div>
)}
</div>
</div>
);
};

export default ApprovalContent;