import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const moduleImageNames = ["Management", "Administration", "Accounting", "Financials", "Purchasing", "Operations",
                        "Sales", "Support & Services", "Inventory", "Distribution", "Production", 
                         "MRP", "Project Management", "Human Resources", "Report Generator"];

  const [activeModule, setActiveModule] = useState(null);
  const [hoveredModule, setHoveredModule] = useState(null);

  const modules = moduleImageNames.map((name) => ({
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

          {modules.map((module) => (
          <div
            key={module.id}
            className={` ${isSidebarOpen ? "opened" : ""} 
              sidebar-module-icons-item 
              ${activeModule === module.id ? "active" : ""} 
              ${hoveredModule === module.id ? "hovered" : ""}`
            }

            onClick={() => setActiveModule(module.id)}
            onMouseEnter={() => setHoveredModule(module.id)}
            onMouseLeave={() => setHoveredModule(null)}
          >
            <img src={module.icon} alt={module.id} />
          </div>
          ))}
        </div>

        <div className='sidebar-kinetiq-footer'>
          <img src={"/icons/Kinetiq-Logo.png"} alt={"Kinetiq Logo"}></img>
        </div>
      </div>

      {/* collapsible description navi */}
      <div className={`sidebar-desc-container ${isSidebarOpen ? "open" : "closed"}`}>
        <div className='sidebar-icons-hamburger-container'></div>
        <div className='sidebar-main-menu-container'></div>  

        <div className='sidebar-module-descs' ref={descsRef} onScroll={() => handleScroll("descs")}>
          {modules.map((module) => (
            <div
              key={module.id}
              className={`sidebar-module-desc-item 
                ${activeModule === module.id ? "active" : ""} 
                ${hoveredModule === module.id ? "hovered" : ""}`
              }
              onClick={() => setActiveModule(module.id)}
              onMouseEnter={() => setHoveredModule(module.id)}
              onMouseLeave={() => setHoveredModule(null)}
            >
              <p>{module.id}</p>
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
        {activeModule && (
          <div className="header-tabs-container">
            <img src={`/icons/header-module-icons/${activeModule}.png`} alt={activeModule} />
            <p>{activeModule}</p>
          </div>
        )}


        </div>
        <div className='body-container'></div>
      </div>

    </div>
  )
}

export default App;
