import React, { useState, useEffect } from "react";
import "../styles/GoodsReceipt.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';

const GoodsReceipt = ({ onBack, onSuccess, selectedData, selectedButton }) => {
  const date_today = new Date().toISOString().split('T')[0];


  const isCreateMode = selectedButton === "Create";


 
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [activeTab, setActiveTab] = useState("document");
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [selectedSerialNumbers, setSelectedSerialNumbers] = useState([]);
 
  const calculateInitialAmount = () => {
    if (isCreateMode) return 0;
    return selectedData.document_items.reduce((sum, item) => {
      return sum + parseFloat(item.quantity * item.cost);
    }, 0).toFixed(2);
  };
  const [initialAmount, setInitialAmount] = useState(calculateInitialAmount());


  const statusOptions = ["Open", "Closed", "Cancelled", "Draft"];


  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [vendorID, setVendorID] = useState("");
  const [vendorList, setVendorList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {
    if (selectedData?.status) {
      setSelectedStatus(selectedData.status); // Set selectedStatus from selectedData
    }
  }, [selectedData]);




  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/operation/supplier/");
      if (!response.ok) throw new Error("Connection to database failed");








      const data = await response.json();








      if (!Array.isArray(data.vendors)) throw new Error("Invalid goods data format");
      setVendorList(data.vendors);
      if (!Array.isArray(data.employees)) throw new Error("Invalid goods data format");
      setEmployeeList(data.employees)








    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVendors();
   
  }, []);




  const handleVendorChange = (e) => {
    const vendorName = e.target.value;
    setSelectedVendor(vendorName);
    const selectedVendorData = vendorList.find(v => v.vendor_name === vendorName);
    setVendorID(selectedVendorData ? selectedVendorData.vendor_code : null);
    setContactPerson(selectedVendorData ? selectedVendorData.contact_person : "");
  };




  useEffect(() => {
    if (vendorList.length > 0) {
      const matchedVendor = vendorList.find(v => v.vendor_code === selectedData.vendor_code);
      if (matchedVendor) {
        setSelectedVendor(matchedVendor.vendor_name);
        setVendorID(matchedVendor.vendor_code);
        setContactPerson(matchedVendor.contact_person);
      }
      const matchedEmployee = employeeList.find(emp => emp.employee_id === selectedData.employee_id);
      if (matchedEmployee) {
        setSelectedOwner(matchedEmployee.employee_name);
      }
    }
  }, [vendorList, selectedData.vendor_code, employeeList, selectedData.employee_id]);




  const [documentItems, setDocumentItems] = useState(
    isCreateMode ? [{}] : [...selectedData.document_items, {}]
  );








 
  const today = new Date().toISOString().slice(0, 10);
  // Initialize document details differently for create mode
  const [documentDetails, setDocumentDetails] = useState({
    vendor_code: isCreateMode ? "" : vendorID,
    vendor_name: isCreateMode ? "" : selectedVendor,
    contact_person: isCreateMode ? "" : contactPerson,
    buyer: isCreateMode ? "" : selectedData.buyer || "",
    owner: isCreateMode ? "" : selectedOwner,
    transaction_id: isCreateMode ? "" : selectedData.transaction_id || "",
    delivery_date: isCreateMode ? today : selectedData.delivery_date || "",
    status: isCreateMode ? "Draft" : selectedStatus,
    posting_date: isCreateMode ? today  : selectedData.posting_date || "",
    document_no: isCreateMode ? "" : selectedData.document_no || "",
    document_date: isCreateMode ? today  : selectedData.document_date || "",
    initialAmount: initialAmount || 0,
    tax_rate: isCreateMode ? 0 : selectedData.tax_rate || 0,
    tax_amount: isCreateMode ? 0 : selectedData.tax_amount || 0,
    discount_rate: isCreateMode ? 0 : selectedData.discount_rate || 0,
    discount_amount: isCreateMode ? 0 : selectedData.discount_amount || 0,
    freight: isCreateMode ? 0 : selectedData.freight || 0,
    transaction_cost: isCreateMode ? 0 : selectedData.transaction_cost || 0,
  });








  useEffect(() => {
    const fetchNextDocumentIds = async () => {
      if (isCreateMode) {
        try {
          const response = await fetch('http://127.0.0.1:8000/operation/goods-tracking/get-next-doc-ids/');
          if (!response.ok) throw new Error('Failed to fetch next document IDs');
         
          const data = await response.json();
         
          setDocumentDetails(prev => ({
            ...prev,
            document_no: data.next_document_no,
            transaction_id: data.next_transaction_id
          }));
         
        } catch (error) {
          toast.error('Error fetching next document IDs:', error);
          return
        }
      }
    };
 
    fetchNextDocumentIds();
  }, [isCreateMode]);








  const handleInputChange = async (e, index, field) => {
    const updatedItems = [...documentItems];
    const currentItem = updatedItems[index];




    // Handle date fields
    if (field === 'manuf_date' || field === 'expiry_date') {
      updatedItems[index] = {
        ...currentItem,
        product_details: {
          ...(currentItem.product_details || {}),
          [field]: e.target.value // This will be in YYYY-MM-DD format from the date input
        }
      };
    } else {
      updatedItems[index][field] = e.target.value;
    }
    setDocumentItems(updatedItems);








    // Check if the row is NOT the last row and the item_name was cleared
    if (index !== updatedItems.length - 1 && currentItem.item_name.trim() === '') {
      // If this item exists in the database, delete it
      try {
        await fetch(`http://127.0.0.1:8000/operation/document-item/${currentItem.content_id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            document_id: "",  // or null, depending on the backend expectations
          }),
        });
      } catch (error) {
        toast.error('Error deleting row from database:', error);
      }
 
      // Remove the item from local state
      updatedItems.splice(index, 1);
      setDocumentItems(updatedItems);
    }
 
    // If you're editing the last row and it was just filled, add a new row
    if (index === documentItems.length - 1) {
      handleAddRow();
    }
  };
 
  const reloadDocumentItems = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/operation/goods-tracking/${selectedData.document_id}/`);
      if (!response.ok) throw new Error('Failed to reload document');
      const updatedData = await response.json();
      return updatedData.document_items;
    } catch (error) {
      toast.error('Reload error:', error);
      return [];
    }
  };
  const [isAddingRow, setIsAddingRow] = useState(false);
  const handleAddRow = async () => {
    const lastRow = documentItems[documentItems.length - 1];
   
    if (isRowFilled(lastRow)) {
      try {
        setIsAddingRow(true);
        if (isCreateMode) {
          // In create mode, just add the item to state without API calls
          const updatedItems = [...documentItems];
          updatedItems[updatedItems.length - 1] = {
            ...lastRow,
            // Calculate total for display
            total: (parseFloat(lastRow.quantity) * (parseFloat(lastRow.cost))).toFixed(2)
          };
         
          // Add new empty row
          updatedItems.push({
            item_id: '',
            item_name: '',
            unit_of_measure: '',
            quantity: '',
            cost: '',
            warehouse_id: ''
          });
 
          setDocumentItems(updatedItems);
          return
        }else{
        // Prepare the payload
        const payload = {
          document_id: selectedData.document_id,
          quantity: parseInt(lastRow.quantity),
          cost: parseFloat(lastRow.cost),
          warehouse_id: lastRow.warehouse_id,
        };
 
        // Set the appropriate item type field
        if (lastRow.item_id.startsWith("ADMIN-MATERIAL")) {
          payload.material_id = lastRow.item_id;
        } else if (lastRow.item_id.startsWith("ADMIN-ASSET")) {
          payload.asset_id = lastRow.item_id;
        } else if (lastRow.item_id.startsWith("ADMIN-PROD")) {
          // First create product docu item
          const productDocuResponse = await fetch('http://127.0.0.1:8000/operation/create-items/create-product-docu-item/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              product_id: lastRow.item_id,
              document_id: selectedData.document_id,
              manufacturing_date: lastRow.manufacturing_date,
              expiry_date: lastRow.manufacturing_date
            })
          });
         
          if (!productDocuResponse.ok) {
            const errorData = await productDocuResponse.json();
            throw new Error(`Create product item ${selectedData.content_id}: ${JSON.stringify(errorData)}`);
          }
          const productDocuItem = await productDocuResponse.json();
          payload.productdocu_id = productDocuItem.productdocu_id;
        }
 
        // Create the document item
        const createResponse = await fetch('http://127.0.0.1:8000/operation/create-items/create-document-item/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
 
        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          throw new Error(`Create item ${selectedData.content_id}: ${JSON.stringify(errorData)}`);
        }
        const createdItem = await createResponse.json();
 
        // Update state
        const freshItems = await reloadDocumentItems();
     
        // Find the newly created item by matching properties
        const newItem = freshItems.find(item =>
          item.item_id === lastRow.item_id &&
          item.quantity === parseInt(lastRow.quantity)
        );








        if (!newItem) {
          throw new Error('Newly created item not found in reloaded data');
        }








        // Update state with the fresh data
        const updatedItems = [...documentItems];
        updatedItems[updatedItems.length - 1] = {
          ...lastRow,
          content_id: newItem.content_id,
          productdocu_id: newItem.productdocu_id || null
        };
       
        updatedItems.push({
          item_id: '',
          item_name: '',
          unit_of_measure: '',
          quantity: '',
          cost: '',
          warehouse_id: ''
        });
 
        setDocumentItems(updatedItems);
        const response = await fetch(`http://127.0.0.1:8000/operation/goods-tracking/${selectedData.document_id}/`);




        if (!response.ok) {
          throw new Error('Network response was not ok');
        }




        const updatedDoc = await response.json();  
        updatedDoc.document_items.push({          
          item_id: '',
          item_name: '',
          unit_of_measure: '',
          quantity: '',
          cost: '',
          warehouse_id: ''
        });




        setDocumentItems(updatedDoc.document_items);  
      }
      } catch (error) {
        toast.error(`Failed to add item: ${error.message}`);
      } finally {
        setIsAddingRow(false);
      }
    }
  };
 
 
 
  const isRowFilled = (row) => {
    return (
      row.item_id &&
      row.item_name &&
      row.unit_of_measure &&
      row.quantity &&
      row.cost &&
      row.warehouse_id
    );
  };




  const [warehouseOptions, setWarehouseOptions] = useState([]);








  useEffect(() => {
    fetch('http://127.0.0.1:8000/operation/get-warehouseID/')
      .then((res) => res.json())
      .then((data) => {
        // Sort A–Z by location
        const sorted = data.sort((a, b) => a.warehouse_location.localeCompare(b.warehouse_location));
        setWarehouseOptions(sorted);
      })
      .catch((err) => toast.error('Error fetching warehouse options:', err));
  }, []);
 
  const [itemOptions, setItemOptions] = useState([]);








  useEffect(() => {
    fetch('http://127.0.0.1:8000/operation/item-data/')
      .then(res => res.json())
      .then(data => {
        const options = [];








        data.products.forEach(prod => {
          options.push({
            id: prod.product_id,
            name: prod.product_name,
            cost: parseFloat(prod.selling_price),
            unit: prod.unit_of_measure,
            type: 'product',
          });
        });








        data.material.forEach(mat => {
          options.push({
            id: mat.material_id,
            name: mat.material_name,
            cost: parseFloat(mat.cost_per_unit),
            unit: mat.unit_of_measure,
            type: 'material',
          });
        });








        data.asset?.forEach(asset => {
          options.push({
            id: asset.asset_id,
            name: asset.asset_name,
            cost: parseFloat(asset.purchase_price),
            unit: "---",
            type: 'asset',
          });
        });








        setItemOptions(options);
      });
  }, []);








  const handleItemSelection = async (index, selectedName) => {
    const updatedItems = [...documentItems];
    const currentItem = updatedItems[index];
 
    // If "-- Select Item --" was chosen (empty value)
    if (selectedName === "") {
      // Only delete if it's not the last row
      if (index !== updatedItems.length - 1) {
        // If this item exists in the database, delete it
        try {
          const confirmDelete = window.confirm('Are you sure you want to archive this row?');
          if (!confirmDelete) {
            // Reset the select value to the previous item name
            updatedItems[index] = {
              ...currentItem,
              item_name: currentItem.item_name || ''
            };
            setDocumentItems(updatedItems);
            return;
          }
 




          await fetch(`http://127.0.0.1:8000/operation/document-item/${currentItem.content_id}/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              document_id: "",  // or null, depending on the backend expectations
            }),
          });
         




        } catch (error) {
          toast.error('Error deleting row from database:', error);
          return;
        }
 
        // Remove the item from local state
        updatedItems.splice(index, 1);
      } else {
        // For last row, just clear the values
        updatedItems[index] = {
          ...currentItem,
          item_id: '',
          item_name: '',
          unit_of_measure: '',
          cost: ''
        };
      }
     
      setDocumentItems(updatedItems);
      return;
    }
 
    // Normal item selection
    const selectedItem = itemOptions.find(opt => opt.name === selectedName);
    if (!selectedItem) return;
 
    updatedItems[index] = {
      ...currentItem,
      item_name: selectedItem.name,
      item_id: selectedItem.id,
      cost: selectedItem.cost,
      unit_of_measure: selectedItem.unit,
    };
 
    setDocumentItems(updatedItems);
 
    // Add new row if this is the last row and we're selecting an item
    if (index === updatedItems.length - 1) {
      handleAddRow();
    }
  };








  useEffect(() => {
    const tax_amount = (documentDetails.tax_rate / 100) * initialAmount;
    const discount_amount = (documentDetails.discount_rate / 100) * initialAmount;
    const total = (parseFloat(initialAmount) + tax_amount - discount_amount + parseFloat(documentDetails.freight || 0)).toFixed(2);
 
    setDocumentDetails(prev => ({
      ...prev,
      tax_amount: tax_amount,
      discount_amount: discount_amount,
      total: total,
    }));
  }, [documentDetails.tax_rate, documentDetails.discount_rate, documentDetails.freight, initialAmount]);
 
 
  const handleDocumentDetailChange = (e, field) => {
    setDocumentDetails(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };








 
 
 
  // Add a new function to handle create operation
  const handleCreateDocument = async () => {
    try {
      if (!selectedOwner || !documentDetails.buyer){
        if(!selectedOwner){
          toast.error("Owner is required")
        }else if(!documentDetails.buyer){
          toast.error("Buyer Required")
        }
        return
      }
      // Prepare the document items for creation
      const itemsToCreate = documentItems.slice(0, -1); // Exclude the last empty row
     
      // Prepare the payload for the create API
      const payload = {
        document_type: "Goods Receipt",
        status: selectedStatus,
        vendor_code: vendorID || null,
        buyer: documentDetails.buyer,
        employee_id: employeeList.find(emp => emp.employee_name === selectedOwner)?.employee_id,
        delivery_date: documentDetails.delivery_date,
        posting_date: documentDetails.posting_date,
        document_date: documentDetails.document_date,
        document_no: documentDetails.document_no, // Add document_no from state
        transaction_id: documentDetails.transaction_id,
        initial_amount: documentDetails.initialAmount,
        tax_rate: documentDetails.tax_rate,
        tax_amount: documentDetails.tax_amount,
        discount_rate: documentDetails.discount_rate,
        discount_amount: documentDetails.discount_amount,
        freight: documentDetails.freight,
        transaction_cost: documentDetails.transaction_cost,
        document_items: itemsToCreate.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          quantity: item.quantity,
          cost: item.cost,
          warehouse_id: item.warehouse_id,
          batch: item.batch_no || null,
          ...(item.item_id.startsWith("ADMIN-PROD") && { product_id: item.item_id }),
          ...(item.item_id.startsWith("ADMIN-ASSET") && { asset_id: item.item_id }),
          ...(item.item_id.startsWith("ADMIN-MATERIAL") && { material_id: item.item_id }),
        }))
      };
      // Call the create API
      const response = await fetch('http://127.0.0.1:8000/operation/goods-tracking/custom-create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });








      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Create failed: ${JSON.stringify(errorData)}`);
      }








      const result = await response.json();
      toast.success('Create successful:', result);
     
      // Call onSuccess with the created data if needed
      onSuccess(result);
     
    } catch (error) {
      toast.error(`Failed to create document: ${error.message}`);
    }
  };
















  const handleBackWithUpdate = async () => {
    const updatedDocumentItems = documentItems.slice(0, -1);  // Assuming you want to update all document items except the last one
    const allProductDetails = documentItems.map(item => item.product_details).slice(0, -1);
 
    try {
      if (isCreateMode) {
        await handleCreateDocument();
      } else {
      // Step 1: Update Product Document Items
      for (let item of updatedDocumentItems) {
        if (item.item_id?.startsWith("PRD") && item.productdocu_id) {
        const updatedDocumentItemData = {
          product_id: item.item_id,
        };
        const documentItemResponse = await fetch(`http://127.0.0.1:8000/operation/product-docu-item/${item.productdocu_id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedDocumentItemData),
        });
 
        if (!documentItemResponse.ok) {
          const errorData = await documentItemResponse.json();
          throw new Error(`Product Items update failed for productdocu_id ${item.productdocu_id}: ${JSON.stringify(errorData)}`);
        }
       
        const documentItemResult = await documentItemResponse.json();
        console.log('Product Items update successful:', documentItemResult);
      }}
 
     
 
      // Step 3: Update ProductDocuItemData after DocumentItems
      //id name uom quanity cost total location serial
      for (let item of updatedDocumentItems) {
        const updateDocomentItems = {
          quantity: parseInt(item.quantity) || 0,
          cost: parseFloat(item.cost) || 0,
          total: (parseFloat(item.quantity * item.cost)).toFixed(2) || 0,
          warehouse_id: item.warehouse_id || "",
        };
        if (item.item_id?.startsWith("ADMIN-MATERIAL")) {
          updateDocomentItems.material_id = item.item_id;
        } else if (item.item_id?.startsWith("ADMIN-ASSET")) {
          updateDocomentItems.asset_id = item.item_id;
        } else if (item.item_id?.startsWith("ADMIN-PROD") && item.productdocu_id) {
          updateDocomentItems.productdocu_id = item.productdocu_id;
        }
        const productDocuItemResponse = await fetch(`http://127.0.0.1:8000/operation/document-item/${item.content_id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateDocomentItems),
        });
 
        if (!productDocuItemResponse.ok) {
          const errorData = await productDocuItemResponse.json();
          throw new Error(`document item update failed for content_id ${item.content_id}: ${JSON.stringify(errorData)}`);
        }
 
        const productDocuItemResult = await productDocuItemResponse.json();
        console.log('`document item update successful:', productDocuItemResult);
      }
      // Step 2: Update GoodsTrackingData last
      //vendor code name CP buyer owner
      //details TransactionID Status DocumentNo DeliveryDate posting date document date
      //initial amount discount rate discount amount freight tax rate tax amount total
      const updatedData = {
        status: selectedStatus,
        vendor_code: vendorID,
        buyer: documentDetails.buyer,
        employee_id: employeeList.find(emp => emp.employee_name === selectedOwner)?.employee_id,
        transaction_id: documentDetails.transaction_id,
        document_no: documentDetails.document_no,
        delivery_date: documentDetails.delivery_date,
        posting_date: documentDetails.posting_date,
        document_date: documentDetails.document_date,
        initial_amount: parseFloat(initialAmount) || 0,
        discount_rate: parseFloat(documentDetails.discount_rate) || 0,
        discount_amount: parseFloat(documentDetails.discount_amount).toFixed(2) || 0,
        tax_rate: parseFloat(documentDetails.tax_rate) || 0,
        tax_amount: parseFloat(documentDetails.tax_amount).toFixed(2) || 0,
        freight: parseFloat(documentDetails.freight) || 0,
        transaction_cost: parseFloat(documentDetails.total).toFixed(2) || 0,
      };
      const goodsTrackingResponse = await fetch(`http://127.0.0.1:8000/operation/goods-tracking/${selectedData.document_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
 
      if (!goodsTrackingResponse.ok) {
        const errorData = await goodsTrackingResponse.json();
        throw new Error(`GoodsTrackingData update failed for document_id ${selectedData.document_id}: ${JSON.stringify(errorData)}`);
      }
 
      const goodsTrackingResult = await goodsTrackingResponse.json();
      console.log('GoodsTrackingData update successful:', goodsTrackingResult);
      }
      if (onSuccess) {
        await onSuccess();  // Refresh the data in GoodsTracking
      }
 
      // ✅ Then call onBack to close GoodsReceiptPO and go back
      if (onBack) {
        onBack();  // Navigate back to GoodsTracking
      }
    } catch (error) {
      toast.error(`Failed to update data. Details: ${error.message}`);
    }
  };
 








  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState("");








  // Fetch purchase orders
  const fetchPurchaseOrders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/operation/purchase_order/");
      if (!response.ok) throw new Error("Failed to fetch purchase orders");
     
      const data = await response.json();
      setPurchaseOrders(data);
    } catch (error) {
      toast.error("Error fetching purchase orders:", error);
      setError(error.message);
    }
  };








  const handlePOSelect = async (poId) => {
    if (!poId) return;
    setSelectedPO(""); // Update the selected PO state
 
    try {
      // Fetch the selected purchase order details
      const response = await fetch(`http://127.0.0.1:8000/operation/purchase_order/${poId}/`);
      if (!response.ok) throw new Error("Failed to fetch purchase order details");
 
      const selectedPO = await response.json();
      const quotation = selectedPO.quotation_id || {};
 
      // Update document details with PO information
      setDocumentDetails(prev => ({
        ...prev,
        vendor_code: quotation.vendor_code || null,
        vendor_name: quotation.vendor_name || null,
        contact_person: quotation.contact_person || null,
        buyer: null,
        owner: quotation.request_id?.employee_name || null,
        delivery_date: selectedPO.delivery_date || null,
        status: "Draft",
        posting_date: date_today,
        document_date: selectedPO.document_date || null,
        tax_rate: parseFloat(quotation.tax || 0).toFixed(2),
        discount_rate: parseFloat(quotation.discount_percent || 0).toFixed(2),
        freight: parseFloat(quotation.freight || 0).toFixed(2),
      }));
 
      // Get item details from pre-fetched itemOptions
      const poItems = (selectedPO.quotation_contents || []).map(content => {
        const itemId = content.material_id || content.asset_id || content.product_id;
        const matchedItem = itemOptions.find(opt => opt.id === itemId);
        if (!matchedItem) return null;
 
        return {
          item_id: itemId,
          item_name: matchedItem.name,
          unit_of_measure: matchedItem.unit,
          cost: matchedItem.cost,
          quantity: content.purchase_quantity || 1,
          type: matchedItem.type,
        };
      }).filter(item => item !== null);
 
      // Calculate initial amount
      const poInitialAmount = poItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
      setInitialAmount(poInitialAmount.toFixed(2));
      // Set document items (add empty row)
      setDocumentItems([...poItems, {}]);
 
    } catch (error) {
      toast.error(`Failed to load PO data: ${error.message}`);
    }
  };
 








  useEffect(() => {
    if (isCreateMode) {
      fetchPurchaseOrders();
    }
  }, [isCreateMode]);
 
  useEffect(() => {
    const tax_amount = (documentDetails.tax_rate / 100) * initialAmount;
    const discount_amount = (documentDetails.discount_rate / 100) * initialAmount;
    const total = parseFloat(initialAmount) + tax_amount - discount_amount + parseFloat(documentDetails.freight || 0).toFixed(2);
 
    setDocumentDetails(prev => ({
      ...prev,
      tax_amount: tax_amount,
      discount_amount: discount_amount,
      transaction_cost: total,
    }));
  }, [documentDetails.tax_rate, documentDetails.discount_rate, documentDetails.freight, initialAmount]);
  useEffect(() => {
      const newInitialAmount = documentItems
        .slice(0, -1) // exclude the last empty row
        .reduce((sum, item) => {
          return sum + (parseFloat(item.quantity || 0) * parseFloat(item.cost || 0));
        }, 0)
        .toFixed(2);
     
      setInitialAmount(newInitialAmount);
    }, [documentItems]);


  return (
    <div className="gr">
      <div className="body-content-container">
        <div className="back-button" onClick={onBack}>← Back</div>
        <div className="content-wrapper">
          <div className="details-grid">
            <div className="details-section">
              {/* Vendor Code (ID) */}
              <div className="detail-row">
                <label>Vendor Code</label>
                <input type="text" value={vendorID} style={{ cursor: 'not-allowed' }} readOnly/>
              </div>


              {/* Vendor Name Dropdown */}
              <div className="detail-row dropdown-scrollbar">
                <label>Vendor Name</label>
                <select value={selectedVendor} onChange={handleVendorChange}>
                  <option value="">Select Vendor</option>
                  {loading ? (
                    <option value="">Loading vendors...</option>
                  ) : (
                    vendorList.map((vendor) => (
                      <option key={vendor.vendor_code} value={vendor.vendor_name}>
                        {vendor.vendor_name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              {/* Contact Person */}
              <div className="detail-row">
                <label>Contact Person</label>
                <input type="text" value={contactPerson} style={{ cursor: 'not-allowed' }} readOnly/>
              </div>








              <div className="detail-row">
                <label>Buyer</label>
                <input
                  type="text"
                  value={documentDetails.buyer}
                  onChange={(e) => handleDocumentDetailChange(e, "buyer")}
                />
              </div>

              <div className="detail-row">
                <label>Owner</label>
                <select value={selectedOwner} onChange={(e) => setSelectedOwner(e.target.value)}>
                  <option value="">Select Owner</option>
                  {loading ? (
                    <option value="">Loading employees...</option>
                  ) : (
                    employeeList.map((employee) => (
                      <option key={employee.employee_id} value={employee.employee_name}>
                        {employee.employee_name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Details Document */}
            <div className="details-section tabbed-section">
              <div className="section-tabs">
                <button
                  className={`tab-button ${activeTab === 'document' ? 'active' : ''}`}
                  onClick={() => setActiveTab('document')}
                >
                  Document Details
                </button>
                <button
                  className={`tab-button ${activeTab === 'cost' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cost')}
                >
                  Cost Details
                </button>
              </div>
             
              {activeTab === 'document' ? (
                <div className="tab-content">
                  <div className="detail-row">
                    <label>Transaction ID</label>
                    <input
                      type="text"
                      value={documentDetails.transaction_id}
                      onChange={(e) => handleDocumentDetailChange(e, "transaction_id")}
                      style={{ cursor: 'not-allowed' }}
                      readOnly
                    />
                  </div>
                  <div className="detail-row">
                    <label>Delivery Date</label>
                    <div className="date-input clickable">
                      <input
                        type="date"
                        defaultValue="2025-02-02"
                        value={documentDetails.delivery_date}
                        onChange={(e) => handleDocumentDetailChange(e, "delivery_date")}
                      />
                      <span className="calendar-icon">📅</span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <label>Status</label>
                    <select
                      className="form-select"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="detail-row">
                    <label>Posting Date</label>
                    <div className="date-input clickable">
                      <input
                        type="date"
                        defaultValue="2025-01-31"
                        value={documentDetails.posting_date}
                        onChange={(e) => handleDocumentDetailChange(e, "posting_date")}
                      />
                      <span className="calendar-icon">📅</span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <label>Document No</label>
                    <input
                      type="text"
                      value={documentDetails.document_no}
                      onChange={(e) => handleDocumentDetailChange(e, "document_no")}
                      style={{ cursor: 'not-allowed' }}
                      readOnly
                    />
                  </div>
                  <div className="detail-row">
                    <label>Document Date</label>
                    <div className="date-input clickable">
                      <input
                        type="date"
                        defaultValue="2025-01-31"
                        value={documentDetails.document_date}
                        onChange={(e) => handleDocumentDetailChange(e, "document_date")}
                      />
                      <span className="calendar-icon">📅</span>
                    </div>
                  </div>
                </div>
              ) : (

                <div className="tab-content cost-details">
                  <div className="detail-row">
                    <label>Initial Amount</label>
                    <input 
                      type="text" 
                      value={initialAmount} 
                      style={{
                        backgroundColor: '#f8f8f8',
                        cursor: 'not-allowed'
                      }}
                      readOnly/>
                  </div>
                  <div className="detail-row">
                    <label>Tax Rate</label>
                    <input
                      type="text"
                      value={documentDetails.tax_rate}
                      readOnly
                      style={{
                        backgroundColor: '#f8f8f8',
                        cursor: 'not-allowed'
                      }}
                    />
                  </div>
                  <div className="detail-row">
                    <label>Discount Rate</label>
                    <input
                      type="text"
                      value={documentDetails.discount_rate}
                      readOnly
                      style={{
                        backgroundColor: '#f8f8f8',
                        cursor: 'not-allowed'
                      }}
                    />
                  </div>
                  <div className="detail-row">
                    <label>Tax Amount</label>
                    <input 
                      type="text" 
                      value={documentDetails.tax_amount.toFixed(2)} 
                      readOnly
                      style={{
                        backgroundColor: '#f8f8f8',
                        cursor: 'not-allowed'
                      }}
                    />
                  </div>
                  <div className="detail-row">
                    <label>Discount Amount</label>
                    <input 
                      type="text" 
                      value={documentDetails.discount_amount.toFixed(2)} 
                      style={{
                        backgroundColor: '#f8f8f8',
                        cursor: 'not-allowed'
                      }} 
                      readOnly
                    />
                  </div>
                  <div className="detail-row">
                    <label>Total</label>
                    <input type="text" value={
                      documentDetails.total
                    }  
                    style={{ cursor: 'not-allowed' }}
                    readOnly
                    />
                  </div>
                  <div className="detail-row">
                    <label>Freight</label>
                    <input
                      type="text"
                      value={documentDetails.freight}
                      style={{
                        backgroundColor: '#f8f8f8',
                        cursor: 'not-allowed'
                      }}
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>
          </div>




          {/* Item Document */}
          <div className="operation_table_container">
            <div className="grpo-table">
              <table className="materials-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>UoM</th>
                    <th>Quantity</th>
                    <th>Cost Per Unit</th>
                    <th>Total</th>
                    <th>Manufacturing Date</th>
                    <th>Expiry Date</th>
                    <th>Warehouse Location</th>
                    <th>Batch No.</th>
                    <th>Serial No.</th>
                  </tr>
                </thead>
                <tbody className="dropdown-scrollbar">
                {documentItems.map((item, index) => (
                    <tr key={item.content_id || index}>
                      <td>{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={item.item_id || ''}
                          onChange={(e) => handleInputChange(e, index, 'item_id')}
                          style={{ cursor: 'not-allowed' }}
                          readOnly
                        />
                      </td>
                      <td>
                      <select
                        value={item.item_name || ''}
                        onChange={(e) => handleItemSelection(index, e.target.value)}
                      >
                        <option value="">-- Select Item --</option>
                        {itemOptions.filter(opt => opt.type === 'product').map((opt, i) => (
                          <option key={i} value={opt.name}>
                            {opt.name} ({opt.type})
                          </option>
                        ))}
                      </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.unit_of_measure || ''}
                          onChange={(e) => handleInputChange(e, index, 'unit_of_measure')}
                          style={{ cursor: 'not-allowed' }}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={item.quantity || ''}
                          onChange={(e) => handleInputChange(e, index, 'quantity')}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.cost || ''}
                          onChange={(e) => handleInputChange(e, index, 'cost')}
                        />
                      </td>
                      <td>{(item.quantity * item.cost || 0).toFixed(2)}</td>
                      <td>
                      {!item.item_id?.startsWith('ADMIN-PROD') ? (
                        <input
                          type="text"
                          value="N/A"
                          readOnly
                          style={{ cursor: 'not-allowed' }}
                        />
                      ) : (
                        <input
                          type="date"
                          value={item.product_details?.manuf_date || ''}
                          onChange={(e) => {
                            handleInputChange(e, index, 'manuf_date');
                          }}
                        />
                      )}
                    </td>
                    <td>
                      {!item.item_id?.startsWith('ADMIN-PROD') ? (
                        <input
                          type="text"
                          value="N/A"
                          readOnly
                          style={{ cursor: 'not-allowed' }}
                        />
                      ) : (
                        <input
                          type="date"
                          value={item.product_details?.expiry_date || ''}
                          onChange={(e) => handleInputChange(e, index, 'expiry_date')}
                        />
                      )}
                    </td>
                      <td>
                        <select
                          value={item.warehouse_id || ''}
                          onChange={(e) => handleInputChange(e, index, 'warehouse_id')}
                        >
                          <option value="">Select warehouse</option>
                          {warehouseOptions.map((wh) => (
                            <option key={wh.warehouse_id} value={wh.warehouse_id}>
                              {wh.warehouse_location}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{item?.batch_no || "N/A"}</td>
                      <td>{item?.serial_no || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="button-section">
            <button
              className="copy-from-button"
              style={{ backgroundColor: '#098F8F', color: 'white', cursor: 'not-allowed' }}
              >
              Copy From
            </button>
            <div className="right-buttons">
              <button className="cancel-button" onClick={onBack}>Cancel</button>
            </div>
          </div>
        </div>
      </div>




    </div>
  );
};





export default GoodsReceipt;