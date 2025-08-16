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
