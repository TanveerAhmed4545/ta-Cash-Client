import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { useAuth } from "../../../Provider/AuthProvider";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { FaChartPie, FaArrowDown as FaArrowTrendDown, FaArrowUp as FaArrowTrendUp, FaInfoCircle as FaCircleInfo } from "react-icons/fa";

const UserStats = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["user-stats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/user/stats/${user?.email}`);
      return data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const totalIncome = stats.reduce((acc, curr) => acc + curr.income, 0);
  const totalExpense = stats.reduce((acc, curr) => acc + curr.expense, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
          <FaChartPie className="text-[#1A3626]" /> My Statistics
        </h1>
        <p className="text-gray-500 mt-1">Visualize your financial habits and monthly cash flow.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Summary Stats */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Received</span>
              <h2 className="text-3xl font-black text-green-600">${totalIncome.toFixed(2)}</h2>
              <div className="mt-4 p-3 bg-green-50 rounded-2xl flex items-center gap-3">
                 <FaArrowTrendUp className="text-green-500" />
                 <span className="text-xs text-green-700 font-bold uppercase">Positive Flow</span>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Spent</span>
              <h2 className="text-3xl font-black text-red-600">${totalExpense.toFixed(2)}</h2>
              <div className="mt-4 p-3 bg-red-50 rounded-2xl flex items-center gap-3">
                 <FaArrowTrendDown className="text-red-500" />
                 <span className="text-xs text-red-700 font-bold uppercase">Expense Tracking</span>
              </div>
           </div>

           <div className="bg-[#1A3626] p-8 rounded-[2.5rem] shadow-lg text-white relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="text-lg font-bold mb-2">Smart Tip</h3>
                 <p className="text-sm opacity-80 leading-relaxed">
                   Users who track their monthly spending tend to save 15% more. Check your tiers to increase limits!
                 </p>
                 <button className="mt-6 text-xs font-bold uppercase tracking-widest flex items-center gap-2 underline underline-offset-4">
                    Upgrade Tier <FaCircleInfo />
                 </button>
              </div>
              <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           </div>
        </div>

        {/* Right: Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-bold text-gray-800">Income vs. Expense</h3>
              <select className="bg-gray-50 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none">
                 <option>Last 6 Months</option>
                 <option>Year 2026</option>
              </select>
           </div>
           
           <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="income" name="Received" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={25} />
                <Bar dataKey="expense" name="Spent" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
