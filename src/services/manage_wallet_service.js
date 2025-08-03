import apiClient from "./APIClient";

export const getAgentWallets = async (id) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.get(
      `merchant-retailer/getAgentWallets/${id}?lang=${lang}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getStockInOut = async (id) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.get(
      `merchant-retailer/stockInOut?lang=${lang}`
    );
    console.log(res, "getStockInOut");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
