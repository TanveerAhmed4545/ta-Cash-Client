import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import SideBar from "../components/Dashboard/SideBar/SideBar";
import { FaSearch, FaBell, FaCommentAlt, FaHome, FaExchangeAlt, FaPlus, FaHistory, FaEllipsisH } from "react-icons/fa";
import { AiOutlineBars } from "react-icons/ai";
import { FiUser, FiMail, FiKey, FiLogOut } from "react-icons/fi";
import { useAuth } from "../Provider/AuthProvider";
import NotificationDropdown from "../components/Dashboard/Notification/NotificationDropdown";
import useNotifications from "../hooks/useNotifications";
import ChangePinModal from "../components/Dashboard/Modals/ChangePinModal";
import InboxModal from "../components/Dashboard/Modals/InboxModal";
import toast from "react-hot-toast";

const DashboardLayout = () => {
 const { user, logout } = useAuth();
 const { notifications, markAllRead, refetch } = useNotifications();
 const [isSidebarOpen, setSidebarOpen] = useState(false);
 const [isProfileOpen, setProfileOpen] = useState(false);
 const [isChangePinOpen, setChangePinOpen] = useState(false);
 const [isInboxOpen, setInboxOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");
 const navigate = useNavigate();
 const location = useLocation();

 // Define searchable pages relevant to Ta-Cash
 const allPages = [
 { name: "Dashboard", path: "/dashboard" },
 { name: "Cash In (Add Money)", path: "/dashboard/cashIn" },
 { name: "Cash Out (Withdraw)", path: "/dashboard/cashOut" },
 { name: "Profile", path: "/dashboard/profile" },
 { name: "Send Money (Transfer)", path: "/dashboard/send-Money" },
 { name: "Transaction History", path: "/dashboard/userTransactions" },
 { name: "My Statistics", path: "/dashboard/user-stats" },
 // Admin specific
 { name: "User Management", path: "/dashboard/user-Management" },
 { name: "All Transactions", path: "/dashboard/allTransactions" },
 { name: "Manage Requests", path: "/dashboard/manage-transactions" },
 { name: "Admin Analytics", path: "/dashboard/admin-analytics" },
 { name: "Audit Logs", path: "/dashboard/audit-logs" },
 { name: "System Settings", path: "/dashboard/system-settings" },
 // Agent specific
 { name: "Agent Transactions", path: "/dashboard/agentTransactions" },
 { name: "Transfer Management", path: "/dashboard/transferManagement" },
 ];

 // Filter pages based on search query
 const searchResults = allPages.filter(page => 
 page.name.toLowerCase().includes(searchQuery.toLowerCase())
 );

 // Bottom nav items
 const bottomNavItems = [
 { label: "Home", icon: FaHome, path: "/dashboard" },
 { label: "Send", icon: FaExchangeAlt, path: "/dashboard/send-Money" },
 { label: "Add", icon: FaPlus, path: "/dashboard/cashIn" },
 { label: "History", icon: FaHistory, path: "/dashboard/userTransactions" },
 { label: "More", icon: FaEllipsisH, action: "sidebar" },
 ];

 const isActivePath = (path) => location.pathname === path;
 
 return (
 <div className="min-h-screen bg-base-200 md:pl-64">
 {/* sidebar */}
 <SideBar isActive={isSidebarOpen} setActive={setSidebarOpen} />

 {/* right side */}
 <div className="flex flex-col min-h-screen min-w-0">
 {/* Top Header */}
 <header className="bg-base-200 sticky top-0 z-10 flex items-center justify-between px-4 md:px-10 py-3 md:py-6 border-b border-transparent">
 
 {/* Mobile Hamburger & Page Title */}
 <div className="flex items-center gap-3 md:gap-0">
 <button
 onClick={() => setSidebarOpen(!isSidebarOpen)}
 className="md:hidden p-2 -ml-1 text-neutral-content focus:outline-none bg-base-100 rounded-xl border border-base-300 shadow-sm active:scale-95 transition-transform"
 >
 <AiOutlineBars className="h-5 w-5" />
 </button>
 <h1 className="text-lg md:text-2xl font-bold text-base-content">Dashboard</h1>
 </div>

 {/* Right: Actions & Profile */}
 <div className="flex items-center gap-2 md:gap-6">
 {/* Search Bar - hidden on smaller tablets/mobile to save space */}
 <div className="hidden lg:flex items-center w-full max-w-xs relative">
 <div className="flex items-center w-full bg-base-100 rounded-full px-4 py-2 border border-base-300 shadow-sm focus-within:ring-2 focus-within:ring-[#1A3626]/20 focus-within:border-[#1A3626] transition-all">
 <input
 type="text"
 placeholder="Search pages (e.g. Cash In, Send Money)..."
 className="bg-transparent border-none outline-none w-full text-sm text-base-content placeholder-gray-400"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 <FaSearch className="text-neutral-content ml-2" />
 </div>

 {/* Search Dropdown Results */}
 {searchQuery.length > 0 && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-xl shadow-lg border border-base-300 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
 {searchResults.length > 0 ? (
 searchResults.map((item, idx) => (
 <button
 key={idx}
 className="w-full flex items-center px-4 py-3 text-sm text-neutral-content hover:bg-green-50 hover:text-primary transition-colors text-left"
 onClick={() => {
 navigate(item.path);
 setSearchQuery("");
 }}
 >
 {item.name}
 </button>
 ))
 ) : (
 <div className="px-4 py-3 text-sm text-neutral-content text-center">
 No matching pages found.
 </div>
 )}
 </div>
 )}
 </div>

 {/* Notification icons */}
 <div className="flex items-center gap-1.5 md:gap-3">
 <button 
 onClick={() => setInboxOpen(true)}
 className="relative p-2 bg-base-100 rounded-full text-neutral-content hover:text-primary transition-colors shadow-sm border border-base-300 active:scale-95 transition-transform"
 >
 <FaCommentAlt className="text-xs md:text-base" />
 </button>
 <NotificationDropdown 
 notifications={notifications} 
 onMarkAllRead={markAllRead} 
 onRefetch={refetch}
 />
 </div>

 {/* Profile Dropdown */}
 <div className="relative">
 <div 
 className="flex items-center gap-2 md:gap-3 ml-0.5 md:ml-2 shrink-0 cursor-pointer hover:bg-base-200 p-1 md:p-1.5 rounded-lg transition-colors active:scale-95 transition-transform"
 onClick={() => setProfileOpen(!isProfileOpen)}
 >
 <div className="text-right hidden sm:block">
 <p className="text-sm font-bold text-base-content truncate max-w-[120px]">{user?.name || "Andrew Forbist"}</p>
 <div className="flex items-center justify-end gap-2">
 <p className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded-full font-bold uppercase">{user?.tier || "Silver"}</p>
 <p className="text-xs text-neutral-content capitalize">{user?.role || "Admin"}</p>
 </div>
 </div>
 <img
 src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name || 'Andrew Forbist'}&background=1A3626&color=fff`}
 alt="Profile"
 onError={(e) => {
 e.target.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=1A3626&color=fff`;
 }}
 className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-green-200 shadow-sm object-cover shrink-0"
 />
 </div>

 {/* Dropdown Menu */}
 {isProfileOpen && (
 <>
 <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}></div>
 <div className="absolute right-0 top-full mt-2 w-48 bg-base-100 rounded-xl shadow-lg border border-base-300 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
 <Link 
 to="/dashboard/profile"
 onClick={() => setProfileOpen(false)}
 className="w-full flex items-center px-4 py-3 text-sm text-neutral-content hover:bg-base-200 transition-colors"
 >
 <FiUser className="w-4 h-4 mr-3 text-[#3b82f6]" />
 Profile
 </Link>
 <button 
 onClick={() => {
 setInboxOpen(true);
 setProfileOpen(false);
 }}
 className="w-full flex items-center px-4 py-3 text-sm text-neutral-content hover:bg-base-200 transition-colors"
 >
 <FiMail className="w-4 h-4 mr-3 text-[#22c55e]" />
 Inbox
 </button>
 <button 
 onClick={() => {
 setChangePinOpen(true);
 setProfileOpen(false);
 }}
 className="w-full flex items-center px-4 py-3 text-sm text-neutral-content hover:bg-base-200 transition-colors"
 >
 <FiKey className="w-4 h-4 mr-3 text-base-content" />
 Change Password
 </button>
 <div className="border-t border-base-300 my-1"></div>
 <button 
 onClick={() => {
 logout();
 setProfileOpen(false);
 navigate("/");
 }}
 className="w-full flex items-center px-4 py-3 text-sm text-neutral-content hover:bg-red-50 hover:text-red-600 transition-colors"
 >
 <FiLogOut className="w-4 h-4 mr-3 text-[#ef4444]" />
 Logout
 </button>
 </div>
 </>
 )}
 </div>
 </div>
 </header>

 {/* outlet / Main Content */}
 <div className="px-4 md:px-10 pb-24 md:pb-10 flex-1 min-w-0 overflow-x-hidden">
 <Outlet></Outlet>
 </div>

 {/* Mobile Bottom Navigation */}
 <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-base-100/90 backdrop-blur-xl border-t border-base-300 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
 <div className="flex items-center justify-around px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
 {bottomNavItems.map((item, idx) => {
 const isActive = item.path ? isActivePath(item.path) : false;
 return (
 <button
 key={idx}
 onClick={() => {
 if (item.action === "sidebar") {
 setSidebarOpen(true);
 } else {
 navigate(item.path);
 }
 }}
 className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 active:scale-90 min-w-[56px] ${
 isActive 
 ? "text-primary" 
 : "text-neutral-content"
 }`}
 >
 <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${isActive ? "bg-primary/10" : ""}`}>
 <item.icon className={`text-base transition-all ${isActive ? "text-primary" : ""}`} />
 </div>
 <span className={`text-[10px] font-bold transition-all ${isActive ? "text-primary" : ""}`}>
 {item.label}
 </span>
 </button>
 );
 })}
 </div>
 </nav>
 </div>

 <ChangePinModal 
 isOpen={isChangePinOpen} 
 onClose={() => setChangePinOpen(false)} 
 />
 <InboxModal 
 isOpen={isInboxOpen} 
 onClose={() => setInboxOpen(false)} 
 />
 </div>
 );
};

export default DashboardLayout;
