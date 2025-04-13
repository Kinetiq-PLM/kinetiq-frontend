import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import StandaloneLogin from './pages/StandaloneLogin'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<StandaloneLogin />} />
      <Route path="/*" element={<App />} /> {/* All other routes use shell app */}
    </Routes>
  </BrowserRouter>
);