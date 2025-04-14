import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import StandaloneLogin from './pages/StandaloneLogin'
import LandingPage from './pages/LandingPage' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> landing page */}
        <Route path="/login" element={<StandaloneLogin />} />
        {/* <Route path="/app/*" element={<App />} /> */}
        <Route path="/*" element={<App />} />{/* Main app shell */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
)