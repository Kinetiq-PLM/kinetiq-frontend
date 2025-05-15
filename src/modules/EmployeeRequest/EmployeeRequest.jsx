import React, { useState } from "react";
import "./styles/EmployeeRequest.css";
import { FaClock, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";

const EmployeeRequest = ({ loadSubModule, setActiveSubModule, employee_id }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  const requestTypes = [
    {
      title: "Leave Request",
      description: "Submit a request for scheduled time off including sick leave, vacation, or personal leave",
      icon: <FaCalendarAlt />,
      color: "#00a9ac",
      submodule: "Leave Request" // Verify this matches the registration in parent app
    },
    {
      title: "Overtime Request",
      description: "Submit a request for overtime hours worked outside of your regular schedule",
      icon: <FaClock />,
      color: "#00a9ac",
      submodule: "Overtime Request" // Verify this matches the registration in parent app
    },
    {
      title: "Resignation Request",
      description: "Submit a formal resignation notice and initiate the departure process",
      icon: <FaSignOutAlt />,
      color: "#00a9ac",
      submodule: "Resignation Request" // Verify this matches the registration in parent app
    }
  ];

  // This function correctly handles the navigation to submodules
  const navigateToSubmodule = (submodule, e) => {
    // If event is provided, prevent default and stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log(`Attempting to navigate to submodule: ${submodule}`);
    
    try {
      // Check if the functions exist
      if (!loadSubModule || typeof loadSubModule !== 'function') {
        console.error('loadSubModule is not a valid function');
        return;
      }
      
      if (!setActiveSubModule || typeof setActiveSubModule !== 'function') {
        console.error('setActiveSubModule is not a valid function');
        return;
      }
      
      // Save any necessary data to sessionStorage for the target submodule
      sessionStorage.setItem('requestSource', 'employeePortal');
      
      // Navigate to the submodule
      setActiveSubModule(submodule);
      loadSubModule(submodule);
      
      // Add logging to verify navigation was successful
      console.log('Navigation triggered to:', submodule);
    } catch (error) {
      console.error('Error navigating to submodule:', error);
      alert(`Failed to navigate to ${submodule}. Please try again or contact support.`);
    }
  };

  return (
    <div className="emp-req">
      <div className="body-content-container">
        <div className="emp-req-dashboard">
          <div className="emp-req-header">
            <h2>Employee Request Portal</h2>
            <p>Submit and track your requests</p>
          </div>

          <div className="emp-req-cards">
            {requestTypes.map((request, index) => (
              <div 
                key={index}
                className={`emp-req-card ${activeCardIndex === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveCardIndex(index)}
                onMouseLeave={() => setActiveCardIndex(null)}
              >
                <div className="emp-req-card-icon" style={{ backgroundColor: request.color }}>
                  {request.icon}
                </div>
                <div className="emp-req-card-content">
                  <h3>{request.title}</h3>
                  <p>{request.description}</p>
                </div>
                <div className="emp-req-card-action">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Ensure the event doesn't bubble up
                      navigateToSubmodule(request.submodule, e);
                    }}
                    className="emp-req-action-button"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="emp-req-recent">
            <h3>Recent Requests</h3>
            <div className="emp-req-recent-empty">
              <p>No recent requests to display</p>
              <small>Your recently submitted requests will appear here</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export wrapped component to ensure props are passed through
const BodyContent = ({ loadSubModule, setActiveSubModule, employee_id }) => {
  return (
    <EmployeeRequest
      loadSubModule={loadSubModule}
      setActiveSubModule={setActiveSubModule}
      employee_id={employee_id}
    />
  );
};

export default BodyContent;