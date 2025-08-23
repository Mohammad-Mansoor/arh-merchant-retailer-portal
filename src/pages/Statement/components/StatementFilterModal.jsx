import React, { useState } from "react";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";

const StatementFilterModal = ({ 
  open, 
  onClose, 
  onSubmit,
  isLoading 
}) => {
  const [filterType, setFilterType] = useState("currentMonth");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const {t} = useTranslation();

  const handleSubmit = () => {
    let filter = {};
    
    switch(filterType) {
      case "currentMonth":
        const now = new Date();
        filter = {
          startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()
        };
        break;
        
      case "previousMonth":
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        filter = {
          startDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString(),
          endDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).toISOString()
        };
        break;
        
      case "custom":
        if (!startDate || !endDate) {
          alert(t("pleaseSelectB"));
          return;
        }
        filter = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        };
        break;
    }
    
    onSubmit(filter);
  };

  return (
    open && (
      <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
           {t("generateS")}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("filterT")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["currentMonth", "previousMonth", "custom"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`py-2 px-3 rounded-md text-sm ${
                      filterType === type
                        ? "bg-[#CD0C02] text-white"
                        : "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300"
                    }`}
                  >
                    {type === "currentMonth" && "Current Month"}
                    {type === "previousMonth" && "Previous Month"}
                    {type === "custom" && "Custom Range"}
                  </button>
                ))}
              </div>
            </div>
            
            {filterType === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("startD")}
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="w-full p-2 border rounded-md dark:bg-slate-700 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("endD")}
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="w-full p-2 border rounded-md dark:bg-slate-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-300"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-[#CD0C02] text-white rounded-md hover:bg-[#a00a00] disabled:opacity-70"
              >
                {isLoading ? t("generating...") : t("generateS")}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default StatementFilterModal;