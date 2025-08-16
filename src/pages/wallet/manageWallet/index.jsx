import { Wallet, Search, ListFilter, X } from "lucide-react";
import { useRef, useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import TransferModal from "./components/TransferModal";
import { BiTransferAlt } from "react-icons/bi";
import { getAgentWallets, getStockInOut } from "../../../services/manage_wallet_service.js";
import { useSelector } from "react-redux";
import { handleSetSearch } from "../../../utils/searchDebouncing.js";
import { ARHCustomDateFiler } from "../../../components/application/date-picker/rangeCallernderCard.jsx";
import ARHAdvanceFilterModal from "../../../components/application/date-picker/FilterModal.jsx";
import ARHCustomDataTable from "../../../components/dataTable/ARHCustomDataTable.jsx";
import { useTranslation } from "react-i18next";

function ManageWallet() {
  const { t } = useTranslation();
  const userInfo = useSelector((state) => state.auth.user);
  const searchRef = useRef(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isAdvanceFilterOpen, setIsAdvanceFilterOpen] = useState(false);

  const [filter, setFilter] = useState({
    search: "",
    limit: 10,
    page: 1,
    agent_id: userInfo?.id,
    'createdAt[gte]': null,
    'createdAt[lte]': null,
    type: null,
    'amount[gte]': null,
    'amount[lte]': null,
  });

  const { 
    data: walletInfo, 
    isLoading: isWalletsLoading, 
    isError: isWalletsError, 
    error: walletsError 
  } = useQuery({
    queryKey: ["walletsInfo"],
    queryFn: () => getAgentWallets(userInfo?.id),
  });

  const {
    data: stockInOutData,
    isLoading: isStockInOutLoading,
    isFetching: isSearching,
    isError: isStockInOutError,
    error: stockInOutError,
    refetch: refetchStockInOut,
  } = useQuery({
    queryKey: ["getStockInOut", filter],
    queryFn: () => getStockInOut(filter),
    placeholderData: { data: [], meta: {} } 
  });

  const handleTransferSuccess = () => {
    refetchStockInOut(); 
  };

  const filterConfig = useMemo(() => [
    {
      key: 'type',
      label: t('walletManagement.columns.type'),
      type: 'dropdown',
      options: [
        { value: 'IN', label: t('walletManagement.typeOptions.in') },
        { value: 'OUT', label: t('walletManagement.typeOptions.out') },
      ],
      multiSelect: false,
    },
    {
      key: 'amount',
      label: t('walletManagement.amountRange'),
      type: 'range',
      min: 0,
      max: 1000000,
      unit: 'AFG',
    }
  ], [t]);

  const initialAdvanceValues = useMemo(() => {
    return {
      type: filter.type || '',
      amount: {
        min: filter['amount[gte]'] || 0,
        max: filter['amount[lte]'] || 1000000,
      }
    };
  }, [filter]);

  const closeTransferModal = () => setIsTransferModalOpen(false);

  const handleSearchChange = (value) => {
    setFilter(prev => ({
      ...prev,
      search: value,
      page: 1, 
    }));
  };

  const clearSearch = () => {
    setFilter(prev => ({
      ...prev,
      search: "",
      page: 1,
    }));
  };

  const clearDateFilter = () => {
    setFilter(prev => {
      const newFilter = { ...prev };
      delete newFilter['createdAt[gte]'];
      delete newFilter['createdAt[lte]'];
      return newFilter;
    });
  };

  const handleDateRangeApply = (startDate, endDate) => {
    setFilter(prev => ({
      ...prev,
      'createdAt[gte]': startDate,
      'createdAt[lte]': endDate,
      page: 1,
    }));
    setIsDatePickerOpen(false);
  };

  const formatDateRange = () => {
    if (!filter['createdAt[gte]'] || !filter['createdAt[lte]']) return null;
    const start = new Date(filter['createdAt[gte]']);
    const end = new Date(filter['createdAt[lte]']);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const handleApplyAdvanceFilters = (filterValues) => {
    setFilter(prev => {
      const newFilter = { ...prev, page: 1 };
      
      if (filterValues.type) {
        newFilter.type = filterValues.type;
      } else {
        delete newFilter.type;
      }
      
      if (filterValues.amount) {
        if (filterValues.amount.min > 0) {
          newFilter['amount[gte]'] = filterValues.amount.min;
        } else {
          delete newFilter['amount[gte]'];
        }
        
        if (filterValues.amount.max < 100000) {
          newFilter['amount[lte]'] = filterValues.amount.max;
        } else {
          delete newFilter['amount[lte]'];
        }
      } else {
        delete newFilter['amount[gte]'];
        delete newFilter['amount[lte]'];
      }
      
      return newFilter;
    });
    
    setIsAdvanceFilterOpen(false);
  };

  const clearAllFilters = () => {
    setFilter({
      search: "",
      limit: 10,
      page: 1,
      agent_id: userInfo?.id,
      'createdAt[gte]': null,
      'createdAt[lte]': null,
      type: null,
      'amount[gte]': null,
      'amount[lte]': null,
    });
  };

  const isAnyFilterApplied = useMemo(() => {
    return (
      filter.search || 
      filter['createdAt[gte]'] || 
      filter['createdAt[lte]'] || 
      filter.type || 
      filter['amount[gte]'] || 
      filter['amount[lte]']
    );
  }, [filter]);

  const columns = useMemo(() => [
    {
      key: "from_wallet_id",
      label: t('walletManagement.columns.fromWallet'),
    },
    {
      key: "to_wallet_id",
      label: t('walletManagement.columns.toWallet'),
      render: (item) => item.to_wallet_id || "-"
    },
    {
      key: "type",
      label: t('walletManagement.columns.type'),
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.type === 'IN' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {item.type === 'IN' ? t('walletManagement.typeOptions.in') : t('walletManagement.typeOptions.out')}
        </span>
      )
    },
    {
      key: "amount",
      label: t('walletManagement.columns.amount'),
      render: (item) => item.amount?.toLocaleString()
    },
    {
      key: "opening_balance",
      label: t('walletManagement.columns.openingBalance'),
      render: (item) => item.opening_balance?.toLocaleString() || "-"
    },
    {
      key: "closing_balance",
      label: t('walletManagement.columns.closingBalance'),
      render: (item) => item.closing_balance?.toLocaleString() || "-"
    },
    {
      key: "is_stock",
      label: t('walletManagement.columns.isStock'),
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.is_stock
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          {item.is_stock ? t('common.yes') : t('common.no')}
        </span>
      )
    },
    {
      key: "product",
      label: t('walletManagement.columns.product'),
      render: (item) => item.product?.productName?.en || "-"
    },
    {
      key: "createdAt",
      label: t('walletManagement.columns.createdAt'),
      render: (item) => new Date(item.createdAt).toLocaleString()
    }
  ], [t]);

  return (
    <div className="w-full px-5 py-4 min-h-screen h-auto bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
      <TransferModal
        open={isTransferModalOpen}
        onClose={closeTransferModal}
        onTransferSuccess={handleTransferSuccess}
      />

      <div className="w-full flex items-center justify-between gap-5">
        <div className="dark:text-white dark:bg-slate-800 w-full py-3 px-3 rounded-md md:py-5 md:px-5 shadow-md hover:scale-101 transition-all duration-300 bg-white flex items-center justify-between">
          {isWalletsLoading ? (
            <div className="w-full flex items-center justify-center min-h-[42px]">
              <CircularProgress size={24} />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-start gap-4">
                <div className="flex items-center justify-start gap-8">
                  <div className="flex items-center justify-start text-red-500">
                    <Wallet />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-[16px] text-[#1d1d1d] dark:text-gray-200">
                      {t('walletManagement.primaryWallet')}
                    </h4>
                    <p className="text-[12px] text-[#646464] dark:text-gray-400">
                      {walletInfo?.primaryWallet?.wallet_id}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <h3>{parseFloat(walletInfo?.primaryWallet?.balance).toFixed(2)} AFG</h3>
              </div>
            </>
          )}
        </div>

        <div className="dark:text-white dark:bg-slate-800 w-full py-3 px-3 rounded-md md:py-5 md:px-5 shadow-md hover:scale-101 transition-all duration-300 bg-white flex items-center justify-between">
          {isWalletsLoading ? (
            <div className="w-full flex items-center justify-center min-h-[42px]">
              <CircularProgress size={24} />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-start gap-4">
                <div className="flex items-center justify-start gap-8">
                  <div className="flex items-center justify-start text-red-500">
                    <Wallet />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-[16px] text-[#1d1d1d] dark:text-gray-200">
                      {t('walletManagement.commissionWallet')}
                    </h4>
                    <p className="text-[12px] text-[#646464] dark:text-gray-400">
                      {walletInfo?.comissionWallet?.wallet_id}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-6 items-center justify-end">
                <h3>{parseFloat(walletInfo?.comissionWallet?.balance).toFixed(2)} AFG</h3>
                <button
                  className="p-2 border border-[#CD0202] hover:text-[#CD0202] rounded-full"
                  onClick={() => setIsTransferModalOpen(true)}
                  title={t('walletManagement.transfer')}
                >
                  <BiTransferAlt size={32} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-start gap-5 mt-10">
        <div className="w-full md:max-w-[500px] relative">
          <div className="relative bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800 rounded-md border border-[#E4E7EC] dark:border-gray-500">
            <input
              ref={searchRef}
              onChange={(e) => {
                handleSetSearch(handleSearchChange, e.target.value, searchRef);
              }}
              type="text"
              placeholder={t('walletManagement.searchPlaceholder')}
              className="bg-transparent dark:placeholder-gray-200 h-[44px] pl-10 pr-8 transition-all duration-300 w-full outline-none px-3 py-2"
            />
            <Search
              size={18}
              className="absolute top-[12px] left-[8px] text-[#667085] dark:text-gray-300"
            />
            {filter.search && (
              <button
                onClick={clearSearch}
                className="absolute top-[12px] right-[8px] text-[#667085] dark:text-gray-300 hover:text-red-500"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setIsDatePickerOpen(true)}
          className="max-w-[250px] cursor-pointer w-full md:w-auto border border-[#E4E7EC] rounded-md dark:border-gray-500 px-3 py-2 h-[44px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800 relative"
        >
          <ListFilter size={20} className="dark:text-gray-300 text-[#667085]" />
          <p className="dark:text-gray-300 text-[#667085] text-[14px] truncate">
            {filter['createdAt[gte]'] && filter['createdAt[lte]'] 
              ? <span className="pr-5">{formatDateRange()} </span> 
              : t('walletManagement.dateFilter')}
          </p>
          
          {filter['createdAt[gte]'] && filter['createdAt[lte]'] && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                clearDateFilter();
              }}
              className="absolute right-2 text-blue-800 dark:text-blue-200 hover:text-red-500"
            >
              <X size={16} />
            </button>
          )}
        </button>
        
        <button
          onClick={() => setIsAdvanceFilterOpen(true)}
          className="max-w-[250px] cursor-pointer w-full md:w-auto border border-[#E4E7EC] rounded-md dark:border-gray-500 px-3 py-2 h-[44px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800  dark:text-gray-300 text-[#667085] text-[14px]  dark:to-slate-800 relative"
        >
          <ListFilter size={20} className="dark:text-gray-300 text-[#667085]" />
          {t('walletManagement.advanceFilter')}
          {isAnyFilterApplied && (
            <span className="absolute top-[-6px] right-[-6px] w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-[10px]">!</span>
            </span>
          )}
        </button>
        
        {isAnyFilterApplied && (
          <button
            onClick={clearAllFilters}
            className="max-w-[150px] cursor-pointer w-full md:w-auto border border-red-500 rounded-md px-3 py-2 h-[44px] flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            {t('walletManagement.clearAll')}
          </button>
        )}
      </div>
  
      <div className="mt-5">
        <ARHCustomDataTable
          data={stockInOutData?.data || []}
          meta={stockInOutData?.meta || {}}
          columns={columns}
          loading={isStockInOutLoading || isSearching}
          isError={isStockInOutError}
          error={stockInOutError}
          onRetry={refetchStockInOut}
          onPageChange={(page) => setFilter(prev => ({ ...prev, page }))}
          onLimitChange={(limit) => setFilter(prev => ({ ...prev, limit, page: 1 }))}
          searchQuery={filter.search}
          className="border border-gray-200 rounded-xl"
          rowClassName="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05]"
          emptyState={
            <div className="w-full min-h-[200px] flex flex-col items-center justify-center p-4">
              <div className="text-gray-400 mb-2">
                <Search size={48} />
              </div>
              <p className="text-gray-500">
                {filter.search 
                  ? t('walletManagement.noResults', { search: filter.search })
                  : t('walletManagement.noTransactions')}
              </p>
            </div>
          }
          errorState={
            <div className="p-4 text-center">
              <div className="text-red-500 mb-2">
                {t('walletManagement.errorLoading')}: {stockInOutError?.message || t('walletManagement.loadDataFailed')}
              </div>
              <button
                onClick={refetchStockInOut}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                {t('walletManagement.retry')}
              </button>
            </div>
          }
        />
      </div>

      {isDatePickerOpen && (
        <div 
          className="fixed inset-0 bg-black/40 bg-opacity-10 z-50 flex items-center justify-center p-4"
          onClick={() => setIsDatePickerOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl max-w-full overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <ARHCustomDateFiler
              onApply={handleDateRangeApply} 
              onClose={() => setIsDatePickerOpen(false)} 
            />
          </div>
        </div>
      )}

      {isAdvanceFilterOpen && (
        <ARHAdvanceFilterModal
          isOpen={isAdvanceFilterOpen}
          onClose={() => setIsAdvanceFilterOpen(false)}
          onApply={handleApplyAdvanceFilters}
          filterConfig={filterConfig}
          initialValues={initialAdvanceValues}
        />
      )}
    </div>
  );
}

export default ManageWallet;