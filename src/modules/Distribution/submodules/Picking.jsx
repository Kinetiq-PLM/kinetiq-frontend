// Picking.jsx
import React, { useState, useEffect } from "react";
import "../styles/Picking.css";
import PickingTable from "../components/picking/PickingTable";
import StatusFilter from "../components/picking/StatusFilter";
import WarehouseFilter from "../components/picking/WarehouseFilter";
import CompletionModal from "../components/picking/CompletionModal";
import EditPickingModal from "../components/picking/EditPickingModal";

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
        setError(null); // Reset error state
        const response = await fetch('http://127.0.0.1:8000/api/picking-lists/');
        
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
        
        // Extract unique warehouses for filtering
        const uniqueWarehouses = [...new Set(data
          .filter(list => list.warehouse_name)
          .map(list => ({ 
            id: list.warehouse_id, 
            name: list.warehouse_name 
          }))
          .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
        )];
        
        setWarehouses(uniqueWarehouses);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching picking lists:', err);
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

    const fetchWarehouses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/warehouses/');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch warehouses');
        }
        
        const data = await response.json();
        setWarehouses(data);
      } catch (err) {
        console.error('Error fetching warehouses:', err);
      }
    };

    fetchPickingLists();
    fetchEmployees();
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
      const response = await fetch(`http://127.0.0.1:8000/api/picking-lists/${list.picking_list_id}/update/`, {
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
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
  
  // Handle status update
  const handleStatusUpdate = async (list, newStatus) => {
    try {
      // If trying to mark as Completed, show the confirmation modal first
      if (newStatus === 'Completed') {
        setShowEditModal(false);
        setShowCompletionModal(true);
        return;
      }
      
      const response = await fetch(`http://127.0.0.1:8000/api/picking-lists/${list.picking_list_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          picked_status: newStatus
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update picking list status');
      }
      
      // Refresh the list after successful update
      setRefreshTrigger(prev => prev + 1);
      setShowEditModal(false);
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
  
  // Handle completion confirmation
  const handleConfirmCompletion = async () => {
    if (!selectedList) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/picking-lists/${selectedList.picking_list_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          picked_status: 'Completed'
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
      alert('Picking list completed successfully! A new Packing List has been created.');
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
  
  return (
    <div className="picking">
      <div className="body-content-container">
        <h2 className="page-title">Picking Lists</h2>
        
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
            onConfirm={handleConfirmCompletion}
            onCancel={() => setShowCompletionModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Picking;