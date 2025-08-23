import apiClient from "./APIClient";

export const signIn = async (payload) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.post(`login?lang=${lang}`, payload);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const startAuth = async (payload) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.post(`customer/request-otp?lang=${lang}`, payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const generateOtp = async (payload) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.post(`login/otp/generate?lang=${lang}`, payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const verifyOtp = async (payload) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.post(`login/otp/verify?lang=${lang}`, payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserInfo = async () => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.get(`profile/?lang=${lang}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};