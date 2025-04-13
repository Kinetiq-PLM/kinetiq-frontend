import React from 'react';
import "../styles/ManagementProjectMonitoring.css";

function ProjectMonitoring() {
  const projects = [
    { id: 1, name: 'Project A', objectives: 'Objective 1', details: 'Details A', status: 'Terminated' },
    { id: 2, name: 'Project B', objectives: 'Objective 2', details: 'Details B', status: 'Active' },
    { id: 3, name: 'Project C', objectives: 'Objective 3', details: 'Details C', status: 'Updating' },
    { id: 4, name: 'Project D', objectives: 'Objective 4', details: 'Details D', status: 'Active' },
    // Add more projects as needed
  ];

  return (
    <div className="project-monitoring-container">
      <h1 className="project-monitoring-header">Project Monitoring</h1>
      <div className="project-monitoring-search-bar">
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
      <table className="project-monitoring-table">
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
                    project.status === 'Active' ? 'status-active' :
                    project.status === 'Updating' ? 'status-updating' :
                    'status-terminated'
                  }>
                    {project.status}
                  </button>
                  <div className="status-dropdown-content">
                    <a href="#">Active</a>
                    <a href="#">Updating</a>
                    <a href="#">Terminated</a>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="project-monitoring-actions">
        <button className="back">Back</button>
      </div>
    </div>
  );
}

export default ProjectMonitoring;