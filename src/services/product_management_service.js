import apiClient from "./APIClient";

export const getProducts = async () => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.get(`product/admin?lang=${lang}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getSingleProducts = async (id) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.get(`product/admin/${id}?lang=${lang}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const activateProduct = async (payload) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.post(
      `product-activation?lang=${lang}`,
      payload
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const recharge = async (payload) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.post(
      `product-activation/recharge?lang=${lang}`,
      payload
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getAllRechargeLogs = async (agentId) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.get(
      `product-activation/get-rechargeLogs?lang=${lang}&agentId=${agentId}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
