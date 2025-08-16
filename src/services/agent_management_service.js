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