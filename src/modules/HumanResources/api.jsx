// api.js
const API_BASE_URL = '/api/employees/';

export async function getEmployees() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  return await response.json();
}

export async function getEmployee(employeeId) {
  const response = await fetch(`${API_BASE_URL}${employeeId}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch employee');
  }
  return await response.json();
}

export async function updateEmployee(employeeId, data) {
  const response = await fetch(`${API_BASE_URL}${employeeId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
      // If token authentication is needed, add the Authorization header here
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to update employee');
  }
  return await response.json();
}

export async function deleteEmployee(employeeId) {
  const response = await fetch(`${API_BASE_URL}${employeeId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to delete employee');
  }
  return true;
}
