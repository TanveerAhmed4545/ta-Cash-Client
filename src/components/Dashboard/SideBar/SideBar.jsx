import { GrLogout } from "react-icons/gr";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useRole from "../../../hooks/useRole";
import { useAuth } from "../../../Provider/AuthProvider";
import AdminMenu from "../Menu/AdminMenu/AdminMenu";
import AgentMenu from "../Menu/AgentMenu/AgentMenu";
import MenuItem from "../Menu/MenuItem/MenuItem";
import UserMenu from "../Menu/UserMenu/UserMenu";

// eslint-disable-next-line react/prop-types
const SideBar = ({ isActive, setActive }) => {
  const { logout } = useAuth();
  const [role] = useRole();
  const navigate = useNavigate();

  const handleToggle = () => {
    setActive(!isActive);
  };

  return (
    <>
      {/* Overlay for mobile when sidebar is active */}
      {isActive && (
         <div 
           className="md:hidden fixed inset-0 bg-black/20 z-[40]" 
           onClick={handleToggle}
         ></div>
      )}

      {/* Sidebar */}
      <div
        className={`z-[50] fixed flex flex-col justify-between overflow-x-hidden bg-[#ecfdf5] w-64 space-y-6 px-4 py-6 inset-y-0 left-0 transform ${
          isActive ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-green-100 shadow-xl md:shadow-none h-screen`}
      >
        <div>
          {/* Logo */}
          <Link to="/dashboard" className="w-full flex px-4 py-2 items-center gap-3 mb-6 cursor-pointer hover:opacity-80 transition-opacity">
             <div className="grid grid-cols-2 gap-[2px] w-8 h-8 shrink-0">
               <div className="bg-[#1A3626] rounded-tl-[10px] rounded-br-[10px]"></div>
               <div className="bg-[#1A3626] rounded-tr-[10px] rounded-bl-[10px]"></div>
               <div className="bg-[#1A3626] rounded-tr-[10px] rounded-bl-[10px]"></div>
               <div className="bg-[#1A3626] rounded-tl-[10px] rounded-br-[10px]"></div>
             </div>
            <h2 className="text-xl font-bold tracking-wider text-[#1A3626] uppercase">Ta Cash</h2>
          </Link>

          {/* Nav Items */}
          <div className="flex flex-col justify-between flex-1 mt-2">
            <nav className="space-y-2">
              <MenuItem
                label={"Dashboard"}
                address={"/dashboard"}
                icon={FaHome}
              ></MenuItem>

              {role === "user" && <UserMenu></UserMenu>}
              {role === "agent" && <AgentMenu></AgentMenu>}
              {role === "admin" && <AdminMenu></AdminMenu>}
            </nav>
          </div>
        </div>

        {/* Bottom Section (Removed Get Pro and Logout) */}
        <div className="mt-auto">
        </div>
      </div>
    </>
  );
};

export default SideBar;
