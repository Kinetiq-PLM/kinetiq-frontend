export const generateUniqueId = (prefix) => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  export const validateForm = (formData, requiredFields) => {
    const errors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = `${field} is required`;
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };