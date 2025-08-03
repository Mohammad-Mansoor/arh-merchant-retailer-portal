import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

const rowsPerPageOptions = [6, 10, 25];

export default function DownlineStockTransferTable({
  data = [],
  isLoading = false,
  isError = false,
  onRetry = () => {},
  currentPage = 1,
  rowsPerPage = 6,
  totalCount = 0,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
}) {
  const totalPages = Math.ceil(totalCount / rowsPerPage) || 1;

  return (
    <div className="overflow-hidden flex flex-col rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto flex-1">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-white/[0.02]">
            <TableRow>
              {[
                "Agent",
                "Amount",
                "Commission Rate",
                "Total Amount",

                "Created At",
              ].map((label) => (
                <TableCell
                  key={label}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-sm dark:text-gray-400"
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {isLoading
              ? [...Array(rowsPerPage)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(6)].map((_, j) => (
                      <TableCell key={j} className="px-5 py-3">
                        <div className="w-full h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : data.map((item, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                  >
                    <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {item?.downlineAgent?.username || "-"}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {item?.amount || "-"}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {item?.commission_rate
                        ? `${item?.commission_rate}%`
                        : "-"}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {item?.total_amount || "-"}
                    </TableCell>

                    <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {new Date(item?.createdAt).toLocaleString() || "-"}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {data.length === 0 && !isError && !isLoading ? (
        <div className="w-full min-h-[200px] flex flex-col items-center justify-center">
          <img src="public/images/Search.png" className="w-[170px] h-[170px]" />
          <p>No Data Found!</p>
        </div>
      ) : isError ? (
        <div className="w-full min-h-[200px] flex flex-col items-center justify-center">
          <img src="public/images/Search.png" className="w-[170px] h-[170px]" />
          <div className="text-sm text-red-600 mb-2">Failed to load data.</div>
          <button
            onClick={onRetry}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : null}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 gap-4 h-[120px]">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span>Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="border rounded-md px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            «
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            ‹
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            ›
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
