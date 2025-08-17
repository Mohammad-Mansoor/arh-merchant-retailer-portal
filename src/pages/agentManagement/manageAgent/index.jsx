import { Search, ListFilter, Eye, Pencil, Trash2, X, Filter, ChevronDown, Check } from "lucide-react";
import { useRef, useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getDownlineAgents } from "../../../services/agent_management_service";
import { useSelector } from "react-redux";
import { handleSetSearch } from "../../../utils/searchDebouncing";
import CreateAgent from "./components/createAgent";
import { useNavigate } from "react-router-dom";
import Badge from "../../../components/ui/badge/Badge";
import ARHCustomDataTable from "../../../components/dataTable/ARHCustomDataTable";
import ARHAdvanceFilterModal from "../../../components/application/date-picker/FilterModal";
import { ARHCustomDateFiler } from "../../../components/application/date-picker/rangeCallernderCard";
import { useTranslation } from "react-i18next";

function ManageAgent() {
  const { t } = useTranslation();
  const searchRef = useRef(null);
  const userInfo = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [refetch, setRefetch] = useState(false);
  const [createAgentModalOpen, setCreateAgentModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isAdvanceFilterOpen, setIsAdvanceFilterOpen] = useState(false);
  
  const [filter, setFilter] = useState({
    search: "",
    limit: 10,
    page: 1,
    parent_agent_id: userInfo?.id,
    'createdAt[gte]': null,
    'createdAt[lte]': null,
    status: null,
    accountType: null,
    'commission_rate[gte]': null,
    'commission_rate[lte]': null,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["downlineAgents", filter, refetch],
    queryFn: () => getDownlineAgents(userInfo?.id, filter),
  });

  const handleRefetch = () => {
    setRefetch((prev) => !prev);
  };
  
  const handleSearchChange = (value) => {
    setFilter((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };
  
  const closeCreateAgentModal = () => {
    setCreateAgentModalOpen(false);
  };

  const handleDeleteAgent = async (agentId) => {
    if (window.confirm(t('agentManagement.deleteConfirm'))) {
      try {
        toast.success(t('agentManagement.deleteSuccess'));
        handleRefetch();
      } catch (error) {
        toast.error(t('agentManagement.deleteError'));
        console.error("Delete error:", error);
      }
    }
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
      label: t('agentManagement.columns.status'),
      type: 'dropdown',
      options: [
        { value: 'active', label: t('agentManagement.statusOptions.active') },
        { value: 'inactive', label: t('agentManagement.statusOptions.inactive') },
        { value: 'suspended', label: t('agentManagement.statusOptions.suspended') },
      ],
      multiSelect: false,
    },
    {
      key: 'accountType',
      label: t('agentManagement.accountType'),
      type: 'dropdown',
      options: [
        { value: 'merchant', label: t('agentManagement.accountTypeOptions.merchant') },
        { value: 'retailer', label: t('agentManagement.accountTypeOptions.retailer') },
      ],
      multiSelect: false,
    },
    {
      key: 'commission_rate',
      label: t('agentManagement.columns.commissionRate'),
      type: 'range',
      min: 0,
      max: 100,
      unit: '%',
    }
  ], [t]);

  const initialAdvanceValues = useMemo(() => {
    return {
      status: filter.status || '',
      accountType: filter.accountType || '',
      commission_rate: {
        min: filter['commission_rate[gte]'] || 0,
        max: filter['commission_rate[lte]'] || 100,
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
      
      if (filterValues.accountType) {
        newFilter.accountType = filterValues.accountType;
      } else {
        delete newFilter.accountType;
      }
      
      if (filterValues.commission_rate) {
        if (filterValues.commission_rate.min > 0) {
          newFilter['commission_rate[gte]'] = filterValues.commission_rate.min;
        } else {
          delete newFilter['commission_rate[gte]'];
        }
        
        if (filterValues.commission_rate.max < 100) {
          newFilter['commission_rate[lte]'] = filterValues.commission_rate.max;
        } else {
          delete newFilter['commission_rate[lte]'];
        }
      } else {
        delete newFilter['commission_rate[gte]'];
        delete newFilter['commission_rate[lte]'];
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
      parent_agent_id: userInfo?.id,
      'createdAt[gte]': null,
      'createdAt[lte]': null,
      status: null,
      accountType: null,
      'commission_rate[gte]': null,
      'commission_rate[lte]': null,
    });
  };

  const isAnyFilterApplied = useMemo(() => {
    return (
      filter.search || 
      filter['createdAt[gte]'] || 
      filter['createdAt[lte]'] || 
      filter.status || 
      filter.accountType || 
      filter['commission_rate[gte]'] || 
      filter['commission_rate[lte]']
    );
  }, [filter]);

  
  const columns = [
    {
      key: "profile",
      label: t('agentManagement.columns.profile'),
      render: (item) => (
        <img
          src={`${import.meta.env.VITE_IMG_BASE_URL}${item?.user?.profile_picture}`}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
      )
    },
    {
      key: "username",
      label: t('agentManagement.columns.username'),
      render: (item) => item?.user?.username || "-"
    },
    {
      key: "email",
      label: t('agentManagement.columns.email'),
      render: (item) => item?.user?.email || "-"
    },
    {
      key: "mobileNumber",
      label: t('agentManagement.columns.mobileNumber'),
      render: (item) => item?.user?.mobileNumber || "-"
    },
    {
      key: "commission_rate",
      label: t('agentManagement.columns.commissionRate'),
      render: (item) => item?.commission_rate ? `${item?.commission_rate}%` : "-"
    },
    {
      key: "address",
      label: t('agentManagement.columns.address'),
      render: (item) => item?.address || "-"
    },
    {
      key: "status",
      label: t('agentManagement.columns.status'),
      render: (item) => (
        <div
          className={`px-5 py-[6px] ${
            item?.user?.status === "active"
              ? "text-green-500 bg-green-100"
              : "text-red-500 bg-red-100"
          } text-sm text-gray-700 dark:text-gray-300 rounded-4xl flex items-center my-2 justify-center`}
        >
          {item?.user?.status || "-"}
        </div>
      )
    },
    {
      key: "createdAt",
      label: t('agentManagement.columns.createdAt'),
      render: (item) => new Date(item?.createdAt).toLocaleDateString() || "-"
    },
    {
      key: "actions",
      label: t('agentManagement.columns.actions'),
      render: (item) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/agent-profile/${item.user.id}`)}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
            title={t('agentManagement.view')}
          >
            <Eye size={18} />
          </button>
          <button 
            onClick={() => navigate(`/edit-agent/${item.user.id}`)}
            className="p-1 text-green-600 hover:bg-green-100 rounded"
            title={t('agentManagement.edit')}
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={() => handleDeleteAgent(item.user.id)}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
            title={t('agentManagement.delete')}
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="w-full px-5 py-4 min-h-screen h-auto bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
      <CreateAgent
        open={createAgentModalOpen}
        onClose={closeCreateAgentModal}
        refetch={handleRefetch}
        closeCreateAgentModal={closeCreateAgentModal}
      />
      
      <div className="w-full flex justify-between flex-col md:flex-row items-start md:items-center  gap-5 mt-5">
      <div className="flex gap-3 w-[70%]">
        <div className="w-full md:max-w-[500px] relative">
          <div className="relative bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800 rounded-md border border-[#E4E7EC] dark:border-gray-500">
            <input
              onChange={(e) => handleSetSearch(handleSearchChange, e.target.value, searchRef)}
              type="text"
              placeholder={t('agentManagement.searchPlaceholder')}
              value={filter.search}
              className="bg-transparent dark:placeholder-gray-200 h-[44px] pl-10 pr-8 transition-all duration-300 w-full outline-none px-3 py-2"
            />
            <Search
              size={18}
              className="absolute top-[12px] left-[8px] text-[#667085] dark:text-gray-300"
            />
            {filter.search && (
              <button
                onClick={() => setFilter(prev => ({ ...prev, search: "" }))}
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
              : t('agentManagement.dateFilter')}
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
            {t('agentManagement.advanceFilter')}
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
            {t('agentManagement.clearAll')}
          </button>
        )}
        </div>
        <div className="flex items-center justify-end w-full md:w-auto">
          <button
            onClick={() => setCreateAgentModalOpen(true)}
            className="bg-[#CD0C02] px-3 py-[10px] rounded-md text-white flex items-center gap-2"
          >
            {t('agentManagement.createAgent')}
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
          error={error}
          onRetry={handleRefetch}
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
                  ? t('agentManagement.noResults', { search: filter.search })
                  : t('agentManagement.noAgents')}
              </p>
            </div>
          }
          errorState={
            <div className="p-4 text-center">
              <div className="text-red-500 mb-2">{t('agentManagement.errorLoading')}</div>
              <button
                onClick={handleRefetch}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                {t('agentManagement.retry')}
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

export default ManageAgent;