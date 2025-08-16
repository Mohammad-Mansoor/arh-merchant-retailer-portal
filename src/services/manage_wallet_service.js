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
export const getStockInOut = async (filter) => {
  const lang = localStorage.getItem("i18nextLng");
  // Create a copy of filter to avoid mutating the original
  const queryParams = {
    ...filter,
    lang: lang
  };
  
  // Remove undefined/null values
  Object.keys(queryParams).forEach(key => {
    if (queryParams[key] === undefined || queryParams[key] === null) {
      delete queryParams[key];
    }
  });

  const queryString = new URLSearchParams(queryParams).toString();
  
  try {
    const res = await apiClient.get(
      `merchant-retailer/stockInOut?${queryString}`
    );
    console.log(res, "getStockInOut");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};