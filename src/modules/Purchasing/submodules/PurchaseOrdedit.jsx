import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PurchaseOrders.css";

const PurchaseOrderEdit = ({ purchaseOrder, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    status: "",
    delivery_date: new Date().toISOString().split("T")[0],
    remarks: "" // Added remarks field
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null); // Store temporarily if awaiting confirmation

  // Fetch the latest purchase order data when component mounts
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/purchase-orders/list/`
        );
        const order = response.data.find(
          po => po.purchase_id === purchaseOrder.purchase_id
        );
        
        if (order) {
          setOriginalData(order);
          setFormData({
            status: order.status || "",
            delivery_date: new Date().toISOString().split("T")[0],
            remarks: order.remarks || ""
          });
        }
      } catch (error) {
        console.error("Error fetching purchase order:", error);
        setError("Failed to load purchase order details");
      }
    };

    fetchPurchaseOrder();
  }, [purchaseOrder.purchase_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = {
      status: formData.status,
      delivery_date: formData.delivery_date,
      remarks: formData.remarks || null
    };

    const changedFields = {};
    Object.keys(payload).forEach(key => {
      if (JSON.stringify(payload[key]) !== JSON.stringify(originalData[key])) {
        changedFields[key] = payload[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      setError("No changes detected");
      setIsLoading(false);
      return;
    }

    // If status is being set to "Completed", show confirmation
    if (formData.status === "Completed" && originalData.status !== "Completed") {
      setPendingChanges(changedFields); // Store the pending patch
      setShowConfirmModal(true); // Show the modal
      setIsLoading(false);
      return;
    }

    // Proceed with normal update if not Completed
    await submitChanges(changedFields);
  };

  const submitChanges = async (changedFields) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/purchase-orders/edit/${purchaseOrder.purchase_id}/`,
        changedFields,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log("Update successful:", response.data);

      // If status is Completed, create shipment
      if (changedFields.status === "Completed") {
        const shipmentPayload = {
          delivery_date: new Date().toISOString().split("T")[0], // Current date
          purchase_id: purchaseOrder.purchase_id, // Send the full purchase_id
        };

        console.log("Shipment Payload:", shipmentPayload); // Debug log

        try {
          const shipmentResponse = await axios.post(
            "http://127.0.0.1:8000/api/received-shipment/create/",
            shipmentPayload,
            { headers: { 'Content-Type': 'application/json' } }
          );
          console.log("Shipment created:", shipmentResponse.data);
        } catch (shipmentError) {
          console.error("Error creating shipment:", shipmentError);
          if (shipmentError.response) {
            console.error("Error details:", shipmentError.response.data);
            setError(`Failed to create shipment: ${shipmentError.response.data.detail || 'Unknown error'}`);
          } else {
            setError("Failed to create shipment: " + shipmentError.message);
          }
        }
      }

      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          const errorMessages = Object.entries(error.response.data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
          setError(`Validation errors:\n${errorMessages}`);
        } else {
          setError(error.response.data);
        }
      } else {
        setError(error.message || "Failed to update purchase order");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="po-edit-modal">
      <div className="po-edit-content" onClick={(e) => e.stopPropagation()}>
        <button className="po-edit-close" onClick={onClose}>×</button>
        <h2>Edit Purchase Order #{purchaseOrder?.purchase_id}</h2>
        {error && (
          <div className="po-edit-error">
            <pre>{error}</pre>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="po-edit-form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="po-edit-form-group">
            <label>Delivery Date</label>
            <input
              type="date"
              name="delivery_date"
              value={formData.delivery_date}
              onChange={handleInputChange}
            />
          </div>
          <div className="po-edit-form-group">
            <label>Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <div className="po-edit-buttons">
            <button
              type="button"
              className="po-edit-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="po-edit-submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="po-confirm-overlay" onClick={() => setShowConfirmModal(false)}>
            <div className="po-confirm-modal" onClick={(e) => e.stopPropagation()}>
              <p>Are you sure you want to mark this order as <strong>Completed</strong>?</p>
              <div className="po-confirm-buttons">
                <button
                  className="confirm-no"
                  onClick={() => setShowConfirmModal(false)}
                >
                  No
                </button>
                <button
                  className="confirm-yes"
                  onClick={() => {
                    setShowConfirmModal(false);
                    submitChanges(pendingChanges);
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrderEdit;