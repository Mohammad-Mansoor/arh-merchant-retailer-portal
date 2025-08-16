import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Search } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { getStatementReport } from "../../services/statement";
import StatementFilterModal from "./components/StatementFilterModal";
import ARHCustomDataTable from "../../components/dataTable/ARHCustomDataTable";


const StatementReport = () => {
  const queryClient = useQueryClient();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 6,
    search: "",
    startDate: null,
    endDate: null
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["statements", filter],
    queryFn: () => getStatementReport(filter),
    enabled: !!filter.startDate && !!filter.endDate,
    keepPreviousData: true
  });


  const columns = [
    {
      key: "createdAt",
      label: "Date",
      render: (item) => new Date(item.createdAt).toLocaleDateString()
    },
    { 
      key: "transactionId", 
      label: "Transaction ID" 
    },
    { 
      key: "transactionType", 
      label: "Type" 
    },
    {
      key: "debit",
      label: "Debit",
      render: (item) => item.debit ? formatCurrency(item.debit) : "-",
      cellClassName: "text-red-600 dark:text-red-400"
    },
    {
      key: "credit",
      label: "Credit",
      render: (item) => item.credit ? formatCurrency(item.credit) : "-",
      cellClassName: "text-green-600 dark:text-green-400"
    },
    {
      key: "walletBalance",
      label: "Balance",
      render: (item) => formatCurrency(item.walletBalance),
      cellClassName: "font-medium"
    },
    {
      key: "remarks",
      label: "Remarks",
      render: (item) => item.remarks || "-"
    },
    {
      key: "agent",
      label: "Agent",
      render: (item) => item.agent?.username || "N/A"
    }
  ];


  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AFN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(value));
  };

 
  const exportData = useMemo(() => {
    if (!data || !data.data) return [];
    
    return data.data.map(item => ({
      "Date": new Date(item.createdAt).toLocaleDateString(),
      "Transaction ID": item.transactionId,
      "Type": item.transactionType,
      "Debit": item.debit ? parseFloat(item.debit).toFixed(2) : "-",
      "Credit": item.credit ? parseFloat(item.credit).toFixed(2) : "-",
      "Balance": parseFloat(item.walletBalance).toFixed(2),
      "Remarks": item.remarks || "-",
      "Agent": item.agent?.username || "N/A"
    }));
  }, [data]);

  const handleFilterSubmit = (dateFilter) => {
    setFilter(prev => ({
      ...prev,
      ...dateFilter,
      page: 1
    }));
    setIsFilterModalOpen(false);
  };

  const handleSearchChange = (value) => {
    setFilter(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleExport = () => {
    if (exportData.length === 0) return;
    
    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Statement Report");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      });

      const start = filter.startDate ? new Date(filter.startDate).toISOString().split('T')[0] : "all";
      const end = filter.endDate ? new Date(filter.endDate).toISOString().split('T')[0] : "all";
      saveAs(blob, `statement-report-${start}-to-${end}.xlsx`);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };


  const customEmptyState = (
    <div className="w-full min-h-[200px] flex flex-col items-center justify-center p-4">
      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-gray-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-gray-500">No statements generated yet</p>
    </div>
  );


  const customErrorState = (
    <div className="w-full min-h-[200px] flex flex-col items-center justify-center p-4">
      <div className="bg-red-100 border-2 border-dashed border-red-300 rounded-xl w-16 h-16 flex items-center justify-center text-red-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="text-sm text-red-600 mb-2">Failed to load statements</div>
      <button
        onClick={refetch}
        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="w-full px-5 py-4 min-h-screen h-auto bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
      {isFilterModalOpen && (
        <StatementFilterModal
          open={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onSubmit={handleFilterSubmit}
          isLoading={isLoading}
        />
      )}
      
      <div className="w-full flex items-center justify-between gap-5 mt-5">
        <div className="flex items-center justify-start w-[70%] gap-5">
          <div className="max-w-[371px] w-[80%] h-[44px] relative bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800 rounded-md border border-[#E4E7EC] dark:border-gray-500">
            <input
              onChange={(e) => handleSearchChange(e.target.value)}
              type="text"
              placeholder="Search transactions..."
              className="bg-transparent dark:placeholder-gray-200 h-full pl-10 transition-all duration-300 absolute left-0 top-0 px-3 py-2 w-full outline-none"
              value={filter.search}
            />
            <Search size={18} className="absolute top-[12px] left-[8px]" />
          </div>
        </div>
        
        <div className="flex items-center justify-end w-[30%] gap-3">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="bg-[#CD0C02] px-4 py-[10px] rounded-md text-white flex items-center gap-2"
          >
            Generate Statement
          </button>
          
          <button
            onClick={handleExport}
            disabled={isLoading || !data || data.data.length === 0}
            className={`px-4 py-[10px] rounded-md flex items-center gap-2 ${
              !isLoading && data && data.data.length > 0
                ? "bg-[#4CAF50] text-white hover:bg-[#3d8b40]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>
      
      <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
        {filter.startDate && filter.endDate && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Showing statements from {new Date(filter.startDate).toLocaleDateString()} 
            {" "}to {new Date(filter.endDate).toLocaleDateString()}
            {data?.meta?.total && ` • ${data.meta.total} records found`}
          </div>
        )}
        
        <ARHCustomDataTable
          data={data?.data || []}
          columns={columns}
          meta={data?.meta || {
            page: filter.page,
            pages: 1,
            total: 0,
            limit: filter.limit
          }}
          loading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          onPageChange={(page) => setFilter(prev => ({ ...prev, page }))}
          onLimitChange={(limit) => 
            setFilter(prev => ({ ...prev, limit, page: 1 }))
          }
          searchQuery={filter.search}
          emptyState={customEmptyState}
          errorState={customErrorState}
          className="border-0"
          rowClassName="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
          onRowClick={(item) => console.log('Row clicked:', item)}
        />
      </div>
    </div>
  );
};

export default StatementReport;