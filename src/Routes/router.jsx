import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import Main from "../Layout/Main";
import UserManagement from "../Page/DashBoard/Admin/UserManagement";
import DashHome from "../Page/DashBoard/DashHome/DashHome";
import SendMoney from "../Page/DashBoard/User/SendMoney";
import UserTransactions from "../Page/DashBoard/User/UserTransactions";
import Home from "../Page/Home/Home";
import Login from "../Page/Login/Login";
import Register from "../Page/Register/Register";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
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
        element: <UserManagement />,
      },
      {
        path: "send-Money",
        element: <SendMoney />,
      },
      {
        path: "UserTransactions",
        element: <UserTransactions />,
      },
    ],
  },
]);
