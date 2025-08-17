import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getPurchaseRequests } from "../../services/saleRequest";


function transformPurchaseData(purchases, range) {
  const isMonthly = range === "monthly";
  const categories = isMonthly 
    ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    : Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString("en-US", { weekday: "short" });
      });

  const totals = categories.map(() => ({ amount: 0, count: 0 }));


  const transferPurchases = purchases.filter(purchase => 
    purchase.status?.toLowerCase() === "transfer"
  );

  transferPurchases.forEach(purchase => {
    try {
      const date = new Date(purchase.createdAt);
      let index = -1;
      
      if (isMonthly) {
        index = date.getMonth();
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        const diffTime = today - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 0 && diffDays <= 6) {
          index = 6 - diffDays;
        }
      }

      if (index >= 0 && index < totals.length) {
        totals[index].amount += parseFloat(purchase.amount) || 0;
        totals[index].count += 1;
      }
    } catch (e) {
      console.warn("Failed to process purchase:", purchase, e);
    }
  });

  return {
    categories,
    sales: totals.map(item => item.amount),
    volume: totals.map(item => item.count)
  };
}

export default function CombinedStatisticsChart() {
  const [timeRange, setTimeRange] = useState("monthly");
  
  const getDateRangeStart = (range) => {
    const now = new Date();
    switch(range) {
      case "daily": 
        const dailyStart = new Date(now);
        dailyStart.setDate(now.getDate() - 6);
        return dailyStart.toISOString();
      case "monthly":
        return new Date(now.getFullYear(), 0, 1).toISOString(); 
      default:
        return new Date(now.getFullYear(), 0, 1).toISOString();
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["purchaseRequests", timeRange],
    queryFn: () => getPurchaseRequests({
      'createdAt[gte]': getDateRangeStart(timeRange),
      'createdAt[lte]': new Date().toISOString()
    }),
    select: (response) => {
      try {
        return transformPurchaseData(response?.data || [], timeRange);
      } catch (e) {
        console.error("Data transformation error:", e);
        return {
          categories: timeRange === "monthly" 
            ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            : Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toLocaleDateString("en-US", { weekday: "short" });
              }),
          sales: Array(timeRange === "monthly" ? 12 : 7).fill(0),
          volume: Array(timeRange === "monthly" ? 12 : 7).fill(0)
        };
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  const chartOptions = useMemo(() => ({
    legend: { show: false },
    colors: ["#CD0202", "#FBBF24"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    stroke: { curve: "smooth", width: [2, 2] },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 }
    },
    markers: { size: 4 },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      x: { format: "dd MMM yyyy" },
      y: {
        formatter: (value) => `${value.toLocaleString()}`
      }
    },
    xaxis: {
      type: "category",
      categories: data?.categories || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false }
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
        formatter: (value) => value.toLocaleString()
      },
      title: { text: "", style: { fontSize: "0px" } }
    },
    noData: {
      text: "No transfer data available",
      align: 'center',
      verticalAlign: 'middle',
      style: {
        color: "#6B7280",
        fontSize: '14px',
        fontFamily: "Outfit, sans-serif"
      }
    }
  }), [data]);

  const chartSeries = useMemo(() => [
    { 
      name: "Sales (Transfer)", 
      data: data?.sales || Array(timeRange === "monthly" ? 12 : 7).fill(0) 
    },
    { 
      name: "Volume (Transfer)", 
      data: data?.volume || Array(timeRange === "monthly" ? 12 : 7).fill(0) 
    }
  ], [data, timeRange]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Purchase Stock Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Purchase Stock targets for each {timeRange === "monthly" ? "month" : "week"}
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setTimeRange("monthly")}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === "monthly" 
                  ? "bg-white dark:bg-gray-700 shadow-sm font-medium" 
                  : "text-gray-500"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeRange("daily")}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === "daily" 
                  ? "bg-white dark:bg-gray-700 shadow-sm font-medium" 
                  : "text-gray-500"
              }`}
            >
              Weekly
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[310px] flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading transfer data...</div>
        </div>
      ) : isError ? (
        <div className="h-[310px] flex flex-col items-center justify-center text-red-500 gap-2">
          <div>Error loading transfer data</div>
          {error && <div className="text-xs text-gray-500">{error.message}</div>}
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px] xl:min-w-full">
            <Chart 
              options={chartOptions} 
              series={chartSeries} 
              type="area" 
              height={310}
            />
          </div>
        </div>
      )}
    </div>
  );
}