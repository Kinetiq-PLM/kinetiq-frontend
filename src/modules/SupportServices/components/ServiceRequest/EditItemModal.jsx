"use client"

import { useRef, useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceAnalysisIcon from "/icons/SupportServices/ServiceAnalysisIcon.png"
import ViewInventoryModal from "./ViewInventoryModal"

import { GET } from "../../api/api"

const EditItemModal = ({ isOpen, onClose, onEdit, item, onViewInventory }) => {
  const [orderId, setOrderId] = useState("")
  const [itemId, setItemId] = useState("")
  const [principalItemId, setPrincipalItemId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [markupPrice, setMarkupPrice] = useState("")
  const [itemName, setItemName] = useState("")
  const [totalPrice, setTotalPrice] = useState("")
  const [warehouseId, setWarehouseId] = useState("")
  const [warehouseName, setWarehouseName] = useState("")
  const [warehouseLocation, setWarehouseLocation] = useState("")

  const [items, setItems] = useState([]);
  const [isItemsDropdown, setItemsDropdown] = useState(false)
  const [showViewInventoryModal, setShowViewInventoryModal] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (item) {
      console.log("item: ", item)
      setOrderId(item.service_order_item_id || "")
      setItemId(item.item?.inventory_item_id || "")
      setPrincipalItemId(item.principal_item?.principal_item_id || "")
      setQuantity(item.item_quantity || "")
      setMarkupPrice(item.principal_item?.mark_up_price || "")
      setItemName(item.item_name || "")
      setTotalPrice(item.total_price || "")
      setWarehouseId(item.warehouse?.warehouse_id || "")
      setWarehouseName(item.warehouse?.warehouse_name || "")
      setWarehouseLocation(item.warehouse?.warehouse_location || "")
    }
  }, [item]);

  const fetchItems= async () => {
    try {
      const data = await GET("order/inventory/items/");
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleToggleItems = () => {
    if (!isItemsDropdown) {
      fetchItems(); 
      setItemsDropdown(true);
    }
    setItemsDropdown(!isItemsDropdown);
  };

  const handleSelectItem = (item) => {
    setItemId(item.inventory_item_id);
    setItemName(item?.item?.item_name || "");
    setWarehouseId(item?.warehouse?.warehouse_id ||  "");
    setWarehouseName(item?.warehouse?.warehouse_name ||  "");
    setWarehouseLocation(item?.warehouse?.warehouse_location ||  "");
    setPrincipalItemId("")
    setMarkupPrice("0.00")
    setTotalPrice("0.00")
    setItemsDropdown(false);
  };

  const handleSelectItemInventory = (item) => {
    setItemId(item.inventory_item_id);
    setItemName(item?.item?.item_name || "");
    setWarehouseId(item?.warehouse?.warehouse_id ||  "");
    setWarehouseName(item?.warehouse?.warehouse_name ||  "");
    setWarehouseLocation(item?.warehouse?.warehouse_location ||  "");
    setPrincipalItemId("")
    setMarkupPrice("0.00")
    setTotalPrice("0.00")
    setShowViewInventoryModal(false)
  };

  const handleViewInventory = () => {
    setShowViewInventoryModal(true)
  }

  const handleEdit = () => {
    if (!/^\d+$/.test(quantity)) {
      setErrorMessage("Invalid quantity, please enter a valid number.");
      setShowModal(true);
      return;
    }

    onEdit({
      item_id: itemId,
      principal_item_id: principalItemId,
      item_quantity: quantity,
      item_price: markupPrice,
      total_price: totalPrice,
      service_order_item_id: orderId,
      item_name: itemName,
      warehouse_id: warehouseId
    })
  }

  const itemRef = useRef(null);
  const principalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (itemRef.current && !itemRef.current.contains(event.target)) {
        setItemsDropdown(false); // Close the dropdown
      }
      if (principalRef.current && !principalRef.current.contains(event.target)) {
        setPrincipalDropdown(false); // Close the dropdown
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container edit-item-modal">
        <div className="modal-header" style={{ borderBottom: "2px solid #00a8a8" }}>
          <div className="modal-header-left">
            <img
              src={ServiceAnalysisIcon || "/placeholder.svg?height=24&width=24"}
              alt="Service Analysis"
              className="modal-header-icon"
            />
            <h2>Edit Item</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg?height=20&width=20"} alt="Close" />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="itemId">
                  Item ID 
                </label>
                <div className="select-wrapper" ref={itemRef}>
                  <input
                    type="text"
                    id="itemId"
                    value={itemId}
                    onChange={(e) => {
                      setItemId(e.target.value);
                      setItemsDropdown(true); // show dropdown on typing
                    }}
                    onClick={handleToggleItems}
                    placeholder="Enter item ID"
                  />
                  <span className="select-arrow" onClick={handleToggleItems}>▼</span>
                  {isItemsDropdown && (
                  <ul className="dropdown-list">
                    {items.length > 0 ? (
                      items
                        .filter((item) =>
                          item.inventory_item_id.toLowerCase().includes(itemId.toLowerCase())
                        )
                        .map((item) => (
                          <li key={item.inventory_item_id} onClick={() => handleSelectItem(item)}>
                            {item.inventory_item_id}
                          </li>
                        ))
                    ) : (
                      <li>No item ID found</li>
                    )}
                  </ul>
                )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="warehouseId">Warehouse ID</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="warehouseId"
                    readOnly
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    placeholder="Enter warehouse ID"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                  <label htmlFor="itemName">Item Name</label>
                  <input
                    type="text"
                    id="itemName"
                    readOnly
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="form-group">
                <label htmlFor="warehouseName">Warehouse Name</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="warehouseName"
                    readOnly
                    value={warehouseName}
                    onChange={(e) => setWarehouseName(e.target.value)}
                    placeholder="Enter warehouse name"
                  />
                </div>
              </div>
            </div>
            <div className="form-row">
            <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="text"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                  />
                </div>
              <div className="form-group">
                <label htmlFor="warehouseLocation">Warehouse Location</label>
                <input
                  type="text"
                  id="warehouseLocation"
                  readOnly
                  value={warehouseLocation}
                  onChange={(e) => setWarehouseLocation(e.target.value)}
                  placeholder="Enter warehouse location"
                />
              </div>
            </div>      
            <div className="form-row">
            <div className="form-group">
                <label htmlFor="principalItemId">Principal Item ID</label>
                <div className="select-wrapper" ref={principalRef}>
                  <input
                    type="text"
                    id="principalItemId"
                    readOnly
                    value={principalItemId}
                    onChange={(e) => setPrincipalItemId(e.target.value)}
                    placeholder="Enter principal item ID"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="markupPrice">Markup Price</label>
                <input
                  type="text"
                  id="markupPrice"
                  readOnly
                  value={markupPrice}
                  onChange={(e) => setMarkupPrice(e.target.value)}
                  placeholder="Enter markup price"
                />
              </div>
              
            </div>

            
          </div>
        </div>

        <div className="inventory-request-section">  
          <button className="update-modal-button" onClick={handleViewInventory}>
              View Inventory
            </button>
          <div className="add-cancel-button">
              <button className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button className="update-modal-button" onClick={handleEdit}>
                Edit
              </button>
              </div>
        </div>

        {showViewInventoryModal && (
        <ViewInventoryModal
          isOpen={showViewInventoryModal}
          onClose={() => setShowViewInventoryModal(false)}
          onSelectItem={(item) => {
            console.log("Selected item:", item)
            handleSelectItemInventory(item)
            setShowViewInventoryModal(false)
          }}
        />
      )}

      {showModal && (
        <div className="alert-modal-overlay">
          <div className="alert-modal-content">
            <h2>⚠  WARNING</h2>
            <p>{errorMessage}</p>
            <button className="alert-okay-button" onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default EditItemModal

