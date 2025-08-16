import apiClient from "./APIClient";

export const createPurchaseRequest = async (data, files) => {
  const formData = new FormData();
  
  // Append files
  files.forEach(file => {
    formData.append('attachments', file);
  });

  // Add customer_id field for merchant requests
  formData.append('customer_id', data.customer_id);
  
  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'customer_id') {
      formData.append(key, value);
    }
  });

  try {
    const response = await apiClient.post('/salesRequest/purchase-request', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPurchaseRequests = async (params = {}) => {
  try {
    const response = await apiClient.get('/purchase-request/merchant-request', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getSalesRequestDetails = async (id) => {
  try {
    const response = await apiClient.get(`/salesRequest/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const removeAttachment = async (id, imgName) => {
  try {
    const response = await apiClient.patch(`/salesRequest/removeAttachment/${id}`, { imgName });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};