import React, { useState, useEffect } from "react";
import "../styles/InternalDelivery.css";
import TabNavigation from "../components/delivery/TabNavigation.jsx";
import DeliveryTable from "../components/delivery/DeliveryTable.jsx";

const InternalDelivery = () => {
  // State for tab management
  const [activeTab, setActiveTab] = useState("content"); // "content" or "stock"
  
  // State for data management
  const [contentDeliveries, setContentDeliveries] = useState([]);
  const [stockTransferDeliveries, setStockTransferDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchInternalDeliveryOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/delivery-orders/');
        
        if (!response.ok) {
          throw new Error('Failed to fetch delivery orders');
        }
        
        const data = await response.json();
        
        // Separate internal deliveries into content and stock transfer categories
        const internalOrders = data.filter(order => order.del_type === 'Internal Delivery');
        const contentOrders = internalOrders.filter(order => order.content_id);
        const stockOrders = internalOrders.filter(order => order.stock_transfer_id);
        
        setContentDeliveries(contentOrders);
        setStockTransferDeliveries(stockOrders);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInternalDeliveryOrders();
  }, []);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  return (
    <div className="internal-delivery">
      <div className="body-content-container">
        <h2 className="page-title">Internal Delivery Orders</h2>
        
        {/* Tab Navigation */}
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          tabs={[
            { id: 'content', label: 'Content Delivery' },
            { id: 'stock', label: 'Stock Transfer' }
          ]} 
        />
        
        {/* Search and Filters */}
        <div className="filters-row">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder={`Search by ${activeTab === 'content' ? 'content ID' : 'stock transfer ID'}...`}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="filter-container">
            <span className="filter-label">Status:</span>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="status-filter"
            >
              <option value="All">All</option>
              <option value="Created">Created</option>
              <option value="Approved">Approved</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        {/* Delivery Table */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading delivery orders...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">Error: {error}</p>
          </div>
        ) : (
          <DeliveryTable 
            deliveries={activeTab === 'content' ? contentDeliveries : stockTransferDeliveries}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            deliveryType={activeTab}
          />
        )}
      </div>
    </div>
  );
};

export default InternalDelivery;