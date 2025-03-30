import React, { useState, useEffect } from "react";
import "../styles/Approvals.css";

const tabs = ["All Approvals", "Approved Requests", "Pending Requests"];

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
        { requestId: "BUD2025-001", approvalId: "APP2025-001", amount: "500,000", approvalDate: "2025-02-17", approvedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "500,000", approvalStatus: "Approved" },
        { requestId: "BUD2025-002", approvalId: "APP2025-002",amount: "1,000,000", approvalDate: "2024-12-15", approvedBy: "Sexbomb Aiah", remarks: "Awaiting Approval", approvedAmount: "Awaiting Approval", approvalStatus: "Pending" },
        { requestId: "BUD2025-003", approvalId: "APP2025-003",amount: "1,300,000", approvalDate: "2024-12-25", approvedBy: "Sexbomb Aiah", remarks: "Awaiting Approval", approvedAmount: "Awaiting Approval", approvalStatus: "Pending" },
        { requestId: "BUD2025-004", approvalId: "APP2025-004",amount: "1,200,000", approvalDate: "2025-01-30", approvedBy: "Sexbomb Aiah", remarks: "Awaiting Approval", approvedAmount: "Awaiting Approval", approvalStatus: "Pending" },
        { requestId: "BUD2025-005", approvalId: "APP2025-005",amount: "1,900,000", approvalDate: "2025-02-28", approvedBy: "Sexbomb Aiah", remarks: "Awaiting Approval", approvedAmount: "Awaiting Approval", approvalStatus: "Pending" },
        { requestId: "BUD2025-006", approvalId: "APP2025-006",amount: "1,100,000", approvalDate: "2025-02-26", approvedBy: "Sexbomb Aiah", remarks: "Awaiting Approval", approvedAmount: "Awaiting Approval", approvalStatus: "Pending" },
        { requestId: "BUD2025-007", approvalId: "APP2025-007",amount: "3,200,000", approvalDate: "2025-02-14", approvedBy: "Sexbomb Aiah", remarks: "Awaiting Approval", approvedAmount: "Awaiting Approval", approvalStatus: "Pending" },
        { requestId: "BUD2025-008", approvalId: "APP2025-008",amount: "2,300,000", approvalDate: "2025-01-19", approvedBy: "Sexbomb Aiah", remarks: "Awaiting Approval", approvedAmount: "Awaiting Approval", approvalStatus: "Pending" },
        { requestId: "BUD2025-009", approvalId: "APP2025-009",amount: "1,200,000", approvalDate: "2025-01-29", approvedBy: "Sexbomb Aiah", remarks: "Awaiting Approval", approvedAmount: "Awaiting Approval", approvalStatus: "Pending" },
        { requestId: "BUD2025-010", approvalId: "APP2025-010",amount: "2,500,000", approvalDate: "2025-03-14", approvedBy: "Sexbomb Aiah", remarks: "Awaiting Approval", approvedAmount: "Awaiting Approval", approvalStatus: "Pending" },
        { requestId: "BUD2025-011", approvalId: "APP2025-011",amount: "3,700,000", approvalDate: "2025-03-02", approvedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "3,500,000", approvalStatus: "Approved" },
        { requestId: "BUD2025-012", approvalId: "APP2025-012",amount: "5,100,000", approvalDate: "2025-03-16", approvedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "5,000,000", approvalStatus: "Approved" },
        { requestId: "BUD2025-013", approvalId: "APP2025-013",amount: "6,200,000", approvalDate: "2025-03-12", approvedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "6,000,000", approvalStatus: "Approved" },
        { requestId: "BUD2025-014", approvalId: "APP2025-014",amount: "2,400,000", approvalDate: "2025-03-15", approvedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "2,400,000", approvalStatus: "Approved" },
        { requestId: "BUD2025-015", approvalId: "APP2025-015",amount: "1,500,000", approvalDate: "2025-03-13", approvedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "1,500,000", approvalStatus: "Approved" },
        { requestId: "BUD2025-016", approvalId: "APP2025-016",amount: "2,200,000", approvalDate: "2025-02-02", approvedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "2,000,000", approvalStatus: "Approved" },
        { requestId: "BUD2025-017", approvalId: "APP2025-017",amount: "3,000,000", approvalDate: "2025-01-02", approvedBy: "Sexbomb Aiah", remarks: "Approved", approvedAmount: "3,000,000", approvalStatus: "Approved" },
        { requestId: "BUD2025-018", approvalId: "APP2025-018",amount: "4,900,000", approvalDate: "2025-02-25", approvedBy: "Sexbomb Aiah", remarks: "Awaiting Approval", approvedAmount: "Awaiting Approval", approvalStatus: "Pending" },
        { requestId: "BUD2025-019", approvalId: "APP2025-019",amount: "5,500,000", approvalDate: "2025-01-01", approvedBy: "Sexbomb Aiah", remarks: "Awaiting Approval", approvedAmount: "Awaiting Approval", approvalStatus: "Pending" },
    ].map(item => ({
        ...item,
        approvalDate: new Date(item.approvalDate)
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
        const filteredApprovedData = filterDataByDate(originalData.filter(item => item.approvalStatus === "Approved"), dateRangeApproved);
        setApprovedData(filteredApprovedData);
    }, [dateRangeApproved, originalData]);

    useEffect(() => {
        const sortedPendingData = sortData(pendingData, filterByPending);
        setPendingData(sortedPendingData);
    }, [filterByPending, pendingData]);

    useEffect(() => {
        const filteredPendingData = filterDataByDate(originalData.filter(item => item.approvalStatus === "Pending"), dateRangePending);
        setPendingData(filteredPendingData);
    }, [dateRangePending, originalData]);

    useEffect(() => {
        let filteredApprovedData = filterDataByDate(originalData.filter(item => item.approvalStatus === "Approved"), dateRangeApproved);
        filteredApprovedData = filterDataBySearch(filteredApprovedData, approvedSearchTerm);
        setApprovedData(filteredApprovedData);
    }, [dateRangeApproved, approvedSearchTerm, originalData]);

    useEffect(() => {
        let filteredPendingData = filterDataByDate(originalData.filter(item => item.approvalStatus === "Pending"), dateRangePending);
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
        const approved = originalData.filter(item => item.approvalStatus === "Approved");
        setApprovedData(approved);
    }, [originalData]);

    useEffect(() => {
        const pending = originalData.filter(item => item.approvalStatus === "Pending");
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
                    const approvalDate = new Date(item.approvalDate);
                    return !isNaN(approvalDate) && approvalDate >= startDate && approvalDate <= today;
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
                        item.approvalId.toLowerCase().includes(lowerTerm) ||
                        item.amount.toLowerCase().includes(lowerTerm) ||
                        item.approvalDate.toISOString().toLowerCase().includes(lowerTerm) ||
                        item.approvedBy.toLowerCase().includes(lowerTerm) ||
                        item.remarks.toLowerCase().includes(lowerTerm) ||
                        item.approvedAmount.toLowerCase().includes(lowerTerm) ||
                        item.approvalStatus.toLowerCase().includes(lowerTerm)
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
                        comparison = new Date(a.approvalDate) - new Date(b.approvalDate);
                    } else if (sortBy === "latest requests") {
                        comparison = new Date(b.approvalDate) - new Date(a.approvalDate);
                    }
                    return comparison;
                });
                return sortedData;
            } catch (error) {
                console.error("Error in sortData:", error);
                return [];
            }
    };

    
 return (
        <div className="approvals">
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

                {activeTab === "All Approvals" && (
                    <div className="content-container">
                        <InfoCard className="filter-infocard">
                            <div className="filter-controls">
                                <input className="search" type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                    <div class="filter-group">
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
                                            <table className="approval-table-2">
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Request ID</th>
                                                        <th>Approval ID</th>
                                                        <th>Amount Requested</th>
                                                        <th>Approval Date</th>
                                                        <th>Approved By</th>
                                                        <th>Remarks</th>
                                                        <th>Approved Amount</th>
                                                        <th>Approval Status</th>
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
                                                                    <div className="row-wrapper">{row.approvalId}</div>
                                                                </td>
                                                                <td>
                                                                    <div className="row-wrapper">{row.amount}</div>
                                                                </td>
                                                                <td>
                                                                    <div className="row-wrapper">{row.approvalDate.toLocaleDateString()}</div>
                                                                </td>
                                                                <td>
                                                                    <div className="row-wrapper">{row.approvedBy}</div>
                                                                </td>
                                                                <td>
                                                                    <div className="row-wrapper">{row.remarks}</div>
                                                                </td>
                                                                <td>
                                                                    <div className="row-wrapper">{row.approvedAmount}</div>
                                                                </td>
                                                                <td>
                                                                    <div className="row-wrapper">
                                                                        <span className={`status-label ${row.approvalStatus.toLowerCase()}`}>
                                                                            {row.approvalStatus}
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
                                <table className="approval-table-2"> 
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Request ID</th>
                                            <th>Approval ID</th>
                                            <th>Amount Requested</th>
                                            <th>Approval Date</th>
                                            <th>Approved By</th>
                                            <th>Remarks</th>
                                            <th>Approved Amount</th>
                                            <th>Approval Status</th>
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
                                                    <div className="row-wrapper">{row.approvalId}</div>
                                                </td>
                                                <td>
                                                    <div className="row-wrapper">{row.amount}</div>
                                                </td>
                                                <td>
                                                    <div className="row-wrapper">{row.approvalDate.toLocaleDateString()}</div>
                                                </td>
                                                <td>
                                                    <div className="row-wrapper">{row.approvedBy}</div>
                                                </td>
                                                <td>
                                                    <div className="row-wrapper">{row.remarks}</div>
                                                </td>
                                                <td>
                                                    <div className="row-wrapper">{row.approvedAmount}</div>
                                                </td>
                                                <td>
                                                    <div className="row-wrapper">
                                                        <span className={`status-label ${row.approvalStatus.toLowerCase()}`}> 
                                                            {row.approvalStatus}
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
                                <table className="approval-table-2">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Request ID</th>
                                            <th>Approval ID</th>
                                            <th>Amount Requested</th>
                                            <th>Approval Date</th>
                                            <th>Approved By</th>
                                            <th>Remarks</th>
                                            <th>Approved Amount</th>
                                            <th>Approval Status</th>
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
                                                    <div className="row-wrapper">{row.approvalId}</div>
                                                </td>
                                                <td>
                                                    <div className="row-wrapper">{row.amount}</div>
                                                </td>
                                                <td>
                                                    <div className="row-wrapper">{row.approvalDate.toLocaleDateString()}</div>
                                                </td>
                                                <td>
                                                    <div className="row-wrapper">{row.approvedBy}</div>
                                                </td>
                                                <td>
                                                    <div classNameclassName="row-wrapper">{row.remarks}</div>
                                                </td>
                                                <td>
                                                    <div className="row-wrapper">{row.approvedAmount}</div>
                                                </td>
                                                <td>
                                                    <div className="row-wrapper">
                                                        <span className={`status-label ${row.approvalStatus.toLowerCase()}`}>
                                                            {row.approvalStatus}
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