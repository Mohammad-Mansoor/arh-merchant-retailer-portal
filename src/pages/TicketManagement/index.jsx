import { useState, useMemo } from "react";
import { Search, Filter, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMerchantTickets, getTicketTypes } from "../../services/ticketService";
import MerchantCreateTicketModal from "./Components/CreateTicketModal";
import { format } from "date-fns";
import ViewTicketModal from "./Components/ViewTicketModal";
import ARHCustomDataTable from "../../components/dataTable/ARHCustomDataTable";
import { ARHCustomDateFiler } from "../../components/application/date-picker/rangeCallernderCard";
import ARHAdvanceFilterModal from "../../components/application/date-picker/FilterModal";
import { useTranslation } from "react-i18next";

export default function MerchantTicketsPage() {
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewTicketModalOpen, setViewTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isAdvanceFilterOpen, setIsAdvanceFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
    status: "",
    ticketTypeId: "",
    "createdAt[gte]": null,
    "createdAt[lte]": null,
  });

  // Fetch tickets with filters
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["merchantTickets", filters],
    queryFn: () => getMerchantTickets(filters),
  });

  // Fetch ticket types for filter dropdown
  const { data: ticketTypes } = useQuery({
    queryKey: ["ticketTypes"],
    queryFn: getTicketTypes,
  });

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setViewTicketModalOpen(true);
  };

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleDateRangeApply = (startDate, endDate) => {
    setFilters(prev => ({
      ...prev,
      "createdAt[gte]": startDate,
      "createdAt[lte]": endDate,
      page: 1,
    }));
    setIsDatePickerOpen(false);
  };

  const clearDateFilter = () => {
    setFilters(prev => {
      const newFilter = { ...prev };
      delete newFilter["createdAt[gte]"];
      delete newFilter["createdAt[lte]"];
      return newFilter;
    });
  };

  const formatDateRange = () => {
    if (!filters["createdAt[gte]"] || !filters["createdAt[lte]"]) return null;
    
    const start = new Date(filters["createdAt[gte]"]);
    const end = new Date(filters["createdAt[lte]"]);
    
    return `${format(start, "MMM dd, yyyy")} - ${format(end, "MMM dd, yyyy")}`;
  };

  const handleApplyAdvanceFilters = (filterValues) => {
    setFilters(prev => ({
      ...prev,
      status: filterValues.status || "",
      ticketTypeId: filterValues.ticketType || "",
      page: 1,
    }));
    setIsAdvanceFilterOpen(false);
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      page: 1,
      limit: 10,
      status: "",
      ticketTypeId: "",
      "createdAt[gte]": null,
      "createdAt[lte]": null,
    });
  };

  const isAnyFilterApplied = useMemo(() => {
    return (
      filters.search || 
      filters["createdAt[gte]"] || 
      filters["createdAt[lte]"] || 
      filters.status || 
      filters.ticketTypeId
    );
  }, [filters]);

  const filterConfig = useMemo(() => [
    {
      key: 'status',
      label: t('tickets.columns.status'),
      type: 'dropdown',
      options: [
        { value: 'pending', label: t('tickets.statusOptions.pending') },
        { value: 'resolved', label: t('tickets.statusOptions.resolved') },
        { value: 'rejected', label: t('tickets.statusOptions.rejected') },
      ],
      multiSelect: false,
    },
    {
      key: 'ticketType',
      label: t('tickets.columns.type'),
      type: 'dropdown',
      options: ticketTypes?.map(type => ({ 
        value: type.id, 
        label: type.name 
      })) || [],
      multiSelect: false,
    }
  ], [ticketTypes, t]);

  const initialAdvanceValues = useMemo(() => {
    return {
      status: filters.status || '',
      ticketType: filters.ticketTypeId || '',
    };
  }, [filters]);

  const columns = [
    {
      key: "id",
      label: t('tickets.columns.id'),
      cellClassName: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
    },
    {
      key: "ticketType",
      label: t('tickets.columns.type'),
      render: (ticket) => ticket.ticketType?.name || "-",
      cellClassName: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
    },
    {
      key: "description",
      label: t('tickets.columns.description'),
      render: (ticket) => (
        <div className="max-w-xs truncate">
          {ticket.description}
        </div>
      ),
      cellClassName: "px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate"
    },
    {
      key: "status",
      label: t('tickets.columns.status'),
      render: (ticket) => {
        const statusColors = {
          pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
          resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
          rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        };
        
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[ticket.status]}`}>
            {t(`tickets.statusOptions.${ticket.status}`)}
          </span>
        );
      },
      cellClassName: "px-6 py-4 whitespace-nowrap"
    },
    {
      key: "createdAt",
      label: t('tickets.columns.createdAt'),
      render: (ticket) => format(new Date(ticket.createdAt), "MMM dd, yyyy"),
      cellClassName: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
    },
    {
      key: "actions",
      label: t('tickets.columns.actions'),
      render: (ticket) => (
        <button 
          onClick={() => handleViewTicket(ticket)}
          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
        >
          {t('tickets.view')}
        </button>
      ),
      cellClassName: "px-6 py-4 whitespace-nowrap text-sm font-medium"
    }
  ];

  return (
    <div className="w-full px-5 py-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <MerchantCreateTicketModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
      
      <ViewTicketModal
        open={viewTicketModalOpen}
        onClose={() => setViewTicketModalOpen(false)}
        ticket={selectedTicket}
      />

      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mt-5">
        <div className="w-full md:w-[70%] flex items-center justify-start gap-5">
          <div className="max-w-[371px] w-full h-[44px] relative bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600">
            <input
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t('tickets.searchPlaceholder')}
              className="bg-transparent dark:text-white dark:placeholder-gray-300 h-full pl-10 absolute left-0 top-0 px-3 py-2 w-full outline-none"
            />
            <Search size={18} className="absolute top-[12px] left-[8px] text-gray-500 dark:text-gray-300" />
          </div>
        </div>
        
        <div className="w-full md:w-[30%] flex items-center justify-end gap-3">
          <button
            onClick={() => setIsDatePickerOpen(true)}
            className="max-w-[250px] cursor-pointer w-full md:w-auto border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 h-[44px] flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 relative"
          >
            <Filter className="text-gray-500 dark:text-gray-300" size={18} />
            <p className="text-gray-500 dark:text-gray-300 text-sm truncate">
              {filters["createdAt[gte]"] && filters["createdAt[lte]"] 
                ? <span className="pr-5">{formatDateRange()} </span> 
                : t('tickets.dateFilter')}
            </p>
            
            {filters["createdAt[gte]"] && filters["createdAt[lte]"] && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  clearDateFilter();
                }}
                className="absolute right-2 text-gray-500 dark:text-gray-300 hover:text-red-500"
              >
                <X size={16} />
              </button>
            )}
          </button>
          
          <button
            onClick={() => setIsAdvanceFilterOpen(true)}
            className="max-w-[250px] cursor-pointer w-full md:w-auto border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 h-[44px] flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 relative"
          >
            <Filter className="text-gray-500 dark:text-gray-300" size={18} />
            <p className="text-gray-500 dark:text-gray-300 text-sm">{t('tickets.advanceFilter')}</p>
            {isAnyFilterApplied && (
              <span className="absolute top-[-6px] right-[-6px] w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-[10px]">!</span>
              </span>
            )}
          </button>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-red-600 px-4 py-2 rounded-md text-white hover:bg-red-700 h-[44px] dark:bg-red-700 dark:hover:bg-red-800"
          >
            {t('tickets.createTicket')}
          </button>
        </div>
      </div>

      {isAnyFilterApplied && (
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-300">
            {t('tickets.filtersApplied')}: 
            {filters.status && <span className="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {t('tickets.columns.status')}: {t(`tickets.statusOptions.${filters.status}`)}
            </span>}
            {filters.ticketTypeId && <span className="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {t('tickets.columns.type')}: {
                ticketTypes?.find(t => t.id === filters.ticketTypeId)?.name || filters.ticketTypeId
              }</span>}
            {filters["createdAt[gte]"] && filters["createdAt[lte]"] && (
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {t('tickets.date')}: {formatDateRange()}
              </span>
            )}
          </div>
          <button
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
          >
            {t('tickets.clearAllFilters')}
          </button>
        </div>
      )}

      <div className="mt-5">
        <ARHCustomDataTable
          data={data?.data || []}
          meta={data?.meta || {
            page: filters.page,
            pages: Math.ceil((data?.meta?.total || 0) / filters.limit),
            total: data?.meta?.total || 0,
            limit: filters.limit
          }}
          columns={columns}
          loading={isLoading}
          isError={isError}
          error={isError ? t('tickets.errorLoading') : null}
          onRetry={refetch}
          onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
          onLimitChange={(limit) => setFilters(prev => ({ ...prev, limit, page: 1 }))}
          searchQuery={filters.search}
          className="border border-gray-200 dark:border-gray-700 rounded-xl"
          headerClassName="bg-gray-50 dark:bg-gray-800"
          rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800"
          emptyState={
            <div className="w-full min-h-[200px] flex flex-col items-center justify-center p-4">
              <div className="text-gray-400 mb-2">
                <Search size={48} />
              </div>
              <p className="text-gray-500 dark:text-gray-300">
                {filters.search 
                  ? t('tickets.noResults', { search: filters.search })
                  : t('tickets.noTicketsAvailable')}
              </p>
              {isAnyFilterApplied && (
                <button
                  onClick={clearAllFilters}
                  className="mt-3 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  {t('tickets.clearFilters')}
                </button>
              )}
            </div>
          }
          errorState={
            <div className="p-4 text-center">
              <div className="text-red-500 mb-2">{t('tickets.errorLoading')}</div>
              <button
                onClick={refetch}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                {t('tickets.retry')}
              </button>
            </div>
          }
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