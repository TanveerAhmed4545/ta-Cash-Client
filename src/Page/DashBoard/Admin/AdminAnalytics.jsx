import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';
import { FaChartLine, FaWallet, FaHandHoldingUsd, FaArrowUp as FaArrowTrendUp } from "react-icons/fa";

const AdminAnalytics = () => {
  const axiosSecure = useAxiosSecure();

  const { data: revenueData = [], isLoading: isLoadingRevenue } = useQuery({
    queryKey: ["admin-revenue"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/admin/revenue-stats");
      return data;
    },
  });

  const { data: dashboardStats = {}, isLoading: isLoadingStats } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/admin/dashboard-stats");
      return data;
    },
  });

  if (isLoadingRevenue || isLoadingStats) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
          <FaChartLine className="text-[#1A3626]" /> Platform Analytics
        </h1>
        <p className="text-gray-500 mt-1">Real-time revenue monitoring and transaction growth trends.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                 <FaWallet className="text-xl" />
              </div>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Revenue</span>
           </div>
           <h2 className="text-3xl font-black text-gray-800">$
             {revenueData.reduce((acc, curr) => acc + curr.revenue, 0).toFixed(2)}
           </h2>
        </div>
        
        {/* Active Users */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                 <FaHandHoldingUsd className="text-xl" />
              </div>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Users</span>
           </div>
           <h2 className="text-3xl font-black text-gray-800">{dashboardStats?.activeUsers || 0}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Revenue Chart */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center justify-between">
            Revenue Trend (Last 7 Days)
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500 font-bold uppercase">Live Updates</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A3626" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1A3626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1A3626" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Volume Bar Chart */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-8">Transaction Volume by Type</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardStats?.transactionVolume || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                <Bar dataKey="value" fill="#1A3626" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
