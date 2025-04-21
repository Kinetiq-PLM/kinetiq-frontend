import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HRDashboard from '../HumanResources.jsx';
import Employees from './Employees';
import EditEmployee from '../pages/EditEmployee';
import Departments from './Departments';
import EditDepartment from '../pages/EditDepartment';
import '../../../App.css';

function App() {
  return (
    <Router>
      <div className="hr-app-layout">
        <aside className="hr-sidebar">Sidebar</aside>
        <div className="hr-main-content">
          <header className="hr-navbar">Navbar</header>
          <div className="hr-dashboard-scrollable">
            <Routes>
              <Route path="/" element={<HRDashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/edit/:empId" element={<EditEmployee />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/departments/edit/:id" element={<EditDepartment />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;