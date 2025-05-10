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
  const [duplicateDetails, setDuplicateDetails] = useState({});
  
  const calculateInitialAmount = () => {
    if (isCreateMode) return 0;
    if (!selectedData?.document_items) return 0;
    
    return selectedData.document_items.reduce((sum, item) => {
      const price = item.item_price !== 0 ? item.item_price : 
                   (duplicateDetails[item.item_id]?.[0]?.price || 0);
      return sum + (parseFloat(item.quantity) * parseFloat(price));
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
      const responseEmployee = await fetch("http://127.0.0.1:8000/operation/supplier/");
      if (!responseEmployee.ok) throw new Error("Connection to database failed");
      const dataE = await responseEmployee.json();
      if (!Array.isArray(dataE.employees)) throw new Error("Invalid employee format");
      setEmployeeList(dataE.employees)
      const response = await fetch("http://127.0.0.1:8000/operation/customer/");
      if (!response.ok) throw new Error("Connection to database failed");
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid customer format");
      setVendorList(data);
      setLoadingInvoices(true);
      const responseSalesInvoice = await fetch("http://127.0.0.1:8000/operation/sales-invoice/");
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
      setSelectedStatus(selectedData.status); 
    }
    if (selectedData?.invoice_id) {
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
    setVendorID(selectedVendorData ? selectedVendorData.customer_id : "");
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


 
 







 
  const today = new Date().toISOString().slice(0, 10);
  const [documentDetails, setDocumentDetails] = useState({
    vendor_code: isCreateMode ? "" : vendorID,
    company_name: isCreateMode ? "" : selectedVendor,
    contact_person: isCreateMode ? "" : contactPerson,
    buyer: isCreateMode ? "" : selectedData.buyer || "",
    owner: isCreateMode ? employee_id : selectedData.owner,
    transaction_id: isCreateMode ? "" : selectedData.transaction_id || "",
    ar_credit_memo: isCreateMode ? "" : selectedData.ar_credit_memo || "",
    invoice_id: isCreateMode ? "" : selectedData.invoice_id || "",
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
          const response = await fetch('http://127.0.0.1:8000/operation/goods-tracking/get-next-doc-ids/');
          if (!response.ok) throw new Error('Failed to fetch next document IDs');
         
          const data = await response.json();
          setDocumentDetails(prev => ({
            ...prev,
            document_no: data.next_document_no,
            transaction_id: data.next_transaction_id,
            ar_credit_memo: data.next_credit_memo_id
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
    if (index !== updatedItems.length - 1 && currentItem.item_name.trim() === '') {
      try {
        await fetch(`http://127.0.0.1:8000/operation/document-item/${currentItem.content_id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            document_id: "",  
          }),
        });
      } catch (error) {
        toast.error('Error deleting row from database:', error);
      }
  
      updatedItems.splice(index, 1);
      setDocumentItems(updatedItems);
    }

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
    
    if (isRowFilled(lastRow)) {
      const updatedItems = [...documentItems];
      updatedItems[updatedItems.length - 1] = {
        ...lastRow,
        total: (parseFloat(lastRow.quantity) * parseFloat(lastRow.cost)).toFixed(2) - parseFloat(lastRow.ar_discount).toFixed(2),
      };
      
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
      row.quantity
    );

    return baseFieldsFilled;
  };




  const [warehouseOptions, setWarehouseOptions] = useState([]);








  useEffect(() => {
    fetch('http://127.0.0.1:8000/operation/get-warehouseID/')
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => a.warehouse_location.localeCompare(b.warehouse_location));
        setWarehouseOptions(sorted);
      })
      .catch((err) => toast.error('Error fetching warehouse options:', err));
  }, []);
 
  const [itemOptions, setItemOptions] = useState([]);
 
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
  
    if (selectedName === "") {
      if (index !== updatedItems.length - 1) {
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
              document_id: "",  
            }),
          });
          


        } catch (error) {
          toast.error('Error deleting row from database:', error);
          return;
        }
  
        updatedItems.splice(index, 1);
      } else {
        updatedItems[index] = {
          ...currentItem,
          item_id: '',
          item_name: '',
          unit_of_measure: '',
          ar_discount: '',
          cost: ''
        };
      }
      
      setDocumentItems(updatedItems);
      return;
    }
  
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
        available_costs: null 
      };
    } else {
      const latestPrice = duplicatePrices[0]?.price;
      updatedItems[index] = {
        ...currentItem,
        item_name: selectedItem.name,
        item_id: selectedItem.id,
        cost: latestPrice || 0, 
        unit_of_measure: selectedItem.unit,
        available_costs: duplicatePrices.map(priceObj => ({
          price: priceObj.price,
          date: priceObj.date
        }))
      };
    }
  
    setDocumentItems(updatedItems);
  
    if (index === updatedItems.length - 1) {
      handleAddRow();
    }
  };
  const handleCostSelection = (index, selectedPrice) => {
    const updatedItems = [...documentItems];
    updatedItems[index].cost = selectedPrice;
    
    updatedItems[index].total = (
      parseFloat(updatedItems[index].quantity || 0) * 
      parseFloat(selectedPrice)
    ).toFixed(2);
    
    setDocumentItems(updatedItems);
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
  }, [documentDetails.ar_discount, documentDetails.tax_rate, documentDetails.discount_rate, documentDetails.freight, initialAmount, documentDetails.invoice_amount]);
 
 
  const handleDocumentDetailChange = (e, field) => {
    setDocumentDetails(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
 
  const handleCreateDocument = async () => {
    try {
      
      const itemsToCreate = documentItems.slice(0, -1); 
     
      const payload = {
        vendor_code: null,
        document_type: "A/R Credit Memo",
        transaction_id: documentDetails.transaction_id,
        document_no: documentDetails.document_no,
        purchase_id: documentDetails?.purchase_id || null,
        status: selectedStatus,
        delivery_date: documentDetails.delivery_date,
        posting_date: documentDetails.posting_date,
        document_date: documentDetails.document_date,
        buyer: vendorID,
        owner: documentDetails.owner,
        ar_credit_memo: documentDetails.ar_credit_memo,
        invoice_id : documentDetails.invoice_id,
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
          ar_discount: parseFloat(item.ar_discount) || 0,
          total: parseFloat(item.total) || 0,
          warehouse_id: item.warehouse_id,
          item_no: null
        }))
      };
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
      if (onSuccess) {
        await onSuccess();
        toast.dismiss()
        toast.success("Successfully updated documents.", {
          autoClose: 1000,
          onClose: () => onBack(), 
        });
      }   
     
    } catch (error) {
      toast.error(`Failed to create document. Please try again later`);
      console.log(error)
    }
  };

  const handleBackWithUpdate = async () => {
      const updatedDocumentItems = documentItems.slice(0, -1);   
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
              ar_discount: parseFloat(item.ar_discount) || 0,
              total: parseFloat(item.total) || 0,
              warehouse_id: item.warehouse_id,
              manuf_date: item.manuf_date,
              expiry_date: item.expiry_date,
              purchase_date: item.purchase_date || null,
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
            vendor_code: null,
            document_type: "A/R Credit Memo",
            transaction_id: documentDetails.transaction_id,
            document_no: documentDetails.document_no,
            purchase_id: documentDetails?.purchase_id || null,
            status: selectedStatus,
            delivery_date: documentDetails.delivery_date,
            posting_date: documentDetails.posting_date,
            document_date: documentDetails.document_date,
            buyer: vendorID,
            owner: documentDetails.owner,
            invoice_id : documentDetails.invoice_id,
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
          toast.success("Successfully updated documents.");
          
        }
        if (onBack) {
          onBack(); 
        }
      } catch (error) {
        toast.error(`Failed to update data. Please try again later`);
        console.log(error.message)
      }
    };
 
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState("");


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
    setSelectedPO(""); 
 
    try {
      const response = await fetch(`http://127.0.0.1:8000/operation/purchase_order/${poId}/`);
      if (!response.ok) throw new Error("Failed to fetch purchase order details");
 
      const selectedPO = await response.json();
      const quotation = selectedPO.quotation_id || {};
 
      setDocumentDetails(prev => ({
        ...prev,
        vendor_code: quotation.vendor_code || null,
        company_name: quotation.company_name || null,
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
 
      const poInitialAmount = poItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
      setInitialAmount(poInitialAmount.toFixed(2));
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
            ar_discount: item.ar_discount || 0, 
            warehouse_id: item.warehouse_id,
            item_no: item.item_no 
          })), 
          {}
        ]
  );


  useEffect(() => {
    const newInitialAmount = documentItems
      .slice(0, -1) 
      .reduce((sum, item) => {
        const price = parseFloat(item.cost || duplicateDetails[item.item_id]?.[0]?.price || 0);
        const discount_percent = item?.ar_discount || 0;
        const discount = (parseFloat(item.quantity || 0) * parseFloat(price)*(discount_percent/100))
        const total = parseFloat((parseFloat(item.quantity || 0) * parseFloat(price))-discount);
        return total + sum;
      }, 0)
      .toFixed(2);
    setInitialAmount(newInitialAmount);
  }, [documentItems, duplicateDetails]);


  return (
    <div className="ar-cred">
      <div className="body-content-container">
        <div className="back-button" onClick={handleBackWithUpdate}> ← Save</div>
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
                    selectedData?.owner
                      ? employeeList.find(e => e.employee_id === selectedData.owner)?.employee_name || selectedData.employee_id
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
                  value={documentDetails?.ar_credit_memo || selectedData?.ar_credit_memo || ""}
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
                              {invoice.invoice_id}
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
                        value={documentDetails?.posting_date || "2025-01-31"}
                        onChange={(e) => handleDocumentDetailChange(e, "posting_date")}
                        min={date_today}
                      />
                      <span className="calendar-icon">📅</span>
                    </div>


                    </div>
                    <div className="detail-row">
                    <label>Document Date</label>
                    <div className="date-input clickable">
                      <input
                        type="date"
                        value={documentDetails?.document_date || "2025-01-31"}
                        onChange={(e) => handleDocumentDetailChange(e, "document_date")}
                        max={date_today}
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
                  <div className="detail-row">
                    <label>Total</label>
                    <input type="text" value={
                      documentDetails.transaction_cost
                      }  
                      readOnly style={{ cursor: 'not-allowed' }}
                    />
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
                    <th>Discount</th>
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
                              toast.info("Maximum quantity is 10 millions")
                            }
                          }}
                        />
                      </td>
                      <td>
                        {item.item_id && duplicateDetails[item.item_id]?.length > 1 ? (
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
                      <td style={{ cursor: 'not-allowed' }}>
                        <input
                        type="number"
                          min="0"
                          max="100"
                          step="1"
                          placeholder="0.00"
                          value={item.ar_discount || ""}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (value <= 100) {
                              handleInputChange(e, index, "ar_discount");
                            } else {
                              toast.dismiss();
                              toast.warning("Discount cannot exceed 100%");
                            }
                          }}
                        />
                      </td>
                      <td readOnly style={{ cursor: 'not-allowed' }}>
                        {(() => {
                          const currentCost = item.cost || 
                          (item.item_id && duplicateDetails[item.item_id]?.[0]?.price) || 0;
                          const discount_percent = item?.ar_discount || 0;
                          const discount = (parseFloat(item.quantity || 0) * parseFloat(currentCost)*(discount_percent/100))
                          const total = parseFloat((parseFloat(item.quantity || 0) * parseFloat(currentCost))-discount);
                          if (total > 1000000000) {
                            toast.dismiss();
                            toast.error("Total cost must not exceed 1 billion");
                          }
                          return total.toFixed(2);
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>








          <div className="button-section">
          <button
            className="copy-from-button"
            style={{ cursor: 'not-allowed' }}
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







