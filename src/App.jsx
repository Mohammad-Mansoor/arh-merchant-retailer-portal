import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import PrivateRoute from "./pages/AuthPages/privateRoute";
import ManageWallet from "./pages/wallet/manageWallet";
import TransferFromComissionToPrimary from "./pages/wallet/transferFromComissionToPrimary";
import StockTransferToDownlineAgents from "./pages/wallet/stockTransferToDownlineAgents";
import ManageAgent from "./pages/agentManagement/manageAgent";
import RollbackOperation from "./pages/RollbackOperation";
import ProductList from "./pages/Products/productList";
import Recharge from "./pages/Products/RechargeTopup";
import AgentProfile from "./pages/agentManagement/manageAgent/components/AgentDetails";
import ProductActivation from "./pages/Reports/TransactionReport";
import StockOutInReport from "./pages/Reports/stockOut-inReport";
import DownlineReport from "./pages/Reports/downlineReport";
import RollbackReport from "./pages/Reports/rollbackReport";
import TopupRechargeReport from "./pages/Reports/topupRechargeReport";
import ContactUs from "./pages/ContactUs";
import Tutorial from "./pages/Tutorial";
import DownlineProductActivation from "./pages/Reports/downlineProductActivation";
import DownlineRechargeReport from "./pages/Reports/downlineRechargeReport";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* 🔐 Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              {/*
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              <Route path="/form-elements" element={<FormElements />} />
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} /> */}
              <Route path="/manage-wallet" element={<ManageWallet />} />
              <Route path="/product-list" element={<ProductList />} />
              <Route path="/recharge" element={<Recharge />} />
              <Route
                path="/comission-to-primary"
                element={<TransferFromComissionToPrimary />}
              />
              <Route
                path="/stock-transfer-downline"
                element={<StockTransferToDownlineAgents />}
              />
              <Route path="/manage-agent" element={<ManageAgent />} />
              <Route path="/manage-agent/:id" element={<AgentProfile />} />
              <Route
                path="/rollback-operation"
                element={<RollbackOperation />}
              />
              <Route
                path="/transaction-report"
                element={<ProductActivation />}
              />
              <Route
                path="/stock-out-in-report"
                element={<StockOutInReport />}
              />
              <Route
                path="/downline-product-activation"
                element={<DownlineProductActivation />}
              />
              <Route
                path="/downline-recharge-report"
                element={<DownlineRechargeReport />}
              />
              <Route path="/downline-report" element={<DownlineReport />} />
              <Route path="/rollback-report" element={<RollbackReport />} />
              <Route path="/topup-report" element={<TopupRechargeReport />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/toturial" element={<Tutorial />} />
            </Route>
          </Route>

          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
