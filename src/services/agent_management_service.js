import apiClient from "./APIClient";
export const createDownlineAgent = async (payload) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.post(
      `merchant-downlineAgent?lang=${lang}`,
      payload
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getDownlineAgents = async (parentUserId) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.get(
      `merchant-downlineAgent/${parentUserId}?lang=${lang}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
