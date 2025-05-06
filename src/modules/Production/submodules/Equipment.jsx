import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Equipment.css";

// Equipment table with backend logic
const EquipmentTable = ({ searchTerm }) => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/equipment/");
        setEquipmentData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch equipment data.");
        setLoading(false);
      }
    };
    fetchEquipmentData();
  }, []);

  const handleStatusChange = async (id, value) => {
    const updatedData = equipmentData.map(item =>
      item.equipment_id === id ? { ...item, availability_status: value } : item
    );
    setEquipmentData(updatedData);
    const equipmentToUpdate = updatedData.find(item => item.equipment_id === id);
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/equipment/${id}/`,
        equipmentToUpdate
      );
      console.log("Availability status updated successfully");
    } catch (error) {
      console.error("Failed to update availability status", error);
    }
  };

  const handleMaintenanceDateChange = async (id, value) => {
    const updatedData = equipmentData.map(item =>
      item.equipment_id === id ? { ...item, last_maintenance_date: value } : item
    );
    setEquipmentData(updatedData);
    const equipmentToUpdate = updatedData.find(item => item.equipment_id === id);
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/equipment/${id}/`,
        equipmentToUpdate
      );
      console.log("Maintenance date updated successfully");
    } catch (error) {
      console.error("Failed to update maintenance date", error);
    }
  };

  const handleCostChange = async (id, value) => {
    const updatedData = equipmentData.map(item =>
      item.equipment_id === id ? { ...item, equipment_cost: value } : item
    );
    setEquipmentData(updatedData);
    const equipmentToUpdate = updatedData.find(item => item.equipment_id === id);
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/equipment/${id}/`,
        equipmentToUpdate
      );
      console.log("Equipment cost updated successfully");
    } catch (error) {
      console.error("Failed to update equipment cost", error);
    }
  };

  const filteredData = equipmentData
    .slice() // Create a shallow copy to avoid mutating the original array
    .sort((a, b) => a.equipment_id.localeCompare(b.equipment_id)) // Sort by equipment_id
    .filter((equipment) => {
      const search = searchTerm.toLowerCase();
      return (
        (equipment.equipment_id && equipment.equipment_id.toLowerCase().includes(search)) ||
        (equipment.equipment_name && equipment.equipment_name.toLowerCase().includes(search)) ||
        (equipment.description && equipment.description.toLowerCase().includes(search)) ||
        (equipment.last_maintenance_date &&
          equipment.last_maintenance_date.toString().toLowerCase().includes(search)) ||
        (equipment.equipment_cost &&
          equipment.equipment_cost.toString().toLowerCase().includes(search)) ||
        (equipment.availability_status &&
          equipment.availability_status.toLowerCase().includes(search))
      );
    });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="equilatable-container">
      <table className="equila-equipment-table">
        <thead>
          <tr>
            <th>Equipment ID</th>
            <th>Equipment Name</th>
            <th>Description</th>
            <th style={{ width: "150px" }}>Last Maintenance Date</th>
            <th>Equipment Cost</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((equipment, index) => (
            <tr key={equipment.equipment_id || index}>
              <td><h1>{equipment.equipment_id || "E001"}</h1></td>
              <td><h2>{equipment.equipment_name || "CNC Milling Machine"}</h2></td>
              <td>
                {equipment.description ||
                  "High-precision 3-axis CNC milling machine for complex parts."}
              </td>
              <td>
                <input
                  type="date"
                  value={equipment.last_maintenance_date || ""}
                  onChange={(e) =>
                    handleMaintenanceDateChange(equipment.equipment_id, e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={equipment.equipment_cost || ""}
                  onChange={(e) =>
                    handleCostChange(equipment.equipment_id, e.target.value)
                  }
                />
              </td>
              <td>
                <select
                  className={`equila-equip-availability-dropdown ${equipment.availability_status
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                  value={equipment.availability_status}
                  onChange={(e) =>
                    handleStatusChange(equipment.equipment_id, e.target.value)
                  }
                >
                  <option value="Available">Available</option>
                  <option value="Out of Order">Out of Order</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;
  return (
    <div className="equila-modal-overlay">
      <div className="equila-modal-content">
        <button className="equila-close-button" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const BodyContent = () => {
  const [searchQuery, setSearchQuery] = useState(""); // For Equipment table
  const [modalSearchQuery, setModalSearchQuery] = useState(""); // For the modal search
  const [showModal, setShowModal] = useState(false);
  const [projectEquipmentData, setProjectEquipmentData] = useState([]);
  const [equipmentMap, setEquipmentMap] = useState({});
  const [itemMap, setItemMap] = useState({});
  const [peLoading, setPeLoading] = useState(false);
  const [peError, setPeError] = useState(null);

  // Fetch project equipment data
  const fetchProjectEquipment = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/project-equipment/");
      setProjectEquipmentData(response.data);
      setPeLoading(false);
    } catch (error) {
      setPeError("Failed to fetch project equipment.");
      setPeLoading(false);
    }
  };

  // Fetch equipment data and create a mapping: equipment_id -> equipment_name
  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/equipment/");
        const map = {};
        response.data.forEach((equipment) => {
          map[equipment.equipment_id] = equipment.equipment_name;
        });
        setEquipmentMap(map);
      } catch (err) {
        console.error("Failed to fetch equipment data.", err);
      }
    };
    fetchEquipmentData();
  }, []);

  // Fetch item data and create a mapping: item_id -> item_name
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/item/");
        const map = {};
        response.data.forEach((item) => {
          const normalizedKey = item.item_id.trim().toLowerCase(); // Normalize the key
          map[normalizedKey] = item.item_name;
        });
        setItemMap(map);
        console.log("Item Map:", map); // Debugging log
      } catch (err) {
        console.error("Failed to fetch item data.", err);
      }
    };
    fetchItemData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleModalSearchChange = (event) => {
    setModalSearchQuery(event.target.value);
  };

  const handleViewProjectEquipment = () => {
    setShowModal(true);
    setPeLoading(true);
    setPeError(null);
    fetchProjectEquipment();
    setModalSearchQuery("");
  };

  const filteredProjectEquipment = projectEquipmentData
    .filter((pe) => {
      const search = modalSearchQuery.toLowerCase();
      const normalizedItemId = pe.item_id.trim().toLowerCase(); // Normalize the item_id
      const itemName = itemMap[normalizedItemId] || ""; // Get the item_name from itemMap

      return (
        (pe.project_equipment_id && pe.project_equipment_id.toLowerCase().includes(search)) ||
        (equipmentMap[pe.equipment_id] && equipmentMap[pe.equipment_id].toLowerCase().includes(search)) ||
        itemName.toLowerCase().includes(search) // Include item_name in the search
      );
    })
    .sort((a, b) => {
      const nameA = equipmentMap[a.equipment_id] || ""; // Get equipment_name for a
      const nameB = equipmentMap[b.equipment_id] || ""; // Get equipment_name for b
      return nameA.localeCompare(nameB); // Sort alphabetically
    });

  return (
    <div className="equimaprod">
      <div className="equimaprod-header-section">
        <h1>Equipment</h1>
      </div>
      <div className="equimaprodcolumns">
        <div className="prod-column-expanded">
          <div className="prodtop-section">
            <div className="equilasearch-wrapper">
              <img src="/icons/search-icon.png" alt="Search" className="search-icon" />
              <input
                type="text"
                className="equilasearch-bar"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <div className="equilaproject-equipment-button" onClick={handleViewProjectEquipment}>
                View Project Equipment
              </div>
            </div>
          </div>
          <div className="equila-EM-table">
            <EquipmentTable searchTerm={searchQuery} />
          </div>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h1>Project Equipment</h1>
        <div className="equila-modalsearch-wrapper">
          <div className="equila-modalsearch-input-wrapper">
            <img src="/icons/search-icon.png" alt="Search" className="search-icon" />
            <input
              type="text"
              className="equila-modalsearch-bar"
              placeholder="Search..."
              value={modalSearchQuery}
              onChange={handleModalSearchChange}
            />
          </div>
        </div>
        <div className="equila-proj-equipment">
          {peLoading ? (
            <p>Loading...</p>
          ) : peError ? (
            <p>{peError}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Equipment Name</th>
                  <th>Product Name</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const groupedEquipment = new Map();

                  // Group data by equipment_name
                  filteredProjectEquipment.forEach((pe) => {
                    const equipmentName = equipmentMap[pe.equipment_id] || pe.equipment_id;
                    const productName = itemMap[pe.item_id.trim().toLowerCase()] || pe.item_id;

                    if (!groupedEquipment.has(equipmentName)) {
                      groupedEquipment.set(equipmentName, []);
                    }
                    groupedEquipment.get(equipmentName).push(productName);
                  });

                  // Render grouped data
                  return [...groupedEquipment.entries()].map(([equipmentName, productNames], index) => (
                    <tr key={index}>
                      <td>{equipmentName}</td>
                      <td>
                        {productNames.map((productName, idx) => (
                          <div key={idx}>{productName}</div> // Each product name on a new line
                        ))}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BodyContent;