// Rework.jsx
import React, { useState, useEffect } from "react";
import "../styles/Rework.css";
import ReworkTable from "../components/rework/ReworkTable";
import StatusFilter from "../components/rework/StatusFilter";
import TypeFilter from "../components/rework/TypeFilter";
import ReworkModal from "../components/rework/ReworkModal";
import AssignModal from "../components/rework/AssignModal";
import CompleteModal from "../components/rework/CompleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Rework = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "completed"
  
  // State for data management
  const [reworks, setReworks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filtering
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for action management
  const [selectedRework, setSelectedRework] = useState(null);
  const [showReworkModal, setShowReworkModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch data on component mount and when refreshTrigger changes
  useEffect(() => {
    const fetchReworks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://127.0.0.1:8000/api/reworks/');
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication error. Please login again.');
          } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch rework orders');
          }
        }
        
        const data = await response.json();
        setReworks(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching rework orders:', err);
      }
    };

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

    fetchReworks();
    fetchEmployees();
  }, [refreshTrigger]);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };
  
  // Handle type filter change
  const handleTypeFilterChange = (type) => {
    setTypeFilter(type);
  };
  
  // Filter reworks based on activeTab, statusFilter, typeFilter, and searchTerm
  const filteredReworks = reworks.filter(rework => {
    // Filter by tab first
    if (activeTab === "pending" && rework.rework_status === "Completed") {
      return false;
    }
    
    if (activeTab === "completed" && rework.rework_status !== "Completed") {
      return false;
    }
    
    // Apply status filter
    if (statusFilter !== "All" && rework.rework_status !== statusFilter) {
      return false;
    }
    
    // Apply type filter
    if (typeFilter !== "All" && rework.rework_types !== typeFilter) {
      return false;
    }
    
    // Apply search filter (search by rework_id, assigned_to, or order_id)
    if (searchTerm && 
        !rework.rework_id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(rework.assigned_to || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(rework.original_order_info?.order_id || '').toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Calculate stats for pending tab
  const pendingStats = {
    total: reworks.filter(r => r.rework_status !== "Completed").length,
    pending: reworks.filter(r => r.rework_status === "Pending").length,
    inProgress: reworks.filter(r => r.rework_status === "In Progress").length,
    rejection: reworks.filter(r => r.rework_types === "Rejection" && r.rework_status !== "Completed").length,
    failedShipment: reworks.filter(r => r.rework_types === "Failed Shipment" && r.rework_status !== "Completed").length
  };
  
  // Calculate stats for completed tab
  const completedStats = {
    total: reworks.filter(r => r.rework_status === "Completed").length,
    rejection: reworks.filter(r => r.rework_types === "Rejection" && r.rework_status === "Completed").length,
    failedShipment: reworks.filter(r => r.rework_types === "Failed Shipment" && r.rework_status === "Completed").length
  };
  
  // Handle rework selection
  const handleReworkSelect = (rework) => {
    setSelectedRework(rework);
    setShowReworkModal(true);
  };
  
  // Handle closing the rework modal
  const handleCloseReworkModal = () => {
    setShowReworkModal(false);
  };
  
  // Handle assign action
  const handleAssignAction = (rework) => {
    setSelectedRework(rework);
    setShowReworkModal(false);
    setShowAssignModal(true);
  };
  
  // Handle assigning a rework to an employee
  const handleAssignRework = async (employeeId) => {
    if (!selectedRework) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reworks/${selectedRework.rework_id}/assign/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assigned_to: employeeId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign rework');
      }
      
      // Close modal and refresh the list
      setShowAssignModal(false);
      setRefreshTrigger(prev => prev + 1);
      
      // Show success notification
      toast.success('Rework assigned successfully!');
      
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };
  
  // Handle complete action
  const handleCompleteAction = (rework) => {
    setSelectedRework(rework);
    setShowReworkModal(false);
    setShowCompleteModal(true);
  };
  
  // Handle completing a rework
  const handleCompleteRework = async () => {
    if (!selectedRework) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reworks/${selectedRework.rework_id}/complete/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete rework');
      }
      
      // Close modal and refresh the list
      setShowCompleteModal(false);
      setRefreshTrigger(prev => prev + 1);
      
      // Show success notification
      toast.success('Rework marked as completed successfully!');
      
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };
  
  // Handle status update
  const handleStatusUpdate = async (rework, newStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reworks/${rework.rework_id}/update-status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rework_status: newStatus
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update rework status');
      }
      
      // Refresh the list
      setRefreshTrigger(prev => prev + 1);
      
      // Show success notification
      toast.success(`Rework status updated to ${newStatus} successfully!`);
      
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };
  
  return (
    <div className="rework">
      <div className="body-content-container">
        <h2 className="page-title">Rework Management</h2>
        
        {/* Add ToastContainer component */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} 
          newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <div 
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => handleTabChange("pending")}
          >
            Pending Reworks
          </div>
          <div 
            className={`tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => handleTabChange("completed")}
          >
            Completed Reworks
          </div>
        </div>
        
        {/* Filters Row */}
        <div className="filters-row">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by Rework ID, Assigned To, or Order ID..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <StatusFilter 
            selectedStatus={statusFilter}
            onStatusChange={handleStatusFilterChange}
            showCompleted={activeTab === "completed"}
          />
          
          <TypeFilter 
            selectedType={typeFilter}
            onTypeChange={handleTypeFilterChange}
          />
        </div>
        
        {/* Statistics Row - different stats for each tab */}
        <div className="stats-row">
          {activeTab === "pending" ? (
            <>
              <div className="stat-box">
                <span className="stat-label">Total Pending Reworks:</span>
                <span className="stat-value">{pendingStats.total}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Pending:</span>
                <span className="stat-value">{pendingStats.pending}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">In Progress:</span>
                <span className="stat-value">{pendingStats.inProgress}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Rejections:</span>
                <span className="stat-value">{pendingStats.rejection}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Failed Shipments:</span>
                <span className="stat-value">{pendingStats.failedShipment}</span>
              </div>
            </>
          ) : (
            <>
              <div className="stat-box">
                <span className="stat-label">Total Completed:</span>
                <span className="stat-value">{completedStats.total}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Rejections:</span>
                <span className="stat-value">{completedStats.rejection}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Failed Shipments:</span>
                <span className="stat-value">{completedStats.failedShipment}</span>
              </div>
            </>
          )}
        </div>
        
        {/* Content based on active tab */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading rework orders...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">Error: {error}</p>
          </div>
        ) : (
          <div className="rework-content">
            <ReworkTable 
              reworks={filteredReworks} 
              onReworkSelect={handleReworkSelect} 
              selectedRework={selectedRework}
              employees={employees}
              onStatusUpdate={handleStatusUpdate}
              showCompleted={activeTab === "completed"}
            />
          </div>
        )}
        
        {/* Modals */}
        {showReworkModal && selectedRework && (
          <ReworkModal 
            rework={selectedRework}
            employees={employees}
            onClose={handleCloseReworkModal}
            onAssign={handleAssignAction}
            onComplete={handleCompleteAction}
          />
        )}
        
        {showAssignModal && selectedRework && (
          <AssignModal 
            rework={selectedRework}
            employees={employees}
            onAssign={handleAssignRework}
            onCancel={() => setShowAssignModal(false)}
          />
        )}
        
        {showCompleteModal && selectedRework && (
          <CompleteModal 
            rework={selectedRework}
            onConfirm={handleCompleteRework}
            onCancel={() => setShowCompleteModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Rework;