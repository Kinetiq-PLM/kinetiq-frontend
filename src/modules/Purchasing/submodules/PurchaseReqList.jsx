import React, { useState } from "react";
import "../styles/PurchaseReqList.css";

const PurchaseReqListBody = () => {
    // State for search input
    const [searchTerm, setSearchTerm] = useState("");

    // Sample purchase request data
    const purchaseRequests = [
        { id: "PR001", name: "Son Goku", department: "Operations", documentDate: "01/31/2025", validDate: "03/02/2025" },
        { id: "PR002", name: "Monkey D. Luffy", department: "Project Management", documentDate: "01/31/2025", validDate: "03/02/2025" },
        { id: "PR003", name: "Tanjiro Kamado", department: "Sales", documentDate: "01/31/2025", validDate: "03/02/2025" },
        { id: "PR004", name: "Toni Fowler", department: "Ah Daddy!", documentDate: "01/31/2025", validDate: "03/02/2025" },
        { id: "PR005", name: "Anya Forger", department: "Admin", documentDate: "01/31/2025", validDate: "03/02/2025" },
        { id: "PR006", name: "Gojo Satoru", department: "Finance", documentDate: "01/31/2025", validDate: "03/02/2025" },
        { id: "PR007", name: "Itadori Yuji", department: "Finance Buddy", documentDate: "01/31/2025", validDate: "03/02/2025" }
    ];

    const handleBack = () => {
        // Add navigation logic here
        console.log("Back button clicked");
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        console.log("Searching for:", e.target.value);
    };

    const handleNewRequest = () => {
        // Add new request logic here
        console.log("New request button clicked");
    };

    const handleRequestClick = (request) => {
        // Add request click logic here
        console.log("Request clicked:", request);
    };

    const handleCheckboxClick = () => {
        // Add checkbox click logic here
        console.log("Checkbox clicked");
    };

    const handleLoadMore = () => {
        // Add load more logic here
        console.log("Load more button clicked");
    };

    // Filter requests based on search term
    const filteredRequests = purchaseRequests.filter(request => {
        const searchLower = searchTerm.toLowerCase();
        return (
            request.id.toLowerCase().includes(searchLower) ||
            request.name.toLowerCase().includes(searchLower) ||
            request.department.toLowerCase().includes(searchLower) ||
            request.documentDate.toLowerCase().includes(searchLower) ||
            request.validDate.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="purchreq">
            <div className="purchreq-body-content-container">
                
                {/* Header section */}
                <div className="purchreq-header">
                    <button className="purchreq-back-btn" onClick={handleBack}>← Back</button>
                    <input
                        type="text"
                        className="purchreq-search"
                        placeholder="Search by PR No., Name, Department, or Date..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                {/* Table container */}
                <div className="purchreq-table-container">
                    <table className="purchreq-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox" onClick={handleCheckboxClick} /></th>
                                <th>PR No.</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Document Date</th>
                                <th>Valid Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((request, index) => (
                                    <tr key={index} onClick={() => handleRequestClick(request)}>
                                        <td><input type="checkbox" onClick={handleCheckboxClick} /></td>
                                        <td>{request.id}</td>
                                        <td>{request.name}</td>
                                        <td>{request.department}</td>
                                        <td>{request.documentDate}</td>
                                        <td>{request.validDate}</td>
                                    </tr>
                                ))
                            ) : (
                                /* Display message when no results found */
                                <tr>
                                    <td colSpan="6" className="purchreq-no-results">
                                        No results found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Load More Button */}
                <button className="purchreq-load-more" onClick={handleLoadMore}>Load more</button>
            </div>
        </div>
    );
};

export default PurchaseReqListBody;
