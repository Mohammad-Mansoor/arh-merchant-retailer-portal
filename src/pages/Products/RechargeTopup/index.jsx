import { Wallet, Search, ListFilter } from "lucide-react";
import TopUpModal from "./components/TopUpModal";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getAllRechargeLogs } from "../../../services/product_management_service.js";
import { handleSetSearch } from "../../../utils/searchDebouncing.js";
import ARHCustomDataTable from "../../../components/dataTable/ARHCustomDataTable.jsx";

function Recharge() {
  const [topupModalOpen, setTopupModalOpen] = useState(false);
  const searchRef = useRef(null);
  const userInfo = useSelector((state) => state.auth.user);
  const [refetch, setRefetch] = useState(false);
  const [filter, setFilter] = useState({
    search: "",
    limit: 10,
    page: 1,
    agentId: userInfo?.id,
  });



  
  const closeTopupModal = () => setTopupModalOpen(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rechargeLogs", filter, refetch],
    queryFn: () => getAllRechargeLogs(userInfo?.id),
  });

  const handleRefetch = () => setRefetch((prev) => !prev);
   const handleTopUpSuccess = () => {
    setTopupModalOpen(false); 
    refetch(); 
  };


  const handleSearchChange = (value) => {
    setFilter((prev) => ({
      ...prev,
      ["search"]: value,
      page: 1 
    }));
  };

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
      render: (item) => "View Details" // Placeholder for actions
    }
  ];

  // Custom empty state
  const customEmptyState = (
    <div className="w-full min-h-[200px] flex flex-col items-center justify-center">
      <img 
        src="public/images/Search.png" 
        alt="No data found" 
        className="w-[170px] h-[170px]"
      />
      <p className="mt-2 text-gray-500">No Data Found!</p>
    </div>
  );

  // Custom error state
  const customErrorState = (
    <div className="w-full min-h-[200px] flex flex-col items-center justify-center">
      <img 
        src="public/images/Search.png" 
        alt="Error occurred" 
        className="w-[170px] h-[170px]"
      />
      <div className="text-sm text-red-600 mb-2">
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
      <TopUpModal open={topupModalOpen} onClose={closeTopupModal} onSuccess={handleTopUpSuccess} />

      <div className="w-full flex items-center justify-between gap-5 mt-5">
        <div className="flex items-center justify-start w-[70%] gap-5">
          <div className="max-w-[371px] w-[80%] h-[44px] relative dark:text-white rounded-md border border-[#E4E7EC] dark:border-gray-500">
            <input
              onChange={(e) => {
                handleSetSearch(handleSearchChange, e.target.value, searchRef);
              }}
              type="text"
              placeholder="Search..."
              className="bg-transparent dark:placeholder-gray-200 h-full pl-10 transition-all duration-300 absolute left-0 top-0 px-3 py-2 w-full outline-none"
            />
            <Search size={18} className="absolute top-[12px] left-[8px]" />
          </div>

          <div className="max-w-[95px] cursor-pointer w-[20%] border border-[#E4E7EC] rounded-md dark:border-gray-500 px-3 py-2 h-[44px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800">
            <ListFilter
              size={24}
              className="dark:text-gray-300 text-[#667085]"
            />
            <p className="dark:text-gray-300 text-[#667085] text-[16px]">
              filter
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end w-[30%]">
          <button
            onClick={() => setTopupModalOpen(true)}
            className="bg-[#CD0C02] px-3 py-[10px] rounded-md text-white"
          >
            Top Up
          </button>
        </div>
      </div>

  
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
    </div>
  );
}

export default Recharge;