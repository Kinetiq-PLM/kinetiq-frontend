import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import DeliveryReceiptPDF from './DeliveryReceiptPDF';
import * as ReactDOM from 'react-dom/client';

const DeliveryReceiptModal = ({ shipment, onSave, onCancel, employees = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryReceipt, setDeliveryReceipt] = useState(null);
  const [error, setError] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [allCarriers, setAllCarriers] = useState([]);
  
  // Form state
  const [signature, setSignature] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  
  // PDF generation state
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  
  // Signature state
  const [signatureMode, setSignatureMode] = useState('type'); // 'type' or 'draw'
  const sigCanvas = useRef({}); // Reference for the signature canvas
  
  // PDF reference
  const pdfRef = useRef(null);

  // Fetch all necessary data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch employees
        const employeesResponse = await fetch('http://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/employees/');
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          setAllEmployees(employeesData);
        }
        
        // Fetch carriers
        const carriersResponse = await fetch('http://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/carriers/');
        if (carriersResponse.ok) {
          const carriersData = await carriersResponse.json();
          setAllCarriers(carriersData);
        }
        
        if (!shipment.delivery_receipt_id) {
          throw new Error('No delivery receipt found for this shipment');
        }
        
        // Fetch delivery receipt
        const deliveryReceiptResponse = await fetch(`http://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/delivery-receipts/${shipment.delivery_receipt_id}/`);
        if (!deliveryReceiptResponse.ok) {
          const errorData = await deliveryReceiptResponse.json();
          throw new Error(errorData.detail || 'Failed to fetch delivery receipt');
        }
        
        const receiptData = await deliveryReceiptResponse.json();
        setDeliveryReceipt(receiptData);
        
        if (receiptData.signature) {
          setSignature(receiptData.signature);
        }
        
        // Fetch customer details if we have a customer ID
        if (receiptData.received_by && receiptData.received_by.startsWith('SALES-CUST-')) {
          fetchCustomerName(receiptData.received_by);
        }
        
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchAllData();
  }, [shipment.delivery_receipt_id]);

  // Function to fetch customer name
  const fetchCustomerName = async (customerId) => {
    try {
      const response = await fetch(`http://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/customers/${customerId}/`);
      if (!response.ok) {
        setCustomerName(`Customer ${customerId}`);
        return;
      }
      
      const data = await response.json();
      setCustomerData(data);
      if (data && data.name) {
        setCustomerName(data.name);
      }
    } catch (err) {
      console.error('Error fetching customer details:', err);
    }
  };

  // Get employee name by ID
  const getEmployeeNameById = (employeeId) => {
    if (!employeeId) return 'N/A';
    
    const employee = allEmployees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };
  
  // Get carrier employee name (fixes the carrier name issue)
  const getCarrierName = (carrierId) => {
    const carrier = allCarriers.find(c => c.carrier_id === carrierId);
    if (!carrier) return 'N/A';
    
    return getEmployeeNameById(carrier.carrier_name);
  };

  // Clear the signature canvas
  const clearSignature = () => {
    if (signatureMode === 'draw' && sigCanvas.current) {
      if (typeof sigCanvas.current.clear === 'function') {
        sigCanvas.current.clear();
      }
    } else {
      setSignature('');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!deliveryReceipt) return;
    
    let finalSignature = signature;
    
    // If using drawing mode, get the signature as base64 image
    if (signatureMode === 'draw' && sigCanvas.current) {
      try {
        // First, try the simple toDataURL method
        if (typeof sigCanvas.current.toDataURL === 'function') {
          finalSignature = sigCanvas.current.toDataURL();
        } 
        // If the canvas appears empty or couldn't be processed
        if (!finalSignature || finalSignature.trim() === '') {
          console.log("Using default signature value");
          finalSignature = "Received Successfully";
        }
      } catch (err) {
        console.error("Error getting signature from canvas:", err);
        finalSignature = "Received Successfully";
      }
    }
    
    // If signature is still empty (in any mode), use a default value
    if (!finalSignature || finalSignature.trim() === '') {
      finalSignature = "Received Successfully";
    }
    
    const updates = {
      ...deliveryReceipt,
      signature: finalSignature,
      receipt_status: 'Received'
    };
    
    onSave(updates);
  };
  
  // Handle rejection form submission
  const handleReject = (e) => {
    e.preventDefault();
    
    if (!deliveryReceipt) return;
    
    const updates = {
      ...deliveryReceipt,
      receipt_status: 'Rejected',
      rejection_reason: rejectReason
    };
    
    onSave(updates);
  };
  
  // Check if signature is valid based on the current mode
  const isSignatureValid = () => {
    if (signatureMode === 'type') {
      // Always return true for type mode since we'll use a default value if empty
      return true;
    } else if (signatureMode === 'draw') {
      // For draw mode, check if the canvas has data
      try {
        if (!sigCanvas.current) return false;
        
        // First check if isEmpty function exists and use it
        if (typeof sigCanvas.current.isEmpty === 'function') {
          return !sigCanvas.current.isEmpty();
        }
        
        // Fallback to comparing canvas data
        if (sigCanvas.current.getTrimmedCanvas) {
          const canvasData = sigCanvas.current.getTrimmedCanvas().toDataURL();
          const emptyCanvas = document.createElement('canvas').toDataURL();
          return canvasData !== emptyCanvas;
        }
        
        // If we can't validate the canvas properly, allow submission anyway
        return true;
      } catch (err) {
        console.error("Error validating signature canvas:", err);
        // If there's an error checking the signature, allow submission anyway
        return true;
      }
    }
    return true; // Default to allowing submission
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not Set';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Update the handleGeneratePDF function
  const handleGeneratePDF = () => {
    setIsPdfGenerating(true);
    
    // Map the shipment data correctly, including all available information
    const deliveryData = {
      id: deliveryReceipt?.delivery_receipt_id,
      receipt_id: deliveryReceipt?.delivery_receipt_id,
      customer_name: customerName || deliveryReceipt?.received_by,
      contact_number: customerData?.phone_number,
      delivery_address: shipment?.destination_location,
      email: customerData?.email,
      order_id: shipment?.shipment_id,
      
      // Map carrier info properly
      carrier_id: shipment?.carrier_id,
      carrier_service_type: shipment?.carrier_service_type,
      
      // Use proper employee name for carrier
      carrier_name: getCarrierName(shipment?.carrier_id),
      packer_id: getEmployeeNameById(shipment?.packing_list_info?.packed_by),
      
      // Add shipping and financial information
      total_amount: deliveryReceipt?.total_amount || shipment?.shipping_cost_info?.total_shipping_cost,
      tracking_number: shipment?.tracking_number,
      
      // Pass full source warehouse array instead of a string
      source_warehouses: shipment?.source_warehouses || [],
      source_location: shipment?.source_location,
      
      // Add shipping dates
      shipment_date: shipment?.shipment_date,
      delivery_date: deliveryReceipt?.delivery_date,
      
      // Additional notes
      notes: deliveryReceipt?.notes || "Thank you for your business!",
      
      // Use the items_details array for the items
      items: shipment?.items_details || []
    };
  
    // Create a temporary div for rendering the PDF component
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
  
    // Use createRoot API for React 18
    const root = ReactDOM.createRoot(tempDiv);
    
    // Render the component
    root.render(
      <DeliveryReceiptPDF deliveryData={deliveryData} />
    );
    
    // Access the DOM after rendering
    setTimeout(() => {
      // Find the button in the rendered component and click it
      const generateButton = tempDiv.querySelector('button');
      if (generateButton) {
        generateButton.click();
      }
      
      // Cleanup after PDF generation
      setTimeout(() => {
        root.unmount();
        document.body.removeChild(tempDiv);
        setIsPdfGenerating(false);
      }, 2000);
    }, 500);
  };
  
  // Determine if receipt can be updated
  const canBeUpdated = deliveryReceipt && 
                       deliveryReceipt.receipt_status !== 'Received' && 
                       deliveryReceipt.receipt_status !== 'Rejected';
  
  // Helper function to display receiver with customer name if available
  const getReceiverDisplay = () => {
    if (customerName) {
      return customerName;
    } else if (deliveryReceipt?.received_by) {
      return deliveryReceipt.received_by;
    }
    return 'Not Yet Received';
  };
  
  return (
    <div className="modal-overlay">
      <div className="delivery-receipt-modal">
        <div className="modal-header">
          <h3>Delivery Receipt</h3>
          <button className="close-button" onClick={onCancel}>&times;</button>
        </div>
        
        <div className="modal-body">
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading delivery receipt...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">Error: {error}</p>
            </div>
          ) : !deliveryReceipt ? (
            <div className="error-container">
              <p className="error-message">No delivery receipt found</p>
            </div>
          ) : (
            <>
              <div className="info-section">
                <h4>Receipt Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Receipt ID</span>
                    <span className="info-value">{deliveryReceipt.delivery_receipt_id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Delivery Date</span>
                    <span className="info-value">{formatDate(deliveryReceipt.delivery_date)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status</span>
                    <span className={`info-value status-${deliveryReceipt.receipt_status?.toLowerCase()}`}>
                      {deliveryReceipt.receipt_status}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Receiver</span>
                    <span className="info-value">{getReceiverDisplay()}</span>
                  </div>
                  {deliveryReceipt.receiving_module && (
                    <div className="info-item">
                      <span className="info-label">Receiving Module</span>
                      <span className="info-value">{deliveryReceipt.receiving_module}</span>
                    </div>
                  )}
                  {deliveryReceipt.total_amount && (
                    <div className="info-item">
                      <span className="info-label">Total Amount</span>
                      <span className="info-value">₱ {deliveryReceipt.total_amount}</span>
                    </div>
                  )}
                </div>
                
                {/* Add PDF download button */}
                <div className="pdf-buttons" style={{ marginTop: '15px', textAlign: 'right' }}>
                  <button 
                    type="button"
                    className="save-button"
                    onClick={handleGeneratePDF}
                    disabled={isPdfGenerating}
                    style={{ 
                      backgroundColor: '#00a8a8',
                      cursor: isPdfGenerating ? 'wait' : 'pointer'
                    }}
                  >
                    {isPdfGenerating ? 'Generating PDF...' : 'Download Receipt PDF'}
                  </button>
                </div>
              </div>
              
              {canBeUpdated ? (
                isRejecting ? (
                  // Rejection Form
                  <form onSubmit={handleReject}>
                    <div className="delivery-receipt-section">
                      <h4>Rejection Details</h4>
                      <div className="form-row">
                        <label className="form-label">Reason for Rejection:</label>
                        <textarea
                          className="form-textarea"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          required
                          placeholder="Please provide a detailed reason for rejecting this delivery"
                        />
                      </div>
                      
                      <div className="receipt-status-buttons">
                        <button
                          type="button"
                          className="cancel-button"
                          onClick={() => setIsRejecting(false)}
                          style={{ flex: 1 }}
                        >
                          Cancel Rejection
                        </button>
                        <button
                          type="submit"
                          className="danger-button"
                          style={{ flex: 1 }}
                          disabled={!rejectReason.trim()}
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  // Delivery Signature Form
                  <form onSubmit={handleSubmit}>
                    <div className="delivery-receipt-section">
                      <h4>Delivery Confirmation</h4>
                      
                      <div className="signature-mode-toggle">
                        <button 
                          type="button"
                          className={`mode-button ${signatureMode === 'type' ? 'active' : ''}`}
                          onClick={() => setSignatureMode('type')}
                        >
                          Type Signature
                        </button>
                        <button
                          type="button"
                          className={`mode-button ${signatureMode === 'draw' ? 'active' : ''}`}
                          onClick={() => setSignatureMode('draw')}
                        >
                          Draw Signature
                        </button>
                      </div>
                      
                      <div className="form-row">
                        <label className="form-label">Receiver Signature:</label>
                        {signatureMode === 'type' ? (
                          <div className="signature-box">
                            <input
                              className="signature-input"
                              value={signature}
                              onChange={(e) => setSignature(e.target.value)}
                              placeholder="Type signature or confirmation code here"
                              // required
                            />
                          </div>
                        ) : (
                          <div className="signature-canvas-container">
                            <SignatureCanvas
                              ref={sigCanvas}
                              penColor="black"
                              canvasProps={{
                                width: 500,
                                height: 200,
                                className: 'signature-canvas'
                              }}
                            />
                            <button 
                              type="button" 
                              className="clear-signature-button"
                              onClick={clearSignature}
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="receipt-status-buttons">
                        <button
                          type="submit"
                          className="receipt-status-button receive"
                          disabled={!isSignatureValid()}
                        >
                          Confirm Receipt
                        </button>
                        <button
                          type="button"
                          className="receipt-status-button reject"
                          onClick={() => setIsRejecting(true)}
                        >
                          Reject Delivery
                        </button>
                      </div>
                    </div>
                  </form>
                )
              ) : (
                <div className={deliveryReceipt.receipt_status === 'Received' ? 'delivered-message' : 'failed-message'}>
                  {deliveryReceipt.receipt_status === 'Received' ? (
                    <p>This delivery has been confirmed as received. No further action is required.</p>
                  ) : (
                    <p>This delivery has been rejected. Please check the rework orders for further processing.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            type="button" 
            className="cancel-button"
            onClick={onCancel}
          >
            Close
          </button>
        </div>
      </div>
      
      {/* The PDF component will be created dynamically when needed */}
    </div>
  );
};

export default DeliveryReceiptModal;