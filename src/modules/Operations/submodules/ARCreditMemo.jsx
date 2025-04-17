import React, { useState, useEffect } from "react";
import "../styles/ARCreditMemo.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';






const ARCreditMemo = ({ onBack, onSuccess, selectedData, selectedButton, employee_id }) => {
  const date_today = new Date().toISOString().split('T')[0];
  const isCreateMode = selectedButton === "Create";


  const [selectedStatus, setSelectedStatus] = useState("Draft");
  const [activeTab, setActiveTab] = useState("document");
  const calculateInitialAmount = () => {
    if (isCreateMode) return 0;
    return selectedData.document_items.reduce((sum, item) => {
      return sum + parseFloat(item.quantity * item.cost);
    }, 0).toFixed(2);
  };
  const [initialAmount, setInitialAmount] = useState(calculateInitialAmount());


  const statusOptions = ["Open", "Closed", "Cancelled", "Draft"];


  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedOwner, setSelectedOwner] = useState(
      isCreateMode ? employee_id : selectedData.employee_name || employee_id
  );
  const [contactPerson, setContactPerson] = useState("");
  const [vendorID, setVendorID] = useState("");
  const [vendorList, setVendorList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);


  const fetchVendors = async () => {
    try {
      setLoading(true);
      const responseEmployee = await fetch("https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/supplier/");
      if (!responseEmployee.ok) throw new Error("Connection to database failed");
      const dataE = await responseEmployee.json();
      if (!Array.isArray(dataE.employees)) throw new Error("Invalid employee format");
      setEmployeeList(dataE.employees)
      const response = await fetch("https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/customer/");
      if (!response.ok) throw new Error("Connection to database failed");
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid customer format");
      setVendorList(data);
      setLoadingInvoices(true);
      const responseSalesInvoice = await fetch("https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/sales-invoice/");
      if (!responseSalesInvoice.ok) throw new Error("Failed to fetch invoices");
      const dataInvoice = await responseSalesInvoice.json();
      setInvoices(dataInvoice);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setLoadingInvoices(false);
    }
  };
  useEffect(() => {
    fetchVendors();
   
  }, []);


  const handleInvoiceSelect = (invoiceId) => {
    if (!invoiceId) {
      setDocumentDetails(prev => ({
        ...prev,
        invoice_id: "",
        invoice_balance: 0,
        invoice_date: date_today,
      }));
      return;
    }
 
    const selectedInvoice = invoices.find(inv => inv.invoice_id === invoiceId);
    if (!selectedInvoice) return;
 
    // Format the date by removing the time portion
    const formattedDate = selectedInvoice.invoice_date.split('T')[0];
 
    setDocumentDetails(prev => ({
      ...prev,
      invoice_id: selectedInvoice.invoice_id,
      invoice_balance: parseFloat(selectedInvoice.total_amount) || 0,
      invoice_date: formattedDate || date_today,
    }));
  };
  useEffect(() => {
    if (selectedData?.status) {
      setSelectedStatus(selectedData.status); // Set selectedStatus from selectedData
    }
    if (selectedData?.invoice_id) {
      // Directly update the state instead of calling handleInvoiceSelect
      const selectedInvoice = invoices.find(inv => inv.invoice_id === selectedData.invoice_id);
      if (selectedInvoice) {
        const formattedDate = selectedInvoice.invoice_date?.split('T')[0] || date_today;
       
        setDocumentDetails(prev => ({
          ...prev,
          invoice_id: selectedInvoice.invoice_id,
          invoice_balance: parseFloat(selectedInvoice.total_amount) || 0,
          invoice_date: formattedDate,
        }));
      }
    }
  }, [selectedData, invoices, date_today]);


  const handleVendorChange = (e) => {
    const customerName = e.target.value;
    setSelectedVendor(customerName);
    const selectedVendorData = vendorList.find(v => v.name === customerName);
    setVendorID(selectedVendorData ? selectedVendorData.customer_id : null);
    setContactPerson(selectedVendorData ? selectedVendorData.contact_person : "");
  };




  useEffect(() => {
    if (vendorList.length > 0) {
      const matchedCustomer = vendorList.find(v => v.customer_id === selectedData.buyer);
      if (matchedCustomer ) {
        setSelectedVendor(matchedCustomer.name);
        setVendorID(matchedCustomer.customer_id);
        setContactPerson(matchedCustomer.contact_person);
      }
      const matchedEmployee = employeeList.find(emp => emp.employee_id === selectedData.employee_id);
      if (matchedEmployee) {
        setSelectedOwner(matchedEmployee.employee_name);
      }
    }
  }, [vendorList, selectedData.buyer, employeeList, selectedData.employee_id]);


 
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
    owner: isCreateMode ? employee_id : selectedOwner,
    transaction_id: isCreateMode ? "" : selectedData.transaction_id || "",
    ar_credit_memo: isCreateMode ? "" : selectedData.ar_credit_memo || "",
    delivery_date: isCreateMode ? today : selectedData.delivery_date || "",
    status: isCreateMode ? "Draft" : selectedStatus,
    posting_date: isCreateMode ? today  : selectedData.posting_date || "",
    document_no: isCreateMode ? "" : selectedData.document_no || null,
    document_date: isCreateMode ? today  : selectedData.document_date || "",
    initialAmount: initialAmount || 0,
    invoice_amount: isCreateMode ? 0 : selectedData.invoice_amount || 0,
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
          const response = await fetch('https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/goods-tracking/get-next-doc-ids/');
          if (!response.ok) throw new Error('Failed to fetch next document IDs');
         
          const data = await response.json();
          const lastCreditMemoId = data.last_credit_memo_id || "AR-1000";
          const nextNumber = parseInt(lastCreditMemoId.split('-')[1]) + 1;
          const nextCreditMemoId = `AR-${nextNumber}`;
          setDocumentDetails(prev => ({
            ...prev,
            document_no: data.next_document_no,
            transaction_id: data.next_transaction_id,
            ar_credit_memo: nextCreditMemoId
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
        await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/document-item/${currentItem.content_id}/`, {
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
      const response = await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/goods-tracking/${selectedData.document_id}/`);
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
          const productDocuResponse = await fetch('https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/create-items/create-product-docu-item/', {
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
        const createResponse = await fetch('https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/create-items/create-document-item/', {
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
        const response = await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/goods-tracking/${selectedData.document_id}/`);




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
      row.item_id,
      row.item_name,
      row.quantity,
      row.cost
    );
  };




  const [warehouseOptions, setWarehouseOptions] = useState([]);








  useEffect(() => {
    fetch('https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/get-warehouseID/')
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
    fetch('https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/item-data/')
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
 




          await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/document-item/${currentItem.content_id}/`, {
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
    const invoiceAmount = parseFloat(documentDetails.invoice_amount) || 0;
    const taxRate = parseFloat(documentDetails.tax_rate) || 0;


    const tax_amount = (taxRate / 100) * invoiceAmount;
    const total = parseFloat(invoiceAmount + invoiceAmount +tax_amount).toFixed(2);
    setDocumentDetails(prev => ({
      ...prev,
      tax_amount: tax_amount,
      total: total,
    }));
  }, [documentDetails.tax_rate, documentDetails.discount_rate, documentDetails.freight, initialAmount, documentDetails.invoice_amount]);
 
 
  const handleDocumentDetailChange = (e, field) => {
    setDocumentDetails(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
 
  // Add a new function to handle create operation
  const handleCreateDocument = async () => {
    try {
      if (!selectedOwner || !vendorID){
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
        document_type: "A/R Credit Memo",
        status: selectedStatus,
        vendor_code: null,
        buyer: vendorID,
        employee_id: employee_id,
        delivery_date: documentDetails.delivery_date,
        posting_date: documentDetails.posting_date,
        document_date: documentDetails.document_date,
        document_no: documentDetails?.document_no || null,
        transaction_id: documentDetails.transaction_id,
        ar_credit_memo: documentDetails.ar_credit_memo,
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
      const response = await fetch('https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/goods-tracking/custom-create/', {
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
    if (!vendorID){
      toast.error("Customer Required")
      return
    }
    try {
      if (isCreateMode) {
        await handleCreateDocument();
      } else {
      // Step 1: Update Product Document Items
      for (let item of updatedDocumentItems) {
        if (item.item_id?.startsWith("ADMIN-PROD") && item.productdocu_id) {
        const updatedDocumentItemData = {
          product_id: item.item_id,
        };
        const documentItemResponse = await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/product-docu-item/${item.productdocu_id}/`, {
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
          total: parseFloat(item.quantity * item.cost).toFixed(2) || 0,
          warehouse_id: item.warehouse_id || "",
        };
        if (item.item_id?.startsWith("ADMIN-MATERIAL")) {
          updateDocomentItems.material_id = item.item_id;
        } else if (item.item_id?.startsWith("ADMIN-ASSET")) {
          updateDocomentItems.asset_id = item.item_id;
        } else if (item.item_id?.startsWith("ADMIN-PROD") && item.productdocu_id) {
          updateDocomentItems.productdocu_id = item.productdocu_id;
        }
        const productDocuItemResponse = await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/document-item/${item.content_id}/`, {
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
        vendor_code: null,
        buyer: vendorID,
        employee_id: employeeList.find(emp => emp.employee_name === selectedOwner)?.employee_id,
        transaction_id: documentDetails.transaction_id,
        invoice_id: documentDetails.invoice_id,
        ar_credit_memo: documentDetails.ar_credit_memo,
        document_no: documentDetails?.document_no || null,
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
      const goodsTrackingResponse = await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/goods-tracking/${selectedData.document_id}/`, {
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
      toast.loading("Updating...");
      }
      if (onSuccess) {
        await onSuccess();  // Refresh the data in GoodsTracking
      }
 
      
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
      const response = await fetch("https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/purchase_order/");
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
      const response = await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/purchase_order/${poId}/`);
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
    const invoiceAmount = parseFloat(documentDetails.invoice_balance) || 0;
    const taxAmount = (parseFloat(documentDetails.tax_rate) / 100) * initialAmount;
    const initial_amount = parseFloat(initialAmount)
    const total = parseFloat(taxAmount + initial_amount).toFixed(2);
    setDocumentDetails(prev => ({
      ...prev,
      tax_amount: taxAmount,
      transaction_cost: total,
    }));
  }, [documentDetails.tax_rate, documentDetails.discount_rate, documentDetails.freight, documentDetails.invoice_balance, initialAmount]);




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
    <div className="ar-cred">
      <div className="body-content-container">
        <div className="back-button" onClick={handleBackWithUpdate}>← Back</div>
        <div className="content-wrapper">
        <ToastContainer transition={Slide} />
          <div className="details-grid">
            <div className="details-section">
              <div className="detail-row">
                <label>Customer ID</label>
                <input type="text" value={vendorID} style={{ cursor: 'not-allowed' }} readOnly/>
              </div>
              <div className="detail-row dropdown-scrollbar">
                <label>Customer Name</label>
                <select value={selectedVendor} onChange={handleVendorChange}>
                  <option value="">Select Customer</option>
                  {loading ? (
                    <option value="">Loading Customer...</option>
                  ) : (
                    vendorList.map((customer) => (
                      <option key={customer.customer_id} value={customer.name}>
                        {customer.name}
                      </option>
                    ))
                  )}
                </select>


              </div>
              <div className="detail-row">
                <label>Contact Person</label>
                <input type="text" value={contactPerson} style={{ cursor: 'not-allowed' }} readOnly/>
              </div>
              <div className="detail-row">
                <label>Owner</label>
                <input
                  type="text"
                  readOnly
                  value={
                    selectedData?.employee_id
                      ? employeeList.find(e => e.employee_id === selectedData.employee_id)?.employee_name || selectedData.employee_id
                      : employeeList.find(e => e.employee_id === employee_id)?.employee_name || employee_id
                  }
                  style={{
                    cursor: 'not-allowed',
                    backgroundColor: '#f8f8f8'
                  }}
                />
              </div>
              <div className="detail-row">
                <label>Credit Memo ID</label>
                <input
                  type="text"
                  value={documentDetails.ar_credit_memo || selectedData?.ar_credit_memo || ""}
                  readOnly
                  style={{ cursor: 'not-allowed' }}
                />              
              </div>
            </div>








            <div className="details-section tabbed-section">
              <div className="section-tabs">
                <button
                  className={`tab-button ${activeTab === 'document' ? 'active' : ''}`}
                  onClick={() => setActiveTab('document')}
                >
                  Document Details
                </button>
                <button
                  className={`tab-button ${activeTab === 'credit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('credit')}
                >
                  Credit Details
                </button>
              </div>
             
              {activeTab === 'document' ? (
                <div className="tab-content">
                  <div className="left-column">
                    <div className="detail-row">
                      <label>Transaction ID</label>
                      <input
                        type="text"
                        value={documentDetails.transaction_id}
                        readOnly
                        style={{ cursor: 'not-allowed' }}
                      />
                    </div>
                    <div className="detail-row dropdown-scrollbar">
                      <label>Invoice ID</label>
                      <select
                        value={documentDetails.invoice_id || ""}
                        onChange={(e) => {
                          handleDocumentDetailChange(e, "invoice_id");
                          handleInvoiceSelect(e.target.value);
                        }}
                        disabled={loadingInvoices}
                      >
                        <option value="">Select Invoice</option>
                        {loadingInvoices ? (
                          <option value="">Loading invoices...</option>
                        ) : (
                          invoices.map((invoice) => (
                            <option key={invoice.invoice_id} value={invoice.invoice_id}>
                              {invoice.invoice_id})
                            </option>
                          ))
                        )}
                      </select>
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
                  </div>
                  <div className="right-column">
                    <div className="detail-row">
                      <label>Invoice Date</label>
                      <div className="date-input clickable">
                        <input
                          type="date"
                          value={documentDetails.invoice_date || date_today}
                          onChange={(e) => handleDocumentDetailChange(e, "invoice_date")}
                          readOnly
                          style={{ cursor: 'not-allowed' }}
                        />
                        <span className="calendar-icon">📅</span>
                      </div>
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
                </div>
              ) : (
                <div className="tab-content credit-details">
                  <div className="detail-row">
                    <label>Initial Amount</label>
                    <input
                      type="text"
                      value={initialAmount}
                      readOnly
                      style={{ cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className="detail-row">
                    <label>Invoice Balance</label>
                    <input
                      type="text"
                      value={documentDetails.invoice_balance ? parseFloat(documentDetails.invoice_balance).toFixed(2) : "0.00"}
                      onChange={(e) => handleDocumentDetailChange(e, "invoice_balance")}
                      readOnly
                      style={{ cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className="detail-row">
                    <label>Sales Tax</label>
                    <input
                      type="text"
                      value={documentDetails.tax_rate}
                      onChange={(e) => handleDocumentDetailChange(e, "tax_rate")}
                    />
                  </div>
                  <div className="detail-row">
                  <div className="detail-row">
                    <label>Total</label>
                    <input type="text" value={
                      documentDetails.transaction_cost
                    }  />
                  </div>
                  </div>
                  <div className="detail-row">
                    <label>Tax Amount</label>
                    <input
                      type="text"
                      value={documentDetails.tax_amount.toFixed(2)}
                      readOnly
                      style={{ cursor: 'not-allowed' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>








          <div className="operation_table_container">
            <div className="gr-table">
              <table className="materials-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
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
                          type="number"
                          value={item.quantity || ''}
                          onChange={(e) => handleInputChange(e, index, 'quantity')}
                          min="0"
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








export default ARCreditMemo;







