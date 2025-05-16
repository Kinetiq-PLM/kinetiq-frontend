import React, { useState, useEffect } from "react";
import "../styles/Packing.css";
import PackingTable from "../components/packing/PackingTable";
import StatusFilter from "../components/packing/StatusFilter";
import TypeFilter from "../components/packing/TypeFilter";
import CompletionModal from "../components/packing/CompletionModal";
import EditPackingModal from "../components/packing/EditPackingModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Packing = () => {
  // State for data management
  const [packingLists, setPackingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [packingTypes, setPackingTypes] = useState([]);
  
  // State for filtering
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  // New state for delivery notes filtering
  const [isPartialFilter, setIsPartialFilter] = useState("All");
  
  // State for action management
  const [selectedList, setSelectedList] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch data on component mount and when refreshTrigger changes
  useEffect(() => {
    const fetchPackingLists = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        const response = await fetch('https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/packing-lists/');
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication error. Please login again.');
          } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch packing lists');
          }
        }
        
        const data = await response.json();
        setPackingLists(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching packing lists:', err);
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

    const fetchPackingTypes = async () => {
      try {
        const response = await fetch('https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/packing-types/');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch packing types');
        }
        
        const data = await response.json();
        setPackingTypes(data);
      } catch (err) {
        console.error('Error fetching packing types:', err);
      }
    };

    fetchPackingLists();
    fetchEmployees();
    fetchPackingTypes();
  }, [refreshTrigger]);
  
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
  
  // Handle partial delivery filter change
  const handlePartialFilterChange = (value) => {
    setIsPartialFilter(value);
  };
  
  // Apply filters to packing lists
  const filteredLists = packingLists.filter(list => {
    // Apply status filter
    if (statusFilter !== "All" && list.packing_status !== statusFilter) {
      return false;
    }
    
    // Apply type filter
    if (typeFilter !== "All" && list.packing_type !== typeFilter) {
      return false;
    }
    
    // Apply partial delivery filter
    if (isPartialFilter !== "All") {
      const isPartial = list.delivery_notes_info && list.delivery_notes_info.is_partial_delivery;
      if (isPartialFilter === "Partial" && !isPartial) {
        return false;
      }
      if (isPartialFilter === "Complete" && isPartial) {
        return false;
      }
    }
    
    // Apply search filter (search by packing_list_id or delivery_id)
    if (searchTerm && !list.packing_list_id.toLowerCase().includes(searchTerm.toLowerCase()) &&
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
      const response = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/packing-lists/${list.packing_list_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update packing list');
      }
      
      // Update the selectedList with the new values so reopening the modal shows correct data
      setSelectedList(prev => ({
        ...prev,
        ...updates
      }));
      
      // Refresh the list after successful update
      setRefreshTrigger(prev => prev + 1);
      setShowEditModal(false);
      toast.success("Packing list updated successfully!");
      
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };
  
  // Handle status update
  const handleStatusUpdate = async (list, newStatus, updatedValues = {}) => {
    try {
      // If trying to mark as Packed, first save any changes
      if (newStatus === 'Packed') {
        // Make sure we have the total_items_packed value
        if (!updatedValues.total_items_packed && updatedValues.packed_items_data) {
          // Calculate from packed_items_data if available
          let calculatedTotal = 0;
          Object.values(updatedValues.packed_items_data).forEach(warehouseItems => {
            Object.values(warehouseItems).forEach(deliveryNoteItems => {
              Object.values(deliveryNoteItems).forEach(item => {
                calculatedTotal += item.packedQuantity || 0;
              });
            });
          });
          updatedValues.total_items_packed = calculatedTotal;
        }
  
        // Prepare all the data to save first
        const updateData = {
          ...updatedValues
        };
        
        // Only send non-empty updates to backend
        if (Object.keys(updateData).length > 0) {
          const updateResponse = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/packing-lists/${list.packing_list_id}/update/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
          });
          
          if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(errorData.error || 'Failed to update packing list details');
          }
          
          // Update selectedList with the new values for completion modal
          setSelectedList(prev => ({
            ...prev,
            ...updateData
          }));
        }
        
        // Now show the completion modal
        setShowEditModal(false);
        setShowCompletionModal(true);
        return;
      }
      
      // For other status changes, just update with what we have
      const response = await fetch(`http://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/packing-lists/${list.packing_list_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packing_status: newStatus,
          ...updatedValues
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update packing list status');
      }
      
      // Refresh the list after successful update
      setRefreshTrigger(prev => prev + 1);
      setShowEditModal(false);
      toast.info(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };
  
  // Handle completion confirmation
  const handleConfirmCompletion = async () => {
    if (!selectedList) return;
    
    try {
      const response = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/packing-lists/${selectedList.packing_list_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packing_status: 'Packed'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete packing list');
      }
      
      // Close modal and refresh the list
      setShowCompletionModal(false);
      setRefreshTrigger(prev => prev + 1);
      
      // Check if this is a partial delivery
      const isPartial = selectedList.delivery_notes_info && selectedList.delivery_notes_info.is_partial_delivery;
      const successMessage = isPartial 
        ? `Batch ${selectedList.delivery_notes_info.current_delivery} of ${selectedList.delivery_notes_info.total_deliveries} marked as Packed! A new Shipment has been created.`
        : 'Packing list marked as Packed successfully! A new Shipment has been created.';
      
      // Show success notification
      toast.success(successMessage, {
        autoClose: 5000 // Keep this message visible a bit longer
      });
      
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };
  
  // Get counts of partial vs complete deliveries
  const getPartialCounts = () => {
    const partial = packingLists.filter(list => list.delivery_notes_info && list.delivery_notes_info.is_partial_delivery).length;
    const complete = packingLists.length - partial;
    return { partial, complete };
  };
  
  const { partial, complete } = getPartialCounts();
  
  return (
    <div className="packing">
      <div className="body-content-container">
        <h2 className="page-title">Packing Lists</h2>
        
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
              placeholder="Search by Packing ID or Delivery ID..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <StatusFilter 
            selectedStatus={statusFilter}
            onStatusChange={handleStatusFilterChange}
          />
          
          <TypeFilter 
            packingTypes={packingTypes}
            selectedType={typeFilter}
            onTypeChange={handleTypeFilterChange}
          />
          
          {/* Add Partial Delivery Filter */}
          <div className="filter-container">
            <span className="filter-label">Delivery:</span>
            <select
              className="delivery-filter"
              value={isPartialFilter}
              onChange={(e) => handlePartialFilterChange(e.target.value)}
            >
              <option value="All">All Deliveries</option>
              <option value="Partial">Partial Deliveries</option>
              <option value="Complete">Complete Deliveries</option>
            </select>
          </div>
        </div>
        
        {/* Statistics Row */}
        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-label">Total Lists:</span>
            <span className="stat-value">{packingLists.length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Pending:</span>
            <span className="stat-value">
              {packingLists.filter(list => list.packing_status === 'Pending').length}
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Packed:</span>
            <span className="stat-value">
              {packingLists.filter(list => list.packing_status === 'Packed').length}
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Shipped:</span>
            <span className="stat-value">
              {packingLists.filter(list => list.packing_status === 'Shipped').length}
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Partial:</span>
            <span className="stat-value">{partial}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Complete:</span>
            <span className="stat-value">{complete}</span>
          </div>
        </div>
        
        {/* Packing Table */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading packing lists...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">Error: {error}</p>
          </div>
        ) : (
          <div className="packing-content">
            <PackingTable 
              packingLists={filteredLists} 
              onListSelect={handleListSelect} 
              selectedList={selectedList}
              employees={employees}
            />
          </div>
        )}
        
        {/* Edit Modal */}
        {showEditModal && selectedList && (
          <EditPackingModal 
            packingList={selectedList}
            employees={employees}
            packingTypes={packingTypes}
            onClose={handleCloseEditModal}
            onSave={handleSaveChanges}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
        
        {/* Completion Confirmation Modal */}
        {showCompletionModal && selectedList && (
          <CompletionModal 
            packingList={selectedList}
            employees={employees}
            packingTypes={packingTypes}
            onConfirm={handleConfirmCompletion}
            onCancel={() => setShowCompletionModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Packing;