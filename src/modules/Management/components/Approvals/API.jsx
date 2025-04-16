const API_URL = 'http://127.0.0.1:8000/admin/management_approvals/managementapproval/approvals/';
// This URL should point to the correct endpoint for fetching approvals

export const approvalService = {
  async fetchAll() {
    const response = await fetch(`${API_URL}/`);
    if (!response.ok) throw new Error('Failed to fetch approvals');
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/${id}/`);
    if (!response.ok) throw new Error('Failed to fetch approval');
    return response.json();
  },

  async create(data) {
    const response = await fetch(`${API_URL}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create approval');
    return response.json();
  },

  async update(id, data) {
    const response = await fetch(`${API_URL}/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update approval');
    return response.json();
  }
};