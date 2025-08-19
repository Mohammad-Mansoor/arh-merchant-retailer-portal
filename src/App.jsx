import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
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
import ProductActivation from "./pages/Reports/TransactionReport";
import StockOutInReport from "./pages/Reports/stockOut-inReport";
import DownlineReport from "./pages/Reports/downlineReport";
import RollbackReport from "./pages/Reports/rollbackReport";
import TopupRechargeReport from "./pages/Reports/topupRechargeReport";
import DownlineProductActivation from "./pages/Reports/downlineProductActivation";
import DownlineRechargeReport from "./pages/Reports/downlineRechargeReport";
import PurchaseStock from "./pages/Stock/PurchaseStock";
import RequestToReverse from "./pages/Stock/RequestToReverseStock";
import Orders from "./pages/Stock/Orders";
import TicketManagement from "./pages/TicketManagement";
import Statement from "./pages/Statement";
import AgentProfile from "./pages/agentManagement/manageAgent/components/AgentDetails";
import EditAgent from "./pages/agentManagement/manageAgent/components/EditAgent";

export default function App() {
  return (
    <>
      <Router basename="/merchant">
        <ScrollToTop />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
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
              <Route path="/purchase-stock" element={<PurchaseStock />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/statment" element={<Statement />} />
              <Route path="/ticket-management" element={<TicketManagement />} />
              <Route path="/request-reverse" element={<RequestToReverse />} />
              <Route path="/manage-agent" element={<ManageAgent />} />
              <Route path="/agent-profile/:id" element={<AgentProfile />} />
              <Route path="/edit-agent/:id" element={<EditAgent />} />
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
            </Route>
          </Route>

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
