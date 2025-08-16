import apiClient from "./APIClient";

export const getAllStockTransferToDownlineAgents = async (filter) => {
  const lang = localStorage.getItem("i18nextLng");
  filter.lang = lang;
  const queryString = new URLSearchParams(filter).toString();
  try {
    const res = await apiClient.get(`transferStock-toDownline?${queryString}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getSingleStockTransferToDownlineAgent = async (id) => {
  const lang = localStorage.getItem("i18nextLng");

  try {
    const res = await apiClient.get(
      `transferStock-toDownline/${id}?lang=${lang}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const transferStockToDownlineAgent = async (payload) => {
  const lang = localStorage.getItem("i18nextLng");

  try {
    const res = await apiClient.post(`transferStock-toDownline`, payload);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getDownlineAgentsBaseOnParentAgent = async (filter) => {
  const lang = localStorage.getItem("i18nextLng");
  const queryString = new URLSearchParams({ ...filter, lang }).toString();
  try {
    const res = await apiClient.get(
      `transferStock-toDownline/users?${queryString}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getChildAgents = async (filter) => {
  const lang = localStorage.getItem("i18nextLng");
  let queryString;
  if (Object.keys(filter).length > 0) {
    queryString = new URLSearchParams({ ...filter, lang }).toString();
  } else {
    queryString.lang = lang;
  }
  try {
    const res = await apiClient.get(
      `merchant-downlineAgent/childAgents?${queryString}`
    );
    console.log(res, "this is child agents");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getSinglAgentDetails = async (id) => {
  const lang = localStorage.getItem("i18nextLng");

  try {
    const res = await apiClient.get(`agents/${id}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
