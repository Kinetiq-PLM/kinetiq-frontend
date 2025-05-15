
import { useState, useRef, Suspense, lazy, act, useEffect } from "react";
import "./App.css";
import "./MediaQueries.css";
//import SearchBar from "./shared/components/SearchBar";
import UserProfile from "./shared/components/UserProfile";
import { Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { User } from "lucide-react";
import LandingPage from "./pages/LandingPage";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [activeSubModule, setActiveSubModule] = useState(null);
  const [hoveredModule, setHoveredModule] = useState(null);
  const [hoveredSubModule, setHoveredSubModule] = useState(null);
  const [ModuleComponent, setModuleComponent] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMainModuleCollapsed, setIsMainModuleCollapsed] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [notifs, setNotifs] = useState([]);

  const displayName = user
    ? `${user.first_name} ${user.last_name?.charAt(0)}.`
    : '';

  const iconsRef = useRef(null);
  const descsRef = useRef(null);

  // landing page
  const [showLanding, setShowLanding] = useState(true);

  // log out at time out
  useEffect(() => {
    let logoutTimeout;
  
    const resetTimeout = () => {
      if (logoutTimeout) clearTimeout(logoutTimeout);
      logoutTimeout = setTimeout(() => {
        console.log("No activity detected for 10 minutes. Logging out.");
        handleLogout();
      }, 30 * 60 * 1000); // 30 minutes
    };
  
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event =>
      window.addEventListener(event, resetTimeout)
    );
  
    resetTimeout();
  
    return () => {
      clearTimeout(logoutTimeout);
      activityEvents.forEach(event =>
        window.removeEventListener(event, resetTimeout)
      );
    };
  }, []);

  useEffect(() => {
    if (activeModule || activeSubModule || showUserProfile) {
      setShowLanding(false);
      localStorage.setItem("activeModule", activeModule);
      localStorage.setItem("activeSubModule", activeSubModule);
      localStorage.setItem("showUserProfile", JSON.stringify(showUserProfile));
    }
  }, [activeModule, activeSubModule, showUserProfile]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("User data loaded from localStorage:");
      console.log(localStorage.getItem("user"));

      const storedModule = localStorage.getItem("activeModule");
      const storedSubModule = localStorage.getItem("activeSubModule");
      const storedShowUserProfile = localStorage.getItem("showUserProfile");

      if (storedShowUserProfile === "true") {
        setShowUserProfile(true);
        setActiveModule(null);
        setActiveSubModule(null);
      } else if (storedModule) {
        setActiveModule(storedModule);
        if (storedSubModule && storedSubModule !== "null") setActiveSubModule(storedSubModule);
      }
    } else {
      setUser(null);
      navigate("/login", { replace: true }); // redirect to login if no user found
    }

  }, []);


  const handleLogout = () => {
    localStorage.removeItem("user");   // clear saved session
    localStorage.removeItem("activeModule");
    localStorage.removeItem("activeSubModule");
    localStorage.removeItem("showUserProfile");
    setUser(null);   // clear local user state 
    navigate("/login");  // redirect to login
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setNotifOpen(false); // close notification menu if profile menu is opened
  };

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handleClickOutsideProfileDropdown = (e) => {
      if (
        !e.target.closest('.header-profile-container') &&
        !e.target.closest('.profile-dropdown')
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutsideProfileDropdown);
    return () => {
      document.removeEventListener("click", handleClickOutsideProfileDropdown);
    };
  }, [isProfileMenuOpen]);

  useEffect(() => {
    if (!notifOpen) return;

    const handleClickOutsideNotif = (e) => {
      if (
        !e.target.closest('.notif-icon') &&
        !e.target.closest('.notif-menu')
      ) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutsideNotif);
    return () => {
      document.removeEventListener("click", handleClickOutsideNotif);
    };
  }, [notifOpen]);


  //fetch notifs
  const fetchNotifs = async (user) => {
    console.log("Fetching notifs...")
    const resp = await fetch(`https://s9v4t5i8ej.execute-api.ap-southeast-1.amazonaws.com/dev/api/notifications/?user_id=${user?.user_id}`, { method: 'GET' })
    // const resp_text = await resp.text()
    // console.log("resp text")
    // console.log(resp_text)
    const resp_data = await resp.json();
    const notif_items = resp_data.data
    console.log("Notifs fetched:")
    console.log(notif_items)
    var temp_list = []
    //populate notifs table
    notif_items.map((notif_item, i) => {
      origin = notif_item.module.split(/\/(.*)/s)
      const orig_module = origin[0]
      const orig_submodule = origin.length == 2 ? origin[1] : null
      const time_formatted = new Date(notif_item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      temp_list[i] = {
        id: notif_item.notifications_id,
        msg: notif_item.message,
        orig_module: orig_module,
        orig_submodule: orig_submodule,
        read: notif_item.notifications_status == 'Read',
        time: time_formatted
      }
    })
    setNotifs(temp_list)
    console.log('Final notif list:')
    console.log(temp_list)

    //notif icon toggle (for loop so we can break out)
    for (var i = 0; i < temp_list.length; ++i) {
      if (temp_list[i].read == false) {
        console.log('found notif')
        setHasNotification(true)
        break
      }
    }
  }

  //func for marking notifs as read
  const readNotif = async (notif_id) => {
    const resp = await fetch(`https://s9v4t5i8ej.execute-api.ap-southeast-1.amazonaws.com/dev/api/notifications/`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        notifications_id: notif_id
      })
    })
  }

  //get notifs
  useEffect(() => {
    if (user) {
      fetchNotifs(user)
    }
  }, [user]);

  // hooks for loading modules
  useEffect(() => {
    console.log("(debug) main hook")
    if (activeModule) {
      console.log("(debug) calling loadmainmodule")
      loadMainModule(activeModule)
    }
  }, [activeModule]);

  useEffect(() => {
    console.log("(debug) sub hook")
    if (activeSubModule) {
      console.log("(debug) calling loadsubmodule")
      loadSubModule(activeSubModule)
    } else {
      console.log("(debug) calling loadmainmodule from sub hook")
      loadMainModule(activeModule)
    }
  }, [activeSubModule]);

  // sync Scroll
  const queryClient = new QueryClient();
  // sync Scroll
  const handleScroll = (source) => {
    if (!iconsRef.current || !descsRef.current) return;

    if (source === "icons") {
      descsRef.current.scrollTop = iconsRef.current.scrollTop;
    } else {
      iconsRef.current.scrollTop = descsRef.current.scrollTop;
    }
  };

  // const loadMainModule = (moduleId) => {
  //   if (moduleFileNames[moduleId] && !activeSubModule) {
  //     const LazyComponent = lazy(() =>
  //       import(
  //         /* @vite-ignore */ `./modules/${moduleFileNames[moduleId]}/${moduleFileNames[moduleId]}.jsx`
  //       )
  //     );

  //     const WrappedComponent = () => (
  //       <LazyComponent
  //         loadSubModule={loadSubModule}
  //         setActiveSubModule={setActiveSubModule}
  //         user_id={user?.user_id}
  //         employee_id={user?.employee_id}
  //       />
  //     );

  //     setModuleComponent(() => WrappedComponent);
  //     setShowUserProfile(false);
  //   }
  // };

  // const loadSubModule = (submoduleId, mainModule = activeModule) => {
  //   if (moduleSubmoduleFileNames[mainModule][submoduleId]) {
  //     const LazyComponent = lazy(() =>
  //       import(
  //         /* @vite-ignore */ `./modules/${moduleFileNames[mainModule]}/submodules/${moduleSubmoduleFileNames[mainModule][submoduleId]}.jsx`
  //       )
  //     );

  //     const WrappedComponent = () => (
  //       <LazyComponent
  //         loadSubModule={loadSubModule}
  //         setActiveSubModule={setActiveSubModule}
  //         user_id={user?.user_id}
  //         employee_id={user?.employee_id}
  //       />
  //     );
  //     setModuleComponent(() => WrappedComponent);

  //     setShowUserProfile(false);
  //   }
  // };


  const mainModules = import.meta.glob('./modules/*/*.jsx');
  const subModules = import.meta.glob('./modules/*/submodules/*.jsx');

  const loadMainModule = (moduleId) => {
    const moduleFile = `./modules/${moduleFileNames[moduleId]}/${moduleFileNames[moduleId]}.jsx`;

    if (mainModules[moduleFile]) {
      const LazyComponent = lazy(mainModules[moduleFile]);

      const WrappedComponent = () => (
        <LazyComponent
          loadSubModule={loadSubModule}
          setActiveSubModule={setActiveSubModule}
          user_id={user?.user_id}
          employee_id={user?.employee_id}
        />
      );

      setModuleComponent(() => WrappedComponent);
      setShowUserProfile(false);
    } else {
      console.warn(`Module file not found: ${moduleFile}`);
    }
  };


  const loadSubModule = (submoduleId, mainModule = activeModule) => {
    const submoduleFile = `./modules/${moduleFileNames[mainModule]}/submodules/${moduleSubmoduleFileNames[mainModule][submoduleId]}.jsx`;

    if (subModules[submoduleFile]) {
      const LazyComponent = lazy(subModules[submoduleFile]);

      const WrappedComponent = () => (
        <LazyComponent
          loadSubModule={loadSubModule}
          setActiveSubModule={setActiveSubModule}
          user_id={user?.user_id}
          employee_id={user?.employee_id}
        />
      );

      setModuleComponent(() => WrappedComponent);
      setShowUserProfile(false);
    } else {
      console.warn(`Submodule file not found: ${submoduleFile}`);
    }
  };


  const moduleFileNames = {
    "Management": "Management",
    "Administration": "Administration",
    "Accounting": "Accounting",
    "Financials": "Financials",
    "Purchasing": "Purchasing",
    "Operations": "Operations",
    "Sales": "Sales",
    "CRM": "CRM",
    "Support & Services": "SupportServices",
    "Inventory": "Inventory",
    "Distribution": "Distribution",
    "Production": "Production",
    "MRP": "MRP",
    "Project Management": "ProjectManagement",
    "Human Resources": "HumanResources",
    "Report Generator": "ReportGenerator",
    "Purchase Request": "PurchaseRequest",
    "Project Request": "ProjectRequest",
    "Workforce Request": "WorkforceRequest",
    "Job Posting": "JobPosting",
    "Employee Request": "EmployeeRequest"
  };

  const moduleSubmoduleFileNames = {
    Management: {
      "Dashboard": "ManagementDashboard",
      "Project Approval": "ManagementApprovals"
    },
    Administration: {
      "User": "User",
      "Item Masterlist": "ItemMasterlist",
      "Business Partner Masterlist": "BusinessPartnerMasterlist",
      "Audit Logs": "AuditLogs",
      "Policy": "Policy",
      "Currency": "Currency",
      "Warehouse": "Warehouse",
      "Notification": "Notification",
    },
    "Accounting": {
      "Chart of Accounts": "ChartOfAccounts",
      "Journal": "Journal",
      "Journal Entry": "JournalEntry",
      "General Ledger": "GeneralLedger",
      "General Ledger Accounts": "GeneralLedgerAccounts",
      // "Accounts Payable": "AccountsPayable",
      // "Accounts Receivable": "AccountsReceivable",
      "Official Receipts": "OfficialReceipts",
      "Payroll Accounting": "PayrollAccounting",
      "Tax and Remittance": "TaxAndRemittance",
      "Accounts Payable Receipts": "AccountsPayableReceipts",
    },
    "Financials": {
      "Reports": "Reports",
      "Validations": "Validations",
      "Approvals": "Approvals",
      "Forms": "Forms"
    },
    "Purchasing": {
      "Purchase Request List": "PurchaseReqList",
      "Puchase Quotation List": "PurchaseQuot",
      "Purchase Order Status": "PurchaseOrdStat",
      "A/P Invoice": "PurchaseAPInvoice",
      "Credit Memo": "PurchaseCredMemo",
      "Vendor Application Form": "VendorAppForm",
    },
    Operations: {
      "Goods Tracking": "GoodsTracking",
      "Internal Transfer": "InternalTransfer",
      "Delivery Approval": "DeliveryApproval",
      "External Delivery": "External Delivery",
      "Item Removal Requisition ": "ItemRemovalRequisition",
    },
    Sales: {
      Quotation: "Quotation",
      Order: "Order",
      Delivery: "Delivery",
      Transactions: "Transactions",
    },
    CRM: {
      Leads: "Leads",
      Opportunity: "Opportunity",
      Campaign: "Campaign",
      Contacts: "Contacts",
      Cases: "Cases",
    },
    "Support & Services": {
      "Service Ticket": "ServiceTicket",
      "Service Call": "ServiceCall",
      "Warranty Renewal": "WarrantyRenewal",
      "Service Request": "ServiceRequest",
      "Service Billing": "ServiceBilling",
      "Service Report": "ServiceReport",
      "Service Contract": "ServiceContract",
    },
    "Inventory": {
      "Shelf Life": "ShelfLife",
      "P-Counts": "PCounts",
      "Stock Flow": "StockFlow",
    },
    "Distribution": {
      "External Delivery": "ExternalDelivery",
      "Internal Delivery": "InternalDelivery",
      "Picking": "Picking",
      "Packing": "Packing",
      Shipment: "Shipment",
      "Returns": "Returns",
    },
    "Production": {
      "Equipment and Labor": "Equipment&Labor",
      //"Quality Control": "QualityControl",
      "Cost of Production": "CostOfProduction"
    },
    "MRP": {
      "Material Requirements Planning": "MaterialRequirementsPlanning",
      "Bills Of Material": "BillsOfMaterial",
      "Product Materials": "ProductMaterials",
    },
    "Project Management": {
      "Project List": "Project List",
      "Project Planning": "ProjectPlanning",
      "Project Request": "Projectrequest",
      "Tasks": "TaskMonitoring",
      "Report Monitoring": "Reports",
      "Warranty Monitoring": "Warranties",
      "Project Cost":"ProjectCost",
    },
    "Human Resources": {
      "Employees": "Employees",
      "Recruitment": "Recruitment",
      "Attendance Tracking": "AttendanceTracking",
      "Payroll": "Payroll",
      "Departments": "Departments",
      "Workforce Allocation": "WorkforceAllocation",
      "Leave Requests": "LeaveRequests",
      "Employee Performance": "EmployeePerformance",
      "Employee Salary": "EmployeeSalary"
    },
    "Report Generator": {
    },
    "Employee Request": {
      "Resignation Request": "ResignationRequest",
      "Overtime Request": "OvertimeRequest",
      "Leave Request": "LeaveRequest"
    },
  };



  const rawPermissions = user?.role?.permissions || "";
  const allowedModules = rawPermissions.split(",").map((m) => m.trim()); // ["Admin", "Operations", ...]
  console.log('raw permissions...')
  console.log(rawPermissions)
  console.log("allowed modules...")
  console.log(allowedModules)

  const filteredModuleFileNames = {};

  allowedModules.forEach((permission) => {
    const [main, sub] = permission.split(/\/(.*)/s)
    console.log('perms main: ' + main)
    console.log('params sub: ' + sub) 
    if (!filteredModuleFileNames[main]) {
      filteredModuleFileNames[main] = {};
    }

    if (!sub) {
      console.log('including all submodules of ' + main)
      filteredModuleFileNames[main] = {
      ...moduleSubmoduleFileNames[main]
      }
    } else {
      filteredModuleFileNames[main][sub] = moduleSubmoduleFileNames[main][sub]
    }
  });

  console.log('filtered modules...')
  console.log(filteredModuleFileNames)
/*
  const filteredModuleFileNames = allowedModules.includes("All")
    ? moduleFileNames
    : Object.fromEntries(
      Object.entries(moduleFileNames).filter(([key]) =>
        allowedModules.includes(key)
      )
    );
*/

  const modulesIcons = Object.keys(filteredModuleFileNames).map((module) => ({
    id: module,
    icon: `/icons/module-icons/${moduleFileNames[module]}.png`,
  }));

  console.log('module icons...')
  console.log(modulesIcons)

  return (
    <div className="shell">
      <div className="shell-container">
        {/* collapsible menu */}

        {/* static left navi -- icons */}
        <div className="sidebar-icons-container">
          <div className="sidebar-icons-hamburger-container">
            <div
              className="sidebar-icons-ham-icon-wrapper"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <div className={`ham-menu-icon ${isSidebarOpen ? "active" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <div className="sidebar-main-menu-container"></div>

          <div
            className={`sidebar-module-icons ${isSidebarOpen ? "opened" : ""}`}
            ref={iconsRef}
            onScroll={() => handleScroll("icons")}
          >
            {modulesIcons.map((module) => (
              <div key={module.id}>
                {/* Main Module Icons */}
                <div
                  className={`sidebar-module-icons-item 
                      ${isSidebarOpen ? "opened" : ""} 
                      ${activeModule === module.id ? "active" : ""} 
                      ${hoveredModule === module.id ? "hovered" : ""}`}
                  onClick={() => {
                    setIsSidebarOpen(true);

                    if (activeModule === module.id) {
                      // if the main module is active, and is clicked when a submodule is open, go back to main module
                      if (activeSubModule) {
                        setActiveSubModule(null);
                        loadMainModule(module.id);
                        setIsMainModuleCollapsed(true);
                      } else { // if it's already active and is the opened module, toggle off
                        isMainModuleCollapsed ? setIsMainModuleCollapsed(false) : setIsMainModuleCollapsed(true); // open submodules if reclicked
                        //setActiveModule(null);
                        setActiveSubModule(null);
                      }
                    } else {
                      // otherwise, activate it
                      setIsMainModuleCollapsed(true);
                      setActiveModule(module.id);
                      setActiveSubModule(null);
                      loadMainModule(module.id);
                    }

                    /*setActiveModule(module.id);
                    setActiveSubModule(null); // Reset submodule when a main module is clicked*/
                  }}
                  onMouseEnter={() => setHoveredModule(module.id)}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  <img src={module.icon} alt={module.id} />
                </div>

                <div
                  className={`sidebar-submodule-empty-container ${isMainModuleCollapsed && isSidebarOpen && activeModule === module.id ? "opened" : ""
                    }`}
                >
                  {/* submodules - only show if this module is active */}
                    {filteredModuleFileNames[module.id] &&
                    Object.keys(filteredModuleFileNames[module.id]).map(
                      (submodule, index) => (
                        <div
                          key={index}
                          className="sidebar-submodule-item-empty"
                        >
                          <p></p>
                        </div>
                      )
                    )}
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-kinetiq-footer">
            <img src={"/icons/Kinetiq-Logo.png"} alt={"Kinetiq Logo"}></img>
          </div>
        </div>

        {/* collapsible description navi */}
        <div
          className={`sidebar-desc-container ${isSidebarOpen ? "" : "closed"}`}
        >
          <div className="sidebar-icons-hamburger-container"></div>
          <div className="sidebar-main-menu-container"></div>

          <div
            className="sidebar-module-descs"
            ref={descsRef}
            onScroll={() => handleScroll("descs")}
          >
            {modulesIcons.map((module) => (
              <div key={module.id}>
                {/* Main Module Items */}
                <div
                  className={`sidebar-module-desc-item 
                            ${activeModule === module.id ? "active" : ""} 
                            ${hoveredModule === module.id ? "hovered" : ""}`}
                  onClick={() => {
                    setIsSidebarOpen(true);
                    if (activeModule === module.id) {
                      // if the main module is active, and is clicked when a submodule is open, go back to main module
                      if (activeSubModule) {
                        setActiveModule(module.id);
                        setActiveSubModule(null);
                        loadMainModule(module.id);
                        setIsMainModuleCollapsed(true);
                      } else { // if it's already active and is the opened module, toggle off
                        isMainModuleCollapsed ? setIsMainModuleCollapsed(false) : setIsMainModuleCollapsed(true); // open submodules if reclicked
                        //setActiveModule(null);
                        setActiveSubModule(null);
                      }
                    } else {
                      // otherwise, activate it
                      setIsMainModuleCollapsed(true);
                      setActiveModule(module.id);
                      setActiveSubModule(null);
                      loadMainModule(module.id);
                    }

                  }}

                  onMouseEnter={() => setHoveredModule(module.id)}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  <p>{module.id}</p>
                </div>

                <div
                  className={`sidebar-submodule-empty-container ${isMainModuleCollapsed && isSidebarOpen && activeModule === module.id ? "opened" : ""
                    }`}
                >
                  {/* Submodules - only show if the main module is active */}
                  {filteredModuleFileNames[module.id] &&
                    Object.keys(filteredModuleFileNames[module.id]).map(
                      (sub, index) => (
                        <div
                          key={index}
                          className={`sidebar-submodule-item
                            ${activeSubModule === sub ? "active" : ""} 
                            ${hoveredSubModule === sub ? "hovered" : ""}`}
                          onClick={() => {
                            setActiveSubModule(sub);
                            //loadSubModule(sub);
                          }}
                          onMouseEnter={() => setHoveredSubModule(sub)}
                          onMouseLeave={() => setHoveredSubModule(null)}
                        >
                          <p>{sub}</p>
                        </div>
                      )
                    )}
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-kinetiq-footer-desc">
            <p>Kinetiq</p>
          </div>
        </div>

        {/* adjustable right content */}
        <div className="header-body-container">

          <div className={`header-navi ${isSidebarOpen ? "squished" : ""}`}>
            <div
              className={`header-tabs-container ${!showUserProfile && activeModule ? "visible" : "hidden"
                }`}
            >
              <img
                src={`/icons/header-module-icons/${moduleFileNames[activeModule]}.png`}
                alt={activeModule}
              />
              <div className="header-module-names">
                <p
                  className={`header-module-name ${!activeSubModule ? "active" : "inactive"}`}
                  onClick={() => {
                    setActiveModule(activeModule);
                    //loadMainModule(activeModule);
                    setActiveSubModule(null);
                    //loadSubModule(null);
                  }}
                >
                  {activeModule}
                </p>
                <p className="fade-in">{activeSubModule ? ` > ` : ""}</p>
                <p id="header-submodule-name" className="fade-in">
                  {activeSubModule ? activeSubModule : ""}
                </p>
              </div>
            </div>

            <div className="header-right-container">
              {/*<SearchBar />*/}
              <img className="notif-icon"
                src={`/icons/Notification-${hasNotification ? "active-" : ""
                  }logo.png`}
                alt="Notificaton-Logo"
                onClick={() => {
                  setNotifOpen(!notifOpen)
                  setIsProfileMenuOpen(false); //close profile menu if notif menu is opened
                  setHasNotification(false)
                }} //to be replaecd by func for setting notifs as read
              ></img>
              {notifOpen && <div className="notif-menu">
                <div className="notif-title"><p>Notifications</p></div>
                {notifs.length === 0 ? (
                  <div className="notif-empty">
                    <p className="notif-msg">No notifications to show.</p>
                  </div>
                ) : (notifs.map((notif, i) =>
                  <div className={notif.read ? "notif-item" : "notif-item-unread"}
                    onClick={
                      notif.orig_submodule ? () => {
                        notifs[i].read = true
                        readNotif(notif.id)
                        setActiveModule(notif.orig_module)
                        setActiveSubModule(notif.orig_submodule)
                      }
                        : () => {
                          notifs[i].read = true
                          readNotif(notif.id)
                          setActiveModule(notif.orig_module)
                          setActiveSubModule(null)
                        }
                    }
                    key={i}
                  >
                    <div className="notif-toprow">
                      <div className="notif-origin"><p>{notif.orig_submodule ? notif.orig_submodule : notif.orig_module}</p></div>
                      <div className="notif-time-and-icon">
                        <div className="notif-time"><p>{notif.time}</p></div>
                        {!notif.read && <p className="unread-notif-icon"><img src="/icons/unread-notif-icon.png" /></p>/* placeholder, should be an img/icon etc (or maybe ascii icon to avoid loading time) */}
                      </div>
                    </div>
                    <div className="notif-msg"><p>{notif.msg}</p></div>
                  </div>
                ))}
              </div>}
              {isProfileMenuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-name">{user?.first_name} {user?.last_name}</div>
                    <div className="profile-details">ID: {user?.employee_id}</div>
                    <div className="profile-details">{user?.role?.role_name}</div>
                  </div>

                  <div className="dropdown-divider"></div>
                  <div className="dropdown-menu">
                    <div className="dropdown-item"
                      onClick={() => {
                        setShowUserProfile(true);
                        setIsProfileMenuOpen(false);
                        setActiveModule(null);
                        setActiveSubModule(null);
                      }}
                    >
                      <img src="/icons/settings.png" />User Profile
                    </div>
                    <div className="dropdown-item" onClick={handleLogout}><img src="/icons/logout.png" /> Logout</div>
                  </div>

                </div>
              )}

              <div className="header-profile-container">
                <div className={`header-profile-icon-wrapper ${isProfileMenuOpen ? "opened" : ""}`}
                  onClick={toggleProfileMenu}>
                  <div className="header-profile-icon">
                    {" "}
                    {displayName?.charAt(0)}
                  </div>
                  <p className="header-profile-name">{displayName}</p>
                </div>
              </div>
            </div>
          </div>
          <QueryClientProvider client={queryClient}>
            <div className="body-container">
              {showLanding && <LandingPage />}
              {showUserProfile ? (
                <UserProfile
                  user_id={user?.user_id}
                  employee_id={user?.employee_id}
                />
              ) : (
                ModuleComponent && (
                  <Suspense fallback={<div className="loading-suspense">Loading...</div>}>
                    <ModuleComponent
                      setActiveModule={setActiveModule}
                      loadSubModule={loadSubModule}
                      setActiveSubModule={setActiveSubModule}
                      user_id={user?.user_id}
                      employee_id={user?.employee_id}
                    />
                  </Suspense>
                )
              )}
            </div>
          </QueryClientProvider>
        </div>
      </div>
    </div >
  );
}

export default App;