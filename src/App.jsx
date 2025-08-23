import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import PrivateRoute from "./pages/AuthPages/privateRoute";
import ManageWallet from "./pages/wallet/manageWallet";

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

// Role-based route protection component
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);
  const userAccountType = user?.agentDetail?.accountType;
  console.log(userAccountType, "this is user account")
  
  if (!user) {
    return <Navigate to="/signin" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userAccountType)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
  
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
    
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
      
              <Route index element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/manage-wallet" element={<ManageWallet />} />
              <Route path="/product-list" element={<ProductList />} />
              <Route path="/recharge" element={<Recharge />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/ticket-management" element={<TicketManagement />} />
              <Route path="/request-reverse" element={<RequestToReverse />} />
              
              {/* Routes restricted to merchants and retailers */}
              <Route 
                path="/stock-transfer-downline" 
                element={
                  <RoleProtectedRoute allowedRoles={["merchant", "retailer"]}>
                    <StockTransferToDownlineAgents />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="/purchase-stock" 
                element={
                  <RoleProtectedRoute allowedRoles={[, "retailer"]}>
                    <PurchaseStock />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="/statment" 
                element={
                  <RoleProtectedRoute allowedRoles={["merchant", "retailer"]}>
                    <Statement />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="/manage-agent" 
                element={
                  <RoleProtectedRoute allowedRoles={["merchant", "retailer"]}>
                    <ManageAgent />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="/agent-profile/:id" 
                element={
                  <RoleProtectedRoute allowedRoles={["merchant", "retailer"]}>
                    <AgentProfile />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="/edit-agent/:id" 
                element={
                  <RoleProtectedRoute allowedRoles={["merchant", "retailer"]}>
                    <EditAgent />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="/rollback-operation" 
                element={
                  <RoleProtectedRoute allowedRoles={["merchant", "retailer"]}>
                    <RollbackOperation />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="/transaction-report" 
                element={
                  <RoleProtectedRoute allowedRoles={["merchant", "retailer"]}>
                    <ProductActivation />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="/stock-out-in-report" 
                element={
                  <RoleProtectedRoute allowedRoles={["merchant", "retailer"]}>
                    <StockOutInReport />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="/downline-product-activation" 
                element={
                  <RoleProtectedRoute allowedRoles={["merchant", "retailer"]}>
                    <DownlineProductActivation />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="/downline-recharge-report" 
                element={
                  <RoleProtectedRoute allowedRoles={["merchant", "retailer"]}>
                    <DownlineRechargeReport />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="/downline-report" 
                element={
                  <RoleProtectedRoute allowedRoles={["merchant", "retailer"]}>
                    <DownlineReport />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="/rollback-report" 
                element={
                  <RoleProtectedRoute allowedRoles={["merchant", "retailer"]}>
                    <RollbackReport />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="/topup-report" 
                element={
                  <RoleProtectedRoute allowedRoles={["merchant", "retailer"]}>
                    <TopupRechargeReport />
                  </RoleProtectedRoute>
                } 
              />
            </Route>
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}