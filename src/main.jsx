import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import  App from './App.jsx'
import StandaloneLogin from './pages/StandaloneLogin'
import emailjs from '@emailjs/browser';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<StandaloneLogin />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
    <script type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js">
    </script>
    <script type="text/javascript">
      (function(){
          emailjs.init({
            publicKey: "QHL_DUC2S209_TnWA",
          })
      })();
    </script>
  </StrictMode>
)