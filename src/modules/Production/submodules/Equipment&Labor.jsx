<<<<<<< HEAD
import React, { useState } from "react";
import "../styles/Equipment&Labor.css";


const Modal = ({ show, onClose, children }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

const BodyContent = () => {
    const [activeTab, setActiveTab] = useState("equipment");
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const renderTable = () => {
        switch (activeTab) {
            case "equipment":
                return <EquipmentTable />;
            case "labor":
                return <LaborTable />;
            default:
                return null;
        }
    };

    const handleViewProjectEquipment = () => {
        setShowModal(true);
    };

    return (
        <div className="equimaprod">
            <div className="equimaprod-header-section">
                <h1>Equipment & Labor</h1>
            </div>

            <div className="equimaprodcolumns">
                <div className="column expanded">
                    <div className="top-section">
                        <div className="equimaprod-button-group">
                            <button
                                className={`equipment-button ${activeTab === "equipment" ? "active" : ""}`}
                                onClick={() => setActiveTab("equipment")}
                            >
                                Equipment
                            </button>
                            <button
                                className={`labor-button ${activeTab === "labor" ? "active" : ""}`}
                                onClick={() => setActiveTab("labor")}
                            >
                                Labor
                            </button>
                        </div>
                        <div className="equilasearch-wrapper">
                            <img src="/icons/search-icon.png" alt="Search" className="search-icon" />
                            <input
                                type="text"
                                className="equilasearch-bar"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <div className="project-equipment-button" onClick={handleViewProjectEquipment}>
                                View Project Equipment
                            </div>
                        </div>
                    </div>

                    <div className="EM-table">
                        {renderTable()}
                    </div>
                </div>
            </div>


            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <h1>Project Equipment</h1>
                <div className="modalsearch-wrapper">
                    <div className="modalsearch-input-wrapper">
                        <img src="/icons/search-icon.png" alt="Search" className="search-icon" />
                        <input
                            type="text"
                            className="modalsearch-bar"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                <div className="proj-equipment-table">
                    <table>
                        <thead>
                            <th>Project Equipment ID</th>
                            <th>Equipment ID</th>
                            <th>Product ID</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td>PROD-PJEQ-2025-cea4b2</td>
                                <td>CNC Milling Machine (5-axis)</td>
                                <td>
                                    <ul>
                                        <li>BeneVision Series</li>
                                        <li>Wato EX-35</li>
                                        <li>HyBase 3000</li>
                                        <li>OEC Elite</li>
                                    </ul>
                                </td>
                            </tr>

                            <tr>
                                <td>PROD-PJEQ-2025-cea4b2</td>
                                <td>CNC Milling Machine (5-axis)</td>
                                <td>
                                    <ul>
                                        <li>BeneVision Series</li>
                                        <li>Wato EX-35</li>
                                        <li>HyBase 3000</li>
                                        <li>OEC Elite</li>
                                    </ul>
                                </td>
                            </tr>

                            <tr>
                                <td>PROD-PJEQ-2025-cea4b2</td>
                                <td>CNC Milling Machine (5-axis)</td>
                                <td>
                                    <ul>
                                        <li>BeneVision Series</li>
                                        <li>Wato EX-35</li>
                                        <li>HyBase 3000</li>
                                        <li>OEC Elite</li>
                                    </ul>
                                </td>
                            </tr>

                            <tr>
                                <td>PROD-PJEQ-2025-cea4b2</td>
                                <td>CNC Milling Machine (5-axis)</td>
                                <td>
                                    <ul>
                                        <li>BeneVision Series</li>
                                        <li>Wato EX-35</li>
                                        <li>HyBase 3000</li>
                                        <li>OEC Elite</li>
                                    </ul>
                                </td>
                            </tr>

                            <tr>
                                <td>PROD-PJEQ-2025-cea4b2</td>
                                <td>CNC Milling Machine (5-axis)</td>
                                <td>
                                    <ul>
                                        <li>BeneVision Series</li>
                                        <li>Wato EX-35</li>
                                        <li>HyBase 3000</li>
                                        <li>OEC Elite</li>
                                    </ul>
                                </td>
                            </tr>


                        </tbody>
                    </table>
                </div>
            </Modal>
        </div>
    );
};

const EquipmentTable = () => {
    const [statuses, setStatuses] = useState(Array(7).fill("available"));
    const [maintenanceDates, setMaintenanceDates] = useState(Array(7).fill("2024-03-01"));
    const [costs, setCosts] = useState(Array(7).fill("750,000"));

    const handleStatusChange = (index, value) => {
        const updatedStatuses = [...statuses];
        updatedStatuses[index] = value;
        setStatuses(updatedStatuses);
    };

    const handleMaintenanceDateChange = (index, value) => {
        const updatedDates = [...maintenanceDates];
        updatedDates[index] = value;
        setMaintenanceDates(updatedDates);
    };

    const handleCostChange = (index, value) => {
        const updatedCosts = [...costs];
        updatedCosts[index] = value;
        setCosts(updatedCosts);
    };

    return (
        <div className="table-container">
            <table className="equipment-table">
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
                    {statuses.map((status, index) => (
                        <tr key={index}>
                            <td><h1>E001</h1></td>
                            <td><h2>CNC Milling Machine</h2></td>
                            <td>High-precision 3-axis CNC milling machine for complex parts.</td>
                            <td>
                                <input
                                    type="date"
                                    value={maintenanceDates[index]}
                                    onChange={(e) => handleMaintenanceDateChange(index, e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={costs[index]}
                                    onChange={(e) => handleCostChange(index, e.target.value)}
                                />
                            </td>
                            <td>
                                <select
                                    className={`availability-dropdown ${status}`}
                                    value={status}
                                    onChange={(e) => handleStatusChange(index, e.target.value)}
                                >
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                    <option value="undermaintenance">Under Maintenance</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const LaborTable = () => {
    const [laborStatuses, setLaborStatuses] = useState(Array(7).fill("available"));
    const [datesWorked, setDatesWorked] = useState(Array(7).fill("2024-03-01"));
    const [daysWorked, setDaysWorked] = useState(Array(7).fill("8"));

    const handleLaborStatusChange = (index, value) => {
        const updatedStatuses = [...laborStatuses];
        updatedStatuses[index] = value;
        setLaborStatuses(updatedStatuses);
    };

    const handleDatesWorkedChange = (index, value) => {
        const updatedDates = [...datesWorked];
        updatedDates[index] = value;
        setDatesWorked(updatedDates);
    };

    const handleDaysWorkedChange = (index, value) => {
        const updatedDays = [...daysWorked];
        updatedDays[index] = value;
        setDaysWorked(updatedDays);
    };

    return (
        <div className="table-container">
            <table className="labor-table">
                <thead>
                    <tr>
                        <th>Labor ID</th>
                        <th>Production Order ID</th>
                        <th>Employee ID</th>
                        <th>Date Worked</th>
                        <th>Days Worked</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {laborStatuses.map((status, index) => (
                        <tr key={index}>
                            <td><h1>L001</h1></td>
                            <td><h2>P0001</h2></td>
                            <td>EMO1</td>
                            <td>
                                <input
                                    type="date"
                                    value={datesWorked[index]}
                                    onChange={(e) => handleDatesWorkedChange(index, e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={daysWorked[index]}
                                    onChange={(e) => handleDaysWorkedChange(index, e.target.value)}
                                />
                            </td>
                            <td>
                                <select
                                    className={`availability-dropdown ${status}`}
                                    value={status}
                                    onChange={(e) => handleLaborStatusChange(index, e.target.value)}
                                >
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                    <option value="undermaintenance">Under Maintenance</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BodyContent;

=======
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Equipment&Labor.css";

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

  const handleStatusChange = async (index, value) => {
    const updatedData = equipmentData.map((item, i) =>
      i === index ? { ...item, availability_status: value } : item
    );
    setEquipmentData(updatedData);
    const equipmentToUpdate = updatedData[index];

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/equipment/${equipmentToUpdate.equipment_id}/`,
        equipmentToUpdate
      );
      console.log("Availability status updated successfully");
    } catch (error) {
      console.error("Failed to update availability status", error);
    }
  };

  const handleMaintenanceDateChange = async (index, value) => {
    const updatedData = equipmentData.map((item, i) =>
      i === index ? { ...item, last_maintenance_date: value } : item
    );
    setEquipmentData(updatedData);
    const equipmentToUpdate = updatedData[index];

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/equipment/${equipmentToUpdate.equipment_id}/`,
        equipmentToUpdate
      );
    } catch (error) {
      console.error("Failed to update maintenance date", error);
    }
  };

  const handleCostChange = async (index, value) => {
    const updatedData = equipmentData.map((item, i) =>
      i === index ? { ...item, equipment_cost: value } : item
    );
    setEquipmentData(updatedData);
    const equipmentToUpdate = updatedData[index];

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/equipment/${equipmentToUpdate.equipment_id}/`,
        equipmentToUpdate
      );
    } catch (error) {
      console.error("Failed to update equipment cost", error);
    }
  };

  const filteredData = equipmentData.filter((equipment) => {
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
    <div className="table-container">
      <table className="equipment-table">
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
                  onChange={(e) => handleMaintenanceDateChange(index, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={equipment.equipment_cost || ""}
                  onChange={(e) => handleCostChange(index, e.target.value)}
                />
              </td>
              <td>
                <select
                  className={`availability-dropdown ${equipment.availability_status
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                  value={equipment.availability_status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
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

// Labor table with backend logic
const LaborTable = ({ searchTerm }) => {
  const [laborData, setLaborData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLaborData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/labor/");
        setLaborData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch labor data.");
        setLoading(false);
      }
    };
    fetchLaborData();
  }, []);

  const handleDatesWorkedChange = async (index, value) => {
    const updatedData = laborData.map((item, i) =>
      i === index ? { ...item, date_worked: value } : item
    );
    setLaborData(updatedData);
    const laborToUpdate = updatedData[index];

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/labor/${laborToUpdate.labor_id}/`,
        { date_worked: value },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Date worked updated successfully");
    } catch (error) {
      console.error("Failed to update date worked", error);
    }
  };

  const handleDaysWorkedChange = async (index, value) => {
    const updatedData = laborData.map((item, i) =>
      i === index ? { ...item, days_worked: value } : item
    );
    setLaborData(updatedData);
    const laborToUpdate = updatedData[index];

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/labor/${laborToUpdate.labor_id}/`,
        { days_worked: value },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Days worked updated successfully");
    } catch (error) {
      console.error("Failed to update days worked", error);
    }
  };

  const filteredData = laborData.filter((labor) => {
    const search = searchTerm.toLowerCase();
    return (
      (labor.labor_id && labor.labor_id.toLowerCase().includes(search)) ||
      (labor.production_order_id && labor.production_order_id.toLowerCase().includes(search)) ||
      (labor.employee_id && labor.employee_id.toLowerCase().includes(search)) ||
      (labor.date_worked &&
        new Date(labor.date_worked)
          .toISOString()
          .split("T")[0]
          .toLowerCase()
          .includes(search)) ||
      (labor.days_worked && labor.days_worked.toString().includes(search))
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="table-container">
      <table className="labor-table">
        <thead>
          <tr>
            <th className="labor-header">Labor ID</th>
            <th className="labor-header">Production Order ID</th>
            <th className="labor-header">Employee ID</th>
            <th className="labor-header">Date Worked</th>
            <th className="labor-header">Days Worked</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((labor, index) => (
            <tr key={labor.labor_id || index} className="labor-row">
              <td className="labor-cell labor-id">
                <h1>{labor.labor_id || "L001"}</h1>
              </td>
              <td className="labor-cell order-id">
                <h2>{labor.production_order_id || ""}</h2>
              </td>
              <td className="labor-cell employee-id">
                {labor.employee_id || ""}
              </td>
              <td className="labor-cell date-worked">
                <input
                  type="date"
                  value={
                    labor.date_worked
                      ? new Date(labor.date_worked).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleDatesWorkedChange(index, e.target.value)}
                />
              </td>
              <td className="labor-cell days-worked">
                <input
                  type="text"
                  value={labor.days_worked}
                  onChange={(e) => handleDaysWorkedChange(index, e.target.value)}
                />
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
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const BodyContent = () => {
  const [activeTab, setActiveTab] = useState("equipment");
  const [searchQuery, setSearchQuery] = useState(""); // For Equipment & Labor tables
  const [modalSearchQuery, setModalSearchQuery] = useState(""); // For the modal search
  const [showModal, setShowModal] = useState(false);
  const [projectEquipmentData, setProjectEquipmentData] = useState([]);
  const [peLoading, setPeLoading] = useState(false);
  const [peError, setPeError] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // New handler for modal search
  const handleModalSearchChange = (event) => {
    setModalSearchQuery(event.target.value);
  };

  const renderTable = () => {
    switch (activeTab) {
      case "equipment":
        return <EquipmentTable searchTerm={searchQuery} />;
      case "labor":
        return <LaborTable searchTerm={searchQuery} />;
      default:
        return null;
    }
  };

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

  const handleViewProjectEquipment = () => {
    setShowModal(true);
    setPeLoading(true);
    setPeError(null);
    fetchProjectEquipment();
    // Also clear modal search query on open
    setModalSearchQuery("");
  };

  // Filter project equipment by modal's search query
  const filteredProjectEquipment = projectEquipmentData.filter((pe) => {
    const search = modalSearchQuery.toLowerCase();
    return (
      (pe.project_equipment_id && pe.project_equipment_id.toLowerCase().includes(search)) ||
      (pe.equipment_id && pe.equipment_id.toLowerCase().includes(search)) ||
      (pe.product_id && pe.product_id.toLowerCase().includes(search))
    );
  });

  return (
    <div className="equimaprod">
      <div className="equimaprod-header-section">
        <h1>Equipment & Labor</h1>
      </div>
      <div className="equimaprodcolumns">
        <div className="column expanded">
          <div className="top-section">
            <div className="equimaprod-button-group">
              <button
                className={`equipment-button ${activeTab === "equipment" ? "active" : ""}`}
                onClick={() => setActiveTab("equipment")}
              >
                Equipment
              </button>
              <button
                className={`labor-button ${activeTab === "labor" ? "active" : ""}`}
                onClick={() => setActiveTab("labor")}
              >
                Labor
              </button>
            </div>
            <div className="equilasearch-wrapper">
              <img src="/icons/search-icon.png" alt="Search" className="search-icon" />
              <input
                type="text"
                className="equilasearch-bar"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <div className="project-equipment-button" onClick={handleViewProjectEquipment}>
                View Project Equipment
              </div>
            </div>
          </div>
          <div className="EM-table">{renderTable()}</div>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h1>Project Equipment</h1>
        <div className="modalsearch-wrapper">
          <div className="modalsearch-input-wrapper">
            <img src="/icons/search-icon.png" alt="Search" className="search-icon" />
            <input
              type="text"
              className="modalsearch-bar"
              placeholder="Search..."
              value={modalSearchQuery}
              onChange={handleModalSearchChange}
            />
          </div>
        </div>
        <div className="proj-equipment-table">
          {peLoading ? (
            <p>Loading...</p>
          ) : peError ? (
            <p>{peError}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Project Equipment ID</th>
                  <th>Equipment ID</th>
                  <th>Product ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjectEquipment.map((pe, index) => (
                  <tr key={pe.project_equipment_id || index}>
                    <td>{pe.project_equipment_id}</td>
                    <td>{pe.equipment_id}</td>
                    <td>{pe.product_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BodyContent;
>>>>>>> 39a3d91 (updated code with database)
