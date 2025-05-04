import React, { useState, useEffect } from "react";
import axios from "axios";

const DeliveryTable = ({ deliveries, searchTerm, statusFilter, deliveryType }) => {
  // State for table management
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("del_order_id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Add loading state for approval process QA PURPOSES
  const [approving, setApproving] = useState(null);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let filtered = [...deliveries];
    
    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(order => order.order_status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        const deliveryIdMatches = order.del_order_id?.toLowerCase().includes(term);
        const contentIdMatches = order.content_id?.toLowerCase().includes(term);
        const stockTransferIdMatches = order.stock_transfer_id?.toLowerCase().includes(term);
        const salesOrderIdMatches = order.sales_order_id?.toLowerCase().includes(term);
        const serviceOrderIdMatches = order.service_order_id?.toLowerCase().includes(term);
        
        return deliveryIdMatches || 
               contentIdMatches || 
               stockTransferIdMatches || 
               salesOrderIdMatches || 
               serviceOrderIdMatches;
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA = a[sortField] || "";
      let valueB = b[sortField] || "";
      
      // Convert to strings for consistent comparison
      valueA = String(valueA).toLowerCase();
      valueB = String(valueB).toLowerCase();
      
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredDeliveries(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [deliveries, searchTerm, statusFilter, sortField, sortDirection]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDeliveries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);
  
  // Handle column sort
  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };
  
  // Format IDs for display
  const formatID = (id, type) => {
    if (!id) return "-";
    
    if (type === "delivery") {
      return id.startsWith("DIS-DO-") ? id : `DIS-DO-${new Date().getFullYear()}-${id}`;
    } else if (type === "content") {
      return id.startsWith("OPS-DOI-") ? id : `OPS-DOI-${new Date().getFullYear()}-${id}`;
    } else if (type === "stock") {
      return id.startsWith("INV-WM-") ? id : `INV-WM-${new Date().getFullYear()}-${id}`;
    } else if (type === "sales") {
      return id.startsWith("SALES-ORD-") ? id : `SALES-ORD-${new Date().getFullYear()}-${id}`;
    } else if (type === "service") {
      return id.startsWith("SERVICES-DO-") ? id : `SERVICES-DO-${new Date().getFullYear()}-${id}`;
    }
    
    return id;
  };
 
  // TEMPORARY: Function to handle delivery order approval QA PURPOSES PUTANGINA
  const handleApprove = async (delOrderId) => {
    try {
      setApproving(delOrderId);
      
      // Send approval request to backend
      await axios.post('https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/approve-order/', { del_order_id: delOrderId });
      
      // Update the order status in the local state (optimistic update)
      const updatedDeliveries = filteredDeliveries.map(order => {
        if (order.del_order_id === delOrderId) {
          return { ...order, order_status: 'Approved' };
        }
        return order;
      });
      
      setFilteredDeliveries(updatedDeliveries);
      setApproving(null);
      
      // Show success message
      alert(`Order ${delOrderId} has been approved for testing purposes.`);
    } catch (error) {
      console.error("Error approving order:", error);
      setApproving(null);
      alert(`Failed to approve order: ${error.message}`);
    }
    };
  
  return (
    <div className="delivery-table-container">
      <div className="table-metadata">
        <span className="record-count">
          Showing {filteredDeliveries.length} {deliveryType} delivery orders
        </span>
        <span className="pagination-info">
          Page {currentPage} of {totalPages || 1}
        </span>
      </div>
      
      <div className="table-wrapper">
        <table className="delivery-table">
          <thead>
            <tr>
              <th>
                  {deliveryType === 'sales' ? 'Sales Order ID' : 
                  deliveryType === 'service' ? 'Service Order ID' : 
                  deliveryType === 'content' ? 'Content ID' : 
                  'Stock Transfer ID'}
                </th>
              <th onClick={() => handleSort("order_status")} className="sortable">
                Status
                {sortField === "order_status" && (
                  <span className="sort-icon">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th>Is Project-Based?</th>
              <th>Is Partial Delivery?</th>
              <th onClick={() => handleSort("del_order_id")} className="sortable">
                Delivery Order ID
                {sortField === "del_order_id" && (
                  <span className="sort-icon">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              {/* TEMPORARY: Approval column - Comment this line to hide the column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((order, index) => (
                <tr key={order.del_order_id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                  <td>
                    {deliveryType === 'sales' 
                      ? formatID(order.sales_order_id, "sales") : 
                     deliveryType === 'service' 
                      ? formatID(order.service_order_id, "service") : 
                     deliveryType === 'content' 
                      ? formatID(order.content_id, "content") : 
                      formatID(order.stock_transfer_id, "stock")}
                  </td>
                  <td className={`status-cell status-${order.order_status?.toLowerCase() || 'created'}`}>
                    {order.order_status === "Created" ? "Pending" : (order.order_status || "Pending")}
                  </td>
                  <td className="centered-cell">
                    {typeof order.is_project_based === 'boolean' 
                      ? (order.is_project_based ? "Yes" : "No") 
                      : (order.is_project_based === "Project Based" ? "Yes" : "No")}
                  </td>
                  <td className="centered-cell">{order.is_partial_delivery ? "Yes" : "No"}</td>
                  <td>{formatID(order.del_order_id, "delivery")}</td>
                  {/* TEMPORARY: Approval button - Comment these lines to remove the button */}
                  <td>
                    {order.order_status !== 'Approved' ? (
                      <button
                        onClick={() => handleApprove(order.del_order_id)}
                        disabled={approving === order.del_order_id}
                        className="approve-button"
                      >
                        {approving === order.del_order_id ? 'Approving...' : 'Approve'}
                      </button>
                    ) : (
                      <span className="approved-text">Approved</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={window.innerWidth <= 576 ? 3 : 6} className="no-data">
                  No {deliveryType} delivery orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic to show relevant page numbers around current page
              const pageNum = totalPages <= 5 
                ? i + 1
                : currentPage <= 3
                  ? i + 1
                  : currentPage >= totalPages - 2
                    ? totalPages - 4 + i
                    : currentPage - 2 + i;
              
              return (
                <button
                  key={pageNum}
                  className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DeliveryTable;