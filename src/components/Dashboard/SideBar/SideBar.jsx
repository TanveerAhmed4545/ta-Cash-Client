import { GrLogout } from "react-icons/gr";
import { FaHome, FaSun, FaMoon } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import useRole from "../../../hooks/useRole";
import { useAuth } from "../../../Provider/AuthProvider";
import { useTheme } from "../../../Provider/ThemeProvider";
import AdminMenu from "../Menu/AdminMenu/AdminMenu";
import AgentMenu from "../Menu/AgentMenu/AgentMenu";
import MenuItem from "../Menu/MenuItem/MenuItem";
import UserMenu from "../Menu/UserMenu/UserMenu";

const SideBar = ({ isActive, setActive }) => {
 const { logout } = useAuth();
 const [role] = useRole();
 const navigate = useNavigate();
 const { theme, toggleTheme } = useTheme();

 const handleToggle = () => {
 setActive(!isActive);
 };

 return (
 <>
 {isActive && (
 <div 
 className="md:hidden fixed inset-0 bg-black/40 z-[40] backdrop-blur-sm" 
 onClick={handleToggle}
 ></div>
 )}

 <div
 className={`z-[50] fixed flex flex-col justify-between overflow-x-hidden bg-base-200 w-64 space-y-6 px-4 py-6 inset-y-0 left-0 transform ${
 isActive ? "translate-x-0" : "-translate-x-full"
 } md:translate-x-0 transition-all duration-300 ease-in-out border-r border-base-300 shadow-xl md:shadow-none h-screen`}
 >
 <div>
 <Link to="/dashboard" className="w-full flex px-4 py-2 items-center gap-3 mb-6 cursor-pointer hover:opacity-80 transition-opacity">
 <div className="grid grid-cols-2 gap-1 w-10 h-10 shrink-0">
 <div className="bg-primary rounded-tl-xl rounded-br-xl"></div>
 <div className="bg-primary rounded-tr-xl rounded-bl-xl opacity-60"></div>
 <div className="bg-primary rounded-tr-xl rounded-bl-xl opacity-60"></div>
 <div className="bg-primary rounded-tl-xl rounded-br-xl"></div>
 </div>
 <h2 className="text-2xl font-black tracking-tighter uppercase italic text-primary ">Ta Cash</h2>
 </Link>

 <div className="flex flex-col justify-between flex-1 mt-6">
 <nav className="space-y-1">
 <MenuItem label={"Dashboard"} address={"/dashboard"} icon={FaHome} />
 <MenuItem label={"Profile"} address={"/dashboard/profile"} icon={FiUser} />
 <div className="my-4 border-t border-base-300/50"></div>
 <div className="space-y-1">
 {role === "user" && <UserMenu />}
 {role === "agent" && <AgentMenu />}
 {role === "admin" && <AdminMenu />}
 </div>
 </nav>
 </div>
 </div>

 <div className="mt-auto flex flex-col gap-3">
 {/* Theme Toggle Button */}
 <button 
 onClick={toggleTheme}
 className="flex items-center justify-between px-4 py-3 text-base-content/80 hover:text-primary hover:bg-base-300 transition-all duration-300 rounded-xl font-bold border border-base-300/50 group"
 >
 <div className="flex items-center gap-3">
 {theme === "light" ? <FaMoon className="w-4 h-4 transition-transform group-hover:rotate-12" /> : <FaSun className="w-4 h-4 text-yellow-400 animate-pulse" />}
 <span className="text-sm capitalize">{theme === "light" ? "Dark" : "Light"} Mode</span>
 </div>
 <div className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-[#4ade80]' : 'bg-base-300'}`}>
 <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${theme === 'dark' ? 'left-6' : 'left-1'}`}></div>
 </div>
 </button>

 <button
 onClick={() => {
 logout();
 navigate("/");
 }}
 className="flex w-full items-center px-4 py-3 text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 rounded-xl gap-3 font-bold group border border-transparent hover:border-red-500/20"
 >
 <GrLogout className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
 <span>Logout Account</span>
 </button>
 </div>
 </div>
 </>
 );
};

export default SideBar;
