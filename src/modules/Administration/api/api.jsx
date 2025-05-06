// src/modules/Administration/api/api.jsx
import axios from 'axios';
//const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = 'https://7lthyploub.execute-api.ap-southeast-1.amazonaws.com/dev/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API endpoints
export const userAPI = {
  // Get all users with optional search and ordering
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/manage/users/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/manage/users/', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update a user
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/manage/users/${userId}/`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Get a single user
  getUser: async (userId) => {
    try {
      const response = await api.get(`/manage/users/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
};

// Role and Permission API endpoints
export const roleAPI = {
  // Get all roles with optional search and ordering
  getRoles: async (params = {}) => {
    try {
      const response = await api.get('/manage/roles/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  // Create a new role
  createRole: async (roleData) => {
    try {
      const response = await api.post('/manage/roles/', roleData);
      return response.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  // Update a role
  updateRole: async (roleId, roleData) => {
    try {
      const response = await api.put(`/manage/roles/${roleId}/`, roleData);
      return response.data;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  // Get a single role
  getRole: async (roleId) => {
    try {
      const response = await api.get(`/manage/roles/${roleId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  },

  // Archive (soft delete) a role
  archiveRole: async (roleId) => {
    try {
      const response = await api.delete(`/manage/roles/${roleId}/`);
      return response.data;
    } catch (error) {
      console.error('Error archiving role:', error);
      throw error;
    }
  },

  // Get archived roles
  getArchivedRoles: async (params = {}) => {
    try {
      const response = await api.get('/manage/roles/archived/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching archived roles:', error);
      throw error;
    }
  },

  // Restore an archived role
  restoreRole: async (roleId) => {
    try {
      const response = await api.patch(`/manage/roles/${roleId}/restore/`);
      return response.data;
    } catch (error) {
      console.error('Error restoring role:', error);
      throw error;
    }
  },
};

// Policies API endpoints
export const policiesAPI = {
  // Get all policies with optional search and ordering
  getPolicies: async (params = {}) => {
    try {
      const response = await api.get('/policies/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching policies:', error);
      throw error;
    }
  },

  // Get a specific policy by ID
  getPolicy: async (id) => {
    try {
      const response = await api.get(`/policies/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching policy ${id}:`, error);
      throw error;
    }
  },

  // Create a new policy
  createPolicy: async (policyData) => {
    try {
      const response = await api.post('/policies/', policyData);
      return response.data;
    } catch (error) {
      console.error('Error creating policy:', error);
      throw error;
    }
  },

  // Update a policy
  updatePolicy: async (id, policyData) => {
    try {
      const response = await api.put(`/policies/${id}/`, policyData);
      return response.data;
    } catch (error) {
      console.error(`Error updating policy ${id}:`, error);
      throw error;
    }
  },

  // Partial update a policy
  patchPolicy: async (id, policyData) => {
    try {
      const response = await api.patch(`/policies/${id}/`, policyData);
      return response.data;
    } catch (error) {
      console.error(`Error patching policy ${id}:`, error);
      throw error;
    }
  },

  // Delete (archive) a policy
  deletePolicy: async (id) => {
    try {
      const response = await api.delete(`/policies/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting policy ${id}:`, error);
      throw error;
    }
  },

  // Fixed uploadPolicyDocument API function
  uploadPolicyDocument: async (id, file) => {
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);
      
      // Log the file being uploaded for debugging
      console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`);
      
      const response = await api.post(`/policies/${id}/upload_document/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Don't set the boundary - let the browser set it automatically
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading document to policy ${id}:`, error);
      console.error("Response data:", error.response?.data);
      throw error;
    }
  },

  // Get archived policies
  getArchivedPolicies: async (params = {}) => {
    try {
      const response = await api.get('/policies/archived/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching archived policies:', error);
      throw error;
    }
  },

  // Restore an archived policy
  restorePolicy: async (id) => {
    try {
      const response = await api.patch(`/policies/${id}/restore/`);
      return response.data;
    } catch (error) {
      console.error(`Error restoring policy ${id}:`, error);
      throw error;
    }
  }
};

// Item Master Data API endpoints
export const itemMasterDataAPI = {
  // Get all items with optional search and ordering
  getItems: async (params = {}) => {
    try {
      const response = await api.get('/item-master/item-master/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },

  // Create a new item
  createItem: async (itemData) => {
    try {
      const response = await api.post('/item-master/item-master/', itemData);
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }

  },


  // Update an item
  updateItem: async (itemId, itemData) => {
    try {
      const response = await api.put(`/item-master/item-master/${itemId}/`, itemData);
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  // Get a single item
  getItem: async (itemId) => {
    try {
      const response = await api.get(`/item-master/item-master/${itemId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  },

  // Archive (soft delete) an item
  archiveItem: async (itemId) => {
    try {
      const response = await api.delete(`/item-master/item-master/${itemId}/`);
      return response.data;
    } catch (error) {
      console.error('Error archiving item:', error);
      throw error;
    }
  },

  // Get archived item-master
  getArchivedItems: async (params = {}) => {
    try {
      const response = await api.get('/item-master/item-master/archived/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching archived items:', error);
      throw error;
    }
  },

  // Restore an archived item
  restoreItem: async (itemId) => {
    try {
      const response = await api.patch(`/item_master/item-master/${itemId}/restore/`);
      return response.data;
    } catch (error) {
      console.error('Error restoring item:', error);
      throw error;
    }
  }
};

// Business Partner Master List API endpoints
export const businessPartnerAPI = {
  // Get all business partners with optional search and ordering
  getBusinessPartners: async (params = {}) => {
    try {
      const response = await api.get('/partner-master/partners/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching business partners:', error);
      throw error;
    }
  },

  // Update a business partner
  updateBusinessPartner: async (partnerId, partnerData) => {
    try {
      const response = await api.put(`/partner-master/partners/${partnerId}/`, partnerData);
      return response.data;
    } catch (error) {
      console.error('Error updating business partner:', error);
      throw error;
    }
  },

  // Get a single business partner
  getBusinessPartner: async (partnerId) => {
    try {
      const response = await api.get(`/partner-master/partners/${partnerId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching business partner:', error);
      throw error;
    }
  }
};

// Vendor API endpoints
export const vendorAPI = {
  // Get all vendors with optional search and ordering
  getVendors: async (params = {}) => {
    try {
      const response = await api.get('/item-master/vendor/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },

  // Update a vendor
  updateVendor: async (vendorId, vendorData) => {
    try {
      const response = await api.put(`/partner-master/vendors/${vendorId}/`, vendorData);
      return response.data;
    } catch (error) {
      console.error('Error updating vendor:', error);
      throw error;
    }
  },

  // Get a single vendor
  getVendor: async (vendorId) => {
    try {
      const response = await api.get(`/partner-master/vendors/${vendorId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor:', error);
      throw error;
    }
  }
};

// Audit Log API endpoints
export const auditLogAPI = {
  // Get all audit logs with optional search and ordering
  getAuditLogs: async (params = {}) => {
    try {
      const response = await api.get('/logs/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },
  
  // Get recent audit logs (last 24 hours)
  getRecentAuditLogs: async (params = {}) => {
    try {
      const response = await api.get('/logs/recent/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent audit logs:', error);
      throw error;
    }
  },
  
  // Get audit logs by date range
  getAuditLogsByDateRange: async (startDate, endDate, params = {}) => {
    try {
      const queryParams = { 
        ...params, 
        start_date: startDate, 
        end_date: endDate 
      };
      const response = await api.get('/logs/', { params: queryParams });
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs by date range:', error);
      throw error;
    }
  },
  
  // Get audit logs summary (count by action type)
  getAuditLogsSummary: async () => {
    try {
      const response = await api.get('/logs/summary/');
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs summary:', error);
      throw error;
    }
  },
  
  // Filter audit logs by user
  getAuditLogsByUser: async (userId, params = {}) => {
    try {
      const queryParams = { ...params, user_id: userId };
      const response = await api.get('/logs/', { params: queryParams });
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs by user:', error);
      throw error;
    }
  },
  
  // Filter audit logs by action type
  getAuditLogsByAction: async (actionType, params = {}) => {
    try {
      const queryParams = { ...params, action_type: actionType };
      const response = await api.get('/logs/', { params: queryParams });
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs by action:', error);
      throw error;
    }
  }
};

// Notifications API endpoints
export const notificationsAPI = {
  // Get audit logs with optional search and ordering
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/notifications/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },
};

// Currency API endpoints
export const currencyAPI = {
  // Get all currencies with optional filtering
  getCurrencies: async (params = {}) => {
    try {
      const response = await api.get('/currencies/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      throw error;
    }
  },

  // Get active currencies
  getActiveCurrencies: async () => {
    try {
      const response = await api.get('/currencies/active/');
      return response.data;
    } catch (error) {
      console.error('Error fetching active currencies:', error);
      throw error;
    }
  },

  // Update exchange rates
  updateExchangeRates: async () => {
    try {
      const response = await api.post('/currencies/update_rates/');
      return response.data;
    } catch (error) {
      console.error('Error updating exchange rates:', error);
      throw error;
    }
  }
};

// Warehouse API endpoints
export const warehouseAPI = {
  // Get all warehouses with optional search and ordering
  getWarehouses: async (params = {}) => {
    try {
      const response = await api.get('/warehouse/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      throw error;
    }
  },

  // Create a new warehouse
  createWarehouse: async (warehouseData) => {
    try {
      const response = await api.post('/warehouse/', warehouseData);
      return response.data;
    } catch (error) {
      console.error('Error creating warehouse:', error);
      throw error;
    }
  },

  // Update a warehouse
  updateWarehouse: async (warehouseId, warehouseData) => {
    try {
      const response = await api.put(`/warehouse/${warehouseId}/`, warehouseData);
      return response.data;
    } catch (error) {
      console.error('Error updating warehouse:', error);
      throw error;
    }
  },

  // Get a single warehouse
  getWarehouse: async (warehouseId) => {
    try {
      const response = await api.get(`/warehouse/${warehouseId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching warehouse:', error);
      throw error;
    }
  },

  // Archive (soft delete) a warehouse
  archiveWarehouse: async (warehouseId) => {
    try {
      const response = await api.delete(`/warehouse/${warehouseId}/`);
      return response.data;
    } catch (error) {
      console.error('Error archiving warehouse:', error);
      throw error;
    }
  },

  // Get archived warehouses
  getArchivedWarehouses: async (params = {}) => {
    try {
      const response = await api.get('/warehouse/archived/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching archived warehouses:', error);
      throw error;
    }
  },

  // Restore an archived warehouse
  restoreWarehouse: async (warehouseId) => {
    try {
      const response = await api.patch(`/warehouse/${warehouseId}/restore/`);
      return response.data;
    } catch (error) {
      console.error('Error restoring warehouse:', error);
      throw error;
    }
  }
};

export default api;