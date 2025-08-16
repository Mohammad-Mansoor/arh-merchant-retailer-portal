import apiClient from "./APIClient";

export const getStatementReport = async (filter) => {
  const queryString = new URLSearchParams(filter).toString();
  try {
    const res = await apiClient.get(
      `/statement/report?${queryString}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching statement report:", error);
    throw error;
  }
};