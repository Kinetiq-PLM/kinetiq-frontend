import { useState } from 'react'
import './Shell-app.css'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='shell-container'>


      {/* collapsible menu */}

      {/* static left navi -- icons */}
      <div className='sidebar-icons-container'>
        <div className='sidebar-icons-hamburger-container'>
          <div className='sidebar-icons-ham-icon-wrapper'>
            <div className={`ham-menu-icon ${isSidebarOpen ? "active" : ""}`}
                              onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      {/* collapsible description navi */}
      <div className='sidebar-desc-container'>

      </div>


      
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
