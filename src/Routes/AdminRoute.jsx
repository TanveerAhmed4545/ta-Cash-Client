/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import useRole from "../hooks/useRole";

const AdminRoute = ({ children }) => {
  const [role, isLoading] = useRole();

  if (isLoading)
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  if (role === "admin") return children;
  return <Navigate to="/dashboard" />;
};

export default AdminRoute;
