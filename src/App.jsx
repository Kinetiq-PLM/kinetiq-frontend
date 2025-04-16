import { useState, useRef, Suspense, lazy, act } from 'react'
import './App.css'
import './MediaQueries.css'
import SearchBar from "./shared/components/SearchBar";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [activeModule, setActiveModule] = useState(null);
  const [activeSubModule, setActiveSubModule] = useState(null);
  const [hoveredModule, setHoveredModule] = useState(null);
  const [hoveredSubModule, setHoveredSubModule] = useState(null);
  const [ModuleComponent, setModuleComponent] = useState(null);

  const iconsRef = useRef(null);
  const descsRef = useRef(null);

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
    if (moduleFileNames[moduleId] && !(activeModule == moduleId && !activeSubModule)) {

      const LazyComponent = lazy(() => import(/* @vite-ignore */ `./modules/${moduleFileNames[moduleId]}/${moduleFileNames[moduleId]}.jsx`));

      setModuleComponent(() => LazyComponent);
    }
  };

  // load jsx files for submodules
  const loadSubModule = (submoduleId) => {
    if (moduleSubmoduleFileNames[activeModule][submoduleId] && !(activeSubModule == submoduleId)) {

      const LazyComponent = lazy(() => import(/* @vite-ignore */ `./modules/${moduleFileNames[activeModule]}/submodules/${moduleSubmoduleFileNames[activeModule][submoduleId]}.jsx`));

      setModuleComponent(() => LazyComponent);
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
      "User Roles": "UserRoles",
      "Access Control": "AccessControl",
      "Settings": "Settings",
    },
    "Administration": {
      "Company Policies": "CompanyPolicies",
      "User Accounts": "UserAccounts",
    },
    "Accounting": {
      "General Ledger": "GeneralLedger",
      "Accounts Payable": "AccountsPayable",
      "Accounts Receivable": "AccountsReceivable",
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
    "Operations": {
      "Workflow Automation": "WorkflowAutomation",
      "Operational Analytics": "OperationalAnalytics",
    },
    "Sales": {
      "Lead Management": "LeadManagement",
      "Invoices": "Invoices",
      "Quotations": "Quotations",
    },
    "CRM": {
      "Contact Management": "ContactManagement",
      "Marketing": "Marketing",
      "Customer Support": "CustomerSupport",
    },
    "Support & Services": {
      "Ticketing System": "TicketingSystem",
      "Customer Support": "CustomerSupport",
    },
    "Inventory": {
      "Stock Levels": "StockLevels",
      "Product Catalog": "ProductCatalog",
    },
    "Distribution": {
      "Shipping": "Shipping",
      "Order Fulfillment": "OrderFulfillment",
    },
    "Production": {
      "Manufacturing Process": "ManufacturingProcess",
      "Quality Control": "QualityControl",
    },
    "MRP": {
      "Material Requirements Planning": "MaterialRequirementsPlanning",
      "Production Scheduling": "ProductionScheduling",
    },
    "Project Management": {
      "Task Assignments": "TaskAssignments",
      "Gantt Charts": "GanttCharts",
    },
    "Human Resources": {
      "Employee Records": "EmployeeRecords",
      "Payroll": "Payroll",
      "Recruitment": "Recruitment",
    },
    "Report Generator": {
    },
  };

  const modulesIcons = Object.keys(moduleFileNames).map((module) => ({
    id: module,
    icon: `/icons/module-icons/${moduleFileNames[module]}.png`,
  }));




  return (
    <div className='shell'>
      <div className='shell-container'>

        {/* collapsible menu */}

        {/* static left navi -- icons */}
        <div className='sidebar-icons-container'>
          <div className='sidebar-icons-hamburger-container'>
            <div className='sidebar-icons-ham-icon-wrapper' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <div className={`ham-menu-icon ${isSidebarOpen ? "active" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <div className='sidebar-main-menu-container'></div>

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
                      ${hoveredModule === module.id ? "hovered" : ""}`
                  }
                  onClick={() => {
                    setActiveModule(module.id);
                    setActiveSubModule(null); // Reset submodule when a main module is clicked
                    setIsSidebarOpen(true);
                    loadMainModule(module.id); // load active module
                  }}
                  onMouseEnter={() => setHoveredModule(module.id)}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  <img src={module.icon} alt={module.id} />

                </div>


                <div
                  className={`sidebar-submodule-empty-container ${(isSidebarOpen && activeModule === module.id) ? "opened" : ""}`}
                >
                  {/* Submodules - Only show if this module is active */}
                  {moduleSubmoduleFileNames[module.id] &&
                    Object.keys(moduleSubmoduleFileNames[module.id]).map((submodule, index) => (
                      <div key={index} className="sidebar-submodule-item-empty">
                        <p></p>
                      </div>
                    ))}


                </div>

              </div>
            ))}
          </div>

          <div className='sidebar-kinetiq-footer'>
            <img src={"/icons/Kinetiq-Logo.png"} alt={"Kinetiq Logo"}></img>
          </div>
        </div>



        {/* collapsible description navi */}
        <div className={`sidebar-desc-container ${isSidebarOpen ? "" : "closed"}`}>
          <div className='sidebar-icons-hamburger-container'></div>
          <div className='sidebar-main-menu-container'></div>

          <div
            className='sidebar-module-descs'
            ref={descsRef}
            onScroll={() => handleScroll("descs")}
          >
            {modulesIcons.map((module) => (
              <div key={module.id}>
                {/* Main Module Items */}
                <div
                  className={`sidebar-module-desc-item 
                            ${activeModule === module.id ? "active" : ""} 
                            ${hoveredModule === module.id ? "hovered" : ""}`
                  }
                  onClick={() => {
                    setActiveModule(module.id);
                    setActiveSubModule(null);
                    loadMainModule(module.id);
                  }}
                  onMouseEnter={() => setHoveredModule(module.id)}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  <p>{module.id}</p>
                </div>

                <div
                  className={`sidebar-submodule-empty-container ${(isSidebarOpen && activeModule === module.id) ? "opened" : ""}`}
                >

                  {/* Submodules - only show if the main module is active */}
                  {moduleSubmoduleFileNames[module.id] &&
                    Object.keys(moduleSubmoduleFileNames[module.id]).map((sub, index) => (
                      <div
                        key={index}
                        className={`sidebar-submodule-item
                            ${activeSubModule === sub ? "active" : ""} 
                            ${hoveredSubModule === sub ? "hovered" : ""}`}
                        onClick={() => { setActiveSubModule(sub); loadSubModule(sub); }}
                        onMouseEnter={() => setHoveredSubModule(sub)}
                        onMouseLeave={() => setHoveredSubModule(null)}
                      >
                        <p>{sub}</p>
                      </div>
                    ))}

                </div>
              </div>
            ))}
          </div>



          <div className='sidebar-kinetiq-footer-desc'>
            <p>Kinetiq</p>
          </div>
        </div>

        {/* adjustable right content */}
        <div className='header-body-container'>
          <div className='header-navi'>
            <div className={`header-tabs-container ${activeModule ? "visible" : "hidden"}`}>
              <img src={`/icons/header-module-icons/${moduleFileNames[activeModule]}.png`} alt={activeModule} />
              <p className={`header-module-name ${!activeSubModule ? "active" : ""}`} onClick={() => {
                setActiveModule(activeModule);
                setActiveSubModule(null);
              }}>
                {activeModule}
              </p>

              <p>{activeSubModule ? ` > ` : ""}</p>
              <p id="header-submodule-name">{activeSubModule ? activeSubModule : ""}</p>
            </div>


            <div className='header-right-container'>
              <SearchBar />
              <img src={`/icons/Notification-${hasNotification ? "active-" : ""}logo.png`}
                alt='Notificaton-Logo' onClick={() => setHasNotification(!hasNotification)}></img>
              <div className='header-profile-container'>
                <div className='header-profile-icon'> <p>C</p></div>
                <p className='header-profile-name'>Crusch K.</p>
              </div>
            </div>


          </div>
          <div className='body-container'>
            {ModuleComponent && (
              <Suspense>
                <ModuleComponent />
              </Suspense>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

export default App;
