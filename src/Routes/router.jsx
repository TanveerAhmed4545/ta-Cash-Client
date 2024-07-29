import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import Main from "../Layout/Main";
import AllTransactions from "../Page/DashBoard/Admin/AllTransactions";
import UserManagement from "../Page/DashBoard/Admin/UserManagement";
import AgentTransactions from "../Page/DashBoard/Agent/AgentTransactions";
import TransactionManagement from "../Page/DashBoard/Agent/TransactionManagement";
import DashHome from "../Page/DashBoard/DashHome/DashHome";
import CashIn from "../Page/DashBoard/User/CashIn";
import CashOut from "../Page/DashBoard/User/CashOut";
import SendMoney from "../Page/DashBoard/User/SendMoney";
import UserTransactions from "../Page/DashBoard/User/UserTransactions";
import Login from "../Page/Login/Login";
import Register from "../Page/Register/Register";
import AdminRoute from "./AdminRoute";
import AgentRoute from "./AgentRoute";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Login />,
      },

      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DashHome />
          </PrivateRoute>
        ),
      },
      {
        path: "user-Management",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "allTransactions",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AllTransactions />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "send-Money",
        element: (
          <PrivateRoute>
            <SendMoney />
          </PrivateRoute>
        ),
      },
      {
        path: "userTransactions",
        element: (
          <PrivateRoute>
            <UserTransactions />
          </PrivateRoute>
        ),
      },
      {
        path: "agentTransactions",
        element: (
          <PrivateRoute>
            <AgentRoute>
              <AgentTransactions />
            </AgentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "cashOut",
        element: (
          <PrivateRoute>
            <CashOut />
          </PrivateRoute>
        ),
      },
      {
        path: "cashIn",
        element: (
          <PrivateRoute>
            <CashIn />
          </PrivateRoute>
        ),
      },
      {
        path: "transferManagement",
        element: (
          <PrivateRoute>
            <AgentRoute>
              <TransactionManagement />
            </AgentRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
]);
