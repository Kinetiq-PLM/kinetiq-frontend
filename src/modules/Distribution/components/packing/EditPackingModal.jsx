import React, { useState, useEffect } from "react";
import { 
  FaUser, 
  FaBox, 
  FaClipboardCheck, 
  FaInfoCircle, 
  FaTags,
  FaWarehouse,
  FaCalendarAlt,
  FaRegCheckCircle,
  FaCheckDouble,
  FaShippingFast,
  FaChevronDown,
  FaChevronUp,
  FaExclamationCircle,
  FaBoxOpen,
  FaBoxes,
  FaClipboard
} from "react-icons/fa";

const EditPackingModal = ({ packingList, employees, packingTypes, onClose, onSave, onStatusUpdate }) => {
  // State for edited values
  const [editedValues, setEditedValues] = useState({});
  const [maxItemsCount, setMaxItemsCount] = useState(0);
  const [totalItemsQuantity, setTotalItemsQuantity] = useState(0);
  
  // New state for delivery notes info (for partial deliveries)
  const [deliveryNotesInfo, setDeliveryNotesInfo] = useState(null);
  
  // New state to track packed items by warehouse, inventory item, and delivery note
  const [packedItems, setPackedItems] = useState({});
  
  // Accordion state for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    info: true,
    partialDelivery: true,
    pickingInfo: true,
    employee: true,
    packingType: true,
    items: true
  });
  
  // Check if packing list is already packed or shipped (both are final states)
  const isPacked = packingList?.packing_status === 'Packed';
  const isShipped = packingList?.packing_status === 'Shipped';
  const isNotEditable = isPacked || isShipped;
  
  // Fetch delivery notes info for partial deliveries
  useEffect(() => {
    if (packingList && packingList.delivery_type === 'sales' && packingList.delivery_id) {
      fetchDeliveryNotesInfo(packingList.delivery_id);
    }
  }, [packingList]);
  
  const fetchDeliveryNotesInfo = async (orderId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delivery-notes/order/${orderId}/`);
      if (response.ok) {
        const data = await response.json();
        setDeliveryNotesInfo(data);
      }
    } catch (error) {
      console.error("Error fetching delivery notes info:", error);
    }
  };
  
  // Check if this is a partial delivery
  const isPartialDelivery = !!(deliveryNotesInfo && deliveryNotesInfo.is_partial_delivery);
  
  useEffect(() => {
    // If we have picking_list_id, fetch the items_count to use as max value
    if (packingList && packingList.picking_list_id) {
      const fetchPickingListDetails = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/picking-lists/${packingList.picking_list_id}/`);
          if (response.ok) {
            const pickingList = await response.json();
            if (pickingList.items_count) {
              // Store the max items count
              setMaxItemsCount(pickingList.items_count);
              
              // If total_items_packed is null, initialize it with items_count
              if (!packingList.total_items_packed || packingList.total_items_packed === null) {
                handleInputChange('total_items_packed', pickingList.items_count);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching picking list:", error);
        }
      };
      
      fetchPickingListDetails();
    }
  }, [packingList]);

  useEffect(() => {
    if (packingList?.items_details) {
      // Initialize the packed items state based on current data
      const initialPackedItems = {};
      
      packingList.items_details.forEach(item => {
        const warehouseId = item.warehouse_id || 'unknown';
        const itemId = item.inventory_item_id;
        const deliveryNoteId = item.delivery_note_id || 'no_note';
        
        if (!initialPackedItems[warehouseId]) {
          initialPackedItems[warehouseId] = {};
        }
        
        if (!initialPackedItems[warehouseId][deliveryNoteId]) {
          initialPackedItems[warehouseId][deliveryNoteId] = {};
        }
        
        const isPacked = ['Packed', 'Shipped'].includes(packingList.packing_status);
        const maxQuantity = parseInt(item.quantity) || 0;
        
        // Check if we have saved packed items data
        let packedQty = 0;
        
        if (packingList.packed_items_data && 
            packingList.packed_items_data[warehouseId] && 
            packingList.packed_items_data[warehouseId][deliveryNoteId] &&
            packingList.packed_items_data[warehouseId][deliveryNoteId][itemId]) {
          // Use the exact quantity from saved data
          packedQty = parseInt(packingList.packed_items_data[warehouseId][deliveryNoteId][itemId].packedQuantity) || 0;
        } else if (isPacked) {
          // If fully packed/shipped status, use max quantity
          packedQty = maxQuantity;
        } else if (packingList.total_items_packed > 0) {
          // For partially packed items without specific data, distribute evenly
          // This is a fallback and shouldn't be needed if packed_items_data is working
          packedQty = Math.min(Math.round(packingList.total_items_packed / packingList.items_details.length), maxQuantity);
        }
        
        initialPackedItems[warehouseId][deliveryNoteId][itemId] = {
          packedQuantity: packedQty,
          maxQuantity: maxQuantity,
          itemName: item.item_name,
          itemNo: item.item_no
        };
      });
      
      setPackedItems(initialPackedItems);
      
      // Calculate initial total packed items
      updateTotalItemsPacked(initialPackedItems);
    }
  }, [packingList]);

  // Add this useEffect to calculate total quantity when the packing list changes
  useEffect(() => {
    if (packingList?.items_details?.length > 0) {
      // Calculate total quantity from item details
      const totalQty = packingList.items_details.reduce((sum, item) => {
        return sum + (parseInt(item.quantity) || 0);
      }, 0);
      
      setTotalItemsQuantity(totalQty);
      
      // If total_items_packed is null, initialize it with total quantity
      if (!packingList.total_items_packed || packingList.total_items_packed === null) {
        handleInputChange('total_items_packed', totalQty);
      }
    }
  }, [packingList]);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    // Don't update if packed or shipped
    if (isNotEditable) return;
    
    // For total_items_packed, limit to the total quantity
    if (field === 'total_items_packed') {
      const numValue = parseInt(value) || 0;
      // Ensure value doesn't exceed the total items quantity
      const limitedValue = Math.min(numValue, totalItemsQuantity);
      
      setEditedValues(prev => ({
        ...prev,
        [field]: limitedValue
      }));
      return;
    }
    
    // For other fields, update normally
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Update the handleSave function to include delivery note info
  const handleSave = () => {
    if (isNotEditable) return;
    
    // Calculate the total packed items directly from the packedItems state
    let totalPacked = 0;
    Object.values(packedItems).forEach(warehouseDeliveryNotes => {
      Object.values(warehouseDeliveryNotes).forEach(deliveryNoteItems => {
        Object.values(deliveryNoteItems).forEach(item => {
          totalPacked += item.packedQuantity;
        });
      });
    });
    
    // Ensure the total_items_packed is included in the updates
    const updatedValues = {
      ...editedValues,
      total_items_packed: totalPacked,
      packed_items_data: packedItems
    };
    
    // Call the parent component's save function
    onSave(packingList, updatedValues);
  };
  
  // Helper to check if the values have changed
  const hasChanges = () => {
    return Object.keys(editedValues).length > 0;
  };
  
  // Format for display purposes only
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  };
  
  // Get appropriate action label based on status
  const getNextStatusLabel = () => {
    switch (packingList.packing_status) {
      case 'Pending':
        return isPartialDelivery ? 
          `Mark as Packed (Delivery ${deliveryNotesInfo?.current_delivery} of ${deliveryNotesInfo?.total_deliveries})` : 
          'Mark as Packed';
      default:
        return '';
    }
  };
  
  // Get next status value based on current status
  const getNextStatus = () => {
    switch (packingList.packing_status) {
      case 'Pending':
        return 'Packed';
      default:
        return null;
    }
  };
  
  // Check if status can be updated - only pending can be updated to packed
  const canUpdateStatus = () => {
    return packingList.packing_status === 'Pending';
  };
  
  // Check if all required fields are filled and status can be updated to packed
  const isStatusUpdateDisabled = () => {
    if (isNotEditable) return true;
    
    // Check if all required fields are filled
    if (!editedValues.packed_by && !packingList.packed_by) return true;
    if (!editedValues.packing_type && !packingList.packing_type) return true;
    
    // Check if at least some items are packed
    const currentPackedCount = editedValues.total_items_packed || packingList.total_items_packed || 0;
    if (currentPackedCount <= 0) return true;
    
    return false;
  };
  
  // Get validation message for status update button
  const getValidationMessage = () => {
    if (!editedValues.packed_by && !packingList.packed_by) {
      return "Employee assignment is required";
    }
    if (!editedValues.packing_type && !packingList.packing_type) {
      return "Packing type is required";
    }
    
    const currentPackedCount = editedValues.total_items_packed || packingList.total_items_packed || 0;
    if (currentPackedCount <= 0) {
      return "At least one item must be packed";
    }
    
    return "";
  };
  
  // Handle status update button click - include delivery notes info for partial deliveries
  const handleStatusUpdate = () => {
    if (isNotEditable) return;
    
    const nextStatus = getNextStatus();
    if (nextStatus) {
      // Calculate the total packed items directly from the packedItems state
      let totalPacked = 0;
      Object.values(packedItems).forEach(warehouseDeliveryNotes => {
        Object.values(warehouseDeliveryNotes).forEach(deliveryNoteItems => {
          Object.values(deliveryNoteItems).forEach(item => {
            totalPacked += item.packedQuantity || 0;
          });
        });
      });
      
      // Create an object with all current edited values
      const updatedValues = {
        ...editedValues,
        packed_by: editedValues.packed_by || packingList.packed_by,
        packing_type: editedValues.packing_type || packingList.packing_type,
        total_items_packed: totalPacked,
        packed_items_data: packedItems
      };
      
      // For partial deliveries, add delivery notes info
      if (isPartialDelivery && deliveryNotesInfo) {
        // Get the current delivery notes being processed
        const currentDeliveryNotes = [];
        
        // Extract delivery note IDs from packed items
        Object.values(packedItems).forEach(warehouseDeliveryNotes => {
          Object.keys(warehouseDeliveryNotes).forEach(deliveryNoteId => {
            if (deliveryNoteId !== 'no_note' && !currentDeliveryNotes.includes(deliveryNoteId)) {
              currentDeliveryNotes.push(deliveryNoteId);
            }
          });
        });
        
        updatedValues.delivery_notes_info = {
          is_partial_delivery: true,
          current_delivery_notes: currentDeliveryNotes,
          current_delivery: deliveryNotesInfo.current_delivery,
          total_deliveries: deliveryNotesInfo.total_deliveries
        };
      }
      
      // Call onStatusUpdate with all the edited values
      onStatusUpdate(packingList, nextStatus, updatedValues);
    }
  };
  
  // Get employee name from ID
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : 'Not assigned';
  };
  
  // Get packing type name from ID
  const getPackingTypeName = (typeId) => {
    const packingType = packingTypes.find(type => type.id === typeId);
    return packingType ? packingType.name : 'Not specified';
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    if (!status) return '';
    
    return `status-badge status-${status.toLowerCase()}`;
  };
  
  // Get completion percentage based on filled fields
  const getCompletionPercentage = () => {
    let totalScore = 0;
    let maxScore = 3; // Now only 3 factors (employee, packing type, items packed)
    
    // Required factors
    if (editedValues.packed_by || packingList.packed_by) totalScore++;
    if (editedValues.packing_type || packingList.packing_type) totalScore++;
    
    // Add factor for packed items (as a percentage of total quantity)
    const currentItemsCount = editedValues.total_items_packed || packingList.total_items_packed || 0;
    if (totalItemsQuantity > 0) {
      const itemsPercentage = currentItemsCount / totalItemsQuantity;
      totalScore += itemsPercentage; // This will add up to 1.0 for 100% packed
    }
    
    return (totalScore / maxScore) * 100;
  };

  // Function to handle changes to packed quantities - updated for delivery notes
  const handlePackedQuantityChange = (warehouseId, deliveryNoteId, itemId, value) => {
    // Don't update if packed or shipped
    if (isNotEditable) return;
    
    // Parse the input value as an integer
    const newQuantity = parseInt(value) || 0;
    
    // Ensure the quantity doesn't exceed the maximum available quantity
    const maxQty = packedItems[warehouseId]?.[deliveryNoteId]?.[itemId]?.maxQuantity || 0;
    const validatedQuantity = Math.min(Math.max(0, newQuantity), maxQty);
    
    // Update the packed items state with the new structure
    setPackedItems(prev => {
      const updated = {...prev};
      
      if (!updated[warehouseId]) {
        updated[warehouseId] = {};
      }
      
      if (!updated[warehouseId][deliveryNoteId]) {
        updated[warehouseId][deliveryNoteId] = {};
      }
      
      updated[warehouseId][deliveryNoteId][itemId] = {
        ...(updated[warehouseId][deliveryNoteId][itemId] || {}),
        packedQuantity: validatedQuantity
      };
      
      return updated;
    });
    
    // Update the total_items_packed with a delay to ensure state is updated
    setTimeout(() => {
      updateTotalItemsPacked(packedItems);
    }, 0);
  };
  
  // Function to update the total_items_packed based on all packed items
  const updateTotalItemsPacked = (packedItemsData) => {
    let total = 0;
    
    // Sum up all packed quantities across all warehouses, delivery notes, and items
    Object.values(packedItemsData).forEach(warehouseItems => {
      Object.values(warehouseItems).forEach(deliveryNoteItems => {
        Object.values(deliveryNoteItems).forEach(item => {
          total += (item.packedQuantity || 0);
        });
      });
    });
    
    // Update the edited values with the new total
    handleInputChange('total_items_packed', total);
  };
  
  // Add helpers for bulk actions - updated for delivery notes
  const markAllItemsInDeliveryNote = (warehouseId, deliveryNoteId, isPack) => {
    if (isNotEditable) return;
    
    const deliveryNoteItems = packedItems[warehouseId]?.[deliveryNoteId];
    if (!deliveryNoteItems) return;
    
    const updatedDeliveryNoteItems = {};
    Object.entries(deliveryNoteItems).forEach(([itemId, itemData]) => {
      updatedDeliveryNoteItems[itemId] = {
        ...itemData,
        packedQuantity: isPack ? itemData.maxQuantity : 0
      };
    });
    
    const updatedPackedItems = {
      ...packedItems,
      [warehouseId]: {
        ...packedItems[warehouseId],
        [deliveryNoteId]: updatedDeliveryNoteItems
      }
    };
    
    setPackedItems(updatedPackedItems);
    updateTotalItemsPacked(updatedPackedItems);
  };
  
  // Mark all items in a warehouse as packed/unpacked
  const markAllItemsInWarehouse = (warehouseId, isPack) => {
    if (isNotEditable) return;
    
    const warehouseItems = packedItems[warehouseId];
    if (!warehouseItems) return;
    
    const updatedWarehouseItems = {};
    Object.entries(warehouseItems).forEach(([deliveryNoteId, deliveryNoteItems]) => {
      updatedWarehouseItems[deliveryNoteId] = {};
      
      Object.entries(deliveryNoteItems).forEach(([itemId, itemData]) => {
        updatedWarehouseItems[deliveryNoteId][itemId] = {
          ...itemData,
          packedQuantity: isPack ? itemData.maxQuantity : 0
        };
      });
    });
    
    const updatedPackedItems = {
      ...packedItems,
      [warehouseId]: updatedWarehouseItems
    };
    
    setPackedItems(updatedPackedItems);
    updateTotalItemsPacked(updatedPackedItems);
  };
  
  // Handle marking all items as packed or unpacked
  const markAllItems = (isPack) => {
    if (isNotEditable) return;
    
    const updatedPackedItems = {};
    Object.entries(packedItems).forEach(([warehouseId, warehouseItems]) => {
      updatedPackedItems[warehouseId] = {};
      
      Object.entries(warehouseItems).forEach(([deliveryNoteId, deliveryNoteItems]) => {
        updatedPackedItems[warehouseId][deliveryNoteId] = {};
        
        Object.entries(deliveryNoteItems).forEach(([itemId, itemData]) => {
          updatedPackedItems[warehouseId][deliveryNoteId][itemId] = {
            ...itemData,
            packedQuantity: isPack ? itemData.maxQuantity : 0
          };
        });
      });
    });
    
    setPackedItems(updatedPackedItems);
    updateTotalItemsPacked(updatedPackedItems);
  };

  // Helper to get delivery note display name
  const getDeliveryNoteDisplayName = (deliveryNoteId) => {
    if (deliveryNoteId === 'no_note') {
      return 'General Items (No Delivery Note)';
    }
    
    // If we have delivery notes info, look up the sequence number
    if (deliveryNotesInfo && deliveryNotesInfo.delivery_notes) {
      const noteInfo = deliveryNotesInfo.delivery_notes.find(
        note => note.delivery_note_id === deliveryNoteId
      );
      
      if (noteInfo) {
        return `Delivery Note ${deliveryNoteId} (Batch ${noteInfo.sequence_number} of ${deliveryNotesInfo.total_deliveries})`;
      }
    }
    
    return `Delivery Note ${deliveryNoteId}`;
  };

  // Render items section, now with delivery note grouping
  const renderItemsSection = () => {
    // First organize data by warehouse, then by delivery note
    const warehouseGroups = [];
    const warehouseMap = {};
    let totalQuantity = 0;
    let totalPackedQuantity = 0;
    
    // Check if we have item details
    if (packingList?.items_details?.length) {
      // Group items first by warehouse, then by delivery note
      packingList.items_details.forEach(item => {
        const warehouseId = item.warehouse_id || 'unknown';
        const deliveryNoteId = item.delivery_note_id || 'no_note';
        totalQuantity += parseInt(item.quantity) || 0;
        
        // Calculate current packed quantity from our tracking state
        const packedQty = packedItems[warehouseId]?.[deliveryNoteId]?.[item.inventory_item_id]?.packedQuantity || 0;
        totalPackedQuantity += packedQty;
        
        // Initialize warehouse if needed
        if (!warehouseMap[warehouseId]) {
          const group = {
            warehouseId,
            warehouseName: item.warehouse_name || 'Unknown Warehouse',
            deliveryNotes: {},
            totalQuantity: 0,
            totalPackedQuantity: 0
          };
          warehouseMap[warehouseId] = group;
          warehouseGroups.push(group);
        }
        
        // Initialize delivery note if needed
        if (!warehouseMap[warehouseId].deliveryNotes[deliveryNoteId]) {
          warehouseMap[warehouseId].deliveryNotes[deliveryNoteId] = {
            deliveryNoteId,
            displayName: getDeliveryNoteDisplayName(deliveryNoteId),
            items: [],
            totalQuantity: 0,
            totalPackedQuantity: 0
          };
        }
        
        // Add item to the delivery note
        warehouseMap[warehouseId].deliveryNotes[deliveryNoteId].items.push(item);
        warehouseMap[warehouseId].totalQuantity += parseInt(item.quantity) || 0;
        warehouseMap[warehouseId].totalPackedQuantity += packedQty;
        warehouseMap[warehouseId].deliveryNotes[deliveryNoteId].totalQuantity += parseInt(item.quantity) || 0;
        warehouseMap[warehouseId].deliveryNotes[deliveryNoteId].totalPackedQuantity += packedQty;
      });
    }
  
    const hasMultipleWarehouses = warehouseGroups.length > 1;
    const hasMultipleDeliveryNotes = isPartialDelivery;
  
    return (
      <div className="items-section">
        <h4 className="section-title">
          <FaBoxOpen className="section-icon" />
          Items to Pack ({packingList?.items_details?.length || 0} items, {totalPackedQuantity}/{totalQuantity} units packed)
          {isPartialDelivery && (
            <span className="batch-indicator">
              (Batch {deliveryNotesInfo?.current_delivery} of {deliveryNotesInfo?.total_deliveries})
            </span>
          )}
        </h4>
  
        {!isNotEditable && (
          <div className="packing-actions">
            <button 
              className="pack-action-button pack-all" 
              onClick={() => markAllItems(true)} 
              disabled={isNotEditable}
            >
              <FaCheckDouble /> Pack All Items
            </button>
            <button 
              className="pack-action-button unpack-all" 
              onClick={() => markAllItems(false)} 
              disabled={isNotEditable}
            >
              <FaBoxOpen /> Unpack All Items
            </button>
          </div>
        )}
  
        {warehouseGroups.length > 0 ? (
          warehouseGroups.map((warehouse, warehouseIndex) => (
            <div key={warehouse.warehouseId} className="warehouse-group">
              <h5 className="warehouse-name">
                <FaWarehouse className="warehouse-icon" /> {warehouse.warehouseName}
                <span className="warehouse-items-count">
                  {Object.keys(warehouse.deliveryNotes).length} delivery note(s),
                  {warehouse.totalPackedQuantity}/{warehouse.totalQuantity} units packed
                </span>
                
                {!isNotEditable && (
                  <div className="warehouse-actions">
                    <button 
                      className="pack-button" 
                      onClick={() => markAllItemsInWarehouse(warehouse.warehouseId, true)}
                      disabled={isNotEditable}
                    >
                      Pack All
                    </button>
                    <button 
                      className="unpack-button" 
                      onClick={() => markAllItemsInWarehouse(warehouse.warehouseId, false)}
                      disabled={isNotEditable}
                    >
                      Unpack All
                    </button>
                  </div>
                )}
              </h5>
              
              {/* Delivery Notes Groups */}
              {Object.values(warehouse.deliveryNotes).map((deliveryNote, dnIndex) => (
                <div key={deliveryNote.deliveryNoteId} className="delivery-note-group">
                  <h6 className="delivery-note-header">
                    <FaClipboard className="delivery-note-icon" /> {deliveryNote.displayName}
                    <span className="delivery-note-items-count">
                      {deliveryNote.items.length} item(s),
                      {deliveryNote.totalPackedQuantity}/{deliveryNote.totalQuantity} units packed
                    </span>
                    
                    {!isNotEditable && (
                      <div className="delivery-note-actions">
                        <button 
                          className="pack-button" 
                          onClick={() => markAllItemsInDeliveryNote(warehouse.warehouseId, deliveryNote.deliveryNoteId, true)}
                          disabled={isNotEditable}
                        >
                          Pack All
                        </button>
                        <button 
                          className="unpack-button" 
                          onClick={() => markAllItemsInDeliveryNote(warehouse.warehouseId, deliveryNote.deliveryNoteId, false)}
                          disabled={isNotEditable}
                        >
                          Unpack All
                        </button>
                      </div>
                    )}
                  </h6>
                  
                  <div className="items-table-container">
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Item Number</th>
                          <th>Available Qty</th>
                          {!isNotEditable && <th>Packed Qty</th>}
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveryNote.items.map((item, itemIndex) => {
                          const warehouseId = warehouse.warehouseId;
                          const deliveryNoteId = deliveryNote.deliveryNoteId;
                          const itemId = item.inventory_item_id;
                          const packedQuantity = packedItems[warehouseId]?.[deliveryNoteId]?.[itemId]?.packedQuantity || 0;
                          const maxQuantity = parseInt(item.quantity) || 0;
                          const isFullyPacked = packedQuantity === maxQuantity;
                          const isPartiallyPacked = packedQuantity > 0 && packedQuantity < maxQuantity;
                          
                          return (
                            <tr key={itemIndex} className={isFullyPacked ? 'fully-packed' : (isPartiallyPacked ? 'partially-packed' : '')}>
                              <td>{item.item_name}</td>
                              <td>{item.item_no || '-'}</td>
                              <td>{maxQuantity}</td>
                              {!isNotEditable ? (
                                <td className="packed-quantity-cell">
                                  <div className="packed-quantity-input-group">
                                    <button 
                                      className="quantity-btn" 
                                      onClick={() => handlePackedQuantityChange(warehouseId, deliveryNoteId, itemId, (packedQuantity - 1))} 
                                      disabled={packedQuantity <= 0 || isNotEditable}
                                    >−</button>
                                    <input
                                      type="number"
                                      className="packed-quantity-input"
                                      value={packedQuantity}
                                      onChange={(e) => handlePackedQuantityChange(warehouseId, deliveryNoteId, itemId, e.target.value)}
                                      min="0"
                                      max={maxQuantity}
                                      disabled={isNotEditable}
                                    />
                                    <button 
                                      className="quantity-btn" 
                                      onClick={() => handlePackedQuantityChange(warehouseId, deliveryNoteId, itemId, (packedQuantity + 1))} 
                                      disabled={packedQuantity >= maxQuantity || isNotEditable}
                                    >+</button>
                                  </div>
                                </td>
                              ) : null}
                              <td className="packing-status-cell">
                                {isFullyPacked ? (
                                  <span className="status-indicator packed">Fully Packed</span>
                                ) : isPartiallyPacked ? (
                                  <span className="status-indicator partial">Partially Packed</span>
                                ) : (
                                  <span className="status-indicator unpacked">Not Packed</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {dnIndex < Object.values(warehouse.deliveryNotes).length - 1 && <hr className="delivery-note-divider" />}
                </div>
              ))}
              
              {warehouseIndex < warehouseGroups.length - 1 && <hr className="warehouse-divider" />}
            </div>
          ))
        ) : (
          <div className="items-table-container">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Item Number</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="3" className="no-data">No items to display</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };
  
  // Render partial delivery info section
  const renderPartialDeliveryInfo = () => {
    if (!isPartialDelivery || !deliveryNotesInfo) return null;
    
    const currentDelivery = deliveryNotesInfo.current_delivery;
    const totalDeliveries = deliveryNotesInfo.total_deliveries;
    const completedDeliveries = deliveryNotesInfo.completed_deliveries || 0;
    const progressPercentage = (completedDeliveries / totalDeliveries) * 100;
    
    return (
      <div className="accordion-section">
        <div 
          className="accordion-header special-header" 
          onClick={() => toggleSection('partialDelivery')}
          aria-expanded={expandedSections.partialDelivery}
        >
          <div className="accordion-title">
            <FaBoxes className="section-icon" /> Partial Delivery Information
          </div>
          <div className="accordion-toggle">
            {expandedSections.partialDelivery ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
        
        {expandedSections.partialDelivery && (
          <div className="accordion-content">
            <div className="partial-delivery-info">
              <div className="partial-delivery-header">
                <div className="partial-delivery-title">
                  <FaBoxes className="partial-delivery-icon" />
                  <h4>Partial Delivery in Progress</h4>
                </div>
                <div className="partial-delivery-counter">
                  <span className="delivery-counter-text">Delivery</span>
                  <span className="delivery-counter-numbers">{currentDelivery} of {totalDeliveries}</span>
                </div>
              </div>
              
              <div className="partial-delivery-progress">
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {completedDeliveries} of {totalDeliveries} deliveries completed
                </div>
              </div>
              
              <div className="delivery-notes-list">
                {deliveryNotesInfo.delivery_notes.map((note, index) => {
                  const isCurrent = index + 1 === currentDelivery;
                  const isCompleted = index + 1 < currentDelivery;
                  const isPending = index + 1 > currentDelivery;
                  
                  // Determine status display
                  let statusDisplay = note.shipment_status || 'Pending';
                  if (statusDisplay) {
                    statusDisplay = statusDisplay.charAt(0).toUpperCase() + statusDisplay.slice(1).toLowerCase();
                  }
                  
                  return (
                    <div 
                      key={note.delivery_note_id} 
                      className={`delivery-note-item ${isCurrent ? 'current-delivery' : (isCompleted ? 'completed-delivery' : 'pending-delivery')}`}
                    >
                      <div className="delivery-note-sequence">{index + 1}</div>
                      <div className="delivery-note-content">
                        <div className="delivery-note-id">{note.delivery_note_id}</div>
                        <div className="delivery-note-details">
                          <span className="item-count">{note.total_quantity || 0} items</span>
                          <span className={`status-badge status-${String(note.shipment_status || '').toLowerCase()}`}>
                            {statusDisplay}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="delivery-notes-info">
                <div className="info-message">
                  <FaExclamationCircle className="info-icon" />
                  <span>Partial deliveries must be processed sequentially. Complete this delivery before proceeding to the next.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="packing modal-overlay" onClick={onClose}>
      <div className="edit-packing-modal improved" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-container">
            <h3>{isNotEditable ? 'View Packing List' : 'Edit Packing List'}</h3>
            <div className="modal-subtitle">
              <span className={getStatusBadgeClass(packingList.packing_status)}>
                {packingList.packing_status || 'No Status'}
              </span>
              {isPartialDelivery && (
                <span className="partial-badge">
                  Partial Delivery {deliveryNotesInfo?.current_delivery || '?'} of {deliveryNotesInfo?.total_deliveries || '?'}
                </span>
              )}
            </div>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        
        <div className="modal-body">
          <div className="modal-scrollable-content">
            {/* Basic Information */}
            <div className="accordion-section">
              <div 
                className="accordion-header" 
                onClick={() => toggleSection('info')}
                aria-expanded={expandedSections.info}
              >
                <div className="accordion-title">
                  <FaBox className="section-icon" /> Packing Information
                </div>
                <div className="accordion-toggle">
                  {expandedSections.info ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              
              {expandedSections.info && (
                <div className="accordion-content">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Packing ID</span>
                      <span className="info-value highlight">{packingList.packing_list_id}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Order Type</span>
                      <span className="info-value">
                        {packingList.is_external ? 'External Order' : 'Internal Order'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Status</span>
                      <span className={`info-value status-${packingList.packing_status?.toLowerCase()}`}>
                        {packingList.packing_status || '-'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        Packed Items Quantity
                        <span className="items-max-info">(Max: {totalItemsQuantity})</span>
                      </span>
                      <span className="info-value">{editedValues.total_items_packed || packingList.total_items_packed || '0'}</span>
                    </div>
                    {packingList.packing_date && (
                      <div className="info-item">
                        <span className="info-label">Packing Date</span>
                        <div className="info-value-with-icon">
                          <span>{new Date(packingList.packing_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Partial Delivery Info (if applicable) */}
            {renderPartialDeliveryInfo()}
            
            {/* Packing Assignment Section */}
            <div className="accordion-section">
              <div 
                className="accordion-header" 
                onClick={() => toggleSection('employee')}
                aria-expanded={expandedSections.employee}
              >
                <div className="accordion-title">
                  <FaUser className="section-icon" /> Assign Packer
                  {!isNotEditable && (!editedValues.packed_by && !packingList.packed_by) && 
                    <span className="required-indicator">*</span>
                  }
                </div>
                <div className="accordion-toggle">
                  {expandedSections.employee ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              
              {expandedSections.employee && (
                <div className="accordion-content">
                  {isNotEditable ? (
                    <div className="employee-display info-display">
                      <FaUser className="display-icon" />
                      <span className="display-value">
                        {getEmployeeName(packingList.packed_by)}
                      </span>
                    </div>
                  ) : (
                    <div className="input-container">
                      <select
                        className="form-select"
                        value={editedValues.packed_by || packingList.packed_by || ''}
                        onChange={(e) => handleInputChange('packed_by', e.target.value)}
                        disabled={isNotEditable}
                      >
                        <option value="">-- Select Employee --</option>
                        {employees.map((employee) => (
                          <option key={employee.employee_id} value={employee.employee_id}>
                            {employee.full_name}
                          </option>
                        ))}
                      </select>
                      
                      {(!editedValues.packed_by && !packingList.packed_by) && (
                        <div className="field-hint">Employee assignment is required</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Packing Type Section */}
            <div className="accordion-section">
              <div 
                className="accordion-header" 
                onClick={() => toggleSection('packingType')}
                aria-expanded={expandedSections.packingType}
              >
                <div className="accordion-title">
                  <FaTags className="section-icon" /> Packing Type
                  {!isNotEditable && (!editedValues.packing_type && !packingList.packing_type) && 
                    <span className="required-indicator">*</span>
                  }
                </div>
                <div className="accordion-toggle">
                  {expandedSections.packingType ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              
              {expandedSections.packingType && (
                <div className="accordion-content">
                  {isNotEditable ? (
                    <div className="packing-type-display info-display">
                      <FaTags className="display-icon" />
                      <span className="display-value">
                        {getPackingTypeName(packingList.packing_type)}
                      </span>
                    </div>
                  ) : (
                    <div className="input-container">
                      <select
                        className="form-select"
                        value={editedValues.packing_type || packingList.packing_type || ''}
                        onChange={(e) => handleInputChange('packing_type', e.target.value)}
                        disabled={isNotEditable}
                      >
                        <option value="">-- Select Packing Type --</option>
                        {packingTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      
                      {(!editedValues.packing_type && !packingList.packing_type) && (
                        <div className="field-hint">Packing type is required</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Items Section */}
            <div className="accordion-section">
              <div 
                className="accordion-header" 
                onClick={() => toggleSection('items')}
                aria-expanded={expandedSections.items}
              >
                <div className="accordion-title">
                  <FaBoxes className="section-icon" /> Packing Items
                </div>
                <div className="accordion-toggle">
                  {expandedSections.items ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              
              {expandedSections.items && (
                <div className="accordion-content">
                  {renderItemsSection()}
                </div>
              )}
            </div>
            
            {/* Status Update Section */}
            {canUpdateStatus() && (
              <div className="status-update-section">
                <h4>Status Update</h4>
                
                {/* Progress indicator */}
                <div className="progress-container">
                  <div className="progress-label">Completion Status</div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{width: `${getCompletionPercentage()}%`}}
                    ></div>
                  </div>
                  <div className="progress-percentage">{Math.round(getCompletionPercentage())}%</div>
                </div>
                
                <button
                  className={`status-update-button status-${getNextStatus().toLowerCase()}`}
                  onClick={handleStatusUpdate}
                  disabled={isStatusUpdateDisabled()}
                >
                  <FaShippingFast className="button-icon" />
                  {getNextStatusLabel()}
                </button>
                
                {isStatusUpdateDisabled() && (
                  <div className="validation-message">
                    <FaExclamationCircle className="validation-icon" />
                    {getValidationMessage()}
                  </div>
                )}
                
                {/* Next steps info when button is enabled */}
                {!isStatusUpdateDisabled() && (
                  <div className="next-steps-info">
                    <h5><FaInfoCircle className="info-icon" /> What happens when you mark as packed?</h5>
                    <div className="next-steps-content">
                      <div className="next-step-item">
                        <div className="step-indicator">1</div>
                        <span>The packing list status will change to "Packed"</span>
                      </div>
                      <div className="next-step-item">
                        <div className="step-indicator">2</div>
                        <span>A new shipment record will be created automatically</span>
                      </div>
                      <div className="next-step-item">
                        <div className="step-indicator">3</div>
                        <span>The item will move to the shipping stage</span>
                      </div>
                      {isPartialDelivery && (
                        <div className="next-step-item">
                          <div className="step-indicator">4</div>
                          <span>After shipping, the next partial delivery will become available</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Status message for packed items */}
            {isPacked && (
              <div className="status-message-section status-packed">
                <FaRegCheckCircle className="status-icon" />
                <div className="status-message">
                  <h5>This packing list has been completed</h5>
                  <p>The items are now ready to be shipped.</p>
                </div>
              </div>
            )}
            
            {/* Status message for shipped items */}
            {isShipped && (
              <div className="status-message-section status-shipped">
                <FaCheckDouble className="status-icon" />
                <div className="status-message">
                  <h5>This packing list has been shipped</h5>
                  <p>This record cannot be modified and is for reference only.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            {isNotEditable ? 'Close' : 'Cancel'}
          </button>
          {!isNotEditable && (
            <button
              className="save-button"
              onClick={handleSave}
              disabled={!hasChanges() || isNotEditable}
            >
              <FaRegCheckCircle className="button-icon" />
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPackingModal;