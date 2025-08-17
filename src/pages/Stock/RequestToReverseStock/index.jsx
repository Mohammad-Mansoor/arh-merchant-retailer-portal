import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ListFilter, Search, Plus, X, Filter } from "lucide-react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { 
  createReverseStockByMerchant, 
  getReverseStocksForMerchant,
} from "../../../services/reverseStockApi";
import ReverseStockModal from "./Components/ReverseStockModal";

import Badge from "../../../components/ui/badge/Badge";
import ARHCustomDataTable from "../../../components/dataTable/ARHCustomDataTable";
import ARHAdvanceFilterModal from "../../../components/application/date-picker/FilterModal";
import { ARHCustomDateFiler } from "../../../components/application/date-picker/rangeCallernderCard";
import { getDownlineAgents } from "../../../services/agent_management_service";

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const statusMap = {
    under_process: {
      variant: "light",
      color: "warning",
      label: t('reverseStock.statusOptions.processing')
    },
    rejected: {
      variant: "light",
      color: "error",
      label: t('reverseStock.statusOptions.rejected')
    },
    reversed: {
      variant: "light",
      color: "success",
      label: t('reverseStock.statusOptions.completed')
    }
  };

  const badgeProps = statusMap[status] || {
    variant: "light",
    color: "light",
    label: status
  };

  return <Badge {...badgeProps}>{badgeProps.label}</Badge>;
};

function ReverseStockPage() {
  const { t } = useTranslation();
  const userInfo = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isAdvanceFilterOpen, setIsAdvanceFilterOpen] = useState(false);
  
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: "",
    'createdAt[gte]': null,
    'createdAt[lte]': null,
    status: null,
    'amount[gte]': null,
    'amount[lte]': null,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["reverseStocks", filter],
    queryFn: () => getReverseStocksForMerchant(filter)
  });

  const { data: retailersData } = useQuery({
    queryKey: ["downlineAgents", userInfo?.id, filter],
    queryFn: () => getDownlineAgents(userInfo?.id, filter),
  });

  const retailers = retailersData?.data || [];

  const handleSearchChange = (value) => {
    setFilter(prev => ({ ...prev, search: value, page: 1 }));
  };

  const clearSearch = () => {
    setFilter(prev => ({ ...prev, search: "", page: 1 }));
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

  const clearDateFilter = () => {
    setFilter(prev => {
      const newFilter = { ...prev };
      delete newFilter['createdAt[gte]'];
      delete newFilter['createdAt[lte]'];
      return newFilter;
    });
  };

  const formatDateRange = () => {
    if (!filter['createdAt[gte]'] || !filter['createdAt[lte]']) return null;
    const start = new Date(filter['createdAt[gte]']);
    const end = new Date(filter['createdAt[lte]']);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const filterConfig = useMemo(() => [
    {
      key: 'status',
      label: t('reverseStock.columns.status'),
      type: 'dropdown',
      options: [
        { value: 'under_process', label: t('reverseStock.statusOptions.processing') },
        { value: 'reversed', label: t('reverseStock.statusOptions.completed') },
        { value: 'rejected', label: t('reverseStock.statusOptions.rejected') },
      ],
      multiSelect: false,
    },
    {
      key: 'amount',
      label: t('reverseStock.amountRange'),
      type: 'range',
      min: 0,
      max: 100000,
      unit: 'AFG',
    }
  ], [t]);

  const initialAdvanceValues = useMemo(() => {
    return {
      status: filter.status || '',
      amount: {
        min: filter['amount[gte]'] || 0,
        max: filter['amount[lte]'] || 100000,
      }
    };
  }, [filter]);

  const handleApplyAdvanceFilters = (filterValues) => {
    setFilter(prev => {
      const newFilter = { ...prev, page: 1 };
      
      if (filterValues.status) {
        newFilter.status = filterValues.status;
      } else {
        delete newFilter.status;
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
      page: 1,
      limit: 10,
      search: "",
      'createdAt[gte]': null,
      'createdAt[lte]': null,
      status: null,
      'amount[gte]': null,
      'amount[lte]': null,
    });
  };

  const isAnyFilterApplied = useMemo(() => {
    return (
      filter.search || 
      filter['createdAt[gte]'] || 
      filter['createdAt[lte]'] || 
      filter.status || 
      filter['amount[gte]'] || 
      filter['amount[lte]']
    );
  }, [filter]);

  const columns = [
    {
      key: "createdAt",
      label: t('reverseStock.columns.createdAt'),
      render: (item) => new Date(item.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      key: "reversedFrom",
      label: t('reverseStock.columns.retailer'),
      render: (item) => {
        const retailer = retailers.find(r => r.id === item.reversedFrom);
        return retailer ? `${retailer.username}` : "N/A";
      }
    },
    {
      key: "amount",
      label: t('reverseStock.columns.amount'),
      render: (item) => parseFloat(item.amount).toFixed(2)
    },
    {
      key: "status",
      label: t('reverseStock.columns.status'),
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: "attachment",
      label: t('reverseStock.columns.attachment'),
      render: (item) => {
        const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL1;
        const getAttachmentLink = (fileName) => {
          if (!fileName) return null;
          return `${IMG_BASE_URL}/uploads/reverseStock_images/${fileName}`;
        };
        
        return item.attachment ? (
          <a
            href={getAttachmentLink(item.attachment)} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {t('reverseStock.viewAttachment')}
          </a>
        ) : (
          <span className="text-gray-400">{t('reverseStock.noAttachment')}</span>
        );
      }
    }
  ];

  return (
    <div className="w-full px-5 py-4 min-h-screen h-auto bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
      {isModalOpen && (
        <ReverseStockModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(formData) => {
            formData.append("type", "downline");
            createReverseStockByMerchant(formData)
              .then(() => {
                refetch();
                setIsModalOpen(false);
              });
          }}
          isLoading={false}
          retailers={retailers}
        />
      )}
      
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mt-5">
       <div className="flex w-[70%] gap-3">
        <div className="w-full md:max-w-[500px] relative">
          <div className="relative bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800 rounded-md border border-[#E4E7EC] dark:border-gray-500">
            <input
              onChange={(e) => handleSearchChange(e.target.value)}
              type="text"
              placeholder={t('reverseStock.searchPlaceholder')}
              value={filter.search}
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
              : t('reverseStock.dateFilter')}
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
            <Filter size={20} className="dark:text-gray-300 text-[#667085]" />
          {t('reverseStock.advanceFilter')}
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
            {t('reverseStock.clearAll')}
          </button>
        )}
        </div>
        <div className="flex items-center justify-end w-full md:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#CD0C02] px-3 py-[10px] rounded-md text-white flex items-center gap-2"
          >
            <Plus size={20} />
            {t('reverseStock.newRequest')}
          </button>
        </div>
      </div>
      
      <div className="mt-5">
        <ARHCustomDataTable
          data={data?.data || []}
          meta={data?.meta || {
            page: filter.page,
            pages: Math.ceil((data?.meta?.totalRecords || 0) / filter.limit),
            total: data?.meta?.totalRecords || 0,
            limit: filter.limit
          }}
          columns={columns}
          loading={isLoading}
          isError={isError}
          error={isError ? t('reverseStock.errorLoadingRequests') : null}
          onRetry={refetch}
          onPageChange={(page) => setFilter(prev => ({ ...prev, page }))}
          onLimitChange={(limit) => setFilter(prev => ({ ...prev, limit, page: 1 }))}
          searchQuery={filter.search}
          className="border border-gray-200 rounded-xl"
          rowClassName="hover:bg-gray-50 dark:hover:bg-white/[0.05]"
          emptyState={
            <div className="w-full min-h-[200px] flex flex-col items-center justify-center p-4">
              <div className="text-gray-400 mb-2">
                <Search size={48} />
              </div>
              <p className="text-gray-500">
                {filter.search 
                  ? t('reverseStock.noResults', { search: filter.search })
                  : t('reverseStock.noRequestsAvailable')}
              </p>
            </div>
          }
          errorState={
            <div className="p-4 text-center">
              <div className="text-red-500 mb-2">{t('reverseStock.errorLoading')}</div>
              <button
                onClick={refetch}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                {t('reverseStock.retry')}
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

export default ReverseStockPage;