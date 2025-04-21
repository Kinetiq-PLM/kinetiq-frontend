// src/services/employeeService.js
import axios from 'axios';

const API_URL = 'https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Include cookies for authentication
});

// Get all employees
export const getEmployees = async () => {
  try {
    const response = await apiClient.get('/employees/');
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Get employee by ID
export const getEmployeeById = async (employeeId) => {
  try {
    const response = await apiClient.get(`/employees/${employeeId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee ${employeeId}:`, error);
    throw error;
  }
};

// Create new employee
export const createEmployee = async (employeeData) => {
  try {
    const response = await apiClient.post('/employees/', employeeData);
    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Update employee
export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const response = await apiClient.put(`/employees/${employeeId}/`, employeeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating employee ${employeeId}:`, error);
    throw error;
  }
};

// Delete employee (or set to inactive)
export const deleteEmployee = async (employeeId) => {
  try {
    const response = await apiClient.delete(`/employees/${employeeId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting employee ${employeeId}:`, error);
    throw error;
  }
};

// Get all departments (for dropdown in forms)
export const getDepartments = async () => {
  try {
    const response = await apiClient.get('/departments/');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Get all positions (for dropdown in forms)
export const getPositions = async () => {
  try {
    const response = await apiClient.get('/positions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching positions:', error);
    throw error;
  }
};