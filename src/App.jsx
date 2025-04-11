import { useState, useRef, Suspense, lazy, act, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./MediaQueries.css";
import SearchBar from "./shared/components/SearchBar";
import EditEmployee from "./modules/HumanResources/pages/EditEmployee"; // ← New import
import EditDepartment from "./modules/HumanResources/pages/EditDepartment";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [activeModule, setActiveModule] = useState(null);
  const [activeSubModule, setActiveSubModule] = useState(null);
  const [hoveredModule, setHoveredModule] = useState(null);
  const [hoveredSubModule, setHoveredSubModule] = useState(null);
  const [ModuleComponent, setModuleComponent] = useState(null);

  const iconsRef = useRef(null);
  const descsRef = useRef(null);

  const handleScroll = (source) => {
    if (!iconsRef.current || !descsRef.current) return;
    if (source === "icons") {
      descsRef.current.scrollTop = iconsRef.current.scrollTop;
    } else {
      iconsRef.current.scrollTop = descsRef.current.scrollTop;
    }
  };

  const loadMainModule = (moduleId) => {
    if (moduleFileNames[moduleId] && !(activeModule === moduleId && !activeSubModule)) {
      const LazyComponent = lazy(() =>
        import(
          /* @vite-ignore */ `./modules/${moduleFileNames[moduleId]}/${moduleFileNames[moduleId]}.jsx`
        )
      );
      setModuleComponent(() => LazyComponent);
    }
  };

  const loadSubModule = (submoduleId) => {
    if (moduleSubmoduleFileNames[activeModule]?.[submoduleId] && !(activeSubModule === submoduleId)) {
      const LazyComponent = lazy(() =>
        import(
          /* @vite-ignore */ `./modules/${moduleFileNames[activeModule]}/submodules/${moduleSubmoduleFileNames[activeModule][submoduleId]}.jsx`
        )
      );
      setModuleComponent(() => LazyComponent);
    }
  };

  const moduleFileNames = {
    "Human Resources": "HumanResources"
  };

  const moduleSubmoduleFileNames = {
    "Human Resources": {
      Employees: "Employees",
      Recruitment: "Recruitment",
      "Attendance Tracking": "AttendanceTracking",
      Payroll: "Payroll",
      Departments: "Departments",
      "Workforce Allocation": "WorkforceAllocation",
      "Leave Requests": "LeaveRequests",
      "Employee Performance": "EmployeePerformance",
      "Employee Salary": "EmployeeSalary"
    }
  };

  const modulesIcons = Object.keys(moduleFileNames).map((module) => ({
    id: module,
    icon: `/icons/module-icons/${moduleFileNames[module]}.png`
  }));

  return (
    <Router>
      <div className="shell">
        <div className="shell-container">
          {/* Sidebar icons */}
          <div className="sidebar-icons-container">
            <div className="sidebar-icons-hamburger-container">
              <div
                className="sidebar-icons-ham-icon-wrapper"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <div className={`ham-menu-icon ${isSidebarOpen ? "active" : ""}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>

            <div className="sidebar-main-menu-container"></div>

            <div
              className={`sidebar-module-icons ${isSidebarOpen ? "opened" : ""}`}
              ref={iconsRef}
              onScroll={() => handleScroll("icons")}
            >
              {modulesIcons.map((module) => (
                <div key={module.id}>
                  <div
                    className={`sidebar-module-icons-item 
                      ${isSidebarOpen ? "opened" : ""} 
                      ${activeModule === module.id ? "active" : ""} 
                      ${hoveredModule === module.id ? "hovered" : ""}`}
                    onClick={() => {
                      setActiveModule(module.id);
                      setActiveSubModule(null);
                      setIsSidebarOpen(true);
                      loadMainModule(module.id);
                    }}
                    onMouseEnter={() => setHoveredModule(module.id)}
                    onMouseLeave={() => setHoveredModule(null)}
                  >
                    <img src={module.icon} alt={module.id} />
                  </div>

                  <div className={`sidebar-submodule-empty-container ${
                    isSidebarOpen && activeModule === module.id ? "opened" : ""
                  }`}>
                    {moduleSubmoduleFileNames[module.id] &&
                      Object.keys(moduleSubmoduleFileNames[module.id]).map((sub, index) => (
                        <div key={index} className="sidebar-submodule-item-empty">
                          <p></p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="sidebar-kinetiq-footer">
              <img src={"/icons/Kinetiq-Logo.png"} alt={"Kinetiq Logo"}></img>
            </div>
          </div>

          {/* Sidebar descriptions */}
          <div className={`sidebar-desc-container ${isSidebarOpen ? "" : "closed"}`}>
            <div className="sidebar-icons-hamburger-container"></div>
            <div className="sidebar-main-menu-container"></div>

            <div className="sidebar-module-descs" ref={descsRef} onScroll={() => handleScroll("descs")}>
              {modulesIcons.map((module) => (
                <div key={module.id}>
                  <div
                    className={`sidebar-module-desc-item 
                            ${activeModule === module.id ? "active" : ""} 
                            ${hoveredModule === module.id ? "hovered" : ""}`}
                    onClick={() => {
                      setActiveModule(module.id);
                      setActiveSubModule(null);
                      loadMainModule(module.id);
                    }}
                    onMouseEnter={() => setHoveredModule(module.id)}
                    onMouseLeave={() => setHoveredModule(null)}
                  >
                    <p>{module.id}</p>
                  </div>

                  <div className={`sidebar-submodule-empty-container ${
                    isSidebarOpen && activeModule === module.id ? "opened" : ""
                  }`}>
                    {moduleSubmoduleFileNames[module.id] &&
                      Object.keys(moduleSubmoduleFileNames[module.id]).map((sub, index) => (
                        <div
                          key={index}
                          className={`sidebar-submodule-item
                            ${activeSubModule === sub ? "active" : ""} 
                            ${hoveredSubModule === sub ? "hovered" : ""}`}
                          onClick={() => {
                            setActiveSubModule(sub);
                            loadSubModule(sub);
                          }}
                          onMouseEnter={() => setHoveredSubModule(sub)}
                          onMouseLeave={() => setHoveredSubModule(null)}
                        >
                          <p>{sub}</p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="sidebar-kinetiq-footer-desc">
              <p>Kinetiq</p>
            </div>
          </div>

          {/* Main content area with routes */}
          <div className="header-body-container">
            <div className="header-navi">
              <div className={`header-tabs-container ${activeModule ? "visible" : "hidden"}`}>
                <img
                  src={`/icons/header-module-icons/${moduleFileNames[activeModule]}.png`}
                  alt={activeModule}
                />
                <p
                  className={`header-module-name ${!activeSubModule ? "active" : ""}`}
                  onClick={() => {
                    setActiveModule(activeModule);
                    loadMainModule(activeModule);
                    setActiveSubModule(null);
                    loadSubModule(null);
                  }}
                >
                  {activeModule}
                </p>

                <p>{activeSubModule ? ` > ` : ""}</p>
                <p id="header-submodule-name">{activeSubModule ? activeSubModule : ""}</p>
              </div>

              <div className="header-right-container">
                <SearchBar />
                <img
                  src={`/icons/Notification-${hasNotification ? "active-" : ""}logo.png`}
                  alt="Notificaton-Logo"
                  onClick={() => setHasNotification(!hasNotification)}
                />
                <div className="header-profile-container">
                  <div className="header-profile-icon"><p>C</p></div>
                  <p className="header-profile-name">Crusch K.</p>
                </div>
              </div>
            </div>

            <div className="body-container">
            <Routes>
                {/* 👇 Dedicated route for Edit Employee */}
                <Route path="/employees/edit/:empId" element={<EditEmployee />} />
              
                {/* 👇 Dedicated route for Edit Department */}
                <Route path="/departments/edit/:id" element={<EditDepartment />} />
              
                {/* 👇 Render active module or submodule */}
                <Route
                  path="*"
                  element={
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
      </div>
    </Router>
  );
}

export default App;
