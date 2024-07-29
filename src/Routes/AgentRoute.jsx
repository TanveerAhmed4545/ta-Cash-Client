/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import useRole from "../hooks/useRole";

const AgentRoute = ({ children }) => {
  const [role, isLoading] = useRole();

  if (isLoading)
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  if (role === "agent") return children;
  return <Navigate to="/dashboard" />;
};

export default AgentRoute;
