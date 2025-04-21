// listService.js
import axios from 'axios';

// Create a more robust axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Better error logging
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout: The server took too long to respond.');
    } else if (error.response) {
      console.error(`API Error: Server responded with status ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('API Error: No response received from server');
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Helper function to extract data from response (handles pagination)
const extractData = (response) => {
  // Check if response has pagination format
  if (response.data && response.data.hasOwnProperty('results')) {
    return response.data.results;
  }
  // If not paginated, return the data directly
  return response.data;
};

// Improved service with better error handling
const listService = {
  // External project methods
  getExternalProjects: async () => {
    console.log('Fetching external projects...');
    try {
      const response = await api.get('/api/project-management/external-details/');
      const data = extractData(response);
      console.log(`Received ${data.length} external projects`);
      return { data };
    } catch (error) {
      console.error('Failed to fetch external projects:', error.message);
      throw error;
    }
  },
  
  getExternalLabor: async () => {
    console.log('Fetching external labor...');
    try {
      const response = await api.get('/api/project-management/external-labor/');
      const data = extractData(response);
      console.log(`Received ${data.length} external labor records`);
      return { data };
    } catch (error) {
      console.error('Failed to fetch external labor:', error.message);
      throw error;
    }
  },
  
  getInternalProjectsDetailed: async () => {
    console.log('Fetching internal project details...');
    try {
      const response = await api.get('/api/project-management/internal-details/detailed/');
      const data = extractData(response);
      console.log(`Received ${data.length} internal project details`);
      return { data };
    } catch (error) {
      console.error('Failed to fetch internal details:', error.message);
      throw error;
    }
  },
  
  getExternalProjectsDetailed: async () => {
    console.log('Fetching external project details...');
    try {
      const response = await api.get('/api/project-management/external-details/detailed/');
      const data = extractData(response);
      console.log(`Received ${data.length} external project details`);
      return { data };
    } catch (error) {
      console.error('Failed to fetch external details:', error.message);
      throw error;
    }
  },
  
  // Delete methods
  deleteExternalProjects: async (ids) => {
    console.log(`Deleting ${ids.length} external projects...`);
    try {
      const response = await api.post('/api/project-management/external-details/bulk_delete/', { ids });
      console.log('Successfully deleted external projects');
      return response;
    } catch (error) {
      console.error('Failed to delete external projects:', error.message);
      throw error;
    }
  },
  
  deleteExternalLabor: async (ids) => {
    console.log(`Deleting ${ids.length} external labor records...`);
    try {
      const response = await api.post('/api/project-management/external-labor/bulk_delete/', { ids });
      console.log('Successfully deleted external labor records');
      return response;
    } catch (error) {
      console.error('Failed to delete external labor:', error.message);
      throw error;
    }
  }
};

export default listService;