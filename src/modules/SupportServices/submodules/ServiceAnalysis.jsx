"use client"

import { useRef, useState, useEffect } from "react"
import "../styles/ServiceAnalysis.css"
import "../styles/SupportServices.css"
import ServiceAnalysisIcon from "/icons/SupportServices/ServiceAnalysisIcon.png"
import Table from "../components/ServiceAnalysis/Table"
import UpdateAnalysisModal from "../components/ServiceAnalysis/UpdateAnalysisModal"
import AddServiceAnalysisModal from "../components/ServiceAnalysis/AddServiceAnalysisModal"
import AddItemModal from "../components/ServiceAnalysis/AddItemModal"
import EditItemModal from "../components/ServiceAnalysis/EditItemModal"
import ViewInventoryModal from "../components/ServiceAnalysis/ViewInventoryModal"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"

import { GET } from "../api/api"
import { POST } from "../api/api"
import { PATCH } from "../api/api"
import { POST_NOTIF } from "../api/api"

const ServiceAnalysis = ({employee_id}) => {
  // State for analyses
  const [analyses, setAnalyses] = useState([])
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showEditItemModal, setShowEditItemModal] = useState(false)
  const [showViewInventoryModal, setShowViewInventoryModal] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOption, setFilterOption] = useState("Filter by")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [activeTab, setActiveTab] = useState("General")
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successModalMessage, setSuccessModalMessage] = useState("")

  // After Analysis state
  const [afterAnalysisInfo, setAfterAnalysisInfo] = useState({
    afterAnalysisId: "",
    analysisId: "",
    serviceStatus: "",
    serviceDate: "",
    description: "",
  })
  
  // Delivery Order state
  const [deliveryOrderInfo, setDeliveryOrderInfo] = useState({
    deliveryOrderId: "",
    customerId: "",
    serviceOrderId: "",
    name: "",
    deliveryDate: "",
    address: "",
    deliveryStatus: "",
  })

  // Service order items
  const [serviceOrderItems, setServiceOrderItems] = useState([])

  // Customer information
  const [customerInfo, setCustomerInfo] = useState({
    customerId: "",
    name: "",
    address: "",
    phoneNumber: "",
    emailAddress: "",
    productId: "",
    productName: "",
    contractId: "",
    terminationDate: "",
    requestType: "",
  })

  // Service order information
  const [serviceOrderInfo, setServiceOrderInfo] = useState({
    serviceOrderId: "",
    orderDate: "",
    orderTotalPrice: "",
  })

  const fetchAnalyses = async () => {
    try {
      // this filters out analyses so that only the service analyses assigned to the one currently logged in will show:
      //const data = await GET(`analysis/analyses/technician/HR-EMP-2025-8d9f9b/`);
      const data = await GET(`analysis/analyses/technician/${employee_id}/`);

      // all analyses version:
      // const data = await GET("analysis/");
      setAnalyses(data);
    } catch (error) {
      console.error("Error fetching analyses:", error)
    }
  }

  useEffect(() => {
    fetchAnalyses();
    fetchMRP();
    fetchDistrib();
  }, []);

    useEffect(() => {
      if (activeTab === "Delivery Order") {
        setDeliveryOrderInfo((prev) => ({
          ...prev,
          ...(selectedAnalysis?.analysis_id && {
            customerId: selectedAnalysis.customer?.customer_id || "",
            name: selectedAnalysis.customer?.name || "",
            address: selectedAnalysis.customer
              ? `${selectedAnalysis.customer.address_line1 || ""} ${selectedAnalysis.customer.address_line2 || ""}`.trim()
              : "",
          }),
          ...(serviceOrderInfo?.serviceOrderId && {
            serviceOrderId: serviceOrderInfo?.serviceOrderId || "",
          }),
        }));
      }
    }, [activeTab, selectedAnalysis, serviceOrderInfo]);

    useEffect(() => {
      if (activeTab === "After Analysis" && selectedAnalysis) {
        setAfterAnalysisInfo((prev) => ({
          ...prev,
          analysisId: selectedAnalysis.analysis_id,
        }));
      }
    }, [activeTab, selectedAnalysis]);

  const handleRowClick = async (analysis) => {
    try {
      const data = await GET(`analysis/${analysis.analysis_id}`); 
      console.log("Fetched data:", data);

      setSelectedAnalysis(data);

      setCustomerInfo({
        customerId: data.customer?.customer_id || "",
        name: data.customer?.name || "",
        address: data.customer ? `${data.customer.address_line1 || ""} ${data.customer.address_line2 || ""}`.trim() : "",
        phoneNumber: data.customer?.phone_number || "",
        emailAddress: data.customer?.email_address || "",
        productId: data.product?.product_id,
        productName: data.product?.product_name,
        contractId: data.contract?.contract_id,
        terminationDate: data.contract?.end_date,
        requestType: data.service_request?.request_type,
      })

      setDeliveryOrderInfo({
        customerId: data.customer?.customer_id || "",
        name: data.customer?.name || "",
        address: data.customer
          ? `${data.customer.address_line1 || ""} ${data.customer.address_line2 || ""}`.trim()
          : "",
        serviceOrderId: serviceOrderInfo?.serviceOrderId || "",
      });

      setAfterAnalysisInfo({
        analysisId: data.analysis_id
      });

      fetchOrder(data.analysis_id);
      fetchAfterAnalysis(data.analysis_id);

    } catch (error) {
      console.error("Error fetching service analysis details:", error);
    }
  };

  const fetchOrder = async (analysisId) => {
    try {
      const fetchedData = await GET(`order/orders/${analysisId}/`);
      const data = fetchedData[0] || {};

      const rawDate = data?.order_date;
      
      
      let formattedDate = "";
      if (rawDate) {
        const date = new Date(rawDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
  
        formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }

      setServiceOrderInfo({
        serviceOrderId: data?.service_order_id || "",
        orderDate: formattedDate,
        orderTotalPrice: data?.order_total_price || "",
      });

      setDeliveryOrderInfo({
        serviceOrderId: data?.service_order_id || "",
      })

      fetchServiceOrderItems(data?.service_order_id);
      fetchDeliveryOrder(data?.service_order_id);

    } catch (error) {
      console.error("Error fetching order:", error);
      setServiceOrderInfo({
        serviceOrderId: "",
        orderDate: "",
        orderTotalPrice: ""
      });
      if (serviceOrderItems){ setServiceOrderItems([]) }
      if (deliveryOrderInfo){ 
        setDeliveryOrderInfo({
          serviceOrderId: "",
          deliveryOrderId: "",
          deliveryDate: "",
          deliveryStatus: "",
      }) }
      
    }
  };

  const fetchServiceOrderItems = async (serviceOrderId) => {
    try {
      const data = await GET(`order/order-items/${serviceOrderId}/`);
      setServiceOrderItems(data)
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  };

  const fetchDeliveryOrder = async (serviceOrderId) => {
    try {
      const data = await GET(`delivery/order/${serviceOrderId}/`);
      setDeliveryOrderInfo((prevState) => ({
        ...prevState,  
        deliveryOrderId: data?.delivery_order_id || prevState.deliveryOrderId,
        deliveryDate: data?.delivery_date || prevState.deliveryDate,
        deliveryStatus: data?.delivery_status || prevState.deliveryStatus,
      }));
    } catch (error) {
      console.error("Error fetching delivery order:", error);
      setDeliveryOrderInfo((prevState) => ({
        ...prevState,  
        deliveryOrderId: "",
        deliveryDate: "",
        deliveryStatus: "",
      }));
    }
  };

  const fetchAfterAnalysis = async (analysisId) => {
    try {
      const data = await GET(`after-analysis/analysis/${analysisId}/`);

      setAfterAnalysisInfo({
        afterAnalysisId: data?.analysis_sched_id || "",
        serviceStatus: data?.service_status || "",
        serviceDate: data.service_date || "",
        description: data.description || "",
      });

    } catch (error) {
      console.error("Error fetching after analysis:", error);
      setAfterAnalysisInfo({
        afterAnalysisId: "",
        serviceStatus: "",
        serviceDate: "",
        description: "",
      });
    }
  };
  
  const [isOpenStatusDD, setOpenStatusDD] = useState(false);

  const handleToggleDropdownStatus = () => {
    setOpenStatusDD(!isOpenStatusDD);
  };
  
  const handleSelectStatus = (status) => {
    setDeliveryOrderInfo((prevState) => ({
      ...prevState,  
      deliveryStatus: status,
    }));
    setOpenStatusDD(false); 
  };

  const [isOpenAfterStatusDD, setOpenAfterStatusDD] = useState(false);

  const handleToggleDropdownAfterStatus = () => {
    setOpenAfterStatusDD(!isOpenAfterStatusDD);
  };

  const handleSelectAfterStatus = (status) => {
    setAfterAnalysisInfo((prevState) => ({
      ...prevState,  
      serviceStatus: status,
    }));
    setOpenAfterStatusDD(false); 
  };

  const statusRef = useRef(null);
  const afterStatusRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setOpenStatusDD(false); // Close the dropdown
      }
      if (afterStatusRef.current && !afterStatusRef.current.contains(event.target)) {
        setOpenAfterStatusDD(false); // Close the dropdown
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isPickerOpen, setIsPickerOpen] = useState(false);

    const toggleDatePicker = () => {
      const dateInput = document.getElementById("deliveryDate");
      if (isPickerOpen) {
        dateInput.blur(); 
      } else {
        dateInput.showPicker(); 
      }
      
      setIsPickerOpen(!isPickerOpen); 
    };

    const toggleDateAfterPicker = () => {
      const dateInput = document.getElementById("serviceDate");
      if (isPickerOpen) {
        dateInput.blur(); 
      } else {
        dateInput.showPicker(); 
      }
      
      setIsPickerOpen(!isPickerOpen); 
    };

  // Handle view analysis
  const handleViewAnalysis = (analysis) => {
      setSelectedAnalysis(analysis)
      setShowUpdateModal(true)
  }

  // Handle update analysis
  const handleUpdateAnalysis = async (analysisData) => {
    const analysisId = analysisData.analysis_id;
    if (!analysisId) {
      console.error("Error: analysis_id is undefined");
      return;
    }
    console.log("Updating analysis:", analysisData)
    try {
      await PATCH(`analysis/${analysisId}/`, analysisData);
      setShowUpdateModal(false);
      fetchAnalyses();
    } catch (error) {
      let firstError = "An unknown error occurred.";
      if (error && typeof error === "object") {
        const keys = Object.keys(error);
        if (keys.length > 0) {
          const firstKey = keys[0];
          const firstValue = error[firstKey];
          if (Array.isArray(firstValue)) {
            firstError = `${firstKey}: ${firstValue[0]}`;
          }
        } else if (typeof error.detail === "string") {
          firstError = error.detail;
        }
      }
        console.error("Error updating service analysis:", error.message);
        setErrorModalMessage(firstError); 
        setShowErrorModal(true);  
    }
  }

  // Handle create analysis
  const handleCreateAnalysis = async (analysisData) => {
      console.log("Creating analysis:", analysisData)
      try {
        const data = await POST("analysis/", analysisData);
        console.log("Analysis created successfully:", data);
        setShowAddModal(false);
        fetchAnalyses();
    } catch (error) {
      let firstError = "An unknown error occurred.";
      if (error && typeof error === "object") {
        const keys = Object.keys(error);
        if (keys.length > 0) {
          const firstKey = keys[0];
          const firstValue = error[firstKey];
          if (Array.isArray(firstValue)) {
            firstError = `${firstKey}: ${firstValue[0]}`;
          }
        } else if (typeof error.detail === "string") {
          firstError = error.detail;
        }
      }
      console.error("Error submitting analysis:", error.message);
      setErrorModalMessage(firstError); 
      setShowErrorModal(true);  
    }
  }

  const handleAddOrder = async () => {
    const orderData = {
      analysis_id: selectedAnalysis.analysis_id,
      customer_id: customerInfo.customerId,
    }

    console.log("Creating service order:", orderData)
      try {
        const data = await POST("order/", orderData);
        console.log("Service order created successfully:", data);
        fetchOrder(selectedAnalysis.analysis_id);
        setSuccessModalMessage("Service order created successfully!"); 
        setShowSuccessModal(true);  
    } catch (error) {
      let firstError = "An unknown error occurred.";
      if (error && typeof error === "object") {
        const keys = Object.keys(error);
        if (keys.length > 0) {
          const firstKey = keys[0];
          const firstValue = error[firstKey];
          if (Array.isArray(firstValue)) {
            firstError = `${firstKey}: ${firstValue[0]}`;
          }
        } else if (typeof error.detail === "string") {
          firstError = error.detail;
        }
      }
        console.error("Error submitting service order:", error.message);
        setErrorModalMessage(firstError); 
        setShowErrorModal(true);  
    }
  }

  // Handle add item
  const handleAddItem = () => {
    if (activeTab === "Service Order") {
      setShowAddItemModal(true)
    }
  }

  const [mrp, setMRP] = useState([])

  const fetchMRP = async () => {
    try {
      const data = await GET("call/calls/mat-planners/");
      const userIds = data.map(user => user.user_id);
      setMRP(userIds);
    } catch (error) {
      console.error("Error fetching material planners:", error)
    }
  }

  const handleCreateOrderItem = async (orderItemData) => {
    console.log("Creating order item:", orderItemData)

    const notifData = {
      module: "Support & Services",
      submodule: "Service Analysis",
      recipient_ids: mrp,
      msg: "New service order item awaiting markup pricing."
    }
    console.log(notifData)
    try {
      const data = await POST("order/item/", orderItemData);
      console.log("Order item created successfully:", data);

      const notif_data_batch = await POST_NOTIF("send-notif-batch/", notifData);
      console.log("Notification sent successfully:", notif_data_batch);

      setShowAddItemModal(false);
      fetchServiceOrderItems(serviceOrderInfo.serviceOrderId);
      
      try {
        const fetchedData = await GET(`order/orders/${selectedAnalysis.analysis_id}/`);
        const data = fetchedData[0] || {};
        setServiceOrderInfo({
          ...serviceOrderInfo,
          orderTotalPrice: data?.order_total_price || "",
        });

      } catch (error) {
        console.error("Error creating order item:", error);
        setServiceOrderInfo({
          ...serviceOrderInfo,
          orderTotalPrice: ""
        });
      }

  } catch (error) {
    let firstError = "An unknown error occurred.";
    if (error && typeof error === "object") {
      const keys = Object.keys(error);
      if (keys.length > 0) {
        const firstKey = keys[0];
        const firstValue = error[firstKey];
        if (Array.isArray(firstValue)) {
          firstError = `${firstKey}: ${firstValue[0]}`;
        }
      } else if (typeof error.detail === "string") {
        firstError = error.detail;
      }
    }
      console.error("Error submitting order item:", error.message);
      setErrorModalMessage(firstError); 
      setShowErrorModal(true);  
  }
}

  const handleEditOrderItem = async (orderItemData) => {
    const orderItemId = orderItemData.service_order_item_id;
    if (!orderItemId) {
      console.error("Error: service_order_item_id is undefined");
      return;
    }
    console.log("Updating service order item:", orderItemData)

    try {
      const data = await PATCH (`order/item/${orderItemId}/`, orderItemData);
      console.log("Order item updated successfully:", data);
      setShowEditItemModal(false);
      fetchServiceOrderItems(serviceOrderInfo.serviceOrderId);

      try {
        const fetchedData = await GET(`order/orders/${selectedAnalysis.analysis_id}/`);
        const data = fetchedData[0] || {};
        setServiceOrderInfo({
          ...serviceOrderInfo,
          orderTotalPrice: data?.order_total_price || "",
        });

      } catch (error) {
        console.error("Error fetching order item:", error);
        setServiceOrderInfo({
          ...serviceOrderInfo,
          orderTotalPrice: ""
        });
      }

  } catch (error) {
    let firstError = "An unknown error occurred.";
    if (error && typeof error === "object") {
      const keys = Object.keys(error);
      if (keys.length > 0) {
        const firstKey = keys[0];
        const firstValue = error[firstKey];
        if (Array.isArray(firstValue)) {
          firstError = `${firstKey}: ${firstValue[0]}`;
        }
      } else if (typeof error.detail === "string") {
        firstError = error.detail;
      }
    }
      console.error("Error updating order item:", error.message);
      setErrorModalMessage(firstError); 
      setShowErrorModal(true);  
  }
  }

  // Handle edit item
  const handleEditItem = (item) => {
    if (activeTab === "Service Order") {
      setShowEditItemModal(true)
    }
  }

  // Handle view inventory
  const handleViewInventory = () => {
    if (activeTab === "Service Order") {
      setShowViewInventoryModal(true)
    }
  }

  const [distrib, setDistrib] = useState([])

  const fetchDistrib = async () => {
    try {
      const data = await GET("call/calls/distrib-manager/");
      const userIds = data.map(user => user.user_id);
      setDistrib(userIds);
    } catch (error) {
      console.error("Error fetching material planners:", error)
    }
  }

  const createDeliveryOrder  = async () => {
    if (activeTab === "Delivery Order") {
      const newDeliveryOrderInfo  = {
        customer_id: deliveryOrderInfo.customerId || "",
        customer_address: deliveryOrderInfo.address || "",
        delivery_status: deliveryOrderInfo.deliveryStatus,
        delivery_date: deliveryOrderInfo.deliveryDate,
        service_order_id: deliveryOrderInfo.serviceOrderId,
      }
      console.log("Creating delivery order:", newDeliveryOrderInfo )

      const notifData = {
        module: "Support & Services",
        submodule: "Service Analysis",
        recipient_ids: distrib,
        msg: "A new delivery order has been submitted. Please review details."
      }
      console.log(notifData)

      try {
        const data = await POST("delivery/", newDeliveryOrderInfo );
        console.log("Delivery order created successfully:", data);

        const notif_data_batch = await POST_NOTIF("send-notif-batch/", notifData);
        console.log("Notification sent successfully:", notif_data_batch);

        fetchDeliveryOrder(serviceOrderInfo.serviceOrderId);
        setSuccessModalMessage("Service delivery order created successfully!"); 
        setShowSuccessModal(true);  
      } catch (error) {
        let firstError = "An unknown error occurred.";
        if (error && typeof error === "object") {
          const keys = Object.keys(error);
          if (keys.length > 0) {
            const firstKey = keys[0];
            const firstValue = error[firstKey];
            if (Array.isArray(firstValue)) {
              firstError = `${firstKey}: ${firstValue[0]}`;
            }
          } else if (typeof error.detail === "string") {
            firstError = error.detail;
          }
        }
          console.error("Error submitting delivery order:", error.message);
          setErrorModalMessage(firstError); 
          setShowErrorModal(true);  
      }
    }
  }

  const updateDeliveryOrder  = async () => {
    if (activeTab === "Delivery Order") {
      const newDeliveryOrderInfo  = {
        delivery_status: deliveryOrderInfo.deliveryStatus,
        delivery_date: deliveryOrderInfo.deliveryDate,
      }
      const id = deliveryOrderInfo.deliveryOrderId
      console.log("Updating delivery order:", id, " with: \n", newDeliveryOrderInfo )

      try {
        const data = await PATCH(`delivery/${id}/`, newDeliveryOrderInfo );
        console.log("Delivery order updated successfully:", data);
        fetchDeliveryOrder(serviceOrderInfo.serviceOrderId);
        setSuccessModalMessage("Delivery order updated successfully!"); 
        setShowSuccessModal(true);  
      } catch (error) {
        let firstError = "An unknown error occurred.";
        if (error && typeof error === "object") {
          const keys = Object.keys(error);
          if (keys.length > 0) {
            const firstKey = keys[0];
            const firstValue = error[firstKey];
            if (Array.isArray(firstValue)) {
              firstError = `${firstKey}: ${firstValue[0]}`;
            }
          } else if (typeof error.detail === "string") {
            firstError = error.detail;
          }
        }
          console.error("Error updating delivery order:", error.message);
          setErrorModalMessage(firstError); 
          setShowErrorModal(true);  
      }
    }
  }

  const updateAfterAnalysis  = async () => {
    const afterAnalysisId = afterAnalysisInfo.afterAnalysisId
    if (!afterAnalysisId) {
      console.error("Error: afterAnalysisId is undefined");
      return;
    }

    const afterAnalysisData = {
      service_status: afterAnalysisInfo.serviceStatus,
      service_date: afterAnalysisInfo.serviceDate,
      description: afterAnalysisInfo.description
    }

    console.log("Updating after analysis sched:", afterAnalysisData)
    try {
        const data = await PATCH (`after-analysis/${afterAnalysisId}/`, afterAnalysisData);
        console.log("After analysis sched update successfully:", data);
        fetchAfterAnalysis(selectedAnalysis.analysis_id);
        setSuccessModalMessage("After analysis schedule updated successfully!"); 
        setShowSuccessModal(true);  
    } catch (error) {
      let firstError = "An unknown error occurred.";
      if (error && typeof error === "object") {
        const firstKey = Object.keys(error)[0];
        if (firstKey && Array.isArray(error[firstKey])) {
          firstError = error[firstKey][0];
        } else if (typeof error.detail === "string") {
          firstError = error.detail;
        }
      }
        console.error("Error updating after analysis sched:", error.message);
        setErrorModalMessage(firstError); 
        setShowErrorModal(true);  
    }
  }

  const createAfterAnalysis  = async () => {
    const afterAnalysisData = {
      analysis_id: selectedAnalysis.analysis_id,
      service_status: afterAnalysisInfo.serviceStatus,
      service_date: afterAnalysisInfo.serviceDate,
      description: afterAnalysisInfo.description,
      technician_id: selectedAnalysis?.technician?.employee_id
    }

    console.log("Creating after analysis sched:", afterAnalysisData)
      try {
        const data = await POST("after-analysis/", afterAnalysisData);
        console.log("After analysis sched created successfully:", data);
        fetchAfterAnalysis(selectedAnalysis.analysis_id);
        setSuccessModalMessage("After analysis scheduled successfully!"); 
        setShowSuccessModal(true);  
    } catch (error) {
      let firstError = "An unknown error occurred.";
      if (error && typeof error === "object") {
        const keys = Object.keys(error);
        if (keys.length > 0) {
          const firstKey = keys[0];
          const firstValue = error[firstKey];
          if (Array.isArray(firstValue)) {
            firstError = `${firstKey}: ${firstValue[0]}`;
          }
        } else if (typeof error.detail === "string") {
          firstError = error.detail;
        }
      }
        console.error("Error submitting after analysis sched:", error.message);
        setErrorModalMessage(firstError); 
        setShowErrorModal(true);  
    }
  }

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "scheduled", label: "Scheduled" },
    { value: "done", label: "Done" },
  ]

  // Handle filter selection
  const handleFilterSelect = (option) => {
    setFilterOption(option)
    setShowFilterOptions(false)
  }

  // Filter analyses based on search query and filter option
  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch =
    searchQuery === "" ||
    analysis.analysis_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    analysis.service_request?.service_request_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    (`${analysis.technician?.first_name ?? ""} ${analysis.technician?.last_name ?? ""}`
    .toLowerCase()
    .includes(searchQuery.toLowerCase()));

    if (filterOption !== "all") {
      if (filterOption === "scheduled" && analysis.analysis_status !== "Scheduled") return false;
      if (filterOption === "done" && analysis.analysis_status !== "Done") return false;
    }
  
    return matchesSearch;
  });

  return (
    <div className="serv servanal">
      <div className="body-content-container">
        <div className="header">
          <div className="icon-container">
            <img src={ServiceAnalysisIcon || "/placeholder.svg?height=24&width=24"} alt="Service Analysis" />
          </div>
          <div className="title-container">
            <h2>Service Analysis</h2>
            <p className="subtitle">Optimizing Service Operations Through Detailed Analysis</p>
          </div>
        </div>

        <div className="divider"></div>

        <div className="fixed-tabs-container">
          <div className="tabs-container">
            <div className={`tab ${activeTab === "General" ? "active" : ""}`} onClick={() => setActiveTab("General")}>
              General
            </div>
            <div
              className={`tab ${activeTab === "Service Order" ? "active" : ""}`}
              onClick={() => setActiveTab("Service Order")}
            >
              Service Order
            </div>
            <div
              className={`tab ${activeTab === "Delivery Order" ? "active" : ""}`}
              onClick={() => setActiveTab("Delivery Order")}
            >
              Delivery Order
            </div>
            <div
              className={`tab ${activeTab === "After Analysis" ? "active" : ""}`}
              onClick={() => setActiveTab("After Analysis")}
            >
              After Analysis
            </div>
          </div>
        </div>

        <div className="content-scroll-area">
          {activeTab === "General" && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerId">Customer ID</label>
                  <input
                    type="text"
                    id="customerId"
                    value={customerInfo.customerId}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, customerId: e.target.value })}
                    placeholder="Enter customer ID"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productId">Product ID</label>
                  <input
                    type="text"
                    id="productId"
                    value={customerInfo.productId}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, productId: e.target.value })}
                    placeholder="Enter product ID"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={customerInfo.name}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productName">Product Name</label>
                  <input
                    type="text"
                    id="productName"
                    value={customerInfo.productName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, productName: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    value={customerInfo.address}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contractId">Contract ID</label>
                  <input
                    type="text"
                    id="contractId"
                    value={customerInfo.contractId}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, contractId: e.target.value })}
                    placeholder="Enter contract ID"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phoneNumber">Number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={customerInfo.phoneNumber}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phoneNumber: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="terminationDate">Termination Date</label>
                  <input
                    type="text"
                    id="terminationDate"
                    value={customerInfo.terminationDate}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, terminationDate: e.target.value })}
                    placeholder="dd/mm/yy"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emailAddress">Email Address</label>
                  <input
                    type="email"
                    id="emailAddress"
                    value={customerInfo.emailAddress}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, emailAddress: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="requestType">Request Type</label>
                  <input
                    type="text"
                    id="requestType"
                    value={customerInfo.requestType}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, requestType: e.target.value })}
                    placeholder="Enter request type"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "Service Order" && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="serviceOrderId">Service Order ID</label>
                  <input
                    type="text"
                    id="serviceOrderId"
                    readOnly
                    value={serviceOrderInfo.serviceOrderId}
                    onChange={(e) => setServiceOrderInfo({ ...serviceOrderInfo, serviceOrderId: e.target.value })}
                    placeholder="No service order issued yet..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="orderDate">Order Date</label>
                  <input
                    type="text"
                    id="orderDate"
                    readOnly
                    value={serviceOrderInfo.orderDate}
                    onChange={(e) => setServiceOrderInfo({ ...serviceOrderInfo, orderDate: e.target.value })}
                    placeholder="dd/mm/yy"
                  />
                </div>
              </div>

              <div className="service-order-items-section">
                <h3>Service Order Items</h3>
                <div className="service-order-table-container">
                  <table className="service-order-table">
                    <thead>
                      <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                        <th>Principal Item ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceOrderItems.length > 0 ? (
                        serviceOrderItems.map((item, index) => (
                          <tr 
                            key={index}
                            onClick={() => setSelectedItem(item)}
                            style={{ cursor: "pointer" }}
                            className={selectedItem === item ? "selected-row" : ""}
                          >
                            <td>{item.item?.inventory_item_id || ""}</td>
                            <td>{item.item_name || ""}</td>
                            <td>{item.item_quantity}</td>
                            <td>{item.item_price}</td>
                            <td>{item.total_price}</td>
                            <td>{item.principal_item?.principal_item_id || ""}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center" }}></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="item-buttons-container">
                  <div className="item-buttons-left">
                    {serviceOrderInfo.serviceOrderId === "" && (
                      <span className="no-order-label">No service order issued yet</span>
                    )}
                    <div className="inner-buttons-container">
                      {/* <button 
                        className="delete-item-button"
                        disabled={serviceOrderInfo.serviceOrderId === ""}
                      >
                        Delete Item
                      </button> */}
                      <button 
                        className={`edit-item-button ${selectedItem ? "clickable" : "disabled"}`}
                        onClick={() => handleEditItem(selectedItem)}
                        disabled={serviceOrderInfo.serviceOrderId === "" || !selectedItem}
                      >
                        Edit Item
                      </button>
                      <button 
                        className="add-item-button" 
                        onClick={handleAddItem}
                        disabled={serviceOrderInfo.serviceOrderId === ""}
                      >
                        Add Item
                      </button>
                    </div>
                  </div>
                  <div className="items-button-right">
                    <div className="form-group">
                      <label htmlFor="orderTotalPrice">Service Order Total Price</label>
                      <input
                        type="text"
                        id="orderTotalPrice"
                        readOnly
                        value={serviceOrderInfo.orderTotalPrice}
                        onChange={(e) => setOrderTotalPrice({ ...serviceOrderInfo, orderTotalPrice: e.target.value })}
                        placeholder="₱ 0.00"
                      />
                  </div>
                  </div>
                </div>
                
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                  <button 
                    className="add-button"
                    disabled={serviceOrderInfo.serviceOrderId !== "" || !selectedAnalysis }
                    onClick={handleAddOrder}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Delivery Order" && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deliveryOrderId">Delivery Order ID</label>
                  <input
                    type="text"
                    id="deliveryOrderId"
                    readOnly
                    value={deliveryOrderInfo.deliveryOrderId}
                    onChange={(e) => setDeliveryOrderInfo({ ...deliveryOrderInfo, deliveryOrderId: e.target.value })}
                    placeholder="No delivery order issued yet..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="customerId">Customer ID</label>
                  <input
                    type="text"
                    id="customerId"
                    value={deliveryOrderInfo.customerId}
                    onChange={(e) => setDeliveryOrderInfo({ ...deliveryOrderInfo, customerId: e.target.value })}
                    placeholder="Enter customer ID"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="serviceOrderId">Service Order ID</label>
                  <input
                    type="text"
                    id="serviceOrderId"
                    value={deliveryOrderInfo.serviceOrderId}
                    readOnly
                    onChange={(e) => setDeliveryOrderInfo({ ...deliveryOrderInfo, serviceOrderId: e.target.value })}
                    placeholder="Enter service order ID"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={deliveryOrderInfo.name}
                    onChange={(e) => setDeliveryOrderInfo({ ...deliveryOrderInfo, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deliveryDate">Delivery Date <span className="required">*</span></label>
                  <div className="date-input-wrapper">
                    <input
                      type="date"
                      id="deliveryDate"
                      value={deliveryOrderInfo.deliveryDate}
                      onChange={(e) => setDeliveryOrderInfo({ ...deliveryOrderInfo, deliveryDate: e.target.value })}
                      placeholder="dd/mm/yy"
                    />
                    <img
                      src={CalendarInputIcon || "/placeholder.svg?height=16&width=16"}
                      alt="Calendar"
                      className="calendar-icon"
                      onClick={toggleDatePicker}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    value={deliveryOrderInfo.address}
                    onChange={(e) => setDeliveryOrderInfo({ ...deliveryOrderInfo, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deliveryStatus">Delivery Status <span className="required">*</span></label>
                  <div className="select-wrapper" ref={statusRef}>
                    <input
                      type="text"
                      id="deliveryStatus"
                      readOnly
                      value={deliveryOrderInfo.deliveryStatus}
                      onChange={(e) => setDeliveryOrderInfo({ ...deliveryOrderInfo, deliveryStatus: e.target.value })}
                      placeholder="Pending"
                    />
                    <span className="select-arrow" onClick={handleToggleDropdownStatus}>▼</span>
                    {isOpenStatusDD && (
                    <ul className="dropdown-list">
                      {["Pending", "Shipped", "Delivered"].map((status) => (
                        <li key={status} onClick={() => handleSelectStatus(status)}>
                          {status}
                        </li>
                      ))}
                    </ul>
                  )}
                  </div>
                </div>
                <div className="form-group">
                  <div className="buttons-container-right-delorder">
                    <button 
                      type="button"
                      className={`update-button ${deliveryOrderInfo.deliveryOrderId !== "" ? "clickable" : "disabled"}`} 
                      onClick={() => updateDeliveryOrder()}
                      disabled={deliveryOrderInfo.deliveryOrderId === ""}
                    >
                      Update
                    </button>
                    <button 
                      type="button"
                      className={`add-button ${deliveryOrderInfo.deliveryOrderId === "" ? "clickable" : "disabled"}`} 
                      onClick={() => createDeliveryOrder()}
                      disabled={deliveryOrderInfo.deliveryOrderId !== ""}
                    >
                      Add
                    </button>
                  </div>
                </div>
                
              </div>

              
            </div>
          )}

          {activeTab === "After Analysis" && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="afterAnalysisId">After Analysis ID</label>
                  <input
                    type="text"
                    id="afterAnalysisId"
                    readOnly
                    value={afterAnalysisInfo.afterAnalysisId}
                    onChange={(e) => setAfterAnalysisInfo({ ...afterAnalysisInfo, afterAnalysisId: e.target.value })}
                    placeholder="No after analysis scheduled yet..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="analysisId">Analysis ID</label>
                  <input
                    type="text"
                    id="analysisId"
                    readOnly
                    value={afterAnalysisInfo.analysisId}
                    onChange={(e) => setAfterAnalysisInfo({ ...afterAnalysisInfo, analysisId: e.target.value })}
                    placeholder="Enter analysis ID"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="serviceStatus">Service Status <span className="required">*</span></label>
                  <div className="select-wrapper" ref={afterStatusRef}>
                    <input
                      type="text"
                      id="serviceStatus"
                      readOnly
                      value={afterAnalysisInfo.serviceStatus}
                      onChange={(e) => setAfterAnalysisInfo({ ...afterAnalysisInfo, serviceStatus: e.target.value })}
                      placeholder="Scheduled"
                    />
                    <span className="select-arrow" onClick={handleToggleDropdownAfterStatus}>▼</span>
                    {isOpenAfterStatusDD && (
                    <ul className="dropdown-list">
                      {["Scheduled", "Completed", "Cancelled", "In Progress"].map((status) => (
                        <li key={status} onClick={() => handleSelectAfterStatus(status)}>
                          {status}
                        </li>
                      ))}
                    </ul>
                  )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="serviceDate">Service Date <span className="required">*</span></label>
                  <div className="date-input-wrapper">
                    <input
                      type="date"
                      id="serviceDate"
                      value={afterAnalysisInfo.serviceDate}
                      onChange={(e) => setAfterAnalysisInfo({ ...afterAnalysisInfo, serviceDate: e.target.value })}
                      placeholder="dd/mm/yy"
                    />
                    <img
                      src={CalendarInputIcon || "/placeholder.svg?height=16&width=16"}
                      alt="Calendar"
                      className="calendar-icon"
                      onClick={toggleDateAfterPicker}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={afterAnalysisInfo.description}
                    onChange={(e) => setAfterAnalysisInfo({ ...afterAnalysisInfo, description: e.target.value })}
                    placeholder="Enter description"
                    rows={5}
                  />
                </div>
              </div>

              <div className="buttons-container-right">
                <button 
                  type="button"
                  className={`update-button ${afterAnalysisInfo.afterAnalysisId !== "" ? "clickable" : "disabled"}`} 
                  onClick={() => updateAfterAnalysis()}
                  disabled={afterAnalysisInfo.afterAnalysisId === ""}
                >
                  Update
                </button>
                <button 
                  type="button"
                  className={`add-button ${afterAnalysisInfo.afterAnalysisId === "" ? "clickable" : "disabled"}`} 
                  onClick={() => createAfterAnalysis()}
                  disabled={afterAnalysisInfo.afterAnalysisId !== ""}
                >
                  Schedule
                </button>
              </div>
            </div>
          )}
          
          <div className="section-divider"></div>
          <div className="search-filter-container">
            <div className="search-container">
              <img src={SearchIcon || "/placeholder.svg?height=16&width=16"} alt="Search" className="search-icon" />
              <input
                type="text"
                placeholder="Search or type a command (Ctrl + G)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-dropdown">
              <button className="filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
              {filterOptions.find(opt => opt.value === filterOption)?.label || "Filter by"}
                <span className="arrow">▼</span>
              </button>
              {showFilterOptions && (
                <div className="filter-options">
                  {filterOptions.map((option) => (
                    <div key={option.value} className="filter-option" onClick={() => handleFilterSelect(option.value)}>
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table Component */}
          <Table 
            analyses={filteredAnalyses} 
            onRowClick={handleRowClick} 
            onViewAnalysis={handleViewAnalysis} 
            selectedAnalysis={selectedAnalysis}
          />

          {
            <div className="buttons-container-right table-buttons">
              <button 
                type="button"
                className={`update-button ${selectedAnalysis ? "clickable" : "disabled"}`} 
                onClick={() => setShowUpdateModal(true)}
                disabled={!selectedAnalysis}
              >
                Update
              </button>
              <button className="add-button" onClick={() => setShowAddModal(true)}>
                Add
              </button>
            </div>
          }
        </div>
      </div>

      {/* Modals */}
      {showUpdateModal && (
        <UpdateAnalysisModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateAnalysis}
          analysis={selectedAnalysis}
        />
      )}

      {showAddModal && (
        <AddServiceAnalysisModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleCreateAnalysis}
          technician={employee_id}
        />
      )}

      {showAddItemModal && (
        <AddItemModal
          isOpen={showAddItemModal}
          onClose={() => setShowAddItemModal(false)}
          onAdd={handleCreateOrderItem}
          order ={serviceOrderInfo.serviceOrderId}
        />
      )}

      {showEditItemModal && (
        <EditItemModal
          isOpen={showEditItemModal}
          onClose={() => setShowEditItemModal(false)}
          onEdit={handleEditOrderItem}
          item={selectedItem}
          onViewInventory={handleViewInventory}
        />
      )}

      {showViewInventoryModal && (
        <ViewInventoryModal
          isOpen={showViewInventoryModal}
          onClose={() => setShowViewInventoryModal(false)}
          onSelectItem={(item) => {
            console.log("Selected item:", item)
            setShowViewInventoryModal(false)
          }}
        />
      )}

{showErrorModal && (
        <div className="alert-modal-overlay">
          <div className="alert-modal-content">
            <h2>ERROR</h2>
            <p>{errorModalMessage}</p>
            <button className="alert-okay-button" onClick={() => setShowErrorModal(false)}>OK</button>
          </div>
        </div>
      )} 

      {showSuccessModal && (
        <div className="alert-modal-overlay">
          <div className="alert-modal-content">
            <p>{successModalMessage}</p>
            <button className="alert-okay-button" onClick={() => setShowSuccessModal(false)}>OK</button>
          </div>
        </div>
      )}   
    </div>
  )
}

export default ServiceAnalysis

