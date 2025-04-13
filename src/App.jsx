import { useState, useRef, Suspense, lazy, act, useEffect } from "react";
import "./App.css";
import "./MediaQueries.css";
import SearchBar from "./shared/components/SearchBar";
import { Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [activeModule, setActiveModule] = useState(null);
  const [activeSubModule, setActiveSubModule] = useState(null);
  const [hoveredModule, setHoveredModule] = useState(null);
  const [hoveredSubModule, setHoveredSubModule] = useState(null);
  const [ModuleComponent, setModuleComponent] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // temp for now: authentication state

  const iconsRef = useRef(null);
  const descsRef = useRef(null);

  const navigate = useNavigate();


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    // logout logic
    // navigate back to login
    navigate("/login");
  };

  //dummy notifs
  const notifs = [
    {
      time: "8:00 PM",
      msg: "Ur phone ringing!!!",
      orig_module: "Administration",
      orig_submodule: null,
      read: false
    },
    {
      time: "9:00 PM",
      msg: "keep urself safe!!!",
      orig_module: "Sales",
      orig_submodule: null,
      read: false
    },
    {
      time: "8:00 PM",
      msg: "bibidi bobidi boo wah",
      orig_module: "Management",
      orig_submodule: "Access Control",
      read: false

    },
    {
      time: "8:00 PM",
      msg: "Elit aliqua laborum laboris ex sint consectetur. Consequat dolor irure ullamco dolore adipisicing est labore velit. Amet cupidatat magna laboris commodo minim.",
      orig_module: "Accounting",
      orig_submodule: "Manufacturing Process",
      read: false
    },
    {
      time: "8:00 PM",
      msg: "wowee!",
      orig_module: "Accounting",
      orig_submodule: "Accounts Receivable",
      read: false
    },
    {
      time: "8:00 PM",
      msg: "Non incididunt commodo consequat occaecat proident consequat non.",
      orig_module: "Accounting",
      orig_submodule: "Accounts Receivable",
      read: true
    },
    {
      time: "8:00 PM",
      msg: "Elit aliqua laborum laboris ex sint consectetur. Consequat dolor irure ullamco dolore adipisicing est labore velit. Amet cupidatat magna laboris commodo minim.",
      orig_module: "Accounting",
      orig_submodule: "Manufacturing Process",
      read: true
    },
    {
      time: "8:00 PM",
      msg: "yippee!",
      orig_module: "Accounting",
      orig_submodule: "Accounts Receivable",
      read: true
    },
    {
      time: "8:00 PM",
      msg: "Minim amet et non irure quis ea Lorem et dolor et tempor excepteur est.",
      orig_module: "Accounting",
      orig_submodule: "Accounts Receivable",
      read: true
    }
  ];

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
  // Sync Scroll
  const handleScroll = (source) => {
    if (!iconsRef.current || !descsRef.current) return;

    if (source === "icons") {
      descsRef.current.scrollTop = iconsRef.current.scrollTop;
    } else {
      iconsRef.current.scrollTop = descsRef.current.scrollTop;
    }
  };

  // load jsx files for main modules
  const loadMainModule = (moduleId) => {
    if (
      moduleFileNames[moduleId] && !activeSubModule
      //!(activeModule == moduleId && !activeSubModule)
    ) {
      const LazyComponent = lazy(() =>
        import(
          /* @vite-ignore */ `./modules/${moduleFileNames[moduleId]}/${moduleFileNames[moduleId]}.jsx`
        )
      );
      setModuleComponent(() => LazyComponent);
    }
  };

  // load jsx files for submodules
  const loadSubModule = (submoduleId, mainModule = activeModule) => {
    if (
      moduleSubmoduleFileNames[mainModule][submoduleId] &&
      !(activeSubModule == submoduleId)
    ) {
      const LazyComponent = lazy(() =>
        import(
          /* @vite-ignore */ `./modules/${moduleFileNames[mainModule]}/submodules/${moduleSubmoduleFileNames[mainModule][submoduleId]}.jsx`
        )
      );

      setModuleComponent(() => LazyComponent);
    }
  };

  const moduleFileNames = {
    Management: "Management",
    Administration: "Administration",
    Accounting: "Accounting",
    Financials: "Financials",
    Purchasing: "Purchasing",
    Operations: "Operations",
    Sales: "Sales",
    CRM: "CRM",
    "Support & Services": "SupportServices",
    Inventory: "Inventory",
    Distribution: "Distribution",
    Production: "Production",
    MRP: "MRP",
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
      "Policy":"Policy",
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
                    /*
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
                    */
                    setActiveModule(module.id);
                    setActiveSubModule(null); // Reset submodule when a main module is clicked
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
                    /*
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
                    */
                    setActiveModule(module.id);
                    setActiveSubModule(null);
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
          <div className="header-navi">
            <div
              className={`header-tabs-container ${activeModule ? "visible" : "hidden"
                }`}
            >
              <img
                src={`/icons/header-module-icons/${moduleFileNames[activeModule]}.png`}
                alt={activeModule}
              />
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

            <div className="header-right-container">
              <SearchBar />
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
                        setActiveModule(notif.orig_module)
                        setActiveSubModule(notif.orig_submodule)
                      }
                        : () => {
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
              <div className="header-profile-container">
              <div className="header-profile-icon-wrapper" onClick={handleLogout}>
                  <div className="header-profile-icon">
                    {" "}
                    <p>C</p>
                  </div>
                  <p className="header-profile-name">Crusch K.</p>
                </div>
              </div>
            </div>
          </div>
          <QueryClientProvider client={queryClient}>
            <div className="body-container">
              {ModuleComponent && (
                <Suspense>
                  <ModuleComponent
                    setActiveModule={setActiveModule}
                    loadSubModule={loadSubModule}
                    setActiveSubModule={setActiveSubModule}
                  />
                </Suspense>
              )}
            </div>
          </QueryClientProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
