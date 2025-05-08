import React, { useState, useEffect, useCallback } from "react";
import "../styles/GoodsReceiptPO.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

const GoodsReceiptPO = ({ onBack, onSuccess, selectedData, selectedButton, employee_id }) => {
  const date_today = new Date().toISOString().split('T')[0];
  const isCreateMode = selectedButton === "Create";
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [selectedDelNote, setSelectedDelNote] = useState("Full Delivery");
  const [activeTab, setActiveTab] = useState("document");
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [selectedSerialNumbers, setSelectedSerialNumbers] = useState([]);
  const [duplicateDetails, setDuplicateDetails] = useState({});
  const [purchaseItemsMatch, setPurchaseItemsMatch] = useState(false);

  const calculateInitialAmount = () => {
    if (isCreateMode) return 0;
    if (!selectedData?.document_items) return 0;
    
    return selectedData.document_items.reduce((sum, item) => {
      // First try item_price, then check duplicateDetails for a price
      const price = item.item_price !== 0 ? item.item_price : 
                    (duplicateDetails[item.item_id]?.[0]?.price || 0);
      return sum + (parseFloat(item.quantity) * parseFloat(price));
    }, 0).toFixed(2);
  };
  const [initialAmount, setInitialAmount] = useState(calculateInitialAmount());
  const statusOptions = ["Open", "Closed", "Cancelled", "Draft"];
  const deliveryNoteOptions = ["Partial Delivery", "Full Delivery"];
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


  useEffect(() => {
    if (selectedData?.status) {
      setSelectedStatus(selectedData.status); // Set selectedStatus from selectedData
    }
  }, [selectedData]);
  useEffect(() => {
    if (selectedData?.delivery_note) {
      setSelectedDelNote(selectedData.delivery_note); // Set selectedStatus from selectedData
    }
  }, [selectedData]);


  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/operation/supplier/");
      if (!response.ok) throw new Error("Connection to database failed");
      const data = await response.json();
      if (!Array.isArray(data.vendors)) throw new Error("Invalid goods data format");
      setVendorList(data.vendors.sort((a, b) => a.company_name.localeCompare(b.company_name)));
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
    const selectedVendorData = vendorList.find(v => v.company_name === vendorName);
    setVendorID(selectedVendorData ? selectedVendorData.vendor_code : null);
    setContactPerson(selectedVendorData ? selectedVendorData.contact_person : "");
  };


  useEffect(() => {
    if (vendorList.length > 0) {
      const matchedVendor = vendorList.find(v => v.vendor_code === selectedData.vendor_code);
      if (matchedVendor) {
        setSelectedVendor(matchedVendor.company_name);
        setVendorID(matchedVendor.vendor_code);
        setContactPerson(matchedVendor.contact_person);
      }
      const matchedEmployee = employeeList.find(emp => emp.employee_id === selectedData.employee_id);
      if (matchedEmployee) {
        setSelectedOwner(matchedEmployee.employee_name);
      }
    }
  }, [vendorList, selectedData.vendor_code, employeeList, selectedData.employee_id]);

  
  

 
  const today = new Date().toISOString().slice(0, 10);
  // Initialize document details differently for create mode
  const [documentDetails, setDocumentDetails] = useState({
    purchase_id: isCreateMode ? "" : selectedData.purchase_id || null,
    vendor_code: isCreateMode ? "" : vendorID,
    company_name: isCreateMode ? "" : selectedVendor,
    contact_person: isCreateMode ? "" : contactPerson,
    buyer: isCreateMode ? "" : selectedData.buyer || "",
    owner: isCreateMode ? employee_id : selectedData.owner,
    transaction_id: isCreateMode ? "" : selectedData.transaction_id || "",
    delivery_date: isCreateMode ? today : selectedData.delivery_date || "",
    status: isCreateMode ? "Draft" : selectedStatus,
    delivery_note: isCreateMode ? "Full Delivery" : selectedDelNote,
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
    updatedItems[index][field] = e.target.value;
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

  const handleAddRow = () => {
    const lastRow = documentItems[documentItems.length - 1];
    
    // Only add a new row if the last row is filled (but don't make API calls yet)
    if (isRowFilled(lastRow)) {
      const updatedItems = [...documentItems];
      
      // Calculate total for the current row
      updatedItems[updatedItems.length - 1] = {
        ...lastRow,
        total: (parseFloat(lastRow.quantity) * parseFloat(lastRow.cost)).toFixed(2)
      };
      
      // Add new empty row with all possible fields
      updatedItems.push({
        item_id: '',
        item_name: '',
        item_type: '',
        unit_of_measure: '',
        quantity: '',
        cost: '',
        warehouse_id: '',
        item_no: ''
      });
  
      setDocumentItems(updatedItems);
    }
  };
 
 
 
  const isRowFilled = (row) => {
    const baseFieldsFilled = (
      row.item_id &&
      row.item_name &&
      row.quantity &&
      row.cost &&
      row.warehouse_id
    );
    return baseFieldsFilled;
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

  // Inside your item fetch useEffect:
  useEffect(() => {
      fetch('http://127.0.0.1:8000/operation/item/')
        .then(res => res.json())
        .then(data => {
          const typePriority = { product: 1, material: 2, asset: 3 };
    
          const filtered = data.filter(item => {
            const priceValid = item.item_price != null && parseFloat(item.item_price) > 0;
  
            const type = item.item_type?.toLowerCase();
            const isAssetOrMaterial = type?.includes('asset') || type?.includes('material');
            const hasValidDate = item.purchase_date;
    
            return priceValid && (!isAssetOrMaterial || hasValidDate);
          });
    
          const uniqueMap = new Map();
          const duplicateDetails = {};
    
          filtered.forEach(item => {
            const id = item.item_id;
            const price = parseFloat(item.item_price);
            const date = item.purchase_date;
    
            if (!uniqueMap.has(id)) {
              uniqueMap.set(id, item);
              duplicateDetails[id] = [{ price, date }];
            } else {
              duplicateDetails[id].push({ price, date });
            }
          });
    
          Object.keys(duplicateDetails).forEach(id => {
            duplicateDetails[id].sort((a, b) => new Date(b.date) - new Date(a.date));
          });
    
          setDuplicateDetails(duplicateDetails);
    
          const options = Array.from(uniqueMap.values()).map(item => ({
            id: item.item_id,
            name: item.item_name,
            cost: parseFloat(item.item_price),
            unit: item.unit_of_measure || '---',
            type: item.item_type?.toLowerCase().includes("asset") ? 'asset' :
                  item.item_type?.toLowerCase().includes("product") ? 'product' :
                  'material',
          }));
    
          options.sort((a, b) => {
            const typeCompare = typePriority[a.type] - typePriority[b.type];
            if (typeCompare !== 0) return typeCompare;
            return a.name.localeCompare(b.name);
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
          const userConfirmed = await new Promise((resolve) => {
            toast.info(
              <div>
                <p style={{fontSize:"1em"}}>Do you want to archive this row?</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                  <button 
                    onClick={() => {
                      toast.dismiss();
                      resolve(true);
                    }}
                    style={{ padding: '5px 15px', cursor: 'pointer', fontSize: "1em" }}
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => {
                      toast.dismiss();
                      resolve(false);
                    }}
                    style={{ padding: '5px 15px', cursor: 'pointer', fontSize: "1em" }}
                  >
                    No
                  </button>
                </div>
              </div>,
              {
                position: "top-right",
                autoClose: false,
                closeButton: false,
                draggable: false,
                closeOnClick: false,
                toastId: 'archive-confirmation'
              }
            );
          });
  
          if (!userConfirmed) {
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
    const duplicatePrices = duplicateDetails[selectedItem.id] || [];
    if (duplicatePrices.length <= 1) {
      updatedItems[index] = {
        ...currentItem,
        item_name: selectedItem.name,
        item_id: selectedItem.id,
        cost: duplicatePrices[0]?.price || selectedItem.cost,
        unit_of_measure: selectedItem.unit,
        available_costs: null // No cost selection needed
      };
    } else {
      const latestPrice = duplicatePrices[0]?.price;
      updatedItems[index] = {
        ...currentItem,
        item_name: selectedItem.name,
        item_id: selectedItem.id,
        cost: latestPrice || 0, // Default to latest price if available
        unit_of_measure: selectedItem.unit,
        available_costs: duplicatePrices.map(priceObj => ({
          price: priceObj.price,
          date: priceObj.date
        }))
      };
    }
  
    setDocumentItems(updatedItems);
 
    // Add new row if this is the last row and we're selecting an item
    if (index === updatedItems.length - 1) {
      handleAddRow();
    }
  };
  const handleCostSelection = (index, selectedPrice) => {
    const updatedItems = [...documentItems];
    updatedItems[index].cost = selectedPrice;
    
    // Recalculate total for this row
    updatedItems[index].total = (
      parseFloat(updatedItems[index].quantity || 0) * 
      parseFloat(selectedPrice)
    ).toFixed(2);
    
    setDocumentItems(updatedItems);
  };
  useEffect(() => {
    const tax_amount = (documentDetails.tax_rate / 100) * initialAmount;
    const discount_amount = (documentDetails.discount_rate / 100) * initialAmount;
    const total = (parseFloat(initialAmount) + parseFloat(tax_amount) - parseFloat(discount_amount) + parseFloat(documentDetails.freight || 0)).toFixed(2);
 
    setDocumentDetails(prev => ({
      ...prev,
      tax_amount: tax_amount,
      discount_amount: discount_amount,
      transaction_cost: total
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
      
      // Prepare the document items for creation
      const itemsToCreate = documentItems
      .slice(0, -1)
      .filter(item => isRowFilled(item));
      if (itemsToCreate.length === 0) {
        toast.error("Please add at least one valid item before saving");
        return;
      }
      if (!documentDetails.buyer) {
        toast.error("Buyer information is required");
        return;
      }
      // Prepare the payload for the create API
      const payload = {
        vendor_code: vendorID,
        document_type: "Goods Receipt PO",
        transaction_id: documentDetails.transaction_id,
        document_no: documentDetails.document_no,
        purchase_id: documentDetails?.purchase_id || null,
        status: selectedStatus,
        delivery_date: documentDetails.delivery_date,
        posting_date: documentDetails.posting_date,
        document_date: documentDetails.document_date,
        buyer: documentDetails.buyer,
        owner: documentDetails.owner,
        delivery_note: selectedDelNote,
        initial_amount: parseFloat(initialAmount).toFixed(2) || 0, 
        discount_rate: parseFloat(documentDetails.discount_rate).toFixed(2) || 0,
        discount_amount: parseFloat(documentDetails.discount_amount).toFixed(2) || 0,
        freight: parseFloat(documentDetails.freight).toFixed(2) || 0,
        tax_rate: parseFloat(documentDetails.tax_rate).toFixed(2) || 0,
        tax_amount: parseFloat(documentDetails.tax_amount).toFixed(2) || 0,
        transaction_cost: parseFloat(documentDetails.transaction_cost).toFixed(2) || 0,
        document_items: itemsToCreate.map(item => ({
          item_id: item.item_id,
          quantity: parseInt(item.quantity, 10),
          item_price: parseFloat(item.cost) || 0,
          total: parseFloat(item.total) || 0,
          warehouse_id: item.warehouse_id,
          item_no: null
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
      if(onSuccess){
        await onSuccess(result);
      }      
      // Call onSuccess with the created data if needed
      
     
    } catch (error) {
      toast.error(`Failed to create document. Please try again later`);
      console.log(error)
    }
  };

  const handleBackWithUpdate = async () => {
    const updatedDocumentItems = documentItems.slice(0, -1);  // Assuming you want to update all document items except the last one
    let rowNum = 0
    if (!selectedOwner){
      toast.error("Owner is required")
      return
    }else if (updatedDocumentItems.length === 0) {
      toast.error("At least one item is required. Please fill all necessary data");
      return;
    }else if (documentDetails.transaction_cost > 1000000000) {
      toast.dismiss()
      toast.error("Transaction cost must not exceed 10 digits (Approx 1 billion)");
      return;
    }else if (!documentDetails.buyer){
      toast.dismiss()
      toast.error("Buyer is required.")
      return
    }
    for (let item of updatedDocumentItems){
      rowNum += 1
      if (!item.item_id){
        toast.dismiss()
        toast.error(`Please add item for Row: ${rowNum}.`);
        return
      }else if(!item.quantity){
        toast.dismiss()
        toast.error(`Please add quantity for ${item.item_name} (Row: ${rowNum}).`);
        return
      }else if(!item.warehouse_id){
        toast.dismiss()
        toast.error(`Please add warehouse for ${item.item_name} (Row: ${rowNum}).`)
        return
      }
    }
    try {
      toast.dismiss()
      if (isCreateMode) {
        toast.loading("Saving changes...")
        await handleCreateDocument();
        toast.dismiss()
      } else {
        rowNum = 0
        toast.loading("Saving changes...")
     
        for (let item of updatedDocumentItems){
          rowNum += 1
          const payload = {
            document_id: selectedData.document_id,
            item_id: item.item_id,
            quantity: parseInt(item.quantity, 10),
            item_price: parseFloat(item.cost) || 0,
            total: parseFloat(item.total) || 0,
            warehouse_id: item.warehouse_id,
            purchase_date: item.purchase_date,
            item_no: item?.item_no || null
          }
          let itemResponse
          if (item.content_id){
            itemResponse = await fetch(`http://127.0.0.1:8000/operation/document-item/${item.content_id}/`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            });
          }else{
            itemResponse = await fetch(`http://127.0.0.1:8000/operation/document-item/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            });
          }
          
          if (!itemResponse.ok) {
            const errorData = await itemResponse.json();
            toast.error(`Row ${rowNum}: ${errorData.error || 'Failed to save item.'}`);
            return;
          }
        }
        const updatedDocumentsData = {
          vendor_code: vendorID,
          document_type: "Goods Receipt PO",
          transaction_id: documentDetails.transaction_id,
          document_no: documentDetails.document_no,
          purchase_id: documentDetails?.purchase_id || null,
          status: selectedStatus,
          delivery_date: documentDetails.delivery_date,
          posting_date: documentDetails.posting_date,
          document_date: documentDetails.document_date,
          buyer: documentDetails.buyer,
          owner: documentDetails.owner,
          delivery_note: selectedDelNote,
          initial_amount: parseFloat(initialAmount).toFixed(2) || 0, 
          discount_rate: parseFloat(documentDetails.discount_rate).toFixed(2) || 0,
          discount_amount: parseFloat(documentDetails.discount_amount).toFixed(2) || 0,
          freight: parseFloat(documentDetails.freight).toFixed(2) || 0,
          tax_rate: parseFloat(documentDetails.tax_rate).toFixed(2) || 0,
          tax_amount: parseFloat(documentDetails.tax_amount).toFixed(2) || 0,
          transaction_cost: parseFloat(documentDetails.transaction_cost).toFixed(2) || 0
        };
        const goodsTrackingResponse = await fetch(`http://127.0.0.1:8000/operation/goods-tracking/${selectedData.document_id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedDocumentsData),
        });
        if (!goodsTrackingResponse.ok) {
          const errorData = await goodsTrackingResponse.json();
          throw new Error(`GoodsTrackingData update failed for document_id ${selectedData.document_id}: ${JSON.stringify(errorData)}`);
        }
      }
      if (onSuccess) {
        await onSuccess();
        toast.dismiss()
        toast.success("Successfully updated documents.", {
          autoClose: 1000,
          onClose: () => onBack(), 
        });
      }
    } catch (error) {
      toast.error(`Failed to update data. Please try again later`);
      console.log(error.message)
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
    if (!poId) {
      setSelectedPO("");
      setPurchaseItemsMatch(false);
      return;
    }
    
    setSelectedPO(poId); // Update the selected PO state
 
    try {
      // Fetch the selected purchase order details
      const response = await fetch(`http://127.0.0.1:8000/operation/purchase_order/${poId}/`);
      if (!response.ok) throw new Error("Failed to fetch purchase order details");
 
      const selectedPO = await response.json();
      const quotation = selectedPO.quotation_id || {};
      const getVendor = quotation.vendor_code || {};
      setSelectedVendor(getVendor.company_name || "");
      setVendorID(getVendor.vendor_code || "");
      setContactPerson(quotation.contact_person || "");
      // Update document details with PO information

      setDocumentDetails(prev => ({
        ...prev,
        vendor_code: getVendor.vendor_code || null,
        company_name: getVendor.company_name || null,
        contact_person: quotation.contact_person || null,
        buyer: quotation?.buyer || "",
        delivery_date: selectedPO.delivery_date || null,
        status: "Draft",
        posting_date: date_today,
        document_date: selectedPO.document_date || null,
        tax_amount: Number(parseFloat(quotation.tax || 0).toFixed(2)),
        discount_rate: Number(parseFloat(quotation.discount_percent || 0).toFixed(2)),
        freight: Number(parseFloat(quotation.freight || 0).toFixed(2)),
        purchase_id: poId
      }));
 
      // Get item details from pre-fetched itemOptions
      
      const poItems = (selectedPO.quotation_contents || []).map(content => {
        const itemId = content.item_id;
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
      const taxAmount = parseFloat(quotation.tax || 0);
      const discountAmount = parseFloat(quotation.discount_amount || 0);
      const freight = parseFloat(quotation.freight || 0);

      // Calculate tax rate
      const taxBase = poInitialAmount - discountAmount;
      const taxRate = taxBase > 0 ? (taxAmount / taxBase) * 100 : 0;

      setInitialAmount(poInitialAmount.toFixed(2));

      // Set document details again to include tax rate
      setDocumentDetails(prev => ({
        ...prev,
        tax_amount: Number(parseFloat(taxAmount|| 0).toFixed(2)),
        discount_rate: Number(parseFloat(quotation.discount_percent || 0).toFixed(2)),
        freight: Number(parseFloat(freight || 0).toFixed(2)),
        tax_rate: Number(parseFloat(taxRate || 0).toFixed(2)),
      }));
      setDocumentItems([...poItems, {}]);
      await checkCurrentDocumentItemsMatch(poId, selectedDelNote);
    } catch (error) {
      toast.error(`Failed to load PO data: ${error.message}`);
      setPurchaseItemsMatch(false);
    }
  };
 




  useEffect(() => {
    fetchPurchaseOrders();
  }, []);
 
  useEffect(() => {
      const tax_amount = (documentDetails.tax_rate / 100) * initialAmount;
      const discount_amount = (documentDetails.discount_rate / 100) * initialAmount;
      const total = (parseFloat(initialAmount) + parseFloat(tax_amount) - parseFloat(discount_amount) + parseFloat(documentDetails.freight || 0)).toFixed(2);
   
      if (total.length <= 10) {
        setDocumentDetails(prev => ({
          ...prev,
          tax_amount: tax_amount,
          discount_amount: discount_amount,
          transaction_cost: total,
        }));
      }else{
        toast.dismiss()
        toast.error("Item rejected")
        toast.warning("Transaction cost must not exceed 10 digits (1 billion)")
      }
    }, [documentDetails.tax_rate, documentDetails.discount_rate, documentDetails.freight, initialAmount]);

  const [documentItems, setDocumentItems] = useState(
    isCreateMode 
      ? [{}] 
      : [
          ...selectedData.document_items.map(item => ({
            content_id: item.content_id,
            item_id: item.item_id,
            item_name: item.item_name,
            unit_of_measure: item.unit_of_measure,
            quantity: item.quantity,
            cost: item.item_price !== 0 ? item.item_price : (duplicateDetails[item.item_id]?.[0]?.price || 0), 
            warehouse_id: item.warehouse_id,
            item_no: item.item_no 
          })), 
          {}
        ]
  );

  useEffect(() => {
    const newInitialAmount = documentItems
      .slice(0, -1) // exclude the last empty row
      .reduce((sum, item) => {
        // Use the price from the item object (which comes from duplicateDetails or itemOptions)
        const price = parseFloat(item.cost || duplicateDetails[item.item_id]?.[0]?.price || 0);
        return sum + (parseFloat(item.quantity || 0) * price);
      }, 0)
      .toFixed(2);
    setInitialAmount(newInitialAmount);
  }, [documentItems, duplicateDetails]);
  const [poMismatchDetails, setPoMismatchDetails] = useState(null);

  const checkCurrentDocumentItemsMatch = useCallback(async (purchaseId, deliveryNote) => {
    if (!purchaseId) {
      //console.log("No purchase ID provided - setting match to false");
      setPurchaseItemsMatch(false);
      setPoMismatchDetails(null);
      return;
    }
  
    try {
      //console.log("Starting items match check for PO:", purchaseId);
      
      // Reset mismatch details
      const mismatches = [];
      
      // Get current document items (excluding last empty row)
      const currentItems = documentItems.slice(0, -1)
        .filter(item => item.item_id) // Only include items with IDs
        .map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          quantity: parseInt(item.quantity || 0, 10)
        }));
  
      //console.log("Current document items (filtered):", currentItems);
  
      // Find the selected purchase order
      const selectedPO = purchaseOrders.find(po => po.purchase_id === purchaseId);
      if (!selectedPO) {
        //console.log("PO not found in local state - setting match to false");
        setPurchaseItemsMatch(false);
        setPoMismatchDetails(["Purchase order not found"]);
        return;
      }
  
      // Check if vendor_code matches
      if (vendorID !== selectedPO.quotation_id.vendor_code.vendor_code) {
        const mismatchMsg = `Vendor mismatch: ${selectedVendor} (Current) ≠ ${selectedPO.quotation_id.vendor_code.company_name} (PO)`;
        //console.log(mismatchMsg);
        mismatches.push(mismatchMsg);
      }
  
      // Check if buyer matches
      if (documentDetails.buyer !== selectedPO.quotation_id.buyer) {
        const mismatchMsg = `Buyer mismatch: ${documentDetails.buyer} (Current) ≠ ${selectedPO.quotation_id.buyer} (PO)`;
        //console.log(mismatchMsg);
        mismatches.push(mismatchMsg);
      }
  
      // Update mismatch details state
      setPoMismatchDetails(mismatches.length > 0 ? mismatches : null);
  
      // If we have any mismatches, don't proceed with item checks
      if (mismatches.length > 0) {
        setPurchaseItemsMatch(false);
        return;
      }
  
      // Get items from purchase order
      const poItems = (selectedPO.quotation_contents || []).map(content => ({
        item_id: content.item_id,
        quantity: parseInt(content.purchase_quantity || 0, 10)
      }));
  
      //console.log("PO items from quotation contents:", poItems);
  
      // For partial delivery, check existing goods receipts
      let existingPartialItems = {};
      if (deliveryNote === "Partial Delivery") {
        //console.log("Partial delivery - checking existing receipts");
        const response = await fetch('http://127.0.0.1:8000/operation/goods-tracking/');
        if (!response.ok) throw new Error("Failed to fetch goods receipts");
        const goodsReceipts = await response.json();
  
        // Find all partial deliveries for this purchase ID (excluding current document if editing)
        const partialReceipts = goodsReceipts.filter(gr => 
          gr.purchase_id === purchaseId && 
          gr.delivery_note === "Partial Delivery" &&
          (!selectedData || gr.document_id !== selectedData.document_id)
        );
  
        //console.log("Found partial receipts:", partialReceipts.length);
  
        // Sum quantities from all partial receipts
        partialReceipts.forEach(gr => {
          gr.document_items.forEach(item => {
            existingPartialItems[item.item_id] = 
              (existingPartialItems[item.item_id] || 0) + parseInt(item.quantity, 10);
          });
        });
  
        //console.log("Existing partial items quantities:", existingPartialItems);
      }
  
      // Check matching based on delivery note type
      let allItemsMatch = true;
      let noExtraItems = true;
      const itemMismatches = [];
  
      if (deliveryNote === "Full Delivery") {
        //console.log("Checking full delivery match");
        allItemsMatch = poItems.every(poItem => {
          const currentItem = currentItems.find(ci => ci.item_id === poItem.item_id);
          const match = currentItem && currentItem.quantity === poItem.quantity;
          const matchedItem = itemOptions.find(opt => opt.id === poItem.item_id);
          if (!match) {
            const mismatchMsg = `Item ${matchedItem?.name || poItem.item_id}: Qty ${currentItem?.quantity || 0} ≠ PO Qty ${poItem.quantity}`;
            itemMismatches.push(mismatchMsg);
          }
          return match;
        });

        noExtraItems = currentItems.every(ci => {
          const exists = poItems.some(poItem => poItem.item_id === ci.item_id);
          if (!exists) {
            const itemName = ci.item_name || 
                            itemOptions.find(opt => opt.id === ci.item_id)?.name || 
                            `Item ${ci.item_id}`;
            const mismatchMsg = `Extra item: ${itemName}`;
            itemMismatches.push(mismatchMsg);
          }
          return exists;
        });
      } else {
        //console.log("Checking partial delivery match");
        
        noExtraItems = currentItems.every(ci => {
          const exists = poItems.some(poItem => poItem.item_id === ci.item_id);
          if (!exists) {
            const itemName = ci.item_name || 
                            itemOptions.find(opt => opt.id === ci.item_id)?.name || 
                            `Item ${ci.item_id}`;
            const mismatchMsg = `Extra item: ${itemName}`;
            itemMismatches.push(mismatchMsg);
          }
          return exists;
        });
      
        allItemsMatch = poItems.every(poItem => {
          const currentItem = currentItems.find(ci => ci.item_id === poItem.item_id);
          
          // Skip if item doesn't exist in current document
          if (!currentItem) {
            //console.log(`Item ${poItem.item_id} not found in current items - skipping validation`);
            return true;
          }
        
          const currentQty = currentItem.quantity || 0;
          const existingQty = existingPartialItems[poItem.item_id] || 0;
          const totalQty = currentQty + existingQty;
          const matchedItem = itemOptions.find(opt => opt.id === poItem.item_id);
          /*
          console.log([
            `Validating item: ${matchedItem?.name || poItem.item_id}`,
            `Current Qty: ${currentQty}`,
            `Existing Qty: ${existingQty}`,
            `Total Qty: ${totalQty}`,
            `PO Qty: ${poItem.quantity}`,
            `Has existing receipts: ${existingQty > 0 ? 'Yes' : 'No'}`
          ].join(" | "));*/
        
          const shouldCheckExactMatch = existingQty === 0;
          const exactMatch = shouldCheckExactMatch ? currentQty === poItem.quantity : true;
          const withinLimit = totalQty <= poItem.quantity;
          /*
          console.log(`Validation rules:`, {
            checkExactMatch: shouldCheckExactMatch,
            exactMatch,
            withinLimit
          });*/
        
          if (!withinLimit) {
            const mismatchMsg = existingQty > 0
              ? `Item ${matchedItem?.name || poItem.item_id}: Combined quantity = ${totalQty} exceeds PO quantity ${poItem.quantity}`
              : `Item ${matchedItem?.name || poItem.item_id}: Quantity ${currentQty} exceeds PO quantity ${poItem.quantity}`;
            
            //console.warn('Quantity limit violation:', mismatchMsg);
            itemMismatches.push(mismatchMsg);
          }
        
          if (shouldCheckExactMatch && !exactMatch) {
            const mismatchMsg = `Item ${matchedItem?.name || poItem.item_id}: Quantity ${currentQty} doesn't match PO quantity ${poItem.quantity}`;
            //console.warn('Exact match violation:', mismatchMsg);
            itemMismatches.push(mismatchMsg);
          }
        
          const isValid = withinLimit && (!shouldCheckExactMatch || exactMatch);
          //console.log(`Validation result: ${isValid ? 'PASS' : 'FAIL'}`);
          
          return isValid;
        });
      }
  
      // Combine all mismatches
      const allMismatches = [...mismatches, ...itemMismatches];
      setPoMismatchDetails(allMismatches.length > 0 ? allMismatches : null);
      /*
      console.log("Final match results:", {
        allItemsMatch,
        noExtraItems,
        finalMatch: allItemsMatch && noExtraItems
      });*/
  
      setPurchaseItemsMatch(allItemsMatch && noExtraItems);
  
    } catch (error) {
      console.error("Error checking items match:", error);
      setPurchaseItemsMatch(false);
      setPoMismatchDetails(["Error checking match details"]);
    }
  }, [documentItems, purchaseOrders, selectedData, vendorID, documentDetails.buyer, selectedVendor]);
  
  useEffect(() => {
    if (documentDetails.purchase_id) {
      checkCurrentDocumentItemsMatch(documentDetails.purchase_id, selectedDelNote);
    }
  }, [documentDetails.purchase_id, selectedDelNote, checkCurrentDocumentItemsMatch]); 

  

  return (
    <div className="goods-r-po">
      <div className="body-content-container">
        <div className="back-button" onClick={handleBackWithUpdate}>← Save</div>
        <div className="content-wrapper">
        <ToastContainer transition={Slide} />
        <Tooltip
  anchorId="purchaseIdSelect"
  place="bottom"
  positionStrategy="fixed"
  content={poMismatchDetails ? poMismatchDetails.join('\n') : ''}
  style={{
    backgroundColor: '#E5E7EB',
    width: '30em',
    color: '#000',
    fontSize: '0.5em',
    padding: '8px 12px',
    borderRadius: '6px',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  }}
/>

          <div className="details-grid">
            <div className="details-section">
            {/* Vendor Code (ID) */}
            <div className="detail-row dropdown-scrollbar">
                <label>Purchase ID</label>
                <select
                  id="purchaseIdSelect"
                  value={documentDetails.purchase_id || ""}
                  onChange={(e) => {
                    setDocumentDetails(prev => ({
                      ...prev,
                      purchase_id: e.target.value
                    }));
                    setSelectedPO(e.target.value);
                    checkCurrentDocumentItemsMatch(e.target.value);
                  }}
                  data-tooltip-content={poMismatchDetails ? poMismatchDetails.join('\n') : ''} 
                  style={{
                    borderColor: poMismatchDetails !== null 
                      ? 'red' 
                      : (poMismatchDetails ? '#5CB338' : '#5CB338')
                  }}
                >
                  <option value="">Select Purchase Order</option>
                  {purchaseOrders.map(po => (
                    <option key={po.purchase_id} value={po.purchase_id}>
                      {po.purchase_id} - {po.status}
                    </option>
                  ))}
                </select>
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
                      <option key={vendor.vendor_code} value={vendor.company_name}>
                        {vendor.company_name}
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
                  onChange={(e) => {
                    const value = e.target.value;
                    const regex = /^[A-Za-z\s]*$/;
                    const maxLength = 50;
                    if ((regex.test(value) || value === '') && value.length <= maxLength) {
                      handleDocumentDetailChange(e, "buyer");
                    }else{
                      toast.dismiss()
                      toast.info(" Please enter a valid name. Only alphabetic characters (A–Z, a–z) and only 50 characters are allowed.")
                    }
                  }}
                />
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
                        value={documentDetails?.delivery_date || date_today}
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
                        className="custom-date-input"
                        type="date"
                        value={documentDetails?.posting_date || date_today}
                        onChange={(e) => handleDocumentDetailChange(e, "posting_date")}
                        min={date_today}
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
                        value={documentDetails?.document_date || date_today}
                        onChange={(e) => handleDocumentDetailChange(e, "document_date")}
                        max={date_today}
                      />
                      <span className="calendar-icon">📅</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="tab-content cost-details">
                  <div className="detail-row">
                    <label>Initial Amount</label>
                    <input type="text" value={initialAmount} style={{ cursor: 'not-allowed' }} readOnly/>
                  </div>
                  <div className="detail-row">
                    <label>Tax Rate</label>
                    <input
                      type="number"
                      value={documentDetails.tax_rate}
                      onChange={(e) => {
                        const value = e.target.value;
                        const regex = /^\d{0,2}(\.\d{0,2})?$/;
                        if (value === '' || (regex.test(value) && parseFloat(value) <= 100)) {
                          setDocumentDetails(prev => ({
                            ...prev,
                            tax_rate: value
                          }));
                        }else{
                          toast.dismiss()
                          toast.info("Please enter a valid percentage. Maximum is 100 and up to 2 decimal places.")
                        }
                      }}
                      step="1"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="detail-row">
                    <label>Discount Rate</label>
                    <input
                      type="number"
                      value={documentDetails.discount_rate}
                      onChange={(e) => {
                        const value = e.target.value;
                        const regex = /^\d{0,3}(\.\d{0,2})?$/;
                        if (value === '' || (regex.test(value) && parseFloat(value) <= 100)) {
                          setDocumentDetails(prev => ({
                            ...prev,
                            discount_rate: value
                          }));
                        }else{
                          toast.dismiss()
                          toast.info("Please enter a valid percentage. Maximum is 100 and up to 2 decimal places.")
                        }
                      }}
                      step="1"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="detail-row">
                    <label>Tax Amount</label>
                    <input type="text" value={documentDetails.tax_amount.toFixed(2)} style={{ cursor: 'not-allowed' }} readOnly/>
                  </div>
                  <div className="detail-row">
                    <label>Discount Amount</label>
                    <input type="text" value={documentDetails.discount_amount.toFixed(2)} style={{ cursor: 'not-allowed' }} readOnly/>
                  </div>

                  
                  <div className="detail-row">
                    <label>Total</label>
                    <input type="text" value={
                      documentDetails.transaction_cost
                    }  
                    style={{ cursor: 'not-allowed' }}
                    readOnly
                    />      
                    
                  </div>
                  <div className="detail-row">
                    <label>Freight</label>
                    <input
                      type="number"
                      value={documentDetails.freight}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.includes('.')) {
                          return; 
                        }
                        const parsedValue = parseInt(value, 10);
                        if (value === '' || (parsedValue <= 1000000000 && /^\d*$/.test(value))) {
                          setDocumentDetails(prev => ({
                            ...prev,
                            freight: value
                          }));
                        }else{
                          toast.dismiss();
                          toast.info("Maximum freight is 1 Billion")
                        }
                      }}
                      step="0.01"
                      min="0"
                      max="1000000000"
                      
                      
                    />
                  </div>

                  <div className="detail-row">
                  <label>Delivery Note</label>
                  <select
                      className="form-select"
                      value={selectedDelNote}
                      onChange={(e) => setSelectedDelNote(e.target.value)}
                    >
                      {deliveryNoteOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
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
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>UoM</th>
                    <th>Quantity</th>
                    <th>Cost Per Unit</th>
                    <th>Total</th>
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
                        {itemOptions.filter(opt => opt.type === 'material' || opt.type === 'asset').map((opt, i) => (
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
                      <td className="item-number">
                        <input
                          type="number"
                          min="0"
                          max="1000000000"
                          step = "1"
                          value={item.quantity || ''}
                          onKeyDown={(e) => {
                            if (e.key === '.') {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (
                              /^\d*$/.test(value) &&      
                              parseInt(value, 10) <= 10000000  
                            ) {
                              handleInputChange(e, index, 'quantity');
                            }else{
                              toast.dismiss();
                              toast.info("Maximum quantity is 10 Millions")
                            }
                          }}
                        />
                      </td>
                      <td>
                        {item.item_id && duplicateDetails[item.item_id]?.length > 1 ? (
                          // Show dropdown if item has multiple prices
                          <select
                            value={item.cost || ''}
                            onChange={(e) => handleCostSelection(index, parseFloat(e.target.value))}
                            required
                          >
                            {duplicateDetails[item.item_id].map((costObj, costIndex) => (
                              <option key={costIndex} value={costObj.price}>
                                {costObj.price.toFixed(2)} (Purchased: {costObj.date || 'Unknown'})
                              </option>
                            ))}
                          </select>
                        ) : (
                          // Show read-only input with first available cost
                          <input
                            type="number"
                            value={
                              item.cost || 
                              (item.item_id && duplicateDetails[item.item_id]?.[0]?.price) || 
                              '0.00'
                            }
                            readOnly
                            style={{ cursor: 'not-allowed' }}
                          />
                        )}
                      </td>
                      <td readOnly style={{ cursor: 'not-allowed' }}>
                        {(() => {
                          const currentCost = item.cost || 
                          (item.item_id && duplicateDetails[item.item_id]?.[0]?.price) || 0;

                          const total = (parseFloat(item.quantity || 0) * parseFloat(currentCost));
                          if (total > 1000000000) {
                            toast.dismiss();
                            toast.error("Total cost must not exceed 1 billion");
                          }
                          return total.toFixed(2);
                        })()}
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
                      <td readOnly style={{ cursor: 'not-allowed' }}>
                        {item?.item_no?.startsWith("BN") ? item.item_no : "N/A"}
                      </td>
                      <td readOnly style={{ cursor: 'not-allowed' }}>
                        {item?.item_no?.startsWith("SRL") ? item.item_no : "N/A"}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
















          <div className="button-section">
            <div className="copy-from-button dropdown-scrollbar">
              {selectedButton === "Create" ? (
                <select
                  className="copy-from-select"
                  value="Copy From"
                  onChange={(e) => handlePOSelect(e.target.value)}
                >
                  <option value="">Copy From</option>
                  {purchaseOrders.map(po => (
                    <option key={po.purchase_id} value={po.purchase_id}>
                      {po.purchase_id.split('-').slice(-2).join('-')}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="copy-from-select"
                  type="text"
                  readOnly
                  style={{ cursor: 'not-allowed' }}
                >Copy From</div>
              )}
            </div>
            <div className="right-buttons">
              <button className="cancel-button" onClick={onBack}>Cancel</button>
            </div>
          </div>
        </div>
      </div>




    </div>
  );
};
















export default GoodsReceiptPO;
 







