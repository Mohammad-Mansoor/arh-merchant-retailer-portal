import { Wallet, Search, ListFilter } from "lucide-react";
import AgentListTable from "./components/table";
import { useRef, useState } from "react";
import TransferModal from "./components/TransferModal";
import { useQuery } from "@tanstack/react-query";
import { getDownlineAgents } from "../../../services/agent_management_service";
import { useSelector } from "react-redux";
import { handleSetSearch } from "../../../utils/searchDebouncing";

function ManageAgent() {
  const searchRef = useRef(null);
  const userInfo = useSelector((state) => state.auth.user);
  const [refetch, setRefetch] = useState(false);
  const [filter, setFilter] = useState({
    search: "",
    limit: 10,
    page: 1,
    parent_agent_id: userInfo?.id,
  });
  const [createAgentModalOpen, setCreateAgentModalOpen] = useState(false);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["downlineAgents", filter, refetch],
    queryFn: () => getDownlineAgents(userInfo?.id),
  });
  const handleRefetch = () => {
    setRefetch((prev) => !prev);
  };
  const handleSearchChange = (value) => {
    setFilter((prev) => ({
      ...prev,
      ["search"]: value,
    }));
  };
  const closeCreateAgentModal = () => {
    setCreateAgentModalOpen(false);
  };

  return (
    <div className="w-full px-5 py-4 min-h-screen h-auto bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
      <TransferModal
        open={createAgentModalOpen}
        onClose={closeCreateAgentModal}
        refetch={handleRefetch}
        closeCreateAgentModal={closeCreateAgentModal}
      />
      {/* Search and filter section */}
      <div className="w-full flex items-center justify-between gap-5 mt-5">
        <div className="flex items-center justify-start w-[70%] gap-5">
          <div className="max-w-[371px] w-[80%] h-[44px] relative bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800 rounded-md border border-[#E4E7EC] dark:border-gray-500 ">
            <input
              onChange={(e) => {
                handleSetSearch(handleSearchChange, e.target.value, searchRef);
              }}
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
        <div className="flex items-center justify-end w-[30%]">
          <button
            onClick={() => setCreateAgentModalOpen(true)}
            className="bg-[#CD0C02] px-3 py-[10px] rounded-md text-white"
          >
            Create Agent
          </button>
        </div>
      </div>

      {/* table section */}
      <div className="mt-5">
        <AgentListTable
          data={data?.data || []}
          isLoading={isLoading}
          isError={isError}
          onRetry={handleRefetch}
          currentPage={filter.page}
          rowsPerPage={filter.limit}
          totalCount={data?.meta?.totalRecords || 0}
          onPageChange={(page) => setFilter((prev) => ({ ...prev, page }))}
          onRowsPerPageChange={(limit) =>
            setFilter((prev) => ({ ...prev, limit, page: 1 }))
          }
        />
      </div>
    </div>
  );
}

export default ManageAgent;
