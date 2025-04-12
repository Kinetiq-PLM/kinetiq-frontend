// Distribution.jsx - Dashboard for Distribution Module
import React, { useState, useEffect } from "react";
import "./styles/Distribution.css";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Search, TrendingUp, Package, Truck, BarChart2, Calendar, Users, AlertCircle, Box } from "lucide-react";

// Register Chart.js components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Distribution = ({ loadSubModule, setActiveSubModule }) => {
  // State for data management
  const [distributionData, setDistributionData] = useState({
    metrics: {
      totalDeliveries: 0,
      pendingDeliveries: 0,
      completedDeliveries: 0,
      inTransit: 0,
      failedDeliveries: 0,
    },
    recentDeliveries: [],
    performanceMetrics: {
      onTimeDeliveryRate: 0,
      averageFulfillmentTime: 0,
      returnRate: 0,
    },
    warehouseUtilization: [],
    distributionByRegion: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState("weekly"); // weekly, monthly, quarterly, yearly
  const [searchTerm, setSearchTerm] = useState("");

  // Handle navigation to submodule
  const navigateToSubmodule = (submoduleId) => {
    if (setActiveSubModule && loadSubModule) {
      setActiveSubModule(submoduleId);
      loadSubModule(submoduleId);
    }
  };

  // Fetch real data from API endpoints
  const fetchRealData = async (timeFrame) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch shipments data
      const shipmentsResponse = await fetch('http://127.0.0.1:8000/api/shipments/');
      if (!shipmentsResponse.ok) {
        throw new Error('Failed to fetch shipments data');
      }
      const shipmentsData = await shipmentsResponse.json();
      
      // Fetch delivery orders
      const deliveryOrdersResponse = await fetch('http://127.0.0.1:8000/api/delivery-orders/');
      if (!deliveryOrdersResponse.ok) {
        throw new Error('Failed to fetch delivery orders data');
      }
      const deliveryOrdersData = await deliveryOrdersResponse.json();
      
      // Process shipments data
      const totalDeliveries = shipmentsData.length;
      const pendingDeliveries = shipmentsData.filter(s => s.shipment_status === 'Pending').length;
      const completedDeliveries = shipmentsData.filter(s => s.shipment_status === 'Delivered').length;
      const inTransit = shipmentsData.filter(s => s.shipment_status === 'Shipped').length;
      const failedDeliveries = shipmentsData.filter(s => s.shipment_status === 'Failed').length;
      
      // Create recent deliveries list from shipments data
      const recentDeliveries = shipmentsData
        .sort((a, b) => new Date(b.shipment_date) - new Date(a.shipment_date))
        .slice(0, 8)
        .map(shipment => ({
          id: shipment.shipment_id,
          date: shipment.shipment_date || 'N/A',
          destination: shipment.destination_location || 'Unknown',
          items: shipment.packing_list_info?.total_items_packed || 0,
          status: shipment.shipment_status,
          priority: getPriorityFromShipment(shipment),
        }));
      
      // Calculate performance metrics
      const onTimeDeliveries = shipmentsData.filter(s => 
        s.shipment_status === 'Delivered' && 
        new Date(s.actual_arrival_date) <= new Date(s.estimated_arrival_date)
      ).length;
      
      const deliveredShipments = shipmentsData.filter(s => s.shipment_status === 'Delivered');
      const onTimeDeliveryRate = deliveredShipments.length > 0 
        ? (onTimeDeliveries / deliveredShipments.length) * 100 
        : 0;
      
      // Calculate average fulfillment time (in days)
      let totalFulfillmentDays = 0;
      let countWithBothDates = 0;
      
      for (const shipment of deliveredShipments) {
        if (shipment.shipment_date && shipment.actual_arrival_date) {
          const startDate = new Date(shipment.shipment_date);
          const endDate = new Date(shipment.actual_arrival_date);
          const diffTime = Math.abs(endDate - startDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          totalFulfillmentDays += diffDays;
          countWithBothDates++;
        }
      }
      
      const averageFulfillmentTime = countWithBothDates > 0 
        ? parseFloat((totalFulfillmentDays / countWithBothDates).toFixed(1)) 
        : 0;
      
      // Calculate return rate based on rejected deliveries
      const rejectedDeliveries = shipmentsData.filter(s => 
        s.delivery_receipt_info?.receipt_status === 'Rejected'
      ).length;
      
      const returnRate = totalDeliveries > 0 
        ? parseFloat(((rejectedDeliveries / totalDeliveries) * 100).toFixed(1)) 
        : 0;
      
      // Simulate warehouse utilization (this would ideally come from a warehouse API endpoint)
      // For now, we'll derive this from the shipment data
      const warehouseData = getWarehouseDataFromShipments(shipmentsData);
      
      // Simulate regional distribution (this would ideally come from a regions API endpoint)
      // For now, we'll derive this from the shipment destinations
      const regionData = getRegionalDataFromShipments(shipmentsData);
      
      // Apply time filter scaling if necessary
      const multiplier = getTimeFrameMultiplier(timeFrame);
      
      // Create the dashboard data object
      const dashboardData = {
        metrics: {
          totalDeliveries,
          pendingDeliveries,
          completedDeliveries,
          inTransit,
          failedDeliveries,
        },
        recentDeliveries,
        performanceMetrics: {
          onTimeDeliveryRate: parseFloat(onTimeDeliveryRate.toFixed(1)),
          averageFulfillmentTime,
          returnRate,
        },
        warehouseUtilization: warehouseData,
        distributionByRegion: regionData,
      };
      
      setDistributionData(dashboardData);
      setLoading(false);
      
      // Initialize charts after data is loaded
      initializeCharts(dashboardData);
    } catch (err) {
      console.error('Error fetching distribution data:', err);
      // Fall back to mock data if API fails
      const mockData = generateMockData(timeFrame);
      setDistributionData(mockData);
      setError("Could not fetch real data. Showing mock data instead.");
      setLoading(false);
      
      // Initialize charts with mock data
      initializeCharts(mockData);
    }
  };
  
  // Helper function to get priority from shipment data
  const getPriorityFromShipment = (shipment) => {
    // This is a simplified example - implement your own priority logic
    if (shipment.delivery_type === 'sales') {
      return 'High';
    } else if (shipment.delivery_type === 'service') {
      return 'Medium';
    } else {
      return 'Low';
    }
  };
  
  // Helper function to get warehouse data from shipments
  const getWarehouseDataFromShipments = (shipments) => {
    // Group shipments by source warehouse
    const warehouses = {};
    
    shipments.forEach(shipment => {
      const source = shipment.source_location || 'Unknown';
      if (!warehouses[source]) {
        warehouses[source] = {
          count: 0,
          capacity: 100, // Assuming a nominal capacity of 100 for each warehouse
        };
      }
      warehouses[source].count++;
    });
    
    // Calculate utilization percentage
    return Object.keys(warehouses).map(warehouse => {
      const utilizationPercentage = Math.min(
        Math.round((warehouses[warehouse].count / warehouses[warehouse].capacity) * 100),
        100
      );
      
      return {
        warehouse,
        utilizationPercentage,
      };
    });
  };
  
  // Helper function to get regional data from shipments
  const getRegionalDataFromShipments = (shipments) => {
    // Group destinations by region
    // This is a simplified approach - in a real system, you'd map addresses to actual regions
    const regions = {
      'East': 0,
      'West': 0,
      'North': 0,
      'South': 0,
    };
    
    shipments.forEach(shipment => {
      const destination = shipment.destination_location || '';
      
      if (destination.toLowerCase().includes('new york') || 
          destination.toLowerCase().includes('boston') ||
          destination.toLowerCase().includes('philadelphia')) {
        regions['East']++;
      } else if (destination.toLowerCase().includes('los angeles') || 
                destination.toLowerCase().includes('san francisco') ||
                destination.toLowerCase().includes('seattle')) {
        regions['West']++;
      } else if (destination.toLowerCase().includes('chicago') || 
                destination.toLowerCase().includes('detroit') ||
                destination.toLowerCase().includes('minneapolis')) {
        regions['North']++;
      } else if (destination.toLowerCase().includes('houston') || 
                destination.toLowerCase().includes('miami') ||
                destination.toLowerCase().includes('atlanta')) {
        regions['South']++;
      } else {
        // Distribute evenly if no match
        const regionKeys = Object.keys(regions);
        const randomRegion = regionKeys[Math.floor(Math.random() * regionKeys.length)];
        regions[randomRegion]++;
      }
    });
    
    // Convert to array format expected by chart
    return Object.keys(regions).map(region => ({
      region,
      count: regions[region]
    }));
  };
  
  // Helper function for time frame multiplier
  const getTimeFrameMultiplier = (timeFrame) => {
    switch (timeFrame) {
      case 'weekly':
        return 1;
      case 'monthly':
        return 4;
      case 'quarterly':
        return 12;
      case 'yearly':
        return 52;
      default:
        return 1;
    }
  };

  // Fetch data on component mount and when time filter changes
  useEffect(() => {
    // Use real data from API
    fetchRealData(timeFilter);
  }, [timeFilter]);
  
  // Handle time filter change
  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter recent deliveries based on search term
  const filteredDeliveries = distributionData.recentDeliveries.filter(delivery => {
    if (!searchTerm) return true;
    
    return (
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Initialize charts
  const initializeCharts = (data) => {
    // Distribution by region chart
    const regionCtx = document.getElementById('regionDistributionChart');
    if (regionCtx) {
      // Destroy existing chart if it exists
      const existingChart = Chart.getChart(regionCtx);
      if (existingChart) {
        existingChart.destroy();
      }
      
      new Chart(regionCtx, {
        type: 'bar',
        data: {
          labels: data.distributionByRegion.map(item => item.region),
          datasets: [{
            label: 'Deliveries by Region',
            data: data.distributionByRegion.map(item => item.count),
            backgroundColor: [
              'rgba(0, 168, 168, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
            ],
            borderColor: [
              'rgba(0, 168, 168, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
    
    // Warehouse utilization chart
    const warehouseCtx = document.getElementById('warehouseUtilizationChart');
    if (warehouseCtx) {
      // Destroy existing chart if it exists
      const existingChart = Chart.getChart(warehouseCtx);
      if (existingChart) {
        existingChart.destroy();
      }
      
      new Chart(warehouseCtx, {
        type: 'bar',
        data: {
          labels: data.warehouseUtilization.map(item => item.warehouse),
          datasets: [{
            label: 'Current Utilization (%)',
            data: data.warehouseUtilization.map(item => item.utilizationPercentage),
            backgroundColor: data.warehouseUtilization.map(item => 
              item.utilizationPercentage > 90 ? 'rgba(255, 99, 132, 0.7)' : 
              item.utilizationPercentage > 70 ? 'rgba(255, 206, 86, 0.7)' : 
              'rgba(75, 192, 192, 0.7)'
            ),
            borderColor: data.warehouseUtilization.map(item => 
              item.utilizationPercentage > 90 ? 'rgba(255, 99, 132, 1)' : 
              item.utilizationPercentage > 70 ? 'rgba(255, 206, 86, 1)' : 
              'rgba(75, 192, 192, 1)'
            ),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
    }
  };
  
  // Generate mock data for development and fallback
  const generateMockData = (timeFrame) => {
    // Adjust values based on time frame for more realistic data
    const multiplier = 
      timeFrame === 'weekly' ? 1 :
      timeFrame === 'monthly' ? 4 :
      timeFrame === 'quarterly' ? 12 :
      timeFrame === 'yearly' ? 52 : 1;
    
    return {
      metrics: {
        totalDeliveries: 125 * multiplier,
        pendingDeliveries: 18 * multiplier,
        completedDeliveries: 98 * multiplier,
        inTransit: 8 * multiplier,
        failedDeliveries: 1 * multiplier,
      },
      recentDeliveries: [
        { id: 'DEL-1001', date: '2025-04-12', destination: 'New York City', items: 12, status: 'Delivered', priority: 'High' },
        { id: 'DEL-1002', date: '2025-04-12', destination: 'Los Angeles', items: 8, status: 'In Transit', priority: 'Medium' },
        { id: 'DEL-1003', date: '2025-04-11', destination: 'Chicago', items: 5, status: 'Processing', priority: 'Low' },
        { id: 'DEL-1004', date: '2025-04-11', destination: 'Houston', items: 15, status: 'Delivered', priority: 'Medium' },
        { id: 'DEL-1005', date: '2025-04-10', destination: 'Miami', items: 3, status: 'Failed', priority: 'High' },
        { id: 'DEL-1006', date: '2025-04-10', destination: 'Seattle', items: 7, status: 'Delivered', priority: 'Low' },
        { id: 'DEL-1007', date: '2025-04-09', destination: 'Boston', items: 9, status: 'Delivered', priority: 'Medium' },
        { id: 'DEL-1008', date: '2025-04-09', destination: 'Atlanta', items: 4, status: 'In Transit', priority: 'High' },
      ],
      performanceMetrics: {
        onTimeDeliveryRate: 94.7,
        averageFulfillmentTime: 2.3,
        returnRate: 1.8,
      },
      warehouseUtilization: [
        { warehouse: 'Warehouse A', utilizationPercentage: 82 },
        { warehouse: 'Warehouse B', utilizationPercentage: 65 },
        { warehouse: 'Warehouse C', utilizationPercentage: 93 },
        { warehouse: 'Warehouse D', utilizationPercentage: 45 },
      ],
      distributionByRegion: [
        { region: 'East', count: 42 * multiplier },
        { region: 'West', count: 38 * multiplier },
        { region: 'North', count: 25 * multiplier },
        { region: 'South', count: 20 * multiplier },
      ],
    };
  };
  
  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'shipped':
      case 'in transit':
        return 'status-in-transit';
      case 'pending':
      case 'processing':
        return 'status-processing';
      case 'failed':
        return 'status-failed';
      default:
        return '';
    }
  };
  
  // Get priority color class
  const getPriorityColorClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };
  
  return (
    <div className="distribution">
      <div className="body-content-container">
        <h2 className="page-title">Distribution Dashboard</h2>
        
        {/* Filters Row */}
        <div className="filters-row">
          <div className="time-filter">
            <span className="filter-label">Time Period:</span>
            <div className="filter-buttons">
              <button 
                className={`filter-button ${timeFilter === 'weekly' ? 'active' : ''}`}
                onClick={() => handleTimeFilterChange('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`filter-button ${timeFilter === 'monthly' ? 'active' : ''}`}
                onClick={() => handleTimeFilterChange('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`filter-button ${timeFilter === 'quarterly' ? 'active' : ''}`}
                onClick={() => handleTimeFilterChange('quarterly')}
              >
                Quarterly
              </button>
              <button 
                className={`filter-button ${timeFilter === 'yearly' ? 'active' : ''}`}
                onClick={() => handleTimeFilterChange('yearly')}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>
        
        {/* Dashboard Content */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <AlertCircle size={32} className="error-icon" />
            <p className="error-message">{error}</p>
          </div>
        ) : (
          <div className="dashboard-content">
            {/* Metrics Row */}
            <div className="metrics-row">
              <div className="metric-card">
                <div className="metric-icon">
                  <Package size={24} />
                </div>
                <div className="metric-content">
                  <span className="metric-value">{distributionData.metrics.totalDeliveries}</span>
                  <span className="metric-label">Total Deliveries</span>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">
                  <Truck size={24} />
                </div>
                <div className="metric-content">
                  <span className="metric-value">{distributionData.metrics.inTransit}</span>
                  <span className="metric-label">In Transit</span>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon processing">
                  <Package size={24} />
                </div>
                <div className="metric-content">
                  <span className="metric-value">{distributionData.metrics.pendingDeliveries}</span>
                  <span className="metric-label">Pending</span>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon completed">
                  <Package size={24} />
                </div>
                <div className="metric-content">
                  <span className="metric-value">{distributionData.metrics.completedDeliveries}</span>
                  <span className="metric-label">Completed</span>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon failed">
                  <AlertCircle size={24} />
                </div>
                <div className="metric-content">
                  <span className="metric-value">{distributionData.metrics.failedDeliveries}</span>
                  <span className="metric-label">Failed</span>
                </div>
              </div>
            </div>
            
            {/* Performance Metrics */}
            <div className="performance-section">
              <h3 className="section-title">Performance Metrics</h3>
              <div className="performance-metrics">
                <div className="performance-metric">
                  <div className="performance-icon">
                    <TrendingUp size={20} />
                  </div>
                  <div className="performance-content">
                    <span className="performance-value">{distributionData.performanceMetrics.onTimeDeliveryRate}%</span>
                    <span className="performance-label">On-Time Delivery Rate</span>
                  </div>
                </div>
                
                <div className="performance-metric">
                  <div className="performance-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="performance-content">
                    <span className="performance-value">{distributionData.performanceMetrics.averageFulfillmentTime} days</span>
                    <span className="performance-label">Avg. Fulfillment Time</span>
                  </div>
                </div>
                
                <div className="performance-metric">
                  <div className="performance-icon">
                    <BarChart2 size={20} />
                  </div>
                  <div className="performance-content">
                    <span className="performance-value">{distributionData.performanceMetrics.returnRate}%</span>
                    <span className="performance-label">Return Rate</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Two Column Layout */}
            <div className="dashboard-columns">
              {/* Recent Deliveries */}
              <div className="dashboard-column">
                <div className="dashboard-card">
                  <h3 className="card-title">Recent Deliveries</h3>
                  <div className="search-container" style={{ marginBottom: '10px' }}>
                    <Search className="search-icon" size={16} />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search deliveries..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div className="recent-deliveries-table-container">
                    <table className="recent-deliveries-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Date</th>
                          <th>Destination</th>
                          <th>Items</th>
                          <th>Status</th>
                          <th>Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDeliveries.length > 0 ? (
                          filteredDeliveries.map((delivery, index) => (
                            <tr key={delivery.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                              <td>{delivery.id}</td>
                              <td>{delivery.date}</td>
                              <td>{delivery.destination}</td>
                              <td className="centered-cell">{delivery.items}</td>
                              <td>
                                <span className={`status-badge ${getStatusColorClass(delivery.status)}`}>
                                  {delivery.status}
                                </span>
                              </td>
                              <td>
                                <span className={`priority-badge ${getPriorityColorClass(delivery.priority)}`}>
                                  {delivery.priority}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="no-data">No deliveries found matching your search.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Charts Column */}
              <div className="dashboard-column">
                {/* Distribution by Region */}
                <div className="dashboard-card">
                  <h3 className="card-title">Distribution by Region</h3>
                  <div className="chart-container">
                    <canvas id="regionDistributionChart"></canvas>
                  </div>
                </div>
                
                {/* Warehouse Utilization */}
                <div className="dashboard-card">
                  <h3 className="card-title">Warehouse Utilization</h3>
                  <div className="chart-container">
                    <canvas id="warehouseUtilizationChart"></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Module Links */}
            <div className="module-links-section">
              <h3 className="section-title">Quick Access</h3>
              <div className="module-links">
                <div 
                  className="module-link-card" 
                  onClick={() => navigateToSubmodule("Internal Delivery")}
                >
                  <div className="module-link-icon">
                    <Truck size={24} />
                  </div>
                  <div className="module-link-content">
                    <span className="module-link-title">Internal Delivery</span>
                    <span className="module-link-description">Manage internal deliveries</span>
                  </div>
                </div>
                
                <div 
                  className="module-link-card" 
                  onClick={() => navigateToSubmodule("External Delivery")}
                >
                  <div className="module-link-icon">
                    <Truck size={24} />
                  </div>
                  <div className="module-link-content">
                    <span className="module-link-title">External Delivery</span>
                    <span className="module-link-description">Manage customer and service deliveries</span>
                  </div>
                </div>
                
                <div 
                  className="module-link-card" 
                  onClick={() => navigateToSubmodule("Shipment")}
                >
                  <div className="module-link-icon">
                    <Package size={24} />
                  </div>
                  <div className="module-link-content">
                    <span className="module-link-title">Shipment</span>
                    <span className="module-link-description">Track and manage all shipments</span>
                  </div>
                </div>
                
                <div 
                  className="module-link-card" 
                  onClick={() => navigateToSubmodule("Picking")}
                >
                  <div className="module-link-icon">
                    <Users size={24} />
                  </div>
                  <div className="module-link-content">
                    <span className="module-link-title">Picking</span>
                    <span className="module-link-description">Manage item picking process</span>
                  </div>
                </div>

                <div 
                  className="module-link-card" 
                  onClick={() => navigateToSubmodule("Packing")}
                >
                  <div className="module-link-icon">
                    <Box size={24} />
                  </div>
                  <div className="module-link-content">
                    <span className="module-link-title">Packing</span>
                    <span className="module-link-description">Manage item packing process</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Distribution;