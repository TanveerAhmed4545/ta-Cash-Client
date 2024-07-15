import { Outlet } from "react-router-dom";
import SideBar from "../components/Dashboard/SideBar/SideBar";

const DashboardLayout = () => {
  return (
    <div className="relative min-h-screen md:flex">
      {/* sidebar */}

      <SideBar />

      {/* outlet */}
      <div className="flex-1 md:ml-64">
        <div className="p-5">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
