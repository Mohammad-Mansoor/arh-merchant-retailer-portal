
import { useSelector } from "react-redux";

export const useAccountType = () => {
  const userInfo = useSelector((state) => state.auth.user);
  return userInfo?.agentDetail?.accountType || "merchant"; // default to retailer if not specified
};