import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HRDashboard from './components/HumanResources';
import Employees from './modules/HumanResources/submodules/Employees';
import EditEmployee from './submodules/EditEmployee';
import Departments from './modules/HumanResources/submodules/Departments';
import EditDepartment from './submodules/EditDepartment';
import AttendanceTracking from './modules/HumanResources/submodules/AttendanceTracking';
import LeaveRequests from './modules/HumanResources/submodules/LeaveRequests';
import EmployeePerformance from './modules/HumanResources/submodules/EmployeePerformance';
import Recruitment from './modules/HumanResources/submodules/Recruitment';
import Payroll from './modules/HumanResources/submodules/Payroll';
import WorkforceAllocation from './modules/HumanResources/submodules/WorkforceAllocation';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="hr-app-layout">
        <aside className="hr-sidebar">Sidebar</aside>
        <div className="hr-main-content">
          <header className="hr-navbar">Navbar</header>
          <div className="hr-dashboard-scrollable">
            <Routes>
              {/* Dedicated routes for edit pages */}
              <Route path="/employees/edit/:empId" element={<EditEmployee />} />
              <Route path="/departments/edit/:id" element={<EditDepartment />} />
              
              {/* Add routes for submodules */}
              <Route path="/attendance" element={<AttendanceTracking />} />
              <Route path="/leave-requests" element={<LeaveRequests />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/employee-performance" element={<EmployeePerformance />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/workforce-allocation" element={<WorkforceAllocation />} />
              
              {/* Catch-all route as fallback */}
              <Route path="*" element={
                  ModuleComponent && (
                    <Suspense>
                      <ModuleComponent
                        loadSubModule={loadSubModule}
                        setActiveSubModule={setActiveSubModule}
                      />
                    </Suspense>
                  )
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;