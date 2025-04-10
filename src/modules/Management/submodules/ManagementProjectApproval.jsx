import React from 'react';
import "../styles/ManagementProjectApproval.css";


function ProjectApproval() {
  const projects = [
    { id: 1, name: 'Project A', objectives: 'Objective 1', details: 'Details A', status: 'Approved' },
    { id: 2, name: 'Project B', objectives: 'Objective 2', details: 'Details B', status: 'Approved' },
    { id: 3, name: 'Project C', objectives: 'Objective 3', details: 'Details C', status: 'Pending' },
    { id: 4, name: 'Project D', objectives: 'Objective 4', details: 'Details D', status: 'Approved' },
    { id: 5, name: 'Project E', objectives: 'Objective 5', details: 'Details E', status: 'Denied' },
    // Add more projects as needed
  ];


  return (
    <div className="project-approval-container">
      <h1 className="project-approval-header">Project Approval</h1>
      <div className="project-approval-search-bar">
        <input type="text" placeholder="Search ID..." />
        <select>
          <option value="last-30">Last 30 Days</option>
          {/* Add more filter options */}
        </select>
        <select>
          <option value="filter-by">Filter By...</option>
          {/* Add more filter options */}
        </select>
      </div>
      <div className="project-approval-table-scroll">
        <table className="project-approval-table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Objectives</th>
              <th>Details</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.objectives}</td>
                <td>{project.details}</td>
                <td>
                  <div className="status-dropdown">
                    <button className={
                      project.status === 'Approved' ? 'status-approved' :
                      project.status === 'Pending' ? 'status-pending' :
                      'status-denied'
                    }>
                      {project.status}
                    </button>
                    <div className="status-dropdown-content">
                      <a href="#">Approved</a>
                      <a href="#">Pending</a>
                      <a href="#">Denied</a>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="project-approval-actions">
        <button className="back">Back</button>
        <button className="monitoring">Monitoring</button>
      </div>
    </div>
  );
}


export default ProjectApproval;
