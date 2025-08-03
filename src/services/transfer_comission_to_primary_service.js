import apiClient from "./APIClient";

export const transferToPrimaryWallet = async (id, payload) => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.post(
      `wallet/transferApiToMainWallet/${id}?lang=${lang}`,
      payload
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getTransferCommissionToPrimaryLog = async () => {
  const lang = localStorage.getItem("i18nextLng");
  try {
    const res = await apiClient.get(`comission-toPrimay?lang=${lang}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
