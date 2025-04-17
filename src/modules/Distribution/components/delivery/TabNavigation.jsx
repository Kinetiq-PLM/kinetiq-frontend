import React from "react";

const TabNavigation = ({ activeTab, onTabChange, tabs = [
  { id: 'sales', label: 'Sales Delivery' },
  { id: 'service', label: 'Service Delivery' }
] }) => {
  return (
    <div className="tab-navigation">
      {tabs.map(tab => (
        <div 
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default TabNavigation;