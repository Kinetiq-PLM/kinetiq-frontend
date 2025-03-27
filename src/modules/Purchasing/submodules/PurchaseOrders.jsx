import React, { useState } from "react";
import "../styles/PurchaseOrders.css";

const PurchaseOrder = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const items = [
        {
            id: 1,
            name: "Office Chair",
            image: "/images/Chair.png",
            material: "Wood, Fabric, Polyester",
            quantity: 1000,
            price: 500,
            discount: 20,
            taxCode: "TC001",
            total: 5000
        },
        {
            id: 2,
            name: "Wooden Table",
            image: "/images/table.png",
            material: "Wood",
            quantity: 1000,
            price: 500,
            discount: 20,
            taxCode: "TC001",
            total: 5000
        },
        {
            id: 3,
            name: "Wooden Door",
            image: "/images/door.png",
            material: "Wood",
            quantity: 1000,
            price: 500,
            discount: 20,
            taxCode: "TC001",
            total: 5000
        }
    ];

    const handleBack = () => {
        // Add navigation logic here
        console.log("Back button clicked");
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        console.log("Item clicked:", item);
    };

    const handleCancel = () => {
        // Add cancel logic here
        console.log("Cancel clicked");
    };

    const handleSubmit = () => {
        // Add submit logic here
        console.log("Submit clicked");
    };

    const ItemDetailModal = ({ item, onClose }) => {
        if (!item) return null;
    
        return (
            <div className="purchord-modal-overlay" onClick={onClose}>
                <div className="purchord-modal-content" onClick={e => e.stopPropagation()}>
                    <button className="purchord-modal-close" onClick={onClose}>×</button>
                    <div className="purchord-modal-header">
                        <h2>{item.name}</h2>
                    </div>
                    <div className="purchord-modal-body">
                        <div className="purchord-modal-image-container">
                            <img src={item.image} alt={item.name} className="purchord-modal-image" />
                        </div>
                        <div className="purchord-modal-details">
                            <div className="purchord-modal-info">
                                <h3>Material:</h3>
                                <p>{item.material}</p>
                            </div>
                            <div className="purchord-modal-pricing">
                                <div className="purchord-modal-price-item">
                                    <span>Quantity</span>
                                    <span>{item.quantity}</span>
                                </div>
                                <div className="purchord-modal-price-item">
                                    <span>Unit Price</span>
                                    <span>₱{item.price}</span>
                                </div>
                                <div className="purchord-modal-price-item">
                                    <span>Discount</span>
                                    <span>{item.discount}%</span>
                                </div>
                                <div className="purchord-modal-price-item">
                                    <span>Tax Code</span>
                                    <span>{item.taxCode}</span>
                                </div>
                                <div className="purchord-modal-price-item total">
                                    <span>Total</span>
                                    <span>₱{item.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="purchord">
            <div className="body-content-container">
                <button className="purchord-back-button" onClick={handleBack}>← Back</button>
                <h2 className="purchord-title">Purchase Order</h2>

                {/* Outer Content Container (Holds Everything Except Title & Back Button) */}
                <div className="purchord-main-container">
                    {/* Customer & Supplier Details */}
                    <div className="purchord-details-container">
                        <div className="purchord-customer-container">
                            <p><strong>Customer Name:</strong> <span>Son Goku</span></p>
                            <p><strong>Customer Address:</strong> <span>Warehouse 1</span></p>
                            <p><strong>RFQ Name:</strong> <span>Zodiac</span></p>
                            <p><strong>RFQ Number:</strong> <span>RFQ00001</span></p>
                            <p><strong>Order Date:</strong> <span>01/30/2025</span></p>
                            <p><strong>Delivery Date:</strong> <span>02/14/2025</span></p>
                        </div>
                        <div className="purchord-supplier-container">
                            <p><strong>Supplier Name:</strong> <span>Kinetiq</span></p>
                            <p><strong>Status:</strong> <span>Open</span></p>
                            <p><strong>Delivery Terms:</strong> <span>30 Days</span></p>
                            <p><strong>Document Date:</strong> <span>01/30/2025</span></p>
                            <p><strong>Payment Terms:</strong> <span>30 Days</span></p>
                            <p><strong>Document No.:</strong> <span>001223</span></p>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="purchord-items-container">
                        {items.map(item => (
                            <div 
                                key={item.id}
                                className="purchord-item-card"
                                onClick={() => handleItemClick(item)}
                            >
                                <img src={item.image} alt={item.name} className="purchord-item-image" />
                                <div className="purchord-item-details">
                                    <h3>{item.name}</h3>
                                    <p><strong>Material:</strong> {item.material}</p>
                                </div>
                                <div className="purchord-item-pricing">
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                    <p><strong>Unit Price:</strong> ₱{item.price}</p>
                                    <p><strong>Discount:</strong> {item.discount}%</p>
                                    <p><strong>Tax Code:</strong> {item.taxCode}</p>
                                    <p><strong>Total:</strong> ₱{item.total}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Section */}
                    <div className="purchord-summary">
                        <p><strong>Total Before Discount:</strong> 15,000.00</p>
                        <p><strong>Discount (20%):</strong> 3,000.00</p>
                        <p><strong>Freight:</strong> 50.00</p>
                        <p><strong>Tax:</strong> 160.00</p>
                        <h3><strong>Total Payment Due:</strong> 12,210.00</h3>
                    </div>
                </div>
            </div>

            {/* Item Detail Modal */}
            <ItemDetailModal 
                item={selectedItem} 
                onClose={() => setSelectedItem(null)} 
            />
        </div>
    );
};

export default PurchaseOrder;
