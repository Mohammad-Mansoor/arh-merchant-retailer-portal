import apiClient from "./APIClient";

export const createReverseStockByMerchant = async (formData) => {
  return apiClient.post("/reverse-stock/merchant", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getReverseStocksForMerchant = async (params = {}) => {
  const res = await apiClient.get("/reverse-stock/merchant", { params });
  return res.data;
};

export const getDownlineAgents = async () => {
  const res = await apiClient.get("/agent/downline");
  return res.data;
};