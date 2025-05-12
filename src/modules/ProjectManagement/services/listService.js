
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://c95i46nr4l.execute-api.ap-southeast-1.amazonaws.com/dev',
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});


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


const extractData = (response) => {
  
  if (response.data && response.data.hasOwnProperty('results')) {
    return response.data.results;
  }
  
  return response.data;
};

const getInternalProjectsWithDeptId = () => {
  return axios.get('/api/internal-project-requests/with_dept_id/');
};



const listService = {
  
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
  
  
  getInternalProjects: async () => {
    console.log('Fetching internal projects...');
    try {
      
      try {
        const response = await api.get('/api/project-management/internal-details/');
        const data = extractData(response);
        console.log(`Received ${data.length} internal projects`);
        return { data };
      } catch (err) {
        
        console.log('Falling back to internal-requests...');
        const response = await api.get('/api/project-management/internal-requests/');
        const data = extractData(response);
        console.log(`Received ${data.length} internal requests`);
        return { data };
      }
    } catch (error) {
      console.error('Failed to fetch internal projects:', error.message);
      throw error;
    }
  },
  
  
  getInternalProjectsDetailed: async () => {
    console.log('Fetching internal project details with related data...');
    try {
      const response = await api.get('/api/project-management/internal-details/detailed/');
      const data = extractData(response);
      console.log(`Received ${data.length} detailed internal project records`);
      return { data };
    } catch (error) {
      console.error('Failed to fetch internal details:', error.message);
      throw error;
    }
  },
  
  getExternalProjectsDetailed: async () => {
    console.log('Fetching external project details with related data...');
    try {
      const response = await api.get('/api/project-management/external-details/detailed/');
      const data = extractData(response);
      console.log(`Received ${data.length} detailed external project records`);
      return { data };
    } catch (error) {
      console.error('Failed to fetch external details:', error.message);
      throw error;
    }
  }
};

export default listService;