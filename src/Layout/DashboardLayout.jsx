import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../components/Dashboard/SideBar/SideBar";
import { FaSearch, FaBell, FaCommentAlt } from "react-icons/fa";
import { AiOutlineBars } from "react-icons/ai";
import { FiUser, FiMail, FiKey, FiLogOut } from "react-icons/fi";
import { useAuth } from "../Provider/AuthProvider";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Define searchable pages relevant to Ta-Cash
  const allPages = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Cash In (Add Money)", path: "/dashboard/cashIn" },
    { name: "Cash Out (Withdraw)", path: "/dashboard/cashOut" },
    { name: "Profile", path: "/dashboard/profile" },
    { name: "Send Money (Transfer)", path: "/dashboard/send-Money" },
    { name: "Transaction History", path: "/dashboard/userTransactions" },
    // Admin specific
    { name: "User Management", path: "/dashboard/user-Management" },
    { name: "All Transactions", path: "/dashboard/allTransactions" },
    // Agent specific
    { name: "Agent Transactions", path: "/dashboard/agentTransactions" },
    { name: "Transfer Management", path: "/dashboard/transferManagement" },
  ];

  // Filter pages based on search query
  const searchResults = allPages.filter(page => 
    page.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-[#f8fafc] md:pl-64">
      {/* sidebar */}
      <SideBar isActive={isSidebarOpen} setActive={setSidebarOpen} />

      {/* right side */}
      <div className="flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <header className="bg-[#f8fafc] sticky top-0 z-10 flex items-center justify-between px-6 md:px-10 py-4 md:py-6 border-b border-transparent">
          
          {/* Mobile Hamburger & Page Title */}
          <div className="flex items-center gap-3 md:gap-0">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 -ml-2 text-gray-600 focus:outline-none bg-white rounded-lg border border-gray-100 shadow-sm"
            >
              <AiOutlineBars className="h-6 w-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Search Bar - hidden on smaller tablets/mobile to save space */}
            <div className="hidden lg:flex items-center w-full max-w-xs relative">
              <div className="flex items-center w-full bg-white rounded-full px-4 py-2 border border-gray-100 shadow-sm focus-within:ring-2 focus-within:ring-[#1A3626]/20 focus-within:border-[#1A3626] transition-all">
                <input
                  type="text"
                  placeholder="Search pages (e.g. Cash In, Send Money)..."
                  className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="text-gray-400 ml-2" />
              </div>

              {/* Search Dropdown Results */}
              {searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {searchResults.length > 0 ? (
                    searchResults.map((item, idx) => (
                      <button
                        key={idx}
                        className="w-full flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-green-50 hover:text-[#1A3626] transition-colors text-left"
                        onClick={() => {
                          navigate(item.path);
                          setSearchQuery("");
                        }}
                      >
                        {item.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No matching pages found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notification icons */}
            <div className="flex items-center gap-2 md:gap-3">
               <button className="relative p-2 bg-white rounded-full text-gray-500 hover:text-[#1A3626] transition-colors shadow-sm border border-gray-100">
                 <FaCommentAlt className="text-sm md:text-base" />
               </button>
               <button className="relative p-2 bg-white rounded-full text-gray-500 hover:text-[#1A3626] transition-colors shadow-sm border border-gray-100">
                 <FaBell className="text-sm md:text-base" />
                 <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full border border-white"></span>
               </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <div 
                className="flex items-center gap-2 md:gap-3 ml-1 md:ml-2 shrink-0 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
                onClick={() => setProfileOpen(!isProfileOpen)}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-800 truncate max-w-[120px]">{user?.name || "Andrew Forbist"}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || "Admin"}</p>
                </div>
                <img
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name || 'Andrew Forbist'}&background=1A3626&color=fff`}
                  alt="Profile"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-green-200 shadow-sm object-cover shrink-0"
                />
              </div>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link 
                      to="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <FiUser className="w-4 h-4 mr-3 text-[#3b82f6]" />
                      Profile
                    </Link>
                    <button className="w-full flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      <FiMail className="w-4 h-4 mr-3 text-[#22c55e]" />
                      Inbox
                    </button>
                    <button className="w-full flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      <FiKey className="w-4 h-4 mr-3 text-gray-700" />
                      Change Password
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                        navigate("/");
                      }}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
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
        <div className="px-6 md:px-10 pb-10 flex-1 min-w-0 overflow-x-hidden">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
