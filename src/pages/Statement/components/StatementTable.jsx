import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

const StatementTable = ({
  data = [],
  isLoading = false,
  isError = false,
  onRetry = () => {},
  currentPage = 1,
  rowsPerPage = 6,
  totalCount = 0,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
}) => {
  const totalPages = Math.ceil(totalCount / rowsPerPage) || 1;
  const rowsPerPageOptions = [6, 10, 25];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AFN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="overflow-hidden flex flex-col rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto flex-1">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-white/[0.02]">
            <TableRow>
              {[
                "Date",
                "Transaction ID",
                "Type",
                "Debit",
                "Credit",
                "Balance",
                "Remarks",
                "Agent"
              ].map((label) => (
                <TableCell
                  key={label}
                  isHeader
                  className="px-4 py-3 font-medium text-gray-600 text-start text-sm dark:text-gray-400"
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
                    {[...Array(8)].map((_, j) => (
                      <TableCell key={j} className="px-4 py-3">
                        <div className="w-full h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {item.transactionId}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {item.transactionType}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
                      {item.debit ? formatCurrency(parseFloat(item.debit)) : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                      {item.credit ? formatCurrency(parseFloat(item.credit)) : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {formatCurrency(parseFloat(item.walletBalance))}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {item.remarks || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {item.agent?.username || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {data.length === 0 && !isError && !isLoading && (
        <div className="w-full min-h-[200px] flex flex-col items-center justify-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-gray-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">No statements generated yet</p>
        </div>
      )}

      {isError && (
        <div className="w-full min-h-[200px] flex flex-col items-center justify-center">
          <div className="bg-red-100 border-2 border-dashed border-red-300 rounded-xl w-16 h-16 flex items-center justify-center text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-sm text-red-600 mb-2">Failed to load statements</div>
          <button
            onClick={onRetry}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Pagination */}
      {(data.length > 0 || isLoading) && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 gap-4">
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
              disabled={currentPage === 1 || isLoading}
              className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              «
            </button>
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoading}
              className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              ‹
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              ›
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages || isLoading}
              className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatementTable;