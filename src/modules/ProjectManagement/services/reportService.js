import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const fallbackData = {
  reports: [
    {
      report_monitoring_id: 'RM-001',
      project_id: 'PRJ-0001',
      intrnl_project_id: 'INTPRJ-0001',
      report_type: 'Inventory Movement',
      report_title: 'Actual Cost Analysis – PRJ-2025-0023',
      received_from: 'Department - IT Team',
      date_created: '2025-02-25',
      assigned_to: 'Department - Project Management',
      description: 'This Report Tracks The Weekly Progress Of Ongoing Projects, Including Completed Tasks, Pending Items, And Updated Timelines.'
    }
  ],
  reportTypes: [
    'Inventory Movement',
    'Sales Order',
    'Resource Availability',
    'Bill of Material',
    'Information',
    'Progress Report',
    'Project Details'
  ],
  departments: [
    'Department - IT Team',
    'Department - Project Management',
    'Department - Accounting',
    'Department - Sales',
    'Department - Operations'
  ],
  externalProjects: [
    { project_id: 'PRJ-0001', project_status: 'Active' },
    { project_id: 'PRJ-0002', project_status: 'Active' }
  ],
  internalProjects: [
    { intrnl_project_id: 'INTPRJ-0001', intrnl_project_status: 'Active' },
    { intrnl_project_id: 'INTPRJ-0002', intrnl_project_status: 'Active' }
  ]
};


const apiService = {
  getReports: async () => {
    try {
      const response = await api.get('/reports/');
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      return fallbackData.reports;
    }
  },
  
  getReport: async (id) => {
    try {
      const response = await api.get(`/reports/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching report ${id}:`, error);
      return fallbackData.reports[0];
    }
  },
  
  createReport: async (reportData) => {
    try {
      const response = await api.post('/reports/', reportData);
      return response.data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },
  
  updateReport: async (id, reportData) => {
    try {
      const response = await api.put(`/reports/${id}/`, reportData);
      return response.data;
    } catch (error) {
      console.error(`Error updating report ${id}:`, error);
      throw error;
    }
  },
  
  deleteReport: async (id) => {
    try {
      await api.delete(`/reports/${id}/`);
      return true;
    } catch (error) {
      console.error(`Error deleting report ${id}:`, error);
      throw error;
    }
  },
  
  // Report types
  getReportTypes: async () => {
    try {
      const response = await api.get('/reports/report_types/');
      return response.data;
    } catch (error) {
      console.error('Error fetching report types:', error);
      return fallbackData.reportTypes;
    }
  },
  
  // Departments
  getDepartments: async () => {
    try {
      const response = await api.get('/reports/departments/');
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      return fallbackData.departments;
    }
  },
  
  // Projects
  getExternalProjects: async () => {
    try {
      const response = await api.get('/external-projects/');
      return response.data;
    } catch (error) {
      console.error('Error fetching external projects:', error);
      return fallbackData.externalProjects;
    }
  },
  
  getInternalProjects: async () => {
    try {
      const response = await api.get('/internal-projects/');
      return response.data;
    } catch (error) {
      console.error('Error fetching internal projects:', error);
      return fallbackData.internalProjects;
    }
  }
};

export default apiService;