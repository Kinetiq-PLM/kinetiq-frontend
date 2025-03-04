import { useState } from 'react'
import './App.css'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const moduleNames = ["management", "admin", "accounting", "financials", "purchasing", "operations",
                        "sales", "support_services", "inventory", "distribution", "production", 
                         "mrp", "project_management", "human_resources", "solutions_customizing"];

  const [activeModule, setActiveModule] = useState(null);
  const modules = moduleNames.map((name) => ({
    id: name,
    icon: `/icons/module-icons/${name}-sidebar.png`,
  }));

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

        <div className='sidebar-main-menu-container'>
          
        </div>

        <div className='sidebar-module-icons'>
          {modules.map((module) => (
          <div
            key={module.id}
            className={`sidebar-module-icons-item ${activeModule === module.id ? "active" : ""}`}
            onClick={() => setActiveModule(module.id)}
          >
            <img src={module.icon} alt={module.id} />
          </div>
          ))}
        </div>
      </div>

      {/* collapsible description navi */}
      {isSidebarOpen && <div className="sidebar-desc-container"></div>}


      
      {/* adjustable right content */}
      <div className='header-body-container'>
        <div className='header-navi'>

        </div>
        <div className='body-container'>

        </div>
      </div>

      

    </div>
  )
}

export default App
