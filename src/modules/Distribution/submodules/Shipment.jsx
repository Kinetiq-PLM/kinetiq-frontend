import React, { useState, useEffect } from "react";
import "../styles/Shipment.css";
import ShipmentTable from "../components/shipment/ShipmentTable";
import FailedShipmentsTable from "../components/shipment/FailedShipmentsTable";
import DeliveredShipmentsTable from "../components/shipment/DeliveredShipmentsTable";
import StatusFilter from "../components/shipment/StatusFilter";
import CarrierFilter from "../components/shipment/CarrierFilter";
import DeliveryTypeFilter from "../components/shipment/DeliveryTypeFilter";
import ShipmentModal from "../components/shipment/ShipmentModal";
import ConfirmShipModal from "../components/shipment/ConfirmShipModal";
import DeliveryReceiptModal from "../components/shipment/DeliveryReceiptModal";
import FailureReportModal from "../components/shipment/FailureReportModal";
import CarrierManagementModal from "../components/shipment/CarrierManagementModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Shipment = () => {
  // Tab state - now with three options
  const [activeTab, setActiveTab] = useState("shipments"); // "shipments", "delivered", or "failed"
  
  // State for data management
  const [shipments, setShipments] = useState([]);
  const [failedShipments, setFailedShipments] = useState([]);
  const [deliveredShipments, setDeliveredShipments] = useState([]); // New state for delivered shipments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carriers, setCarriers] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  // State for filtering
  const [statusFilter, setStatusFilter] = useState("All");
  const [carrierFilter, setCarrierFilter] = useState("All");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for action management
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [showConfirmShipModal, setShowConfirmShipModal] = useState(false);
  const [showDeliveryReceiptModal, setShowDeliveryReceiptModal] = useState(false);
  const [showFailureReportModal, setShowFailureReportModal] = useState(false);
  const [showCarrierManagementModal, setShowCarrierManagementModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch data on component mount and when refreshTrigger changes
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        const response = await fetch('http://127.0.0.1:8000/api/shipments/');
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication error. Please login again.');
          } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch shipments');
          }
        }
        
        const data = await response.json();
        
        // Separate shipments by status
        const delivered = data.filter(s => s.shipment_status === 'Delivered');
        const active = data.filter(s => s.shipment_status !== 'Failed' && s.shipment_status !== 'Delivered');
        
        setDeliveredShipments(delivered);
        setShipments(active);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching shipments:', err);
      }
    };
  
    const fetchFailedShipments = async () => {
      try {
        // Use the dedicated endpoint for failed shipments
        const response = await fetch('http://127.0.0.1:8000/api/failed-shipments/');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch failed shipments');
        }
        
        const data = await response.json();
        setFailedShipments(data);
      } catch (err) {
        console.error('Error fetching failed shipments:', err);
        // Don't set error state as the main shipments might have loaded successfully
      } finally {
        setLoading(false);
      }
    };
  
    const fetchCarriers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/carriers/');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch carriers');
        }
        
        const data = await response.json();
        setCarriers(data);
      } catch (err) {
        console.error('Error fetching carriers:', err);
      }
    };

    // Function to fetch employees
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/employees/');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch employees');
        }
        
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };
  
    fetchShipments();
    fetchFailedShipments();
    fetchCarriers();
    fetchEmployees();
  }, [refreshTrigger]);
  
  // Get employee full name by employee id
  const getEmployeeFullName = (employeeId) => {
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId; // Fallback to ID if employee not found
  };
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Reset filters when changing tabs
    if (tab !== 'shipments') {
      setStatusFilter('All');
      setCarrierFilter('All');
      setDeliveryTypeFilter('All');
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };
  
  // Handle carrier filter change
  const handleCarrierFilterChange = (carrier) => {
    setCarrierFilter(carrier);
  };
  
  // Handle delivery type filter change
  const handleDeliveryTypeFilterChange = (type) => {
    setDeliveryTypeFilter(type);
  };
  
  // Apply filters to active shipments
  const filteredShipments = shipments.filter(shipment => {
    // Apply status filter
    if (statusFilter !== "All" && shipment.shipment_status !== statusFilter) {
      return false;
    }
    
    // Apply carrier filter
    if (carrierFilter !== "All" && shipment.carrier_id !== carrierFilter) {
      return false;
    }
    
    // Apply delivery type filter
    if (deliveryTypeFilter !== "All" && shipment.delivery_type !== deliveryTypeFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm && 
        !shipment.shipment_id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !String(shipment.delivery_id || '').toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Apply search filter to delivered shipments
  const filteredDeliveredShipments = deliveredShipments.filter(shipment => {
    if (!searchTerm) return true;
    
    return (
      shipment.shipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(shipment.delivery_id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Apply only search filter to failed shipments
  const filteredFailedShipments = failedShipments.filter(failedShipment => {
    if (!searchTerm) return true;
    
    // Get shipment details if available
    const shipmentDetails = failedShipment.shipment_details || {};
  
    // Search in both failed shipment and shipment details
    return (
      failedShipment.failed_shipment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipmentDetails.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(shipmentDetails.delivery_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      failedShipment.failure_reason?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Handle shipment selection
  const handleShipmentSelect = (shipment) => {
    setSelectedShipment(shipment);
    setShowShipmentModal(true);
  };
  
  // Handle closing the shipment modal
  const handleCloseShipmentModal = () => {
    setShowShipmentModal(false);
  };
  
  // Handle save changes from the shipment modal
  const handleSaveChanges = async (shipment, updates) => {
    if (Object.keys(updates).length === 0) {
      setShowShipmentModal(false);
      return;
    }
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/shipments/${shipment.shipment_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update shipment');
      }
      
      // Refresh the list after successful update
      setRefreshTrigger(prev => prev + 1);
      setShowShipmentModal(false);
      toast.success("Shipment updated successfully!");
      
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };
  
  // Handle ship status update
  const handleShipStatusUpdate = async (shipment, formData = {}) => {
    try {
      // First, save any changes to the shipment
      if (Object.keys(formData).length > 0) {
        const updateResponse = await fetch(`http://127.0.0.1:8000/api/shipments/${shipment.shipment_id}/update/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          throw new Error(errorData.error || 'Failed to update shipment details');
        }
        
        // Update the selected shipment with the new values
        // This ensures the confirmation modal has the latest data
        const updatedShipment = {
          ...shipment,
          ...formData
        };
        
        // If carrier_id was updated, find the carrier name
        if (formData.carrier_id) {
          const carrier = carriers.find(c => c.carrier_id === formData.carrier_id);
          if (carrier) {
            updatedShipment.carrier_name = getEmployeeFullName(carrier.carrier_name);
          }
        }
        
        setSelectedShipment(updatedShipment);
      }
      
      // Now show the confirmation modal
      setShowShipmentModal(false);
      setShowConfirmShipModal(true);
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };
  
  // Handle confirming shipment
  const handleConfirmShipment = async () => {
    if (!selectedShipment) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/shipments/${selectedShipment.shipment_id}/ship/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipment_status: 'Shipped'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mark shipment as shipped');
      }
      
      // Close modal and refresh the list
      setShowConfirmShipModal(false);
      setRefreshTrigger(prev => prev + 1);
      
      // Show success notification
      toast.success('Shipment marked as Shipped successfully! A delivery receipt has been created.', {
        autoClose: 5000 // Keep this message visible a bit longer
      });
      
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };
  
  // Handle showing delivery receipt modal
  const handleShowDeliveryReceipt = (shipment) => {
    setSelectedShipment(shipment);
    setShowShipmentModal(false);
    setShowDeliveryReceiptModal(true);
  };
  
  // Handle updating delivery receipt
  const handleUpdateDeliveryReceipt = async (deliveryReceipt) => {
    if (!selectedShipment) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delivery-receipts/${deliveryReceipt.delivery_receipt_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deliveryReceipt),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update delivery receipt');
      }
      
      // Close modal and refresh the list
      setShowDeliveryReceiptModal(false);
      setRefreshTrigger(prev => prev + 1);
      toast.success("Delivery receipt updated successfully!");
      
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };
  
  // Handle report failure
  const handleReportFailure = (shipment) => {
    setSelectedShipment(shipment);
    setShowShipmentModal(false);
    setShowFailureReportModal(true);
  };
  
  // Handle submitting failure report
  const handleSubmitFailureReport = async (failureDetails) => {
    if (!selectedShipment) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/shipments/${selectedShipment.shipment_id}/fail/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipment_status: 'Failed',
          failure_reason: failureDetails.failure_reason
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to report shipment failure');
      }
      
      // Close modal and refresh the list
      setShowFailureReportModal(false);
      setRefreshTrigger(prev => prev + 1);
      toast.warning(`Shipment marked as failed: ${failureDetails.failure_reason}`);
      
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };
  
  // Refresh carriers
  const refreshCarriers = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Calculate stats for the shipments tab
  const shipmentStats = {
    total: shipments.length,
    pending: shipments.filter(shipment => shipment.shipment_status === 'Pending').length,
    shipped: shipments.filter(shipment => shipment.shipment_status === 'Shipped').length,
    delivered: shipments.filter(shipment => shipment.shipment_status === 'Delivered').length
  };
  
  // Calculate stats for the failed shipments tab
  const failedStats = {
    total: failedShipments.length,
    pending: failedShipments.filter(shipment => 
      shipment.failed_shipment_info?.resolution_status === 'Pending').length,
    inProgress: failedShipments.filter(shipment => 
      shipment.failed_shipment_info?.resolution_status === 'In Progress').length,
    resolved: failedShipments.filter(shipment => 
      shipment.failed_shipment_info?.resolution_status === 'Resolved').length
  };

  // Calculate stats for the delivered shipments tab
  const deliveredStats = {
    total: deliveredShipments.length,
    onTime: deliveredShipments.filter(shipment => shipment.delivery_status === 'On Time').length,
    late: deliveredShipments.filter(shipment => shipment.delivery_status === 'Late').length,
    rejected: deliveredShipments.filter(shipment => shipment.delivery_status === 'Rejected').length
  };
  
  return (
    <div className="shipment">
      <div className="body-content-container">
        <h2 className="page-title">Shipment Management</h2>

        {/* Add ToastContainer component */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} 
          newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <div 
            className={`tab ${activeTab === "shipments" ? "active" : ""}`}
            onClick={() => handleTabChange("shipments")}
          >
            Active Shipments
          </div>
          <div 
            className={`tab ${activeTab === "delivered" ? "active" : ""}`}
            onClick={() => handleTabChange("delivered")}
          >
            Delivered Shipments
          </div>
          <div 
            className={`tab ${activeTab === "failed" ? "active" : ""}`}
            onClick={() => handleTabChange("failed")}
          >
            Failed Shipments
          </div>
        </div>
        
        {/* Filters Row */}
        <div className="filters-row">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder={
                activeTab === "shipments" 
                  ? "Search by Shipment ID, Tracking #, or Delivery ID..." 
                  : activeTab === "delivered"
                    ? "Search delivered shipments..."
                    : "Search failed shipments..."
              }
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Only show these filters in the Shipments tab */}
          {activeTab === "shipments" && (
            <>
              <StatusFilter 
                selectedStatus={statusFilter}
                onStatusChange={handleStatusFilterChange}
                showDelivered={false} 
              />
              
              <CarrierFilter 
                carriers={carriers}
                employees={employees}
                selectedCarrier={carrierFilter}
                onCarrierChange={handleCarrierFilterChange}
                getEmployeeFullName={getEmployeeFullName}
              />
              
              <DeliveryTypeFilter 
                selectedType={deliveryTypeFilter}
                onTypeChange={handleDeliveryTypeFilterChange}
              />
              
              <button 
                type="button" 
                className="save-button"
                onClick={() => setShowCarrierManagementModal(true)}
                style={{ marginLeft: 'auto' }}
              >
                Manage Carriers
              </button>
            </>
          )}
        </div>
        
        {/* Statistics Row - different stats for each tab */}
        <div className="stats-row">
          {activeTab === "shipments" ? (
            <>
              <div className="stat-box">
                <span className="stat-label">Total Active Shipments:</span>
                <span className="stat-value">{shipmentStats.total}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Pending:</span>
                <span className="stat-value">{shipmentStats.pending}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">In Transit:</span>
                <span className="stat-value">{shipmentStats.shipped}</span>
              </div>
            </>
          ) : activeTab === "delivered" ? (
            <>
              <div className="stat-box">
                <span className="stat-label">Total Deliveries:</span>
                <span className="stat-value">{deliveredStats.total}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">On-Time:</span>
                <span className="stat-value">{deliveredStats.onTime}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Late:</span>
                <span className="stat-value">{deliveredStats.late}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Rejected:</span>
                <span className="stat-value">{deliveredStats.rejected}</span>
              </div>
            </>
          ) : (
            <>
              <div className="stat-box">
                <span className="stat-label">Failed Shipments:</span>
                <span className="stat-value">{failedStats.total}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Pending Resolution:</span>
                <span className="stat-value">{failedStats.pending}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">In Progress:</span>
                <span className="stat-value">{failedStats.inProgress}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Resolved:</span>
                <span className="stat-value">{failedStats.resolved}</span>
              </div>
            </>
          )}
        </div>
        
        {/* Content based on active tab */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading shipments...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">Error: {error}</p>
          </div>
        ) : (
          <div className="shipment-content">
            {activeTab === "shipments" ? (
              <ShipmentTable 
                shipments={filteredShipments} 
                onShipmentSelect={handleShipmentSelect} 
                selectedShipment={selectedShipment}
                carriers={carriers}
                employees={employees}
                getEmployeeFullName={getEmployeeFullName}
              />
            ) : activeTab === "delivered" ? (
              <DeliveredShipmentsTable
                shipments={filteredDeliveredShipments}
                onShipmentSelect={handleShipmentSelect}
                selectedShipment={selectedShipment}
                carriers={carriers}
                employees={employees}
                getEmployeeFullName={getEmployeeFullName}
              />
            ) : (
              <FailedShipmentsTable 
                failedShipments={filteredFailedShipments}
                onShipmentSelect={handleShipmentSelect}
                selectedShipment={selectedShipment}
                carriers={carriers}
                employees={employees}
                getEmployeeFullName={getEmployeeFullName}
              />
            )}
          </div>
        )}
        
        {/* Modals remain the same */}
        {showShipmentModal && selectedShipment && (
          <ShipmentModal 
            shipment={selectedShipment}
            carriers={carriers}
            employees={employees}
            getEmployeeFullName={getEmployeeFullName}
            onClose={() => setShowShipmentModal(false)}
            onSave={handleSaveChanges}
            onShip={handleShipStatusUpdate}
            onShowDeliveryReceipt={handleShowDeliveryReceipt}
            onReportFailure={handleReportFailure}
          />
        )}
        
        {showConfirmShipModal && selectedShipment && (
          <ConfirmShipModal 
            shipment={selectedShipment}
            onConfirm={handleConfirmShipment}
            onCancel={() => setShowConfirmShipModal(false)}
          />
        )}
        
        {showDeliveryReceiptModal && selectedShipment && (
          <DeliveryReceiptModal 
            shipment={selectedShipment}
            onSave={handleUpdateDeliveryReceipt}
            onCancel={() => setShowDeliveryReceiptModal(false)}
          />
        )}
        
        {showFailureReportModal && selectedShipment && (
          <FailureReportModal 
            shipment={selectedShipment}
            onSubmit={handleSubmitFailureReport}
            onCancel={() => setShowFailureReportModal(false)}
          />
        )}
        
        {showCarrierManagementModal && (
          <CarrierManagementModal 
            carriers={carriers}
            employees={employees}
            refreshCarriers={refreshCarriers}
            onClose={() => setShowCarrierManagementModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Shipment;