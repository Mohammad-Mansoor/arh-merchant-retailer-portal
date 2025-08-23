import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";

import StatisticsChart from "../../components/ecommerce/StatisticsChart";

import CombinedStatisticsChart1 from "../../components/ecommerce/StatisticsChart1";
import CombinedStatisticsChart2 from "../../components/ecommerce/Statics2";


export default function Home() {
  return (
    <>
     
      <div className="grid grid-cols-12 gap-4 p-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <EcommerceMetrics />
     
       
        </div>

     

        <div className="col-span-12">
          <StatisticsChart />
     
        </div>
  <div className="col-span-12">
    
          <CombinedStatisticsChart1 />
        </div>
          <div className="col-span-12">
    
          <CombinedStatisticsChart2 />
        </div>
    
      </div>
    </>
  );
}
