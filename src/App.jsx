import { useState, useRef, Suspense, lazy, act, useEffect } from "react";
import "./App.css";
import "./MediaQueries.css";
//import SearchBar from "./shared/components/SearchBar";
import UserProfile from "./shared/components/UserProfile";
import { Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { User } from "lucide-react";

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [notifs, setNotifs] = useState([]);

  const displayName = user
    ? `${user.first_name} ${user.last_name?.charAt(0)}.`
    : '';

  const iconsRef = useRef(null);
  const descsRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("User data loaded from localStorage:");
      console.log(localStorage.getItem("user"));
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");   // clear saved session
    setUser(null);   // clear local user state 
    navigate("/login");  // redirect to login
  };

  // if you need to just go to shellapp just comment out the 4 lines below: 
  const isAuthenticated = user !== null;

  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // up til here ^^
  // -- then just remove "/login" from the url -- tho u wont have any user data since u didn't log in (unless u'll hard code it)


  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.header-profile-container')) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  //fetch notifs
  const fetchNotifs = async (user) => {
    console.log("Fetching notifs...")
    const resp = await fetch(`http://127.0.0.1:8000/api/notifications/?user_id=${user?.user_id}`, { method: 'GET' })
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
      origin = notif_item.module.split('/')
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
    const resp = await fetch(`http://127.0.0.1:8000/api/notifications/`, {
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


  //dummy notifs
  // const notifs = [
  //   {
  //     time: "8:00 PM",
  //     msg: "Ur phone ringing!!!",
  //     orig_module: "Administration",
  //     orig_submodule: null,
  //     read: false
  //   },
  //   {
  //     time: "9:00 PM",
  //     msg: "keep urself safe!!!",
  //     orig_module: "Sales",
  //     orig_submodule: null,
  //     read: false
  //   },
  //   {
  //     time: "8:00 PM",
  //     msg: "bibidi bobidi boo wah",
  //     orig_module: "Management",
  //     orig_submodule: "Access Control",
  //     read: false

  //   },
  //   {
  //     time: "8:00 PM",
  //     msg: "Elit aliqua laborum laboris ex sint consectetur. Consequat dolor irure ullamco dolore adipisicing est labore velit. Amet cupidatat magna laboris commodo minim.",
  //     orig_module: "Accounting",
  //     orig_submodule: "Manufacturing Process",
  //     read: false
  //   },
  //   {
  //     time: "8:00 PM",
  //     msg: "wowee!",
  //     orig_module: "Accounting",
  //     orig_submodule: "Accounts Receivable",
  //     read: false
  //   },
  //   {
  //     time: "8:00 PM",
  //     msg: "Non incididunt commodo consequat occaecat proident consequat non.",
  //     orig_module: "Accounting",
  //     orig_submodule: "Accounts Receivable",
  //     read: true
  //   },
  //   {
  //     time: "8:00 PM",
  //     msg: "Elit aliqua laborum laboris ex sint consectetur. Consequat dolor irure ullamco dolore adipisicing est labore velit. Amet cupidatat magna laboris commodo minim.",
  //     orig_module: "Accounting",
  //     orig_submodule: "Manufacturing Process",
  //     read: true
  //   },
  //   {
  //     time: "8:00 PM",
  //     msg: "yippee!",
  //     orig_module: "Accounting",
  //     orig_submodule: "Accounts Receivable",
  //     read: true
  //   },
  //   {
  //     time: "8:00 PM",
  //     msg: "Minim amet et non irure quis ea Lorem et dolor et tempor excepteur est.",
  //     orig_module: "Accounting",
  //     orig_submodule: "Accounts Receivable",
  //     read: true
  //   }
  // ];

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

  const loadMainModule = (moduleId) => {
    if (moduleFileNames[moduleId] && !activeSubModule) {
      const LazyComponent = lazy(() =>
        import(
          /* @vite-ignore */ `./modules/${moduleFileNames[moduleId]}/${moduleFileNames[moduleId]}.jsx`
        )
      );

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
    }
  };

  const loadSubModule = (submoduleId, mainModule = activeModule) => {
    if (moduleSubmoduleFileNames[mainModule][submoduleId]) {
      const LazyComponent = lazy(() =>
        import(
          /* @vite-ignore */ `./modules/${moduleFileNames[mainModule]}/submodules/${moduleSubmoduleFileNames[mainModule][submoduleId]}.jsx`
        )
      );

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
  };

  const moduleSubmoduleFileNames = {
    "Management": {
      "Dashboard": "ManagementDashboard",
      "Policy Compliance Oversight": "ManagementPolicyComplianceOversight",
      "Salary Release Approval": "ManagementSalaryReleaseApproval",
      "Budget Review Approval": "ManagementBudgetReviewApproval",
      "Purchasing Approval": "ManagementPurchasingApproval",
      "Project Approval": "ManagementProjectApproval",
      "Project Monitoring": "ManagementProjectMonitoring",
      "RecruitmentCandidates": "ManagementRecruitmentCandidates",
      "AssetRemoval": "ManagementAssetRemoval",
      "User Roles": "UserRoles",
      "Access Control": "AccessControl",
      "Settings": "Settings",
    },
    Administration: {
      "User": "User",
      "Item Masterlist": "ItemMasterlist",
      "Business Partner Masterlist": "BusinessPartnerMasterlist",
      "Audit Logs": "AuditLogs",
      "Policy": "Policy",
      "Currency": "Currency",
      "Notification": "Notification",
    },
    "Accounting": {
      "Chart of Accounts": "ChartOfAccounts",
      "Journal": "Journal",
      "Journal Entry": "JournalEntry",
      "General Ledger": "GeneralLedger",
      "General Ledger Accounts": "GeneralLedgerAccounts",
      "Accounts Receivable": "AccountsReceivable",
      "Accounts Payable": "AccountsPayable",
      "Official Receipts": "OfficialReceipts",
    },
    "Financials": {
      "Budgeting": "Budgeting",
      "Cash Flow": "CashFlow",
      "Financial Reports": "FinancialReports",
    },
    "Purchasing": {
      "Supplier Management": "SupplierManagement",
      "Purchase Orders": "PurchaseOrders",
    },
    Operations: {
      "Goods Tracking": "GoodsTracking",
      "Internal Transfer": "InternalTransfer",
      "Delivery Approval": "DeliveryApproval",
      "Delivery Receipt": "DeliveryReceipt",
      "Item Removal": "ItemRemoval",
    },
    Sales: {
      Quotation: "Quotation",
      Order: "Order",
      Delivery: "Delivery",
      // Invoice: "Invoice",
      // "Blanket Agreement": "BlanketAgreement",
      "Master List": "MasterList",
      Reporting: "Reporting",
      // Return: "Return",
    },
    CRM: {
      Ticket: "Ticket",
      Campaign: "Campaign",
      "Partner Master Data": "PartnerMasterData",
      Opportunity: "Opportunity",
      Support: "Support",
    },
    "Support & Services": {
      "Service Ticket": "ServiceTicket",
      "Service Call": "ServiceCall",
      "Service Request": "ServiceRequest",
      "Warranty Renewal": "WarrantyRenewal",
      "Service Analysis": "ServiceAnalysis",
      "Service Billing": "ServiceBilling",
      "Service Report": "ServiceReport",
      "Service Contract": "ServiceContract",
    },
    "Inventory": {
      "Stock Levels": "StockLevels",
      "P-Counts": "PCounts",
      "Stock Flow": "StockFlow",
    },
    "Distribution": {
      "Shipping": "Shipping",
      "Order Fulfillment": "OrderFulfillment",
    },
    "Production": {
      "Equipment and Labor": "Equipment&Labor",
      "Quality Control": "QualityControl",
      "Cost of Production": "CostOfProduction"
    },
    "MRP": {
      "Material Requirements Planning": "MaterialRequirementsPlanning",
      "Bills Of Material": "BillsOfMaterial",
    },
    "Project Management": {
      "Task Assignments": "TaskAssignments",
      "Gantt Charts": "GanttCharts",
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
      "Custom Reports": "CustomReports",
      "Data Visualization": "DataVisualization",
    },
  };



  const rawPermissions = user?.role?.permissions || "";
  const allowedModules = rawPermissions.split(",").map((m) => m.trim()); // ["Admin", "Operations", ...]

  const filteredModuleFileNames = allowedModules.includes("All")
    ? moduleFileNames
    : Object.fromEntries(
      Object.entries(moduleFileNames).filter(([key]) =>
        allowedModules.includes(key)
      )
    );

  const modulesIcons = Object.keys(moduleFileNames).map((module) => ({
    id: module,
    icon: `/icons/module-icons/${moduleFileNames[module]}.png`,
  }));

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
                      // if it's already active, toggle off
                      setActiveModule(null);
                      setActiveSubModule(null);
                    } else {
                      // otherwise, activate it
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
                  className={`sidebar-submodule-empty-container ${isSidebarOpen && activeModule === module.id ? "opened" : ""
                    }`}
                >
                  {/* submodules - only show if this module is active */}
                  {moduleSubmoduleFileNames[module.id] &&
                    Object.keys(moduleSubmoduleFileNames[module.id]).map(
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

                    if (activeModule === module.id) {
                      // if it's already active, toggle off
                      setActiveModule(null);
                      setActiveSubModule(null);
                    } else {
                      // otherwise, activate it
                      setActiveModule(module.id);
                      setActiveSubModule(null);
                      loadMainModule(module.id);
                    }
                    /*
                    setActiveModule(module.id);
                    setActiveSubModule(null);*/
                  }}

                  onMouseEnter={() => setHoveredModule(module.id)}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  <p>{module.id}</p>
                </div>

                <div
                  className={`sidebar-submodule-empty-container ${isSidebarOpen && activeModule === module.id ? "opened" : ""
                    }`}
                >
                  {/* Submodules - only show if the main module is active */}
                  {moduleSubmoduleFileNames[module.id] &&
                    Object.keys(moduleSubmoduleFileNames[module.id]).map(
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
              className={`header-tabs-container ${activeModule ? "visible" : "hidden"
                }`}
            >
              <img
                src={`/icons/header-module-icons/${moduleFileNames[activeModule]}.png`}
                alt={activeModule}
              />
              <div className="header-module-names">
                <p
                  className={`header-module-name ${!activeSubModule ? "active" : ""
                    }`}
                  onClick={() => {
                    setActiveModule(activeModule);
                    //loadMainModule(activeModule);
                    setActiveSubModule(null);
                    //loadSubModule(null);
                  }}
                >
                  {activeModule}
                </p>

                <p>{activeSubModule ? ` > ` : ""}</p>
                <p id="header-submodule-name">
                  {activeSubModule ? activeSubModule : ""}
                </p>
              </div>
            </div>

            <div className="header-right-container">
              {/*<SearchBar />*/}
              <img
                src={`/icons/Notification-${hasNotification ? "active-" : ""
                  }logo.png`}
                alt="Notificaton-Logo"
                onClick={() => {
                  setNotifOpen(!notifOpen)
                  setHasNotification(false)
                }} //to be replaecd by func for setting notifs as read
              ></img>
              {notifOpen && <div className="notif-menu">
                <div className="notif-title"><p>Notifications</p></div>
                {notifs.map((notif, i) =>
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
                )}
              </div>}
              {isProfileMenuOpen && (
                <div className="profile-dropdown">
                  <p className="profile-name"><strong>{user?.first_name} {user?.last_name}</strong></p>
                  <p className="profile-details">ID: {user?.employee_id}</p>
                  <p className="profile-details">Role: {user?.role?.role_name}</p>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-item" onClick={() => setShowUserProfile(true)}>Settings</div>
                  <div className="dropdown-item" onClick={handleLogout}>Logout</div>
                </div>
              )}

              <div className="header-profile-container">
                <div className="header-profile-icon-wrapper" onClick={toggleProfileMenu}>
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
              {showUserProfile ? (
                <UserProfile
                  user_id={user?.user_id}
                  employee_id={user?.employee_id}
                />
              ) : (
                ModuleComponent && (
                  <Suspense fallback={<div>Loading...</div>}>
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
    </div>
  );
}

export default App;
