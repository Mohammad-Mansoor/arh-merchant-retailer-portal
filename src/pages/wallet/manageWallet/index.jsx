import { Wallet, Search, ListFilter } from "lucide-react";
import WalletReportTable from "./components/table";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getAgentWallets,
  getStockInOut,
} from "../../../services/manage_wallet_service.js";
import { useSelector } from "react-redux";
import { handleSetSearch } from "../../../utils/searchDebouncing.js";
function ManageWallet() {
  const userInfo = useSelector((state) => state.auth.user);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [states, setStates] = useState({
    refetchTableData: false,
  });
  const searchRef = useRef(null);

  const {
    data: walletInfo,
    isLoading: loadingWallets,
    isError,
    error,
  } = useQuery({
    queryKey: ["walletsInfo"],
    queryFn: () => getAgentWallets(userInfo?.id),
  });
  const {
    data: stockInOutData,
    isLoading: loadingStockInOut,
    isError: isStockInOutError,
    error: stockInOutError,
  } = useQuery({
    queryKey: ["getStockInOut", states.refetchTableData, limit, search, page],
    queryFn: () => getStockInOut(userInfo?.id),
  });

  return (
    <div className="w-full px-5 py-4 min-h-screen h-auto bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
      {/* wallet info Cards Section */}
      <div className="w-full flex items-center justify-between gap-5">
        <div className=" dark:text-white dark:bg-slate-800 w-full py-3 px-3 rounded-md md:py-5 md:px-5 shadow-md hover:scale-101 transition-all duration-300 bg-white flex items-center justify-between">
          {loadingWallets ? (
            <div className="w-full flex items-center justify-center min-h-[42px]">
              <CircularProgress size={24} />
            </div>
          ) : (
            <>
              {" "}
              <div className="flex  items-center justify-start gap-4">
                <div className="flex items-center justify-start gap-8">
                  <div className="flex items-center justify-start text-red-500 ">
                    <Wallet />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-[16px] text-[#1d1d1d] dark:text-gray-200">
                      Comission Wallet
                    </h4>
                    <p className="text-[12px] text-[#646464] dark:text-gray-400">
                      {walletInfo?.primaryWallet?.wallet_id}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <h3>{walletInfo?.primaryWallet?.balance} AFG</h3>
              </div>
            </>
          )}
        </div>
        <div className=" dark:text-white dark:bg-slate-800 w-full py-3 px-3 rounded-md md:py-5 md:px-5 shadow-md hover:scale-101 transition-all duration-300 bg-white flex items-center justify-between">
          {loadingWallets ? (
            <div className="w-full flex items-center justify-center min-h-[42px]">
              <CircularProgress size={24} />
            </div>
          ) : (
            <>
              {" "}
              <div className="flex  items-center justify-start gap-4">
                <div className="flex items-center justify-start gap-8">
                  <div className="flex items-center justify-start text-red-500 ">
                    <Wallet />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-[16px] text-[#1d1d1d] dark:text-gray-200">
                      Comission Wallet
                    </h4>
                    <p className="text-[12px] text-[#646464] dark:text-gray-400">
                      {walletInfo?.comissionWallet?.wallet_id}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <h3>{walletInfo?.comissionWallet?.balance} AFG</h3>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search and filter section */}
      <div className="w-full flex items-center justify-start gap-5 mt-10">
        <div className="max-w-[371px] w-[80%] h-[44px] relative bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800 rounded-md border border-[#E4E7EC] dark:border-gray-500 ">
          <input
            onChange={(e) =>
              handleSetSearch(setSearch, e.target.value, searchRef)
            }
            type="text"
            placeholder="Search..."
            className="bg-transparent dark:placeholder-gray-200 h-full pl-10  transition-all duration-300  absolute left-0 top-0 px-3 py-2 w-full outline-none "
          />
          <Search size={18} className="absolute top-[12px] left-[8px]" />
        </div>
        <div className="max-w-[95px] cursor-pointer w-[20%] border border-[#E4E7EC] rounded-md dark:border-gray-500 px-3 py-2 h-[44px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800">
          <ListFilter
            size={24}
            // color="#667085"
            className="dark:text-gray-300 text-[#667085]"
          />
          <p className="dark:text-gray-300 text-[#667085] text-[16px]">
            filter
          </p>
        </div>
      </div>

      {/* table section */}
      <div className="mt-5">
        <WalletReportTable
          data={stockInOutData}
          loading={loadingStockInOut}
          isError={isStockInOutError}
          error={stockInOutError}
          onLimitChange={setLimit}
          limit={limit}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default ManageWallet;
