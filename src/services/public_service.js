import apiClient from "./APIClient";

export const getCoutries = async () => {
  const lang = localStorage.getItem("i18nextLng");

  try {
    const res = await apiClient.get(`country?lang=${lang}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getProvincesBaseOnCountry = async (countryId) => {
  const lang = localStorage.getItem("i18nextLng");

  try {
    const res = await apiClient.get(
      `province?lang=${lang}&countryId=${countryId}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getDistrictsBaseOnProvince = async (provinceId) => {
  const lang = localStorage.getItem("i18nextLng");

  try {
    const res = await apiClient.get(
      `district?lang=${lang}&provinceId=${provinceId}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
