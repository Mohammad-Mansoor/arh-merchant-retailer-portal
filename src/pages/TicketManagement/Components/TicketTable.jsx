import React, { useState } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import ViewTicketModal from "./ViewTicketModal";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function MerchantTicketsTable({
  data = [],
  isLoading = false,
  isError = false,
  onRetry = () => {},
  currentPage = 1,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
}) {
  const totalPages = Math.ceil(totalCount / rowsPerPage) || 1;
  const [viewTicketModalOpen, setViewTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setViewTicketModalOpen(true);
  };
  return (
    <div className="overflow-hidden  rounded-xl border border-gray-200 bg-white">
      <ViewTicketModal
        open={viewTicketModalOpen}
        onClose={() => setViewTicketModalOpen(false)}
        ticket={selectedTicket}
      />
      <div className="overflow-x-auto min-h-[55vh]">
        <table className="min-w-full divide-y  divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["ID", "Type", "Description", "Status", "Created At", "Actions"].map(header => (
                <th 
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : data.map(ticket => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ticket.ticketType?.name || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {ticket.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(ticket.createdAt), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
          onClick={() => handleViewTicket(ticket)}
          className="text-red-600 hover:text-red-900"
        >
          View
        </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
     <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 gap-4 h-[120px]">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span>Rows per page</span>
          <select
            // value={limit}
            // onChange={handleRowsPerPageChange}
            className="border rounded-md px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            {/* {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))} */}
          </select>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300">
          Page page of {totalPages}
        </div>
        {/* <div className="text-sm text-gray-600 dark:text-gray-300">
          Total Records {totalRecords}
        </div> */}

        <div className="flex items-center gap-1">
          <button
            // onClick={() => goToPage(1)}
            // disabled={page === 1}
            className="px-2 py-2 text-sm rounded bg-[#F7F7F7] hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronsLeft className="w-[16px] h-[16px]"/>
          </button>
          <button
            // onClick={() => goToPage(page - 1)}
            // disabled={page === 1}
            className="px-2 py-2 text-sm rounded bg-[#F7F7F7] hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronLeft className="w-[16px] h-[16px]"/>
          </button>
          <button
            // onClick={() => goToPage(page + 1)}
            // disabled={page === totalPages}
            className="px-2 py-2 text-sm rounded bg-[#F7F7F7] hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronRight className="w-[16px] h-[16px]"/>
          </button>
          <button
            // onClick={() => goToPage(totalPages)}
            // disabled={page === totalPages}
            className="px-2 py-2 text-sm rounded bg-[#F7F7F7] hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
           <ChevronsRight className="w-[16px] h-[16px]"/>
          </button>
        </div>
      </div>
    </div>
  );
}