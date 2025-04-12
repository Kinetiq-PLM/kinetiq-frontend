import React, { useState } from "react";
import "../styles/Positions.css";

// Mock data based on your INSERT statements
const initialPositions = [
  // Regular
  {
    positionId: "POS001",
    positionTitle: "Senior Accountant",
    salaryGrade: "SG-ACCT-3",
    minSalary: 600000,
    maxSalary: 800000,
    employmentType: "Regular",
    typicalDurationDays: null, // indefinite / permanent
    isActive: true,
    createdAt: "2024-01-01 08:00:00",
    updatedAt: "2024-01-15 09:30:00",
  },
  {
    positionId: "POS002",
    positionTitle: "HR Manager",
    salaryGrade: "SG-HR-4",
    minSalary: 800000,
    maxSalary: 1000000,
    employmentType: "Regular",
    typicalDurationDays: null,
    isActive: true,
    createdAt: "2024-02-01 08:00:00",
    updatedAt: "2024-02-10 08:30:00",
  },
  {
    positionId: "POS003",
    positionTitle: "IT Supervisor",
    salaryGrade: "SG-IT-3",
    minSalary: 700000,
    maxSalary: 900000,
    employmentType: "Regular",
    typicalDurationDays: null,
    isActive: true,
    createdAt: "2024-03-05 08:00:00",
    updatedAt: "2024-03-05 08:00:00",
  },
  {
    positionId: "POS004",
    positionTitle: "Warehouse Manager",
    salaryGrade: "SG-WH-2",
    minSalary: 500000,
    maxSalary: 650000,
    employmentType: "Regular",
    typicalDurationDays: null,
    isActive: true,
    createdAt: "2024-03-10 08:00:00",
    updatedAt: "2024-03-10 10:00:00",
  },

  // Contractual
  {
    positionId: "POS005",
    positionTitle: "Project Accountant",
    salaryGrade: null,
    minSalary: 1500,
    maxSalary: 2000,
    employmentType: "Contractual",
    typicalDurationDays: 90, // ~3 months
    isActive: true,
    createdAt: "2024-04-01 08:00:00",
    updatedAt: "2024-04-01 08:00:00",
  },
  {
    positionId: "POS006",
    positionTitle: "Inventory Specialist",
    salaryGrade: null,
    minSalary: 1200,
    maxSalary: 1500,
    employmentType: "Contractual",
    typicalDurationDays: 60, // ~2 months
    isActive: false,
    createdAt: "2024-04-10 08:00:00",
    updatedAt: "2024-05-02 12:00:00",
  },
  {
    positionId: "POS007",
    positionTitle: "System Migration Consultant",
    salaryGrade: null,
    minSalary: 2500,
    maxSalary: 3000,
    employmentType: "Contractual",
    typicalDurationDays: 180, // ~6 months
    isActive: true,
    createdAt: "2024-05-01 08:00:00",
    updatedAt: "2024-05-15 08:00:00",
  },
  {
    positionId: "POS008",
    positionTitle: "Audit Assistant",
    salaryGrade: null,
    minSalary: 1300,
    maxSalary: 1600,
    employmentType: "Contractual",
    typicalDurationDays: 120, // ~4 months
    isActive: true,
    createdAt: "2024-06-01 08:00:00",
    updatedAt: "2024-06-01 08:00:00",
  },
  {
    positionId: "POS009",
    positionTitle: "Data Entry Specialist",
    salaryGrade: null,
    minSalary: 1000,
    maxSalary: 1200,
    employmentType: "Contractual",
    typicalDurationDays: 30, // ~1 month
    isActive: true,
    createdAt: "2024-06-05 09:00:00",
    updatedAt: "2024-06-07 09:30:00",
  },

  // Seasonal
  {
    positionId: "POS010",
    positionTitle: "Holiday Sales Associate",
    salaryGrade: null,
    minSalary: 800,
    maxSalary: 1200,
    employmentType: "Seasonal",
    typicalDurationDays: 21, // 3 weeks
    isActive: true,
    createdAt: "2024-07-01 08:00:00",
    updatedAt: "2024-07-02 09:00:00",
  },
  {
    positionId: "POS011",
    positionTitle: "Tax Season Accountant",
    salaryGrade: null,
    minSalary: 1500,
    maxSalary: 1800,
    employmentType: "Seasonal",
    typicalDurationDays: 28, // 4 weeks
    isActive: true,
    createdAt: "2024-07-10 08:00:00",
    updatedAt: "2024-07-10 08:00:00",
  },
  {
    positionId: "POS012",
    positionTitle: "Summer Intern",
    salaryGrade: null,
    minSalary: 600,
    maxSalary: 800,
    employmentType: "Seasonal",
    typicalDurationDays: 14, // 2 weeks
    isActive: true,
    createdAt: "2024-08-01 08:00:00",
    updatedAt: "2024-08-01 08:00:00",
  },
  {
    positionId: "POS013",
    positionTitle: "Christmas Warehouse Helper",
    salaryGrade: null,
    minSalary: 900,
    maxSalary: 1100,
    employmentType: "Seasonal",
    typicalDurationDays: 20, // ~3 weeks
    isActive: false,
    createdAt: "2024-09-01 08:00:00",
    updatedAt: "2024-09-05 08:00:00",
  },
  {
    positionId: "POS014",
    positionTitle: "New Year Event Staff",
    salaryGrade: null,
    minSalary: 750,
    maxSalary: 950,
    employmentType: "Seasonal",
    typicalDurationDays: 7, // 1 week
    isActive: true,
    createdAt: "2024-10-01 08:00:00",
    updatedAt: "2024-10-02 12:00:00",
  },
];

const Positions = () => {
  const navigate = useNavigate();
  const [data] = useState(initialPositions);

  // Track which row’s "3 dots" menu is open
  const [openIndex, setOpenIndex] = useState(null);
  const toggleMenu = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Called when user clicks "Edit"
  const handleEdit = (posId) => {
    // Example navigation. Adapt as needed for your app:
    navigate(`/positions/edit/${posId}`);
  };

  return (
    <div className="hr-position">
      <div className="hr-position-body-content-container">
        <div className="hr-position-scrollable">
          <div className="hr-position-heading">
            <h2><strong>Positions</strong></h2>

            <div className="hr-position-table-container">
              <table className="hr-position-table">
                <thead>
                  <tr>
                    <th>Position ID</th>
                    <th>Position Title</th>
                    <th>Salary Grade</th>
                    <th>Min Salary</th>
                    <th>Max Salary</th>
                    <th>Employment Type</th>
                    <th>Typical Duration (Days)</th>
                    <th>Is Active</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((pos, index) => (
                    <tr key={index}>
                      <td>{pos.positionId}</td>
                      <td>{pos.positionTitle}</td>
                      <td>{pos.salaryGrade || "—"}</td>
                      <td>{pos.minSalary.toFixed(2)}</td>
                      <td>{pos.maxSalary.toFixed(2)}</td>
                      <td>
                        <span className={`hr-tag ${pos.employmentType.toLowerCase()}`}>
                          {pos.employmentType}
                        </span>
                      </td>
                      <td>
                        {pos.typicalDurationDays ? pos.typicalDurationDays : "—"}
                      </td>
                      <td>
                        <span className={`hr-tag ${pos.isActive ? "active" : "inactive"}`}>
                          {pos.isActive ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>{pos.createdAt}</td>
                      <td>{pos.updatedAt}</td>
                      <td className="hr-position-actions">
                        <div className="hr-position-dots" onClick={() => toggleMenu(index)}>
                          ⋮
                          {openIndex === index && (
                            <div className="hr-position-dropdown">
                              <div
                                className="hr-position-dropdown-item"
                                onClick={() => handleEdit(pos.positionId)}
                              >
                                Edit
                              </div>
                              <div className="hr-position-dropdown-item">Archive</div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Positions;
