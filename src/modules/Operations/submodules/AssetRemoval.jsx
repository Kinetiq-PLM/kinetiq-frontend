import React, { useState } from 'react';
import '../styles/AssetRemoval.css';

const AssetRemoval = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  
  const items = [
    { id: 'D001', itemNo: 'IT1001', itemName: 'Laptop', date: '03/20/25', status: 'Approved' },
    { id: 'D002', itemNo: 'IT1002', itemName: 'Printer', date: '03/21/25', status: 'Pending' },
    { id: 'D003', itemNo: 'IT1003', itemName: 'Monitor', date: '03/22/25', status: 'Approved' },
  ];
 
  const filteredItems = activeTab === 'all'
    ? items
    : items.filter(item => item.status.toLowerCase() === activeTab.toLowerCase());

  const handleCheckboxChange = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  return (
    <div className="AssetRemoval">
      <div className="body-content-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved
          </button>
          <button
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Deprecation ID</th>
              <th>Item No.</th>
              <th>Item Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </div>
                </td>
                <td>{item.id}</td>
                <td>{item.itemNo}</td>
                <td>{item.itemName}</td>
                <td>{item.date}</td>
                <td>
                  <span className={`status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="send-to">
          <button>Send To</button>
        </div>
      </div>
    </div>
  );
};

export default AssetRemoval;