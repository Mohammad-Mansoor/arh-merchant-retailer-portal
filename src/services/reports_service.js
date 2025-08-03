import apiClient from "./APIClient";

export const getStockInOutReport = async (filter) => {
  const lang = localStorage.getItem("i18nextLng");
  filter.lang = lang;
  const queryString = new URLSearchParams(filter).toString();
  try {
    const res = await apiClient.get(
      `merchant-reports/stockinOut?${queryString}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getDownlineStockInOutReport = async (filter) => {
  const lang = localStorage.getItem("i18nextLng");
  filter.lang = lang;
  const queryString = new URLSearchParams(filter).toString();
  try {
    const res = await apiClient.get(
      `merchant-reports/downline-stockinOut?${queryString}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getProductActivationReport = async (filter) => {
  const lang = localStorage.getItem("i18nextLng");
  filter.lang = lang;
  const queryString = new URLSearchParams(filter).toString();
  try {
    const res = await apiClient.get(
      `merchant-reports/productActivation?${queryString}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getRechargeLogReport = async (filter) => {
  const lang = localStorage.getItem("i18nextLng");
  filter.lang = lang;
  const queryString = new URLSearchParams(filter).toString();
  try {
    const res = await apiClient.get(
      `merchant-reports/rechargeLog?${queryString}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getDownlineProductActivationReport = async (filter) => {
  const lang = localStorage.getItem("i18nextLng");
  filter.lang = lang;
  const queryString = new URLSearchParams(filter).toString();
  try {
    const res = await apiClient.get(
      `merchant-reports/downline-productActivation-report?${queryString}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getDownlineRechargeLogReport = async (filter) => {
  const lang = localStorage.getItem("i18nextLng");
  filter.lang = lang;
  const queryString = new URLSearchParams(filter).toString();
  try {
    const res = await apiClient.get(
      `merchant-reports/downline-RechargeLog-report?${queryString}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
