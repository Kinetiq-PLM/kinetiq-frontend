import axios from 'axios';

const API_URL = '/project-tasks/api';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const logRequest = (method, url, data = null) => {
  console.log(`${method} request to: ${url}`);
  if (data) {
    console.log('Request data:', data);
  }
};

const logResponse = (method, url, response) => {
  console.log(`${method} response from: ${url}`);
  console.log('Response status:', response.status);
  console.log('Response data:', response.data);
  return response.data;
};

const logError = (method, url, error) => {
  console.error(`Error in ${method} request to ${url}:`);
  console.error('Status:', error.response?.status);
  console.error('Data:', error.response?.data);
  console.error('Message:', error.message);
  if (error.config) {
    console.error('Request URL:', error.config.url);
    console.error('Request data:', error.config.data);
  }
  throw error;
};

export const fetchInternalTasks = async () => {
  const url = `${API_URL}/internal-tasks/`;
  try {
    logRequest('GET', url);
    const response = await axios.get(url);
    return logResponse('GET', url, response);
  } catch (error) {
    logError('GET', url, error);
    return []; 
  }
};

export const fetchExternalTasks = async () => {
  const url = `${API_URL}/external-tasks/`;
  try {
    logRequest('GET', url);
    const response = await axios.get(url);
    return logResponse('GET', url, response);
  } catch (error) {
    logError('GET', url, error);
    return []; 
  }
};

export const createInternalTask = async (taskData) => {
  const url = `${API_URL}/internal-tasks/create/`;
  try {
    const formattedData = {
      ProjectID: taskData.ProjectID,
      TaskDescription: taskData.TaskDescription,
      TaskStatus: taskData.TaskStatus,
      Taskdeadline: taskData.Taskdeadline,
      Laborid: taskData.Laborid,
    };
    
    logRequest('POST', url, formattedData);
    const response = await axios.post(url, formattedData);
    return logResponse('POST', url, response);
  } catch (error) {
    logError('POST', url, error);
    
    const errorMessage = error.response?.data?.detail || 'Failed to create task. Please try again.';
    
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    throw enhancedError;
  }
};

export const createExternalTask = async (taskData) => {
  const url = `${API_URL}/external-tasks/create/`;
  try {
    const formattedData = {
      ProjectID: taskData.ProjectID,
      TaskDescription: taskData.TaskDescription,
      TaskStatus: taskData.TaskStatus,
      Taskdeadline: taskData.Taskdeadline,
      Laborid: taskData.Laborid,
    };
    
    logRequest('POST', url, formattedData);
    const response = await axios.post(url, formattedData);
    return logResponse('POST', url, response);
  } catch (error) {
    logError('POST', url, error);
    
    const errorMessage = error.response?.data?.detail || 'Failed to create task. Please try again.';
    
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    throw enhancedError;
  }
};

export const deleteInternalTask = async (taskId) => {
  const url = `${API_URL}/internal-tasks/${taskId}/`;
  try {
    logRequest('DELETE', url);
    const response = await axios.delete(url);
    logResponse('DELETE', url, response);
    return true;
  } catch (error) {
    logError('DELETE', url, error);
    return false; 
  }
};

export const deleteExternalTask = async (taskId) => {
  const url = `${API_URL}/external-tasks/${taskId}/`;
  try {
    logRequest('DELETE', url);
    const response = await axios.delete(url);
    logResponse('DELETE', url, response);
    return true;
  } catch (error) {
    logError('DELETE', url, error);
    return false; 
  }
};

export const getInternalProjects = async () => {
  const url = `${API_URL}/internal-projects/`;
  try {
    logRequest('GET', url);
    const response = await axios.get(url);
    return logResponse('GET', url, response);
  } catch (error) {
    logError('GET', url, error);
    

    console.warn('Using fallback internal projects data');
    return [
      { intrnl_project_id: 'INT-PROJ-001', intrnl_project_name: 'Internal Project 1' },
      { intrnl_project_id: 'INT-PROJ-002', intrnl_project_name: 'Internal Project 2' },
      { intrnl_project_id: 'INT-PROJ-003', intrnl_project_name: 'Internal Project 3' }
    ];
  }
};

export const getExternalProjects = async () => {
  const url = `${API_URL}/external-projects/`;
  try {
    logRequest('GET', url);
    const response = await axios.get(url);
    return logResponse('GET', url, response);
  } catch (error) {
    logError('GET', url, error);
    

    console.warn('Using fallback external projects data');
    return [
      { project_id: 'EXT-PROJ-001', project_name: 'External Project 1' },
      { project_id: 'EXT-PROJ-002', project_name: 'External Project 2' },
      { project_id: 'EXT-PROJ-003', project_name: 'External Project 3' }
    ];
  }
};

export const getInternalLabor = async () => {
  const url = `${API_URL}/internal-labor/`;
  try {
    logRequest('GET', url);
    const response = await axios.get(url);
    return logResponse('GET', url, response);
  } catch (error) {
    logError('GET', url, error);
    
    // Return fallback data if API call fails
    console.warn('Using fallback internal labor data');
    return [
      { intrnl_project_labor_id: 'INT-LAB-001', employee_id: 'EMP-001' },
      { intrnl_project_labor_id: 'INT-LAB-002', employee_id: 'EMP-002' },
      { intrnl_project_labor_id: 'INT-LAB-003', employee_id: 'EMP-003' }
    ];
  }
};

export const getExternalLabor = async () => {
  const url = `${API_URL}/external-labor/`;
  try {
    logRequest('GET', url);
    const response = await axios.get(url);
    return logResponse('GET', url, response);
  } catch (error) {
    logError('GET', url, error);
    

    console.warn('Using fallback external labor data');
    return [
      { project_labor_id: 'EXT-LAB-001', employee_id: 'EMP-001' },
      { project_labor_id: 'EXT-LAB-002', employee_id: 'EMP-002' },
      { project_labor_id: 'EXT-LAB-003', employee_id: 'EMP-003' }
    ];
  }
};


export const checkApiHealth = async () => {
  const url = `${API_URL}/debug-models/`;
  try {
    logRequest('GET', url);
    const response = await axios.get(url);
    logResponse('GET', url, response);
    return {
      status: 'success',
      message: 'API is reachable and working',
      data: response.data
    };
  } catch (error) {
    logError('GET', url, error);
    return {
      status: 'error',
      message: 'API is not reachable or has an error',
      error: error.message
    };
  }
};