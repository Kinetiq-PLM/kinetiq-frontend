import { useState } from 'react'
import './App.css'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const moduleImageNames = ["Management", "Administration", "Accounting", "Financials", "Purchasing", "Operations",
                        "Sales", "Support & Services", "Inventory", "Distribution", "Production", 
                         "MRP", "Project Management", "Human Resources", "Report Generator"];

  const [activeModule, setActiveModule] = useState(null);
  const modules = moduleImageNames.map((name) => ({
    id: name,
    icon: `/icons/module-icons/${name}.png`,
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
      {isSidebarOpen && <div className="sidebar-desc-container">
        <div className='sidebar-icons-hamburger-container'>
          
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
            <p>{module.id}</p>
          </div>
          ))}
        </div>
        
        </div>}


      
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
