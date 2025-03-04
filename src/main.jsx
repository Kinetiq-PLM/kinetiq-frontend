import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ShellApp from './Shell-app.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShellApp />
  </StrictMode>,
)
