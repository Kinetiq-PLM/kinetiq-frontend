import React, { useState, useEffect } from "react";
import "../styles/ExternalDelivery.css";
import TabNavigation from "../components/delivery/TabNavigation.jsx";
import DeliveryTable from "../components/delivery/DeliveryTable.jsx";

const ExternalDelivery = () => {
  // State for tab management
  const [activeTab, setActiveTab] = useState("sales"); // "sales" or "service"
  
  // State for data management
  const [salesDeliveries, setSalesDeliveries] = useState([]);
  const [serviceDeliveries, setServiceDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchDeliveryOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/delivery-orders/');
        
        if (!response.ok) {
          throw new Error('Failed to fetch delivery orders');
        }
        
        const data = await response.json();
        
        // Separate external deliveries into sales and service categories
        const externalOrders = data.filter(order => order.del_type === 'External Delivery');
        const salesOrders = externalOrders.filter(order => order.sales_order_id);
        const serviceOrders = externalOrders.filter(order => order.service_order_id);
        
        setSalesDeliveries(salesOrders);
        setServiceDeliveries(serviceOrders);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDeliveryOrders();
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
    <div className="external-delivery">
      <div className="body-content-container">
        <h2 className="page-title">External Delivery Orders</h2>
        
        {/* Tab Navigation */}
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
        
        {/* Search and Filters */}
        <div className="filters-row">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder={`Search by ${activeTab === 'sales' ? 'sales' : 'service'} order ID...`}
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
            deliveries={activeTab === 'sales' ? salesDeliveries : serviceDeliveries}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            deliveryType={activeTab}
          />
        )}
      </div>
    </div>
  );
};

export default ExternalDelivery;