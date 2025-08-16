import { User, User2, Users, Users2, Users2Icon, Wallet, Wallet2 } from "lucide-react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import {
  getAgentWallets,
} from "../../services/manage_wallet_service";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getDownlineAgents } from "../../services/agent_management_service";
export default function EcommerceMetrics() {
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
  } = useQuery({
    queryKey: ["downlineAgents"],
    queryFn: () => getDownlineAgents(userInfo?.id),
  });
  const agents = data1?.data || [];
  const activeagent = agents.filter(agent => agent?.user?.status === "active").length;
  const inactiveagent = agents.filter(agent => agent?.user?.status === "inactive").length;
  const totalCount = agents.length;


  console.log(totalCount, "this is active agent");

  // const fetchAgent = async () => {
  //   try {
  
  //   }
  // }
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Wallet2 className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
             Main Wallet Balance
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {parseFloat(walletInfo?.primaryWallet?.balance).toFixed(2)} AFG
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>
  
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Wallet2  className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Commission Wallet Balance
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {parseFloat(walletInfo?.comissionWallet?.balance).toFixed(2)} AFG
            </h4>
          </div>

  
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Users  className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Retailers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data1?.meta?.total}
            </h4>
          </div>
          <div className="flex gap-3"> 
  <Badge color="success">
            <ArrowUpIcon />
           {activeagent} Active
          </Badge>
            <Badge color="warning">
            <ArrowDownIcon />
            {inactiveagent} inActive
          </Badge>
  </div>
        </div>
      </div>
    </div>
  );
}
