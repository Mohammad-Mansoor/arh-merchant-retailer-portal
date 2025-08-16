import apiClient from "./APIClient";

export const getProducts = async () => {
  try {
    const res = await apiClient.get(`product/admin`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getSingleProducts = async (id) => {
 
  try {
    const res = await apiClient.get(`product/admin/${id}`);
    console.log(res, "this is single product data");
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




export const getProviders = async () => {
  try {
    const lang = localStorage.getItem("i18nextLng");
    const res = await apiClient.get(`companies?lang=${lang}`);
    console.log(res, "this is providers data");
    return res.data?.data;
  } catch (error) {
    console.log("Error fetching providers:", error);
    throw error;
  }
};

export const getProductCategories = async () => {

  try {
    const res = await apiClient.get(`productCategory`);
    console.log(res, "this is product categories data");
    return res.data;
  } catch (error) {
    console.log("Error fetching product categories:", error);
    throw error;
  }
};

export const getProductTypes = async () => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.get(`productTypes`);
    console.log(res, "this is product types data");
    return res.data;
  } catch (error) {
    console.log("Error fetching product types:", error);
    throw error;
  }
};