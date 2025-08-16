import apiClient from "./APIClient";

export const getCoutries = async () => {
  // const lang = localStorage.getItem("i18nextLng");
  try {
    const params = new URLSearchParams();
    params.append("lang", "en");
    // const res = await apiClient.get(`country?lang=${lang}`);
     const res = await apiClient.get(`/country?${params}`);
    console.log(res, "this is country detail");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getProvincesBaseOnCountry = async (countryId) => {
  // const lang = localStorage.getItem("i18nextLng");

  try {
    // const res = await apiClient.get(
    //   `province?lang=${lang}&countryId=${countryId}`
    // );
     const params = new URLSearchParams();
    if (countryId) params.append("countryId", countryId);
    const res = await apiClient.get(`/province?${params}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getDistrictsBaseOnProvince = async (provinceId) => {
  // const lang = localStorage.getItem("i18nextLng");

  try {
    // const res = await apiClient.get(
    //   `district?lang=${lang}&provinceId=${provinceId}`
    // );
     const params = new URLSearchParams();
    if (provinceId) params.append("provinceId", provinceId);
    const res = await apiClient.get(`/district?${params}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
