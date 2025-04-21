// Picking.jsx
import React, { useState, useEffect } from "react";
import "../styles/Picking.css";
import PickingTable from "../components/picking/PickingTable";
import StatusFilter from "../components/picking/StatusFilter";
import WarehouseFilter from "../components/picking/WarehouseFilter";
import CompletionModal from "../components/picking/CompletionModal";
import EditPickingModal from "../components/picking/EditPickingModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Picking = () => {
  // State for data management
  const [pickingLists, setPickingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  
  // State for filtering
  const [statusFilter, setStatusFilter] = useState("All");
  const [warehouseFilter, setWarehouseFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for action management
  const [selectedList, setSelectedList] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch data on component mount and when refreshTrigger changes
  useEffect(() => {
    const fetchPickingLists = async () => {
      try {
        setLoading(true);
        setError(null);
        // const response = await fetch('https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-lists/');
        const response = await fetch('https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-lists/');
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication error. Please login again.');
          } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch picking lists');
          }
        }
        
        const data = await response.json();
        setPickingLists(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching picking lists:', err);
      }
    };
  
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/employees/');
        
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
  
    const fetchWarehouses = async () => {
      try {
        const response = await fetch('https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/warehouses/');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch warehouses');
        }
        
        const data = await response.json();
        console.log('Fetched warehouses from API:', data); // Debug line
        setWarehouses(data);
      } catch (err) {
        console.error('Error fetching warehouses:', err);
      }
    };
  
    // First fetch the picking lists and employees
    fetchPickingLists();
    fetchEmployees();
    
    // Then fetch warehouses separately (and don't derive from picking lists)
    fetchWarehouses();
  }, [refreshTrigger]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };
  
  // Handle warehouse filter change
  const handleWarehouseFilterChange = (warehouse) => {
    setWarehouseFilter(warehouse);
  };
  
  // Apply filters to picking lists
  const filteredLists = pickingLists.filter(list => {
    // Apply status filter
    if (statusFilter !== "All" && list.picked_status !== statusFilter) {
      return false;
    }
    
    // Apply warehouse filter
    if (warehouseFilter !== "All" && list.warehouse_id !== warehouseFilter) {
      return false;
    }
    
    // Apply search filter (search by picking_list_id or delivery_id)
    if (searchTerm && !list.picking_list_id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !String(list.delivery_id || '').toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Handle list selection - now opens the edit modal
  const handleListSelect = (list) => {
    setSelectedList(list);
    setShowEditModal(true);
  };
  
  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
  
  // Handle save changes from the edit modal
  const handleSaveChanges = async (list, updates) => {
    if (Object.keys(updates).length === 0) {
      setShowEditModal(false);
      return;
    }
    
    try {
      const response = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-lists/${list.picking_list_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update picking list');
      }
      
      // Refresh the list after successful update
      setRefreshTrigger(prev => prev + 1);
      setShowEditModal(false);
      toast.success("Picking list updated successfully!");
      
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };
  
  // Handle status update
  const handleStatusUpdate = async (list, newStatus, employeeId, warehouseId) => {
    try {
      // Build the update object
      const updateData = {
        picked_status: newStatus === 'Completed' ? 'In Progress' : newStatus // Don't set Completed yet
      };
      
      // Add employee and warehouse if they changed
      if (employeeId && employeeId !== list.picked_by) {
        updateData.picked_by = employeeId;
      }
      
      // Always update warehouse if this is an external delivery and the warehouse changed
      if (list.is_external && warehouseId && warehouseId !== list.warehouse_id) {
        updateData.warehouse_id = warehouseId;
      }
  
      // Always make the API call when status changes (or when completing)
      const response = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-lists/${list.picking_list_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update picking list status');
      }
  
      // Find the warehouse name for the updated warehouse ID
      const warehouseName = warehouses.find(w => w.id === (warehouseId || list.warehouse_id))?.name || list.warehouse_name;
  
      // Update the selectedList with the new values so completion modal has the latest data
      setSelectedList(prev => ({
        ...prev,
        picked_by: employeeId || prev.picked_by,
        warehouse_id: warehouseId || prev.warehouse_id,
        warehouse_name: warehouseName,
        picked_status: updateData.picked_status
      }));
      
      // Refresh the list after successful update (only if not going to completion)
      if (newStatus !== 'Completed') {
        setRefreshTrigger(prev => prev + 1);
        setShowEditModal(false);
        toast.info(`Status updated to ${newStatus}`);
      }
      
      // If trying to mark as Completed, show the completion modal
      if (newStatus === 'Completed') {
        setShowEditModal(false);
        setShowCompletionModal(true);
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };
  
  // Handle completion confirmation
  const handleConfirmCompletion = async () => {
    if (!selectedList || !showCompletionModal) return;
    
    try {
      // Get the current employee and warehouse selections from the modal
      // Since the modal is closed at this point, we'll use the selectedList data
      const response = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-lists/${selectedList.picking_list_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          picked_status: 'Completed'
          // We don't include employee/warehouse here because the completion modal
          // is shown after the edit modal is closed, so any changes were already saved
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete picking list');
      }
      
      // Close modal and refresh the list
      setShowCompletionModal(false);
      setRefreshTrigger(prev => prev + 1);
      
      // Show success notification
      toast.success('Picking list completed successfully! A new Packing List has been created.', {
        autoClose: 5000 // Keep this message visible a bit longer
      });
      
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };
  
  return (
    <div className="picking">
      <div className="body-content-container">
        <h2 className="page-title">Picking Lists</h2>

        {/* Add ToastContainer component */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} 
          newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

        {/* Filters Row */}
        <div className="filters-row">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by Picking ID or Delivery ID..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <StatusFilter 
            selectedStatus={statusFilter}
            onStatusChange={handleStatusFilterChange}
          />
          
          <WarehouseFilter 
            warehouses={warehouses}
            selectedWarehouse={warehouseFilter}
            onWarehouseChange={handleWarehouseFilterChange}
          />
        </div>
        
        {/* Statistics Row */}
        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-label">Total Lists:</span>
            <span className="stat-value">{pickingLists.length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Not Started:</span>
            <span className="stat-value">
              {pickingLists.filter(list => list.picked_status === 'Not Started').length}
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-label">In Progress:</span>
            <span className="stat-value">
              {pickingLists.filter(list => list.picked_status === 'In Progress').length}
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Completed:</span>
            <span className="stat-value">
              {pickingLists.filter(list => list.picked_status === 'Completed').length}
            </span>
          </div>
        </div>
        
        {/* Picking Table */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading picking lists...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">Error: {error}</p>
          </div>
        ) : (
          <div className="picking-content">
            <PickingTable 
              pickingLists={filteredLists} 
              onListSelect={handleListSelect} 
              selectedList={selectedList}
              employees={employees}
            />
          </div>
        )}
        
        {/* Edit Modal */}
        {showEditModal && selectedList && (
          <EditPickingModal 
            pickingList={selectedList}
            employees={employees}
            warehouses={warehouses}
            onClose={handleCloseEditModal}
            onSave={handleSaveChanges}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
        
        {/* Completion Confirmation Modal */}
        {showCompletionModal && selectedList && (
          <CompletionModal 
            pickingList={selectedList}
            employees={employees}
            warehouses={warehouses}
            onConfirm={handleConfirmCompletion}
            onCancel={() => setShowCompletionModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Picking;