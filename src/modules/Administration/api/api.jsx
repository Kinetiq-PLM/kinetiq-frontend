// src/modules/Administration/api/api.jsx
import axios from 'axios';
const API_BASE_URL = 'http://localhost:8000/api';
//const API_BASE_URL = 'https://7lthyploub.execute-api.ap-southeast-1.amazonaws.com/dev';

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
  updatePolicy: async (policyId, policyData) => {
    try {
      const response = await api.put(`/policies/${policyId}/`, policyData);
      return response.data;
    } catch (error) {
      console.error('Error updating policy:', error);
      throw error;
    }
  },

  // Get a single policy
  getPolicy: async (policyId) => {
    try {
      const response = await api.get(`/policies/${policyId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching policy:', error);
      throw error;
    }
  },

  // Archive (soft delete) a policy
  archivePolicy: async (policyId) => {
    try {
      const response = await api.delete(`/policies/${policyId}/`);
      return response.data;
    } catch (error) {
      console.error('Error archiving policy:', error);
      throw error;
    }
  },

  // Get archived policies
  getArchivedPolicies: async () => {
    try {
      const response = await api.get('/policies/archived/');
      return response.data;
    } catch (error) {
      console.error('Error fetching archived policies:', error);
      throw error;
    }
  },

  // Restore an archived policy
  restorePolicy: async (policyId) => {
    try {
      const response = await api.patch(`/policies/${policyId}/restore/`);
      return response.data;
    } catch (error) {
      console.error('Error restoring policy:', error);
      throw error;
    }
  },

  // Upload a document to a policy
  uploadPolicyDocument: async (policyId, documentFile) => {
    try {
      const formData = new FormData();
      formData.append('document', documentFile);
      
      const response = await api.post(`/policies/${policyId}/upload_document/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading policy document:', error);
      throw error;
    }
  },

  // Download a policy document
  downloadPolicyDocument: async (policyId) => {
    try {
      const response = await api.get(`/policies/${policyId}/download_document/`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading policy document:', error);
      throw error;
    }
  }
};

// Assets API endpoints
export const assetsAPI = {
  // Get all assets with optional search and ordering
  getAssets: async (params = {}) => {
    try {
      const response = await api.get('/item-master/assets/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },

  // Create a new asset
  createAsset: async (assetData) => {
    try {
      const response = await api.post('/item-master/assets/', assetData);
      return response.data;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  },

  // Update an asset
  updateAsset: async (assetId, assetData) => {
    try {
      const response = await api.put(`/item-master/assets/${assetId}/`, assetData);
      return response.data;
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  },

  // Get a single asset
  getAsset: async (assetId) => {
    try {
      const response = await api.get(`/item-master/assets/${assetId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching asset:', error);
      throw error;
    }
  },

  // Archive (soft delete) an asset
  archiveAsset: async (assetId) => {
    try {
      const response = await api.delete(`/item-master/assets/${assetId}/`);
      return response.data;
    } catch (error) {
      console.error('Error archiving asset:', error);
      throw error;
    }
  },

  // Get archived assets
  getArchivedAssets: async () => {
    try {
      const response = await api.get('/item-master/assets/archived/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching archived assets:', error);
      throw error;
    }
  },

  // Restore an archived asset
  restoreAsset: async (assetId) => {
    try {
      const response = await api.patch(`/item-master/assets/${assetId}/restore/`);
      return response.data;
    } catch (error) {
      console.error('Error restoring asset:', error);
      throw error;
    }
  }
};

// Products API endpoints
export const productsAPI = {
  // Get all products with optional search and ordering
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/item-master/products/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Create a new product
  createProduct: async (productData) => {
    try {
      const response = await api.post('/item-master/products/', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update a product
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/item-master/products/${productId}/`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Get a single product
  getProduct: async (productId) => {
    try {
      const response = await api.get(`/item-master/products/${productId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Archive (soft delete) a product
  archiveProduct: async (productId) => {
    try {
      const response = await api.delete(`/item-master/products/${productId}/`);
      return response.data;
    } catch (error) {
      console.error('Error archiving product:', error);
      throw error;
    }
  },

  // Get archived products
  getArchivedProducts: async () => {
    try {
      const response = await api.get('/item-master/products/archived/', { params }, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching archived products:', error);
      throw error;
    }
  },

  // Restore an archived product
  restoreProduct: async (productId) => {
    try {
      const response = await api.patch(`/item-master/products/${productId}/restore/`);
      return response.data;
    } catch (error) {
      console.error('Error restoring product:', error);
      throw error;
    }
  }
};

// Raw Materials API endpoints
export const rawMaterialsAPI = {
  // Get all raw materials with optional search and ordering
  getRawMaterials: async (params = {}) => {
    try {
      const response = await api.get('/item-master/raw-materials/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching raw materials:', error);
      throw error;
    }
  },

  // Create a new raw material
  createRawMaterial: async (materialData) => {
    try {
      const response = await api.post('/item-master/raw-materials/', materialData);
      return response.data;
    } catch (error) {
      console.error('Error creating raw material:', error);
      throw error;
    }
  },

  // Update a raw material
  updateRawMaterial: async (materialId, materialData) => {
    try {
      const response = await api.put(`/item-master/raw-materials/${materialId}/`, materialData);
      return response.data;
    } catch (error) {
      console.error('Error updating raw material:', error);
      throw error;
    }
  },

  // Get a single raw material
  getRawMaterial: async (materialId) => {
    try {
      const response = await api.get(`/item-master/raw-materials/${materialId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching raw material:', error);
      throw error;
    }
  },

  // Archive (soft delete) a raw material
  archiveRawMaterial: async (materialId) => {
    try {
      const response = await api.delete(`/item-master/raw-materials/${materialId}/`);
      return response.data;
    } catch (error) {
      console.error('Error archiving raw material:', error);
      throw error;
    }
  },

  // Get archived raw materials
  getArchivedRawMaterials: async () => {
    try {
      const response = await api.get('/item-master/raw-materials/archived/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching archived raw materials:', error);
      throw error;
    }
  },

  // Restore an archived raw material
  restoreRawMaterial: async (materialId) => {
    try {
      const response = await api.patch(`/item-master/raw-materials/${materialId}/restore/`);
      return response.data;
    } catch (error) {
      console.error('Error restoring raw material:', error);
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
  getArchivedItems: async () => {
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
      const response = await api.get('/partner-master/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching business partners:', error);
      throw error;
    }
  },

  // Update a business partner
  updateBusinessPartner: async (partnerId, partnerData) => {
    try {
      const response = await api.put(`/partner-master/${partnerId}/`, partnerData);
      return response.data;
    } catch (error) {
      console.error('Error updating business partner:', error);
      throw error;
    }
  },

  // Get a single business partner
  getBusinessPartner: async (partnerId) => {
    try {
      const response = await api.get(`/partner-master/${partnerId}/`);
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
      const response = await api.get('/partner-master/vendors/', { params });
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
  // Get audit logs with optional search and ordering
  getAuditLogs: async (params = {}) => {
    try {
      const response = await api.get('/logs/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },

  // Get a single audit log entry
  getAuditLog: async (logId) => {
    try {
      const response = await api.get(`/logs/${logId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching audit log:', error);
      throw error;
    }
  }
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
      const response = await api.get('/warehouses/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      throw error;
    }
  },

  // Create a new warehouse
  createWarehouse: async (warehouseData) => {
    try {
      const response = await api.post('/warehouses/', warehouseData);
      return response.data;
    } catch (error) {
      console.error('Error creating warehouse:', error);
      throw error;
    }
  },

  // Update a warehouse
  updateWarehouse: async (warehouseId, warehouseData) => {
    try {
      const response = await api.put(`/warehouses/${warehouseId}/`, warehouseData);
      return response.data;
    } catch (error) {
      console.error('Error updating warehouse:', error);
      throw error;
    }
  },

  // Get a single warehouse
  getWarehouse: async (warehouseId) => {
    try {
      const response = await api.get(`/warehouses/${warehouseId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching warehouse:', error);
      throw error;
    }
  },

  // Archive (soft delete) a warehouse
  archiveWarehouse: async (warehouseId) => {
    try {
      const response = await api.delete(`/warehouses/${warehouseId}/`);
      return response.data;
    } catch (error) {
      console.error('Error archiving warehouse:', error);
      throw error;
    }
  },

  // Get archived warehouses
  getArchivedWarehouses: async () => {
    try {
      const response = await api.get('/warehouses/archived/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching archived warehouses:', error);
      throw error;
    }
  },

  // Restore an archived warehouse
  restoreWarehouse: async (warehouseId) => {
    try {
      const response = await api.patch(`/warehouses/${warehouseId}/restore/`);
      return response.data;
    } catch (error) {
      console.error('Error restoring warehouse:', error);
      throw error;
    }
  }
};

export default api;