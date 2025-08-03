import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import CircularProgress from "@mui/material/CircularProgress";

const rowsPerPageOptions = [6, 10, 25];

export default function WalletReportTable({
  data,
  loading,
  isError,
  error,
  onPageChange,
  onLimitChange,
  limit,
}) {
  const { data: transactions = [], meta = {} } = data || {};
  const { page = 1, totalPages = 1, totalRecords = 0 } = meta;

  const handleRowsPerPageChange = (e) => {
    onLimitChange(parseInt(e.target.value));
  };

  const goToPage = (targetPage) => {
    if (targetPage >= 1 && targetPage <= totalPages) {
      onPageChange(targetPage);
    }
  };

  // if (loading) return <div className="p-4">Loading...</div>;
  // if (isError)
  //   return <div className="p-4 text-red-500">Error: {error?.message}</div>;

  return (
    <div className="overflow-hidden flex flex-col rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto flex-1">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-white/[0.02]">
            <TableRow>
              {[
                "From Wallet",
                "To Wallet",
                "Type",
                "Amount",
                "Opening Balance",
                "Closing Balance",
                "is Stock",
                "Product",
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
            {transactions.map((item, idx) => (
              <TableRow
                key={idx}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.05]"
              >
                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {item?.from_wallet_id}
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {item?.to_wallet_id || "-"}
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {item?.type || "-"}
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {item.amount}
                </TableCell>
                <TableCell
                  className={`px-5 py-3 text-sm text-gray-700 dark:text-gray-300`}
                >
                  {item?.opening_balance || "-"}
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {item?.closing_balance || "-"}
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {item?.is_stock ? "Yes" : "No"}
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {item?.product?.productName?.en || "-"}
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {new Date(item.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {transactions.length === 0 && !loading && !isError ? (
          <div className="w-full min-h-[200px] flex flex-col items-center justify-center">
            <img
              src="public/images/Search.png"
              className="w-[170px] h-[170px]"
            />
            <p>No Data Found!</p>
          </div>
        ) : loading && !isError ? (
          <div className="w-full min-h-[200px] flex items-center justify-center">
            <div className="w-full flex items-center justify-center min-h-[42px]">
              <CircularProgress size={42} />
            </div>
          </div>
        ) : !loading && isError ? (
          <div className="p-4 text-red-500">Error: {error?.message}</div>
        ) : null}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 gap-4 h-[120px]">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span>Rows per page</span>
          <select
            value={limit}
            onChange={handleRowsPerPageChange}
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
          Page {page} of {totalPages}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Total Records {totalRecords}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => goToPage(1)}
            disabled={page === 1}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            «
          </button>
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            ‹
          </button>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            ›
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={page === totalPages}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
