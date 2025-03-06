import { useState, useRef } from 'react'
import './App.css'
import SearchBar from "./shared/components/SearchBar"; 


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const moduleNames = ["Management", "Administration", "Accounting", "Financials", "Purchasing", "Operations",
                        "Sales", "Support & Services", "Inventory", "Distribution", "Production", 
                         "MRP", "Project Management", "Human Resources", "Report Generator"];
  const moduleSubmodules = {
                          "Management": ["User Roles", "Access Control", "Settings"],
                          "Administration": ["Company Policies", "User Accounts"],
                          "Accounting": ["General Ledger", "Accounts Payable", "Accounts Receivable"],
                          "Financials": ["Budgeting", "Cash Flow", "Financial Reports"],
                          "Purchasing": ["Supplier Management", "Purchase Orders"],
                          "Operations": ["Workflow Automation", "Operational Analytics"],
                          "Sales": ["Lead Management", "Invoices", "Quotations"],
                          "Support & Services": ["Ticketing System", "Customer Support"],
                          "Inventory": ["Stock Levels", "Product Catalog"],
                          "Distribution": ["Shipping", "Order Fulfillment"],
                          "Production": ["Manufacturing Process", "Quality Control"],
                          "MRP": ["Material Requirements Planning", "Production Scheduling"],
                          "Project Management": ["Task Assignments", "Gantt Charts"],
                          "Human Resources": ["Employee Records", "Payroll", "Recruitment"],
                          "Report Generator": ["Custom Reports", "Data Visualization"],
                        };
                        

  const [activeModule, setActiveModule] = useState(null);
  const [activeSubModule, setActiveSubModule] = useState(null);
  const [hoveredModule, setHoveredModule] = useState(null);
  const [hoveredSubModule, setHoveredSubModule] = useState(null);

  const modulesIcons = moduleNames.map((name) => ({
    id: name,
    icon: `/icons/module-icons/${name}.png`,
  }));

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

  return (
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
                  }}
                  onMouseEnter={() => setHoveredModule(module.id)}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  <img src={module.icon} alt={module.id}/>
                  
                </div>
                

                <div 
                  className={`sidebar-submodule-empty-container ${(isSidebarOpen && activeModule === module.id) ? "opened" : ""}`} 
                >
                  {/* Submodules - Only show if this module is active */}
                  {moduleSubmodules[module.id]?.map((_, index) => (
                    <div key={index} className={"sidebar-submodule-item-empty"}>
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
                    {moduleSubmodules[module.id]?.map((sub, index) => (
                        <div 
                            key={index} 
                            className={`sidebar-submodule-item
                                ${activeSubModule === sub ? "active" : ""} 
                                ${hoveredSubModule === sub ? "hovered" : ""}`}
                            onClick={() => setActiveSubModule(sub)}
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
            <img src={`/icons/header-module-icons/${activeModule}.png`} alt={activeModule} />
            <p id="header-module-name" onClick={() => {
                          setActiveModule(activeModule);
                          setActiveSubModule(null);
                      }}>
              {activeModule}
            </p>
            <p>{activeSubModule ? ` > ` : ""}</p>
            <p>{activeSubModule ? activeSubModule : ""}</p>
          </div>


          <div className='header-right-container'>
            <SearchBar />
            <img src={`/icons/Notification-${hasNotification ? "active-" : ""}logo.png`}
                alt='Notificaton-Logo'  onClick={() =>setHasNotification(!hasNotification)}></img>
            <div className='header-profile-container'>
              <div className='header-profile-icon'> <p>C</p></div>
              <p>Crusch K.</p>
            </div>
          </div>


        </div>
        <div className='body-container'></div>
      </div>

    </div>
  )
}

export default App;
