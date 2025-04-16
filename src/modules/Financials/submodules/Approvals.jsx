import React, { useState, useEffect, useMemo } from "react";
    import "../styles/Approvals.css";
import { GET } from "../api/api";

    
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
    const initialDepartmentBudgets = {
      "Marketing": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "Operations": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "IT": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "Accounting": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "Purchasing": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "Support and Services": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "Management": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "MRP": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "Inventory": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "Project Management": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "Human Resources": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "Sales": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "Administration": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "Financials": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "Production": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
      "Distribution": { allocatedBudget: 0, totalSpent: 0, remainingBudget: 0 },
    };
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
      
      const closeWarningPopup = () => { setIsWarningPopupVisible(false); };
      const closeApprovedByWarning = () => { setIsApprovedByWarningVisible(false); };
    
      useEffect(() => {
        let tempData = filterDataByDate(originalData, dateRange);
        tempData = filterDataBySearch(tempData, searchTerm);
        tempData = sortData(tempData, filterBy);
        setFilteredData(tempData);
    
        let tempRequestData = filterDataByDate(originalRequestData, dateRange, 'requestDate');
        tempRequestData = filterDataBySearch(tempRequestData, searchTerm, 'requestId');
        tempRequestData = sortData(tempRequestData, filterBy, 'requestId', 'requestDate');
        setFilteredRequestData(tempRequestData);
      }, [dateRange, searchTerm, filterBy, originalData, originalRequestData]);
    
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
            return (item[requestIdField].toLowerCase().includes(lowerTerm) ||
              item.departmentId.toLowerCase().includes(lowerTerm) ||
              item.amount.toLowerCase().includes(lowerTerm) ||
              (item.submissionDate ? item.submissionDate.toISOString().toLowerCase().includes(lowerTerm) : false) ||
              (item.validationDate ? item.validationDate.toISOString().toLowerCase().includes(lowerTerm) : false) ||
              (item.approvalDate ? item.approvalDate.toISOString().toLowerCase().includes(lowerTerm) : false) ||
              item.validatedBy.toLowerCase().includes(lowerTerm) ||
              item.remarks.toLowerCase().includes(lowerTerm) ||
              item.approvedAmount.toLowerCase().includes(lowerTerm) ||
              item.validationStatus.toLowerCase().includes(lowerTerm) ||
              item.approvedBy.toLowerCase().includes(lowerTerm));
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
              const amountA = parseFloat(a.amount.replace(/,/g, ''));
              const amountB = parseFloat(b.amount.replace(/,/g, ''));
              if (isNaN(amountA)) return 1;
              if (isNaN(amountB)) return -1;
              comparison = amountA - amountB;
            } else if (sortBy === "highest amount") {
              const amountA = parseFloat(a.amount.replace(/,/g, ''));
              const amountB = parseFloat(b.amount.replace(/,/g, ''));
              if (isNaN(amountA)) return 1;
              if (isNaN(amountB)) return -1;
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
    
      const updateApprovalTable = (totalBudget) => {
        const tableData = Object.keys(departmentBudgets).map(dept => ({
          department: dept,
          allocatedBudget: departmentBudgets[dept].allocatedBudget.toLocaleString(undefined, { minimumFractionDigits: 2 }),
          totalSpent: departmentBudgets[dept].totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 }),
          remainingBudget: departmentBudgets[dept].remainingBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })
        }));
    
        setValidationTableData(tableData);
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
          approvedAmount: totalApprovedAmount
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
            setIsRequestWarningVisible(false);
            updateSubmissionTable(originalRequestData);
            updateAllocatedBudgetAndTotalSpent();
          }
        }
      }, [originalData, originalRequestData, activeTab, budgetPlanStatus]);
    
      const handleRowSelect = (rowId) => {
        if (selectedRows.includes(rowId)) {
          setSelectedRows(selectedRows.filter(id => id !== rowId));
        } else {
          setSelectedRows([...selectedRows, rowId]);
        }
      };
    
      const handleProcessClick = () => {
        if (selectedRows.length === 0) {
          setIsWarningPopupVisible(true);
          return;
        }
        const selectedRowsData = selectedRows.map(rowId => {
          return activeTab === "Budget Submission List" ? originalData.find(row => row.requestId === rowId) : originalRequestData.find(row => row.requestId === rowId);
        });
        setEditingRows(selectedRowsData);
        setIsEditModalVisible(true);
      };
    
      const handleRejectClick = () => {
        setApprovalStatus("Rejected");
        setIsConfirmationVisible(true);
        setConfirmationMessage(`Are you sure you want to approve the selected data?\n` +
          `Submission ID(s): ${editingRows.map(row => row.requestId).join(', ')}\n` +
          `Requested Amount(s): ${editingRows.map(row => row.amount).join(', ')}\n` +
          `Approved Amount(s): ${editingRows.map(row => row.approvedAmount || row.amount).join(', ')}`
        );
    };
    
      const handleApproveClick = () => {
        setApprovalStatus("Approved");
        setIsConfirmationVisible(true);
        setConfirmationMessage(
          `Are you sure you want to approve the selected data?\n` +
          `Submission ID(s): ${editingRows.map(row => row.requestId).join(', ')}\n` +
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
          const editingRow = editingRows.find(editRow => editRow.requestId === row.requestId);
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
            if (item.validationStatus === "Approved") {
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

      const fetchApprovals = async () => {
        try {
          const data = await GET("/approvals/budget-submission-approvals/");
          setOriginalData(data.map(sub => ({
            requestId: sub.budget_submission?.budget_submission_id || "",
            departmentId: sub.validation?.budget_submission?.dept_id || "",
            amount: sub.amount_requested || "",
            approvedAmount: sub.final_approved_amount || "",
            submissionDate: sub.budget_submission?.date_submitted || "",
            validatedBy: sub.validation?.validated_by || "",
            validationDate: sub.validation?.validation_date || "",
            approvedBy: sub.validated_by || "",
            approvalDate: sub.approval_date || "",
            remarks: sub.remarks || "",
            validationStatus: sub.approval_status || ""
          })));
        } catch (error) {
          console.error("Error fetching:", error);
        }
      };
      
      // Define as a separate function outside of fetchApprovals
      const fetchRejectedApprovals = async () => {
        try {
          const data = await GET("/approvals/rejected-budget-submissions/"); 
          console.log("Raw rejected data:", data);
          
          // Define processedData as a variable to store the mapped array
          const processedData = data.map(item => ({
            requestId: item.budget_approvals_id || "",
            amount: item.amount_requested || "",
            submissionDate: item.approval_date || "",
            approvedBy: item.validated_by || "",
            remarks: item.remarks || "",
            validationStatus: item.approval_status || ""
          }));
          
          console.log("Data to be set:", processedData);
          
          // Then use the processed data to update state
          setRejectedData(processedData);
        } catch (error) {
          console.error("Failed to load rejected approvals:", error);
        }
      };

      const fetchRequestsApprovals = async () => {
        try{
          const data = await GET("/approvals/budget-request-approvals/");
          setOriginalRequestData(data.map(sub => ({
            requestId: sub.budget_request_form?.budget_request_id || "",
            departmentId: sub.validation?.budget_request_form?.dept_id || "",
            amount: sub.validation?.amount_requested || "",
            approvedAmount: sub.final_approved_amount || "",
            submissionDate: sub.budget_submission?.date_submitted || "",
            validatedBy: sub.validation?.validated_by || "",
            validationDate: sub.validation?.validation_date || "",
            approvedBy: sub.approved_by || "",
            approvalDate: sub.approval_date || "",
            remarks: sub.remarks || "",
            validationStatus: sub.approval_status || ""
          })));
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      }
    
      useEffect(() => {
        fetchApprovals();
        fetchRejectedApprovals();
        fetchRequestsApprovals();
      }, []);

          
           useEffect(() => {
            fetchRequestsApprovals();
          }, []);

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
                        <p>₱{totalBudget.allocated?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div className="summary-total-spent">
                        Total Spent
                        <p>₱{totalBudget.spent?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div className="summary-total-remaining">
                        Total Remaining
                        <p>₱{totalBudget.remaining?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
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
                        <p>₱{totalBudget.approvedAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
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
                        {originalData.map((row, index) => (
                          <tr key={index} onClick={() => handleRowSelect(row.requestId)} className={selectedRows.includes(row.requestId) ? "selected" : ""} style={{ backgroundColor: row.validationStatus === "Approved" ? "#f0f0f0" : "white" }}>
                            <td><div className="row-wrapper"><input type="checkbox" checked={selectedRows.includes(row.requestId)} readOnly /></div></td>
                            <td><div className="row-wrapper">{row.requestId}</div></td>
                            <td><div className="row-wrapper">{row.departmentId}</div></td>
                            <td><div className="row-wrapper">{row.amount}</div></td>
                            <td><div className="row-wrapper">{row.approvedAmount}</div></td>
                            <td><div className="row-wrapper">{row.submissionDate}</div></td>
                            <td><div className="row-wrapper">{row.validationDate ? row.validationDate: "N/A"}</div></td>
                            <td><div className="row-wrapper">{row.validatedBy}</div></td>
                            <td><div className="row-wrapper">{row.approvalDate ? row.approvalDate : "N/A"}</div></td>
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
                  {isEditModalVisible && (
  <InfoCard className="edit-modal">
    <div className="edit-modal-content">
      <div className="edit-modal-header">
        <h3>Approval Process</h3>
      </div>
      {editingRows.map((row) => (
        <div key={row.requestId} className="edit-modal-item">
          <div className="edit-modal-left">
            <div className="edit-modal-select-icon">
              <input
                type="checkbox"
                style={{ transform: "scale(1.5)" }}
                checked={selectedRows.includes(row.requestId)}
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
                <strong>Approved Amount:</strong> {row.approvedAmount || row.amount}
              </p>
              <p>
                <strong>Validated By:</strong> {row.validatedBy}
              </p>
              <p>
                <strong>Validation Date:</strong>{" "}
                {row.validationDate ? row.validationDate.toLocaleDateString() : "N/A"}
              </p>
              <div className="edit-modal-input-group approved-by-group">
                <div className="edit-modal-label-input">
                  <label>
                    <strong>Approved By:</strong>
                  </label>
                  <input
                    type="text"
                    value={editedApprovedBy}
                    onChange={(e) => setEditedApprovedBy(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="popup-buttons">
        <button className="cancel-button" onClick={() => setIsEditModalVisible(false)}>
          Cancel
        </button>
        <button className="reject-button" onClick={handleRejectClick}>
          Reject
        </button>
        <button className="approve-button" onClick={handleApproveClick}>
          Approve
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
                            <td><div className="row-wrapper">{row.submissionDate}</div></td>
                            <td><div className="row-wrapper">{row.approvedBy}</div></td>
                            <td><div className="row-wrapper">{row.remarks === "Rejected" ? "For Resubmission" : row.remarks}</div></td>
                            <td><div className="row-wrapper"><span className={`status-label ${row.validationStatus}`}>{row.validationStatus}</span></div></td>

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
                            <p>{totalBudget.approvedAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '₱0.00'}</p>
                          </div>
                          <div className="summary-status">
                            <div className="summary-approved">
                              Approved <span className="status-circle approved"></span>
                              <p>{originalRequestData.filter(item => item.validationStatus === "Approved").length}</p>
                            </div>
                            <div className="summary-pending">
                              Pending <span className="status-circle pending"></span>
                              <p>{originalRequestData.filter(item => item.validationStatus === "Pending").length}</p>
                            </div>
                            <div className="summary-rejected">
                              Rejected <span className="status-circle rejected"></span>
                              <p>{originalRequestData.filter(item => item.validationStatus === "Rejected").length}</p>
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
                              <th>Approved Amount</th>
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
                            {originalData.map((row, index) => (
                              <tr key={index} onClick={() => handleRowSelect(row.requestId)} className={selectedRows.includes(row.requestId) ? "selected" : ""} style={{ backgroundColor: row.validationStatus === "Approved" ? "#f0f0f0" : "white" }}>
                                <td><div className="row-wrapper"><input type="checkbox" checked={selectedRows.includes(row.requestId)} readOnly /></div></td>
                                <td><div className="row-wrapper">{row.requestId}</div></td>
                                <td><div className="row-wrapper">{row.departmentId}</div></td>
                                <td><div className="row-wrapper">{row.amount}</div></td>
                                <td><div className="row-wrapper">{row.approvedAmount}</div></td>
                                <td><div className="row-wrapper">{row.requestDate}</div></td>
                                <td><div className="row-wrapper">{row.validationDate ? row.validationDate: "N/A"}</div></td>
                                <td><div className="row-wrapper">{row.validatedBy}</div></td>
                                <td><div className="row-wrapper">{row.approvalDate ? row.approvalDate: "N/A"}</div></td>
                                <td><div className="row-wrapper">{row.approvedBy}</div></td>
                                <td><div className="row-wrapper">{row.remarks}</div></td>
                                <td><div className="row-wrapper"><span className={`status-label ${row.validationStatus}`}>{row.validationStatus}</span></div></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="button-container">
                          <button className="process-button" onClick={handleProcessClick}>Process</button>
                        </div>
                      </InfoCard>
                      {isEditModalVisible && (
  <InfoCard className="edit-modal">
    <div className="edit-modal-content">
      <div className="edit-modal-header">
        <h3>Approval Process</h3>
      </div>
      {editingRows.map((row) => (
        <div key={row.requestId} className="edit-modal-item">
          <div className="edit-modal-left">
            <div className="edit-modal-select-icon">
              <input
                type="checkbox"
                style={{ transform: "scale(1.5)" }}
                checked={selectedRows.includes(row.requestId)}
                readOnly
              />
            </div>
            <div className="edit-modal-details">
                                <p><strong>Request ID:</strong> {row.requestId}</p>
                                <p><strong>Department ID:</strong> {row.departmentId}</p>
                                <p><strong>Amount Requested:</strong> {row.amount}</p>
                                <p><strong>Approved Amount:</strong> {row.approvedAmount || row.amount}</p>
                                <p><strong>Validated By:</strong> {row.validatedBy}</p>
                                <p><strong>Validation Date:</strong> {row.validationDate ? row.validationDate: 'N/A'}</p>
                                <div className="edit-modal-input-group approved-by-group">
                <div className="edit-modal-label-input">
                  <label>
                    <strong>Approved By:</strong>
                  </label>
                  <input
                    type="text"
                    value={editedApprovedBy}
                    onChange={(e) => setEditedApprovedBy(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="popup-buttons">
        <button className="cancel-button" onClick={() => setIsEditModalVisible(false)}>
          Cancel
        </button>
        <button className="reject-button" onClick={handleRejectClick}>
          Reject
        </button>
        <button className="approve-button" onClick={handleApproveClick}>
          Approve
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
                                <td><div className="row-wrapper">{row.requestDate}</div></td>
                                <td><div className="row-wrapper">{row.approvedBy}</div></td>
                                <td><div className="row-wrapper">{row.remarks}</div></td>
                                <td><div className="row-wrapper"><span className={`status-label ${row.validationStatus}`}>{row.validationStatus}</span></div></td>
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
                  <p>Please select at least one row to approve or reject.</p>
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