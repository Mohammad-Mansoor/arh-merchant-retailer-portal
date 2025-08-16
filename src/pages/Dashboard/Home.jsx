import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import Filter from "../../components/Data Filter/Filter";
import CombinedStatisticsChart1 from "../../components/ecommerce/StatisticsChart1";


export default function Home() {
  return (
    <>
     
      <div className="grid grid-cols-12 gap-4 p-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <EcommerceMetrics />
     
          {/* <Filter/> */}

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
     
        </div>
  <div className="col-span-12">
    
          <CombinedStatisticsChart1 />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-12">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
