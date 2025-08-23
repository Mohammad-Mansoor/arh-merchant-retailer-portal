import React from "react";
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search as SearchIcon } from "lucide-react";
import LimitSelect from "../ui/LimitSelect";
import { useTranslation } from "react-i18next";

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [6, 10, 25];

export default function ARHCustomDataTable({
  data = [],
  columns = [],
  meta = {},
  loading = false,
  isError = false,
  error = null,
  onRetry = () => {},
  onPageChange = () => {},
  onLimitChange = () => {},
  onRowClick = () => {},
  searchQuery = "",
  rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE_OPTIONS,
  className = "",
  headerClassName = "",
  rowClassName = "",
  cellClassName = "",
  emptyState = null,
  errorState = null,
  loadingState = null,
}) {
  const { 
    page: currentPage = 1, 
    pages: totalPages = 1, 
    total: totalRecords = 0,
    limit: currentLimit = rowsPerPageOptions[0]
  } = meta || {};
  const {t} = useTranslation();
  const startItem = (currentPage - 1) * currentLimit + 1;
  const endItem = Math.min(currentPage * currentLimit, totalRecords);

  const goToPage = (targetPage) => {
    if (targetPage >= 1 && targetPage <= totalPages) {
      onPageChange(targetPage);
    }
  };

  const defaultEmptyState = (
    <div className="w-full min-h-[200px] flex flex-col items-center justify-center p-4">
      <div className="text-gray-400 mb-2">
        <SearchIcon size={48} />
      </div>
      <p className="text-gray-500">
        {searchQuery 
          ? `No results found for "${searchQuery}"`
          : "No data available"}
      </p>
    </div>
  );

  const defaultErrorState = (
    <div className="p-4 text-center">
      <div className="text-red-500 mb-2">Error: {error?.message || "Failed to load data"}</div>
      <button
        onClick={onRetry}
        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );

  const defaultLoadingState = Array(currentLimit || rowsPerPageOptions[0]).fill(0).map((_, i) => (
    <TableRow key={`skeleton-${i}`}>
      {columns.map((_, j) => (
        <TableCell key={`skeleton-cell-${i}-${j}`} className="px-5 py-3">
          <div className="w-full h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  ));

  return (
    <div className={`overflow-hidden flex flex-col rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] ${className}`}>
      {searchQuery && (
        <div className="px-4 py-2 text-sm text-gray-600 tex dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
          {t("showing1")} "{searchQuery}"
        </div>
      )}

      <div className="max-w-full min-h-[60vh] max-h-[70vh] overflow-x-auto flex-1 relative">
        <ShadTable>
          <TableHeader className={`bg-gray-50 px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider dark:bg-white/[0.02] ${headerClassName}`}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  isHeader
                  className={`px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 ${column.headerClassName || ""}`}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              loadingState || defaultLoadingState
            ) : isError ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="px-5 py-3 text-center min-h-[60vh]"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {errorState || defaultErrorState}
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="px-5 py-3 text-center min-h-[60vh]"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {emptyState || defaultEmptyState}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow
                  key={item.id || index}
                  className={`hover:bg-gray-50 dark:hover:bg-white/[0.05] ${rowClassName}`}
                  onClick={() => onRowClick(item)}
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={`${item.id}-${column.key}`} 
                      className={`px-5 py-3 text-sm text-gray-700 dark:text-gray-300 ${cellClassName} ${column.cellClassName || ""}`}
                    >
                      {column.render 
                        ? column.render(item) 
                        : (item[column.key] || "-")
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </ShadTable>
      </div>

      {totalRecords > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t dark:border-gray-700 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t("show")} {startItem} {t("to")} {endItem} {t("of")} {totalRecords} {t("records")}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>{t("row1")}</span>
              <LimitSelect
                value={currentLimit} 
                onChange={onLimitChange} 
                options={rowsPerPageOptions} 
              />
            </div>

            <div className="flex rtl:flex-row-reverse items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                aria-label="First page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-sm">
                {t("page")} {currentPage} {t("of")} {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                aria-label="Last page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}