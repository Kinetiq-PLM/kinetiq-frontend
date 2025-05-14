// src/services/positionService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Get all positions
export const getPositions = async () => {
  try {
    const response = await apiClient.get('/positions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching positions:', error);
    throw error;
  }
};

// Get position by ID
export const getPositionById = async (positionId) => {
  try {
    const response = await apiClient.get(`/positions/${positionId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching position ${positionId}:`, error);
    throw error;
  }
};

// Create new position
export const createPosition = async (positionData) => {
  try {
    const response = await apiClient.post('/positions/', positionData);
    return response.data;
  } catch (error) {
    console.error('Error creating position:', error);
    throw error;
  }
};

// Update position
export const updatePosition = async (positionId, positionData) => {
  try {
    const response = await apiClient.put(`/positions/${positionId}/`, positionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating position ${positionId}:`, error);
    throw error;
  }
};

// Delete position
export const deletePosition = async (positionId) => {
  try {
    const response = await apiClient.delete(`/positions/${positionId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting position ${positionId}:`, error);
    throw error;
  }
};

// Update position status (activate/deactivate)
export const updatePositionStatus = async (positionId, isActive) => {
  try {
    const response = await apiClient.patch(`/positions/${positionId}/`, {
      is_active: isActive
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating position status ${positionId}:`, error);
    throw error;
  }
};