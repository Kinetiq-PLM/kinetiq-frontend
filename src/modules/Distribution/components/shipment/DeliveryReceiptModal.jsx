// components/shipment/DeliveryReceiptModal.jsx
import React, { useState, useEffect } from 'react';

const DeliveryReceiptModal = ({ shipment, onSave, onCancel }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryReceipt, setDeliveryReceipt] = useState(null);
  const [error, setError] = useState(null);
  
  // Form state
  const [signature, setSignature] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  
  // Fetch delivery receipt on component mount
  useEffect(() => {
    const fetchDeliveryReceipt = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!shipment.delivery_receipt_id) {
          throw new Error('No delivery receipt found for this shipment');
        }
        
        const response = await fetch(`http://127.0.0.1:8000/api/delivery-receipts/${shipment.delivery_receipt_id}/`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch delivery receipt');
        }
        
        const data = await response.json();
        setDeliveryReceipt(data);
        
        // Initialize form state with existing data
        if (data.signature) {
          setSignature(data.signature);
        }
        
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchDeliveryReceipt();
  }, [shipment.delivery_receipt_id]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!deliveryReceipt) return;
    
    const updates = {
      ...deliveryReceipt,
      signature: signature,
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
  
  // Determine if receipt can be updated
  const canBeUpdated = deliveryReceipt && 
                       deliveryReceipt.receipt_status !== 'Received' && 
                       deliveryReceipt.receipt_status !== 'Rejected';
  
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
                    <span className="info-value">{deliveryReceipt.received_by || 'Not Yet Received'}</span>
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
                      <span className="info-value">₱ {deliveryReceipt.total_amountb}</span>
                    </div>
                  )}
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
                      <div className="form-row">
                        <label className="form-label">Receiver Signature:</label>
                        <div className="signature-box">
                          <input
                            className="signature-input"
                            value={signature}
                            onChange={(e) => setSignature(e.target.value)}
                            placeholder="Type signature or confirmation code here"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="receipt-status-buttons">
                        <button
                          type="submit"
                          className="receipt-status-button receive"
                          disabled={!signature.trim()}
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
    </div>
  );
};

export default DeliveryReceiptModal;