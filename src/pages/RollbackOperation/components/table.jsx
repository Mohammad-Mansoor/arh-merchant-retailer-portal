import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

const transactionData = [
  {
    dateTime: "2025-03-25 14:35",
    type: "IN",
    from: "Ahmad (ARH-00001)",
    to: "Ahmad (ARH-C00001)",
    amount: "+20,000 AFN",
    amountColor: "text-green-600",
    balance: "1,210,000 AFN",
    recordId: "TO000001",
  },
  {
    dateTime: "2025-03-24 18:12",
    type: "Out",
    from: "ARH-00001",
    to: "ARH-00001",
    amount: "-10,000 AFN",
    amountColor: "text-red-600",
    balance: "1,190,000 AFN",
    recordId: "TR000001",
  },
  // Add more mock rows here to test pagination
];

const rowsPerPageOptions = [6, 10, 25];

export default function RollbackTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const totalPages = Math.ceil(transactionData.length / rowsPerPage);
  const paginatedData = transactionData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="overflow-hidden flex flex-col rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto flex-1">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-white/[0.02]">
            <TableRow>
              {[
                "Date And Time",
                "Type",
                "From",
                "To",
                "Amount",
                "Balance",
                "Record ID",
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
            {paginatedData.map((item, idx) => (
              <TableRow
                key={idx}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.05]"
              >
                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {item.dateTime}
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {item.type}
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {item.from}
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {item.to}
                </TableCell>
                <TableCell
                  className={`px-5 py-3 text-sm font-medium ${item.amountColor}`}
                >
                  {item.amount}
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {item.balance}
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {item.recordId}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 gap-4 h-[120px]">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span>Rows per page</span>
          <select
            value={rowsPerPage}
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
          Page {currentPage} of {totalPages}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            «
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            ‹
          </button>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            ›
          </button>
          <button
            onClick={() => goToPage(totalPages)}
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
