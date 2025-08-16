import { Wallet, Search, ListFilter, X } from "lucide-react";
import TopUpModal from "./components/TopUpModal";
import { useRef, useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getAllRechargeLogs } from "../../../services/product_management_service.js";
import ARHCustomDataTable from "../../../components/dataTable/ARHCustomDataTable.jsx";
import { getProviders } from "../../../services/product_management_service.js";
import ARHAdvanceFilterModal from "../../../components/application/date-picker/FilterModal.jsx";
import { ARHCustomDateFiler } from "../../../components/application/date-picker/rangeCallernderCard.jsx";

function Recharge() {
  const [topupModalOpen, setTopupModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isAdvanceFilterOpen, setIsAdvanceFilterOpen] = useState(false);
  const searchRef = useRef(null);
  const userInfo = useSelector((state) => state.auth.user);
  const [refetch, setRefetch] = useState(false);
  
  const [filter, setFilter] = useState({
    search: "",
    limit: 10,
    page: 1,
    agentId: userInfo?.id ? Number(userInfo.id) : null,
    'createdAt[gte]': null,
    'createdAt[lte]': null,
    status: "",
    operator: "",
    companyId: "",
    'amount[gte]': "",
    'amount[lte]': "",
  });

  // Fetch providers for company filter
  const { data: providers } = useQuery({
    queryKey: ["providers"],
    queryFn: getProviders,
  });

  // Fetch recharge logs with filters
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rechargeLogs", filter, refetch],
    queryFn: () => getAllRechargeLogs(filter),
  });

  const closeTopupModal = () => setTopupModalOpen(false);
  const handleRefetch = () => setRefetch((prev) => !prev);

  const handleSearchChange = (value) => {
    setFilter((prev) => ({
      ...prev,
      search: value,
      page: 1
    }));
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

  const handleApplyAdvanceFilters = (filterValues) => {
    setFilter(prev => ({
      ...prev,
      status: filterValues.status || "",
      operator: filterValues.operator || "",
      companyId: filterValues.company ? Number(filterValues.company) : "",
      'amount[gte]': filterValues.amount?.min ? Number(filterValues.amount.min) : "",
      'amount[lte]': filterValues.amount?.max ? Number(filterValues.amount.max) : "",
      page: 1,
    }));
    setIsAdvanceFilterOpen(false);
  };

  const clearAllFilters = () => {
    setFilter({
      search: "",
      limit: 10,
      page: 1,
      agentId: userInfo?.id ? Number(userInfo.id) : null,
      'createdAt[gte]': null,
      'createdAt[lte]': null,
      status: "",
      operator: "",
      companyId: "",
      'amount[gte]': "",
      'amount[lte]': "",
    });
  };

  const isAnyFilterApplied = useMemo(() => {
    return (
      filter.search || 
      filter['createdAt[gte]'] || 
      filter['createdAt[lte]'] || 
      filter.status || 
      filter.operator || 
      filter.companyId || 
      filter['amount[gte]'] || 
      filter['amount[lte]']
    );
  }, [filter]);

  const filterConfig = useMemo(() => [
    {
      key: 'status',
      label: 'Status',
      type: 'dropdown',
      options: [
        { value: 'success', label: 'Success' },
        { value: 'failed', label: 'Failed' },
        { value: 'pending', label: 'Pending' },
      ],
      multiSelect: false,
    },
    {
      key: 'operator',
      label: 'Operator',
      type: 'dropdown',
      options: [
        { value: 'MTN', label: 'MTN' },
        { value: 'Etisalat', label: 'Etisalat' },
        { value: 'Roshan', label: 'Roshan' },
        { value: 'AWCC', label: 'AWCC' },
      ],
      multiSelect: false,
    },
    {
      key: 'company',
      label: 'Company',
      type: 'dropdown',
      options: providers?.map(provider => ({ 
        value: provider.id, 
        label: provider.name 
      })) || [],
      multiSelect: false,
    },
    {
      key: 'amount',
      label: 'Amount Range',
      type: 'range',
      min: 0,
      max: 100000,
      unit: 'AF',
    }
  ], [providers]);

  const initialAdvanceValues = useMemo(() => {
    return {
      status: filter.status || '',
      operator: filter.operator || '',
      company: filter.companyId ? String(filter.companyId) : '',
      amount: {
        min: filter['amount[gte]'] ? parseInt(filter['amount[gte]']) : 0,
        max: filter['amount[lte]'] ? parseInt(filter['amount[lte]']) : 100000,
      }
    };
  }, [filter]);

  // Define table columns
  const columns = [
    { 
      key: "txnNumber", 
      label: "Transaction ID" 
    },
    { 
      key: "receiver", 
      label: "Receiver" 
    },
    { 
      key: "amount", 
      label: "Amount",
      render: (item) => `${item?.amount || 0} AF`
    },
    { 
      key: "operator", 
      label: "Operator" 
    },
    { 
      key: "company", 
      label: "Company",
      render: (item) => item?.company?.name || "-"
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <div className={`px-5 py-[6px] rounded-full flex items-center justify-center ${
          item?.status === "success"
            ? "text-green-500 bg-green-100"
            : item?.status === "failed"
            ? "text-red-500 bg-red-100"
            : "text-orange-500 bg-orange-100"
        }`}>
          {item?.status || "-"}
        </div>
      )
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (item) => new Date(item?.createdAt).toLocaleDateString()
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => "View Details"
    }
  ];

  // Custom empty state
  const customEmptyState = (
    <div className="w-full min-h-[200px] flex flex-col items-center justify-center">
      <div className="bg-gray-100 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <Search size={32} className="text-gray-400" />
      </div>
      <p className="text-gray-500 dark:text-gray-400">
        {filter.search 
          ? `No results found for "${filter.search}"`
          : "No recharge logs found"}
      </p>
      {isAnyFilterApplied && (
        <button
          onClick={clearAllFilters}
          className="mt-4 text-red-600 dark:text-red-400 hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  // Custom error state
  const customErrorState = (
    <div className="w-full min-h-[200px] flex flex-col items-center justify-center">
      <div className="text-red-500 mb-2">
        {error?.message || "Failed to load data"}
      </div>
      <button
        onClick={handleRefetch}
        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="w-full px-5 py-4 min-h-screen">
      <TopUpModal open={topupModalOpen} onClose={closeTopupModal} />

      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mt-5">
        <div className="w-full md:max-w-[500px] relative">
          <div className="relative bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:to-slate-800 rounded-md border border-[#E4E7EC] dark:border-gray-500">
            <input
              value={filter.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by receiver, operator, or company..."
              className="bg-transparent dark:placeholder-gray-200 h-[44px] pl-10 w-full outline-none px-3 py-2"
            />
            <Search size={18} className="absolute top-[12px] left-[8px] text-[#667085] dark:text-gray-300" />
            {filter.search && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute top-[12px] right-[8px] text-[#667085] dark:text-gray-300 hover:text-red-500"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsDatePickerOpen(true)}
            className="max-w-[250px] cursor-pointer w-full md:w-auto border border-[#E4E7EC] rounded-md dark:border-gray-500 px-3 py-2 h-[44px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800 relative"
          >
            <ListFilter size={20} className="dark:text-gray-300 text-[#667085]" />
            <p className="dark:text-gray-300 text-[#667085] text-[14px] truncate">
              {filter['createdAt[gte]'] && filter['createdAt[lte]'] 
                ? <span className="pr-5">{formatDateRange()} </span> 
                : "Date Filter"}
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
            <span>Advanced Filter</span>
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
              Clear All
            </button>
          )}
          
          <button
            onClick={() => setTopupModalOpen(true)}
            className="bg-[#CD0C02] px-4 py-2 rounded-md text-white h-[44px]"
          >
            Top Up
          </button>
        </div>
      </div>

      {isAnyFilterApplied && (
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Filters applied: 
          {filter.status && <span className="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Status: {filter.status}</span>}
          {filter.operator && <span className="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Operator: {filter.operator}</span>}
          {filter.companyId && <span className="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Company: {
            providers?.find(p => p.id === filter.companyId)?.name || filter.companyId
          }</span>}
          {filter['amount[gte]'] && filter['amount[lte]'] && (
            <span className="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              Amount: {filter['amount[gte]']} - {filter['amount[lte]']} AF
            </span>
          )}
          {filter['createdAt[gte]'] && filter['createdAt[lte]'] && (
            <span className="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              Date: {formatDateRange()}
            </span>
          )}
        </div>
      )}

      <div className="mt-5">
        <ARHCustomDataTable
          data={data?.data || []}
          columns={columns}
          meta={data?.meta || {
            page: filter.page,
            pages: Math.ceil((data?.meta?.totalRecords || 0) / filter.limit) || 1,
            total: data?.meta?.totalRecords || 0,
            limit: filter.limit
          }}
          loading={isLoading}
          isError={isError}
          error={error}
          onRetry={handleRefetch}
          onPageChange={(page) => setFilter((prev) => ({ ...prev, page }))}
          onLimitChange={(limit) => 
            setFilter((prev) => ({ ...prev, limit, page: 1 }))
          }
          searchQuery={filter.search}
          emptyState={customEmptyState}
          errorState={customErrorState}
          rowClassName="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          onRowClick={(item) => console.log('Row clicked:', item)}
        />
      </div>

      {isDatePickerOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
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

export default Recharge;