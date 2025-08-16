import { Search, ListFilter } from "lucide-react";
import { useRef, useState } from "react";
import TransferModal from "./components/TransferModal";
import { useSelector } from "react-redux";
import { getAllStockTransferToDownlineAgents } from "../../../services/stockTransferToDownlineAgentsService.js";
import { useQuery } from "@tanstack/react-query";
import { handleSetSearch } from "../../../utils/searchDebouncing.js";
import ARHCustomDataTable from "../../../components/dataTable/ARHCustomDataTable.jsx";
import { useTranslation } from "react-i18next";

function StockTransferToDownlineAgents() {
  const { t } = useTranslation();
  const searchRef = useRef(null);
  const userInfo = useSelector((state) => state.auth.user);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [filter, setFilter] = useState({
    search: "",
    limit: 10,
    page: 1,
    parent_agent_id: userInfo?.id,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["stockTransferToDownlineAgents", filter],
    queryFn: () => getAllStockTransferToDownlineAgents(filter),
  });
  console.log("Stock Transfer Data:", data);

  const handleSearchChange = (value) => {
    setFilter((prev) => ({
      ...prev,
      search: value,
      page: 1 
    }));
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  const columns = [
    {
      key: "downlineAgent",
      label: t("stockTransfer.agent"),
      render: (item) => item?.downlineAgent?.username || "-"
    },
    {
      key: "amount",
      label: t("stockTransfer.amount"),
      render: (item) => item?.amount || "-"
    },
    {
      key: "commission_rate",
      label: t("stockTransfer.commissionRate"),
      render: (item) => item?.commission_rate ? `${item?.commission_rate}%` : "-"
    },
    {
      key: "total_amount",
      label: t("stockTransfer.totalAmount"),
      render: (item) => item?.total_amount || "-"
    },
    {
      key: "createdAt",
      label: t("stockTransfer.createdAt"),
      render: (item) => new Date(item?.createdAt).toLocaleString() || "-"
    }
  ];

  return (
    <div className="w-full px-5 py-4 min-h-screen h-auto bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
      {isTransferModalOpen && (
        <TransferModal
          open={isTransferModalOpen}
          onClose={closeTransferModal}
        />
      )}

      <div className="w-full flex items-center justify-between gap-5 mt-5">
        <div className="flex items-center justify-start w-[70%] gap-5">
          <div className="max-w-[371px] w-[80%] h-[44px] relative bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800 rounded-md border border-[#E4E7EC] dark:border-gray-500 ">
            <input
              onChange={(e) => {
                handleSetSearch(handleSearchChange, e.target.value, searchRef);
              }}
              type="text"
              placeholder={t("common2.search")}
              className="bg-transparent dark:placeholder-gray-200 h-full pl-10  transition-all duration-300  absolute left-0 top-0 px-3 py-2 w-full outline-none "
            />
            <Search size={18} className="absolute top-[12px] left-[8px]" />
          </div>
          <div className="max-w-[95px] cursor-pointer w-[20%] border border-[#E4E7EC] rounded-md dark:border-gray-500 px-3 py-2 h-[44px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800">
            <ListFilter
              size={24}
              className="dark:text-gray-300 text-[#667085]"
            />
            <p className="dark:text-gray-300 text-[#667085] text-[16px]">
              {t("common2.filter")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end w-[30%]">
          <button
            onClick={() => {
              setIsTransferModalOpen(true);
            }}
            className="bg-[#CD0C02] px-3 py-[10px] rounded-md text-white"
          >
            {t("stockTransfer.transferAmount")}
          </button>
        </div>
      </div>

      <div className="mt-5">
        <ARHCustomDataTable
          data={data?.data || []}
          meta={data?.meta || {
            page: filter.page,
            pages: Math.ceil((data?.meta?.total || 0) / filter.limit),
            total: data?.meta?.total || 0,
            limit: filter.limit
          }}
          columns={columns}
          loading={isLoading}
          isError={isError}
          error={isError ? t("stockTransfer.errorLoading") : null}
          onRetry={refetch}
          onPageChange={(page) => setFilter(prev => ({ ...prev, page }))}
          onLimitChange={(limit) => setFilter(prev => ({ ...prev, limit, page: 1 }))}
          searchQuery={filter.search}
          className="border border-gray-200 rounded-xl"
          rowClassName="hover:bg-gray-50 dark:hover:bg-white/[0.05]"
          emptyState={
            <div className="w-full min-h-[200px] flex flex-col items-center justify-center">
              <img src="/images/Search.png" className="w-[170px] h-[170px]" />
              <p>{t("common2.noDataFound")}</p>
            </div>
          }
          errorState={
            <div className="w-full min-h-[200px] flex flex-col items-center justify-center">
              <img src="/images/Search.png" className="w-[170px] h-[170px]" />
              <div className="text-sm text-red-600 mb-2">{t("stockTransfer.errorLoading")}</div>
              <button
                onClick={refetch}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                {t("common2.retry")}
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default StockTransferToDownlineAgents;