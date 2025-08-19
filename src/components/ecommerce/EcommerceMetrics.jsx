import { Users, Wallet2 } from "lucide-react";
import { ArrowDownIcon, ArrowUpIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { getAgentWallets } from "../../services/manage_wallet_service";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getDownlineAgents } from "../../services/agent_management_service";
import { useTranslation } from "react-i18next";

function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#CD0202] dark:border-white"></div>
    </div>
  );
}

export default function EcommerceMetrics() {
  const { t } = useTranslation();
  const userInfo = useSelector((state) => state.auth.user);
  
  const {
    data: walletInfo,
    isLoading: loadingWallets,
  } = useQuery({
    queryKey: ["walletsInfo"],
    queryFn: () => getAgentWallets(userInfo?.id),
  });
  
  const {
    data: data1,
    isLoading: loadingAgents,
  } = useQuery({
    queryKey: ["downlineAgents"],
    queryFn: () => getDownlineAgents(userInfo?.id),
  });
  
  const agents = data1?.data || [];
  const activeagent = agents.filter(agent => agent?.user?.status === "active").length;
  const inactiveagent = agents.filter(agent => agent?.user?.status === "inactive").length;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Wallet2 className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("ecommerceMetrics.mainWallet")}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 min-h-[28px] flex items-center">
              {loadingWallets ? (
                <Spinner />
              ) : (
                `${parseFloat(walletInfo?.primaryWallet?.balance || 0).toFixed(2)} ${t("common3.currency")}`
              )}
            </h4>
          </div>
        </div>
      </div>
  

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Wallet2 className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("ecommerceMetrics.commissionWallet")}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 min-h-[28px] flex items-center">
              {loadingWallets ? (
                <Spinner />
              ) : (
                `${parseFloat(walletInfo?.comissionWallet?.balance || 0).toFixed(2)} ${t("common3.currency")}`
              )}
            </h4>
          </div>
        </div>
      </div>
      

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Users className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("ecommerceMetrics.totalRetailers")}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 min-h-[28px] flex items-center">
              {loadingAgents ? <Spinner /> : data1?.meta?.total}
            </h4>
          </div>
          <div className="flex gap-3"> 
            <Badge color="success">
              <ArrowUpIcon />
              {loadingAgents ? <Spinner /> : `${activeagent} ${t("ecommerceMetrics.active")}`}
            </Badge>
            <Badge color="warning">
              <ArrowDownIcon />
              {loadingAgents ? <Spinner /> : `${inactiveagent} ${t("ecommerceMetrics.inactive")}`}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}