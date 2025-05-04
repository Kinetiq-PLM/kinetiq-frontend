import React from 'react';
import "../../styles/DeliveryReceiptPDF.css";

const DeliveryReceiptPDF = React.forwardRef(({ receipt, shipment, customer, employees = [] }, ref) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '₱0.00';
    return `₱${parseFloat(amount).toFixed(2)}`;
  };

  // Helper for employee names
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return '-';
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };

  // Get package details from shipment data
  const getPackageDetails = () => {
    if (!shipment || !shipment.packing_list_info) {
      return { quantity: 0, description: '', piecesPerPackage: 0, numberOfPackages: 0 };
    }
    
    return {
      quantity: shipment.packing_list_info.total_items_packed || 1,
      description: shipment.packing_list_info.packing_type || 'Box',
      piecesPerPackage: 1, // Default
      numberOfPackages: shipment.packing_list_info.total_items_packed || 1
    };
  };

  const packageDetails = getPackageDetails();

  // Extract destination parts for better formatting
  const getDestinationParts = () => {
    if (!shipment || !shipment.destination_location) {
      return {
        fullAddress: 'N/A'
      };
    }
    
    return {
      fullAddress: shipment.destination_location
    };
  };

  const destinationParts = getDestinationParts();

  return (
    <div className="delivery-receipt-pdf" ref={ref}>
      <div className="receipt-container">
        {/* Header Section */}
        <div className="header-flex">
          <div className="logo-section">
            <img src="/distribution-pdf-assets/kinetiq-logo.png" alt="Kinetiq Logo" className="company-logo" />
          </div>
          
          <div className="title-section">
            <h1 className="receipt-title">DELIVERY RECEIPT</h1>
            <div className="receipt-details">
              <div className="receipt-row">
                <span className="detail-label">Receipt No:</span>
                <span className="detail-value">{receipt?.delivery_receipt_id || 'DIS-DR-2025-5af613'}</span>
              </div>
              <div className="receipt-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{formatDate(receipt?.delivery_date) || 'May 1, 2025'}</span>
              </div>
            </div>
          </div>
          
          {/* QA Badge */}
          <div className="qa-badge">
            <div className="badge-circle">QA</div>
            <div className="badge-text">Quality Assured</div>
          </div>
        </div>
        
        {/* Divider Line */}
        <div className="divider-line"></div>
        
        {/* Company Info */}
        <div className="company-info">
          <div className="company-name">Kinetiq Healthcare Solutions</div>
          <div className="company-contact">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
            </svg>
            <span>kinetiq.plm@gmail.com</span>
          </div>
        </div>
        
        {/* Shipment Information */}
        <div className="info-card">
          <div className="card-header">
            <h2>Shipment Information</h2>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-column">
                <div className="info-item">
                  <span className="label">Tracking No:</span>
                  <span className="value">{shipment?.tracking_number || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Ship Date:</span>
                  <span className="value">{formatDate(shipment?.shipment_date) || 'N/A'}</span>
                </div>
              </div>
              <div className="info-column">
                <div className="info-item">
                  <span className="label">Est. Arrival:</span>
                  <span className="value">{formatDate(shipment?.estimated_arrival_date) || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Delivery Date:</span>
                  <span className="value">{formatDate(shipment?.actual_arrival_date) || 'Pending'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Carrier:</span>
                  <span className="value">
                    {shipment?.carrier_name || 
                     (shipment?.carrier_id ? getEmployeeName(shipment.carrier_id) : 'Not Assigned')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Source Warehouses */}
        <div className="info-card">
          <div className="card-header">
            <h2>Source Warehouses</h2>
          </div>
          <div className="card-content">
            <div className="info-grid">
              {shipment?.source_warehouses && shipment.source_warehouses.map((warehouse, index) => (
                <div className="info-item" key={index}>
                  <span className="label">Warehouse {index + 1}:</span>
                  <span className="value">{warehouse.location}</span>
                </div>
              ))}
              {(!shipment?.source_warehouses || shipment.source_warehouses.length === 0) && (
                <div className="info-item">
                  <span className="label">Source:</span>
                  <span className="value">No warehouse information available</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Customer Information */}
        <div className="info-card">
          <div className="card-header">
            <h2>Customer Information</h2>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-column">
                <div className="info-item">
                  <span className="label">Name:</span>
                  <span className="value">{customer?.name || 'PhilCare Medical Supplies'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Delivered To:</span>
                  <span className="value">{destinationParts.fullAddress}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Item Details Table */}
        <div className="info-card">
          <div className="card-header">
            <h2>Item Details</h2>
          </div>
          <div className="card-content">
            <table className="shipment-table">
              <thead>
                <tr>
                  <th>Item No</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Source Warehouse</th>
                </tr>
              </thead>
              <tbody>
                {shipment?.items_details?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item_no || 'N/A'}</td>
                    <td>{item.item_name || 'Unknown Item'}</td>
                    <td>{item.quantity || '0'}</td>
                    <td>{item.warehouse_name || 'N/A'}</td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan="4" className="empty-message">No items available</td>
                  </tr>
                )}
                {(!shipment?.items_details || shipment.items_details.length === 0) && (
                  <tr className="empty-row">
                    <td colSpan="4"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Package Summary */}
        <div className="info-card">
          <div className="card-header">
            <h2>Package Summary</h2>
          </div>
          <div className="card-content">
            <table className="shipment-table">
              <thead>
                <tr>
                  <th>Package Type</th>
                  <th>Total Items</th>
                  <th>Packing Type</th>
                  <th>Packed By</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{packageDetails.description || 'Standard Package'}</td>
                  <td>{packageDetails.quantity || '0'}</td>
                  <td>{shipment?.packing_list_info?.packing_type || 'Standard'}</td>
                  <td>
                    {shipment?.packing_list_info?.packed_by_name || 
                     (shipment?.packing_list_info?.packed_by ? 
                      getEmployeeName(shipment.packing_list_info.packed_by) : 'N/A')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Footer Section */}
        <div className="footer-section">
          <div className="signature-area">
            <div className="signature-box">
              <div className="signature-label">Received By (Signature)</div>
              {receipt?.signature && !receipt.signature.startsWith('data:') && (
                <div className="signature-text">{receipt.signature}</div>
              )}
            </div>
            <div className="date-box">
              <div className="date-line"></div>
              <div className="date-label">Date</div>
            </div>
          </div>
          <div className="total-area">
            <div className="total-box">
              <div className="total-label">Total Packages</div>
              <div className="total-value">{packageDetails.numberOfPackages || '1'}</div>
              {receipt?.total_amount > 0 && (
                <>
                  <div className="total-label" style={{marginTop: '10px'}}>Delivery Fee</div>
                  <div className="total-value" style={{fontSize: '18px'}}>{formatCurrency(receipt?.total_amount)}</div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Healthcare Note */}
        <div className="healthcare-note">
          <svg className="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9 12l2 2 4-4"></path>
          </svg>
          <span>This delivery contains medical supplies. Please handle with care and store according to proper healthcare guidelines.</span>
        </div>
        
        {/* Receipt Status */}
        {receipt?.receipt_status && (
          <div className={`receipt-status-indicator ${receipt.receipt_status.toLowerCase()}`}>
            {receipt.receipt_status}
          </div>
        )}
      </div>
    </div>
  );
});

export default DeliveryReceiptPDF;