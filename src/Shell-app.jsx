import { useState } from 'react'
import './Shell-app.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='shell-container'>
      {/* collapsible menu */}

      {/* static left navi -- icons */}
      <div className='sidebar-icons-container'>

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
