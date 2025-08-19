import apiClient from "./APIClient";

export const createDownlineAgent = async (payload) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.post(
      `merchant-downlineAgent?lang=${lang}`,
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getDownlineAgents = async (parentUserId) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.get(
      `merchant-downlineAgent/${parentUserId}?lang=${lang}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Update getAgentById function
export const getAgentById = async (id) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.get(
      `merchant-downlineAgent/agent/${id}?lang=${lang}`
    );
    console.log(res, "this is res data")
    return res.data?.data;
  } catch (error) {
    throw error;
  }
};
export const updateAgentDetails = async (id, payload) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.patch(
      `merchant-downlineAgent/${id}?lang=${lang}`,
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};


export const signUpAgent = async (payload) => {
  const lang = localStorage.getItem("i18nextLng");
  
  try {
    const formData = new FormData();
    


    formData.append('email', payload.email);
    formData.append('mobileNumber', payload.mobileNumber);
    formData.append('alternativeContact', payload.alternativeContact || '');
    formData.append('country', payload.country);
    formData.append('province', payload.province);
    formData.append('district', payload.district);
    formData.append('address', payload.address);
    formData.append('messageLanguage', payload.messageLanguage);
    formData.append('status', payload.status || 'active');
    formData.append('accountType', payload.accountType || 'merchant');
    formData.append('registrationType', payload.registrationType || 'direct');
    formData.append('username', payload.username || `${payload.firstName} ${payload.lastName}`);
    formData.append('user_type', payload.user_type || 'agent');
    formData.append('permissions', JSON.stringify(payload.permissions || []));
    
   
    if (payload.profile_picture) {
 
      if (payload.profile_picture.startsWith('data:')) {
        const blob = await fetch(payload.profile_picture).then(r => r.blob());
        formData.append('file', blob, 'profile.jpg');
      } else {
        // If it's already a File object
        formData.append('file', payload.profile_picture);
      }
    }

    const res = await apiClient.post(
      `merchant1/sign-up?lang=${lang}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDownlineAgent = async (id) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.delete(
      `merchant-downlineAgent/${id}?lang=${lang}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};