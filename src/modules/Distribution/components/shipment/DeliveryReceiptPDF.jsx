import React from 'react';
import "../../styles/DeliveryReceiptPDF.css";

const DeliveryReceiptPDF = React.forwardRef(({ receipt, shipment, customer }, ref) => {
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

  // Get package details from shipment data
  const getPackageDetails = () => {
    if (!shipment || !shipment.packing_list_info) {
      return { quantity: 0, description: '', piecesPerPackage: 0, numberOfPackages: 0 };
    }
    
    return {
      quantity: shipment.packing_list_info.total_items_packed || 1,
      description: `${shipment.packing_list_info.packing_type || 'Box'} - ${shipment.tracking_number || ''}`,
      piecesPerPackage: 1, // Default
      numberOfPackages: shipment.packing_list_info.total_items_packed || 1
    };
  };

  const packageDetails = getPackageDetails();

  // Extract destination parts for better formatting
  const getDestinationParts = () => {
    if (!shipment || !shipment.destination_location) {
      return {
        address: 'N/A',
        cityStateZip: 'N/A'
      };
    }
    
    const parts = shipment.destination_location.split(',');
    return {
      address: parts[0].trim(),
      cityStateZip: parts.slice(1).join(',').trim()
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
                  <span className="label">Phone:</span>
                  <span className="value">{customer?.phone || 'N/A'}</span>
                </div>
              </div>
              <div className="info-column">
                <div className="info-item">
                  <span className="label">Address:</span>
                  <span className="value">{destinationParts.address || '678 Care Avenue'}</span>
                </div>
                <div className="info-item">
                  <span className="label">City/State/Zip:</span>
                  <span className="value">{destinationParts.cityStateZip || 'Unit 4B, Quezon City, Manila, 1110, Philippines'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shipment Details */}
        <div className="info-card">
          <div className="card-header">
            <h2>Shipment Details</h2>
          </div>
          <div className="card-content">
            <table className="shipment-table">
              <thead>
                <tr>
                  <th>Quantity</th>
                  <th>Description</th>
                  <th>Pieces per Package</th>
                  <th>Number of Packages</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{packageDetails.quantity || '1'}</td>
                  <td>{packageDetails.description || 'Box - TRK5-bb1289'}</td>
                  <td>{packageDetails.piecesPerPackage || '1'}</td>
                  <td>{packageDetails.numberOfPackages || '1'}</td>
                </tr>
                <tr className="empty-row">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr className="empty-row">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
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
      </div>
    </div>
  );
});

export default DeliveryReceiptPDF;