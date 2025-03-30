import React, { useState, useEffect } from "react";
import "../styles/Validations.css";

const tabs = ["All Validations", "Approved Requests", "Pending Requests"];

const InfoCard = ({ title, value, color, children, className }) => (
    <div className={`info-card ${className}`}>
        {title && <h2 className="info-title">{title}</h2>}
        {value && <p className={`info-value ${color}`}>{value}</p>}
        {children}
    </div>
);

const BodyContent = () => {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [isCompact, setIsCompact] = useState(window.innerWidth < 768);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState("Last 30 days");
    const [dateRangeApproved, setDateRangeApproved] = useState("Last 30 days");
    const [dateRangePending, setDateRangePending] = useState("Last 30 days");
    const [filterBy, setFilterBy] = useState("All");
    const [originalData, setOriginalData] = useState([
        { requestId: "BUD2025-001", departmentId: "MAR01", amount: "500,000", validationDate: "2025-02-17", validatedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "Approved", validationStatus: "Approved"},
        { requestId: "BUD2025-002", departmentId: "OPER02", amount: "1,000,000", validationDate: "2024-12-15", validatedBy: "Sexbomb Aiah", remarks: "Awaiting Validation", approvedAmount: "Awaiting Validation", validationStatus: "Pending"},
        { requestId: "BUD2025-002", departmentId: "IT03", amount: "1,300,000", validationDate: "2024-12-25", validatedBy: "Sexbomb Aiah", remarks: "Awaiting Validation", approvedAmount: "Awaiting Validation", validationStatus: "Pending"},
        { requestId: "BUD2025-002", departmentId: "ACC04", amount: "1,200,000", validationDate: "2025-01-30", validatedBy: "Sexbomb Aiah", remarks: "Awaiting Validation", approvedAmount: "Awaiting Validation", validationStatus: "Pending"},
        { requestId: "BUD2025-002", departmentId: "PUR05", amount: "1,900,000", validationDate: "2025-02-28", validatedBy: "Sexbomb Aiah", remarks: "Awaiting Validation", approvedAmount: "Awaiting Validation", validationStatus: "Pending"},
        { requestId: "BUD2025-002", departmentId: "SUP05", amount: "1,100,000", validationDate: "2025-02-26", validatedBy: "Sexbomb Aiah", remarks: "Awaiting Validation", approvedAmount: "Awaiting Validation", validationStatus: "Pending"},
        { requestId: "BUD2025-002", departmentId: "PRO06", amount: "3,200,000", validationDate: "2025-02-14", validatedBy: "Sexbomb Aiah", remarks: "Awaiting Validation", approvedAmount: "Awaiting Validation", validationStatus: "Pending"},
        { requestId: "BUD2025-002", departmentId: "MRP07", amount: "2,300,000", validationDate: "2025-01-19", validatedBy: "Sexbomb Aiah", remarks: "Awaiting Validation", approvedAmount: "Awaiting Validation", validationStatus: "Pending"},
        { requestId: "BUD2025-002", departmentId: "INV08", amount: "1,200,000", validationDate: "2025-01-29", validatedBy: "Sexbomb Aiah", remarks: "Awaiting Validation", approvedAmount: "Awaiting Validation", validationStatus: "Pending"},
        { requestId: "BUD2025-003", departmentId: "PM09", amount: "2,500,000", validationDate: "2025-03-14", validatedBy: "Sexbomb Aiah", remarks: "Awaiting Validation", approvedAmount: "Awaiting Validation", validationStatus: "Pending"},
        { requestId: "BUD2025-004", departmentId: "HR10", amount: "3,700,000", validationDate: "2025-03-02", validatedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "Approved", validationStatus: "Approved"},
        { requestId: "BUD2025-004", departmentId: "MAR01", amount: "5,100,000", validationDate: "2025-03-16", validatedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "Approved", validationStatus: "Approved"},
        { requestId: "BUD2025-004", departmentId: "OPER02", amount: "6,200,000", validationDate: "2025-03-12", validatedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "Approved", validationStatus: "Approved"},
        { requestId: "BUD2025-004", departmentId: "IT03", amount: "2,400,000", validationDate: "2025-03-15", validatedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "Approved", validationStatus: "Approved"},
        { requestId: "BUD2025-004", departmentId: "ACC04", amount: "1,500,000", validationDate: "2025-03-13", validatedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "Approved", validationStatus: "Approved"},
        { requestId: "BUD2025-004", departmentId: "PUR05", amount: "2,200,000", validationDate: "2025-02-02", validatedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "Approved", validationStatus: "Approved"},
        { requestId: "BUD2025-004", departmentId: "SUP05", amount: "3,000,000", validationDate: "2025-01-02", validatedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "Approved", validationStatus: "Approved"},
        { requestId: "BUD2025-005", departmentId: "PRO06", amount: "4,900,000", validationDate: "2025-02-25", validatedBy: "Sexbomb Aiah", remarks: "Awaiting Validation", approvedAmount: "Awaiting Validation", validationStatus: "Pending"},
        { requestId: "BUD2025-006", departmentId: "MRP07", amount: "5,500,000", validationDate: "2025-01-01", validatedBy: "Sexbomb Aiah", remarks: "Awaiting Validation", approvedAmount: "Awaiting Validation", validationStatus: "Pending"},
    ].map(item => ({
        ...item,
        validationDate: new Date(item.validationDate)
    })));

    const [filteredData, setFilteredData] = useState(originalData);
    const [approvedData, setApprovedData] = useState([]);
    const [pendingData, setPendingData] = useState([]);
    const [filterByApproved, setFilterByApproved] = useState("All");
    const [filterByPending, setFilterByPending] = useState("All");
    const [approvedSearchTerm, setApprovedSearchTerm] = useState("");
    const [pendingSearchTerm, setPendingSearchTerm] = useState("");

    useEffect(() => {
        const sortedApprovedData = sortData(approvedData, filterByApproved);
        setApprovedData(sortedApprovedData);
    }, [filterByApproved, approvedData]);

    useEffect(() => {
        const filteredApprovedData = filterDataByDate(originalData.filter(item => item.validationStatus === "Approved"), dateRangeApproved);
        setApprovedData(filteredApprovedData);
    }, [dateRangeApproved, originalData]);

    useEffect(() => {
        const sortedPendingData = sortData(pendingData, filterByPending);
        setPendingData(sortedPendingData);
    }, [filterByPending, pendingData]);

    useEffect(() => {
        const filteredPendingData = filterDataByDate(originalData.filter(item => item.validationStatus === "Pending"), dateRangePending);
        setPendingData(filteredPendingData);
    }, [dateRangePending, originalData]);

    useEffect(() => {
        let filteredApprovedData = filterDataByDate(originalData.filter(item => item.validationStatus === "Approved"), dateRangeApproved);
        filteredApprovedData = filterDataBySearch(filteredApprovedData, approvedSearchTerm);
        setApprovedData(filteredApprovedData);
    }, [dateRangeApproved, approvedSearchTerm, originalData]);

    useEffect(() => {
        let filteredPendingData = filterDataByDate(originalData.filter(item => item.validationStatus === "Pending"), dateRangePending);
        filteredPendingData = filterDataBySearch(filteredPendingData, pendingSearchTerm);
        setPendingData(filteredPendingData);
    }, [dateRangePending, pendingSearchTerm, originalData]);

    useEffect(() => {
        let tempData = filterDataByDate(originalData, dateRange);
        tempData = filterDataBySearch(tempData, searchTerm);
        tempData = sortData(tempData, filterBy);
        setFilteredData(tempData);
    }, [dateRange, searchTerm, filterBy, originalData]);

    useEffect(() => {
        const handleResize = () => {
            setIsCompact(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        let tempData = filterDataByDate(originalData, dateRange);
        tempData = filterDataBySearch(tempData, searchTerm);
        tempData = sortData(tempData, filterBy);
        setFilteredData(tempData);
    }, [dateRange, searchTerm, filterBy, originalData]);


    useEffect(() => {
        const approved = originalData.filter(item => item.validationStatus === "Approved");
        setApprovedData(approved);
    }, [originalData]);

    useEffect(() => {
        const pending = originalData.filter(item => item.validationStatus === "Pending");
        setPendingData(pending);
    }, [originalData]);

    const handlePageChange = (direction) => {
        const currentIndex = tabs.indexOf(activeTab);
        if (direction === "next" && currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1]);
        } else if (direction === "prev" && currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1]);
        }
    };

    const filterDataByDate = (data, range) => {
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
                const validationDate = new Date(item.validationDate);
                return !isNaN(validationDate) && validationDate >= startDate && validationDate <= today;
            });
        } catch (error) {
            console.error("Error in filterDataByDate:", error);
            return [];
        }
    };

    const filterDataBySearch = (data, term) => {
        try {
            if (!term) return data;
            const lowerTerm = term.toLowerCase();
            return data.filter(item => {
                return (
                    item.requestId.toLowerCase().includes(lowerTerm) ||
                    item.departmentId.toLowerCase().includes(lowerTerm)|
                    item.amount.toLowerCase().includes(lowerTerm) ||
                    item.validationDate.toISOString().toLowerCase().includes(lowerTerm) ||
                    item.validatedBy.toLowerCase().includes(lowerTerm) ||
                    item.remarks.toLowerCase().includes(lowerTerm) ||
                    item.approvedAmount.toLowerCase().includes(lowerTerm) ||
                    item.validationStatus.toLowerCase().includes(lowerTerm) 
                );
            });
        } catch (error) {
            console.error("Error in filterDataBySearch:", error);
            return [];
        }
    };

    const sortData = (data, sortBy) => {
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
                    comparison = new Date(a.validationDate) - new Date(b.validationDate);
                } else if (sortBy === "latest requests") {
                    comparison = new Date(b.validationDate) - new Date(a.validationDate);
                }
                return comparison;
            });
            return sortedData;
        } catch (error) {
            console.error("Error in sortData:", error);
            return [];
        }
    };

    const tableData = [
        { department: "Marketing", allocatedBudget: "500,000.00", totalSpent: "100,000.00", remainingBudget: "400,000.00" },
        { department: "Operations", allocatedBudget: "400,000.00", totalSpent: "200,000.00", remainingBudget: "200,000.00" },
        { department: "IT Department", allocatedBudget: "200,000.00", totalSpent: "50,000.00", remainingBudget: "150,000.00" },
        { department: "Accounting", allocatedBudget: "300,000.00", totalSpent: "150,000.00", remainingBudget: "150,000.00" },
        { department: "Purchasing", allocatedBudget: "200,000.00", totalSpent: "50,000.00", remainingBudget: "150,000.00" },
        { department: "Support & Services", allocatedBudget: "400,000.00", totalSpent: "250,000.00", remainingBudget: "150,000.00" },
        { department: "Production", allocatedBudget: "200,000.00", totalSpent: "50,000.00", remainingBudget: "150,000.00" },
        { department: "MRP", allocatedBudget: "400,000.00", totalSpent: "250,000.00", remainingBudget: "150,000.00" },
        { department: "Inventory", allocatedBudget: "400,000.00", totalSpent: "250,000.00", remainingBudget: "150,000.00" },
        { department: "Project Management", allocatedBudget: "400,000.00", totalSpent: "250,000.00", remainingBudget: "150,000.00" },
        { department: "Human Resources", allocatedBudget: "400,000.00", totalSpent: "250,000.00", remainingBudget: "150,000.00" },
    ];
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

            {activeTab === "All Validations" && (
                <div className="content-container">
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
                                {tableData.map(row => (
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
                                        <th></th>
                                        <th>Request ID</th>
                                        <th>Department ID</th>
                                        <th>Amount Requested</th>
                                        <th>Validation Date</th>
                                        <th>Validated By</th>
                                        <th>Remarks</th>
                                        <th>Approved Amount</th>
                                        <th>Validation Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((row, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="row-wrapper">
                                                    <input type="checkbox" />
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
                                                <div className="row-wrapper">{row.validationDate.toLocaleDateString()}</div>
                                            </td>
                                            <td>
                                                <div className="row-wrapper">{row.validatedBy}</div>
                                            </td>
                                            <td>
                                                <div className="row-wrapper">{row.remarks}</div>
                                            </td>
                                            <td>
                                                <div className="row-wrapper">{row.approvedAmount}</div>
                                            </td>
                                            
                                            <td>
                                                <div className="row-wrapper">
                                                    <span className={`status-label ${row.validationStatus.toLowerCase()}`}>
                                                        {row.validationStatus}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </InfoCard>
                    </InfoCard>
                </div>
            )}
            {activeTab === "Approved Requests" && (
                <div className="content-container">
                    <InfoCard className="filter-infocard">
                        <div className="filter-controls">
                            <input className="search" type="text" placeholder="Search..." value={approvedSearchTerm} onChange={(e) => setApprovedSearchTerm(e.target.value)} />
                            <div className="filter-group">
                                <select className="select-day" value={dateRangeApproved} onChange={(e) => setDateRangeApproved(e.target.value)}>
                                    <option value="Last 30 days">Last 30 days</option>
                                    <option value="Last 7 days">Last 7 days</option>
                                    <option value="All Time">All Time</option>
                                </select>

                                <select className="select-type" value={filterByApproved} onChange={(e) => setFilterByApproved(e.target.value)}>
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
                                        <th></th>
                                        <th>Request ID</th>
                                        <th>Department ID</th>
                                        <th>Amount Requested</th>
                                        <th>Validation Date</th>
                                        <th>Validated By</th>
                                        <th>Remarks</th>
                                        <th>Approved Amount</th>
                                        <th>Validation Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {approvedData.map((row, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="row-wrapper">
                                                    <input type="checkbox" />
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
                                                <div className="row-wrapper">{row.validationDate.toLocaleDateString()}</div>
                                            </td>
                                            <td>
                                                <div className="row-wrapper">{row.validatedBy}</div>
                                            </td>
                                            <td>
                                                <div className="row-wrapper">{row.remarks}</div>
                                            </td>
                                            <td>
                                                <div className="row-wrapper">{row.approvedAmount}</div>
                                            </td>
                                            <td>
                                                <div className="row-wrapper">
                                                    <span className={`status-label ${row.validationStatus.toLowerCase()}`}>
                                                        {row.validationStatus}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </InfoCard>
                    </InfoCard>

                </div>
            )}
            {activeTab === "Pending Requests" && (
                <div className="content-container">
                    <InfoCard className="filter-infocard">
                        <div className="filter-controls">
                            <input className="search" type="text" placeholder="Search..." value={pendingSearchTerm} onChange={(e) => setPendingSearchTerm(e.target.value)} />
                            <div className="filter-group">
                                <select className="select-day" value={dateRangePending} onChange={(e) => setDateRangePending(e.target.value)}>
                                    <option value="Last 30 days">Last 30 days</option>
                                    <option value="Last 7 days">Last 7 days</option>
                                    <option value="All Time">All Time</option>
                                    </select>

                                <select className="select-type" value={filterByPending} onChange={(e) => setFilterByPending(e.target.value)}>
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
                                        <th></th>
                                        <th>Request ID</th>
                                        <th>Department ID</th> 
                                        <th>Amount Requested</th>
                                        <th>Validation Date</th>
                                        <th>Validated By</th>
                                        <th>Remarks</th>
                                        <th>Approved Amount</th>
                                        <th>Validation Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingData.map((row, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="row-wrapper">
                                                    <input type="checkbox" />
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
                                                <div className="row-wrapper">{row.validationDate.toLocaleDateString()}</div>
                                            </td>
                                            <td>
                                                <div className="row-wrapper">{row.validatedBy}</div>
                                            </td>
                                            <td>
                                                <div className="row-wrapper">{row.remarks}</div>
                                            </td>
                                            <td>
                                                <div className="row-wrapper">{row.approvedAmount}</div>
                                            </td>
                                            <td>
                                                <div className="row-wrapper">
                                                    <span className={`status-label ${row.validationStatus.toLowerCase()}`}>
                                                        {row.validationStatus}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </InfoCard>
                    </InfoCard>

                </div>
            )}
            </div>
            </div>
    );
};
export default BodyContent;