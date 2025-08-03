import { Search, ListFilter } from "lucide-react";

// import RollbackModal from "./components/RollbackModal";
import { useState } from "react";
import RollbackReportTable from "./components/table";

function RollbackReport() {
  const [reportModal, setReportModal] = useState(false);

  const closeReportModal = () => {
    setReportModal(false);
  };
  return (
    <div
      className="w-full px-5 py-4 h-screen  "
      style={{
        background:
          "linear-gradient(135deg, #EFF2FF 0%, #FAF5FF 50%, #FCF3FB 100%) ",
      }}
    >
      {/* <RollbackModal open={reportModal} onClose={closeReportModal} /> */}
      {/* Search and filter section */}
      <div className="w-full flex items-center justify-between gap-5 mt-5">
        <div className="flex items-center justify-start w-[70%] gap-5">
          <div className="max-w-[371px] w-[80%] h-[44px] relative bg-gradient-to-r from-[#F8F4FF] to-[#FAF9F3] dark:from-slate-800 dark:text-white dark:to-slate-800 rounded-md border border-[#E4E7EC] dark:border-gray-500 ">
            <input
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
            onClick={() => setRollbackModal(true)}
            className="bg-[#CD0C02] px-3 py-[10px] rounded-md text-white"
          >
            Export
          </button>
        </div>
      </div>

      {/* table section */}
      <div className="mt-5">
        <RollbackReportTable />
      </div>
    </div>
  );
}

export default RollbackReport;
