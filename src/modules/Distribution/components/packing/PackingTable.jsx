// components/packing/PackingTable.jsx
import React from "react";

const PackingTable = ({ packingLists, onListSelect, selectedList }) => {
  // Get the delivery type name
  const getDeliveryTypeName = (type) => {
    switch (type) {
      case 'sales':
        return 'Sales Order';
      case 'service':
        return 'Service Order';
      case 'content':
        return 'Content Order';
      case 'stock':
        return 'Stock Transfer';
      default:
        return 'Unknown';
    }
  };
  
  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };
  
  // Helper for employee names
  const getEmployeeName = (employeeId, employees) => {
    if (!employeeId || !employees || employees.length === 0) return '-';
    
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };
  
  // Find the associated class based on status
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Packed':
        return 'status-packed';
      case 'Shipped':
        return 'status-shipped';
      default:
        return '';
    }
  };
  
  // Render empty state when no data
  if (!packingLists || packingLists.length === 0) {
    return (
      <div className="packing-table-container">
        <div className="table-metadata">
          <span>0 packing lists</span>
        </div>
        <div className="table-wrapper">
          <table className="packing-table">
            <thead>
              <tr>
                <th>Packing ID</th>
                <th>Delivery Type</th>
                <th>Delivery ID</th>
                <th>Status</th>
                <th>Packed By</th>
                <th>Items Count</th>
                <th>Packing Type </th>
                <th>Packing Type</th>
                <th>Packing Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8" className="no-data">No packing lists found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="packing-table-container">
      <div className="table-metadata">
        <span>{packingLists.length} packing lists</span>
      </div>
      <div className="table-wrapper">
        <table className="packing-table">
          <thead>
            <tr>
              <th>Packing ID</th>
              <th>Delivery Type</th>
              <th>Delivery ID</th>
              <th>Status</th>
              <th>Packed By</th>
              <th>Items Count</th>
              <th>Packing Type</th>
              <th>Packing Date</th>
            </tr>
          </thead>
          <tbody>
            {packingLists.map((list, index) => (
              <tr
                key={list.packing_list_id}
                className={`
                  ${index % 2 === 0 ? 'even-row' : 'odd-row'} 
                  ${selectedList && selectedList.packing_list_id === list.packing_list_id ? 'selected-row' : ''}
                `}
                onClick={() => onListSelect(list)}
              >
                <td>{list.packing_list_id}</td>
                <td>{getDeliveryTypeName(list.delivery_type)}</td>
                <td>{list.delivery_id || '-'}</td>
                <td className={`status-cell ${getStatusClass(list.packing_status)}`}>
                  {list.packing_status || '-'}
                </td>
                <td>{list.packed_by || '-'}</td>
                <td className="centered-cell">{list.total_items_packed || '0'}</td>
                <td>{list.packing_type || '-'}</td>
                <td>{formatDate(list.packing_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackingTable;