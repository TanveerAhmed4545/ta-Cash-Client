import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useBalance from "../../../hooks/useBalance";
import { useAuth } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { FaPlus, FaExchangeAlt, FaMoneyBillWave, FaHistory, FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const DashHome = () => {
  const { user } = useAuth();
  const [balance, isLoading] = useBalance();
  const axiosSecure = useAxiosSecure();

  const { data: history = [] } = useQuery({
    queryKey: ["history", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/history/${user?.email}`);
      return res.data;
    },
  });

  const { data: limits = { dailyLimit: 20000, dailySpent: 0, savingGoals: [] } } = useQuery({
    queryKey: ["limits", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/user-limits/${user?.email}`);
      return res.data;
    },
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["activities", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/activities/${user?.email}`);
      return res.data;
    },
  });

  const { income, outcome, cashflowData, recentTransactions } = useMemo(() => {
    let inc = 0;
    let out = 0;
    const monthlyData = {
      Jan: { name: 'Jan', income: 0, expense: 0 },
      Feb: { name: 'Feb', income: 0, expense: 0 },
      Mar: { name: 'Mar', income: 0, expense: 0 },
      Apr: { name: 'Apr', income: 0, expense: 0 },
      May: { name: 'May', income: 0, expense: 0 },
      Jun: { name: 'Jun', income: 0, expense: 0 },
      Jul: { name: 'Jul', income: 0, expense: 0 },
      Aug: { name: 'Aug', income: 0, expense: 0 },
      Sep: { name: 'Sep', income: 0, expense: 0 },
      Oct: { name: 'Oct', income: 0, expense: 0 },
      Nov: { name: 'Nov', income: 0, expense: 0 },
      Dec: { name: 'Dec', income: 0, expense: 0 },
    };

    history.forEach((t) => {
      const amount = Number(t.amount) || 0;
      // Define income: user received money OR user performed cash-in
      const isIncome = t.recipientEmail === user?.email || t.type === 'cash-in';
      
      if (isIncome) inc += amount;
      else out += amount;

      // Group by accurate month from date if available
      let m = 'Jan';
      if (t.date) {
        // Basic parsing assuming YYYY-MM-DD or standard Date string
        const dateObj = new Date(t.date);
        if (!isNaN(dateObj.getTime())) {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          m = months[dateObj.getMonth()];
        }
      }

      if (isIncome) monthlyData[m].income += amount;
      else monthlyData[m].expense += amount;
    });

    const cData = Object.values(monthlyData);
    const recent = history.slice(-5).reverse(); // Last 5 real transactions

    return { income: inc, outcome: out, cashflowData: cData, recentTransactions: recent };
  }, [history, user]);

  const pieData = [
    { name: 'Expense', value: outcome > 0 ? outcome : 1 }, // Give 1 to show flat donut if 0
    { name: 'Income', value: income > 0 ? income : 1 }
  ];
  const COLORS = ['#bbf7d0', '#1A3626'];

  return (
    <div className="w-full text-gray-800 pb-10 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: Profile Card, Actions, Limit, Savings */}
        <div className="flex flex-col gap-6 col-span-1">
          {/* Main Balance Card */}
          <div className="bg-[#1A3626] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-4 left-4 grid grid-cols-2 gap-1 opacity-80">
               <div className="w-2 h-2 bg-green-300 rounded-tl-full rounded-br-full"></div>
               <div className="w-2 h-2 bg-green-300 rounded-tr-full rounded-bl-full"></div>
               <div className="w-2 h-2 bg-green-300 rounded-tr-full rounded-bl-full"></div>
               <div className="w-2 h-2 bg-green-300 rounded-tl-full rounded-br-full"></div>
            </div>
            <div className="absolute top-4 right-4 opacity-50">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.33-.89-2.41-1.76H7.73c.12 1.86 1.51 2.96 3.17 3.32V19h2.34v-1.65c1.65-.3 3.01-1.33 3.01-3.08 0-2.23-1.63-2.96-3.94-3.53z"/></svg>
            </div>
            
            <div className="mt-8 mb-6">
              <h3 className="text-xl font-medium mb-1">{user?.name || "Ta-Cash User"}</h3>
              <p className="text-sm text-green-200/60 mb-2">Available Balance</p>
              <h2 className="text-3xl font-bold">
                ${isLoading ? "..." : Number(balance).toLocaleString()}
              </h2>
            </div>
            <div className="flex justify-between items-end text-sm text-green-200/80">
              <div>
                <p className="text-xs uppercase opacity-70">Status</p>
                <p>Active</p>
              </div>
              <div>
                <p className="text-xs uppercase opacity-70">Role</p>
                <p className="capitalize">{user?.role || "User"}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-between items-center px-1 mb-2">
            <Link to="/dashboard/cashIn" className="flex flex-col items-center justify-center gap-3 cursor-pointer group">
              <div className="w-[60px] h-[60px] rounded-full border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] bg-white flex items-center justify-center text-[#4b5563] group-hover:bg-[#1A3626] group-hover:text-white transition-all duration-300">
                <FaPlus className="text-xl" />
              </div>
              <span className="text-[13px] font-medium text-[#1f2937]">Cash In</span>
            </Link>
            
            <Link to="/dashboard/send-Money" className="flex flex-col items-center justify-center gap-3 cursor-pointer group">
              <div className="w-[60px] h-[60px] rounded-full border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] bg-white flex items-center justify-center text-[#4b5563] group-hover:bg-[#1A3626] group-hover:text-white transition-all duration-300">
                <FaExchangeAlt className="text-xl" />
              </div>
              <span className="text-[13px] font-medium text-[#1f2937]">Send Money</span>
            </Link>
            
            <Link to="/dashboard/cashOut" className="flex flex-col items-center justify-center gap-3 cursor-pointer group">
              <div className="w-[60px] h-[60px] rounded-full border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] bg-white flex items-center justify-center text-[#4b5563] group-hover:bg-[#1A3626] group-hover:text-white transition-all duration-300">
                <FaMoneyBillWave className="text-xl" />
              </div>
              <span className="text-[13px] font-medium text-[#1f2937]">Cash Out</span>
            </Link>
            
            <Link to="/dashboard/userTransactions" className="flex flex-col items-center justify-center gap-3 cursor-pointer group">
              <div className="w-[60px] h-[60px] rounded-full border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] bg-white flex items-center justify-center text-[#4b5563] group-hover:bg-[#1A3626] group-hover:text-white transition-all duration-300">
                <FaHistory className="text-xl" />
              </div>
              <span className="text-[13px] font-medium text-[#1f2937]">History</span>
            </Link>
          </div>

          {/* Daily Limit */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">Daily Limit</h3>
              <button className="text-gray-400">⋮</button>
            </div>
            <div className="flex justify-between items-end mb-2">
               <p className="text-sm font-semibold text-gray-800">${Number(limits.dailySpent).toLocaleString()} <span className="text-xs text-gray-400 font-normal">spent of ${Number(limits.dailyLimit).toLocaleString()}</span></p>
               <p className="text-xs font-bold text-gray-800">{((limits.dailySpent / limits.dailyLimit) * 100).toFixed(1)}%</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-[#1A3626] h-2 rounded-full" style={{ width: `${Math.min((limits.dailySpent / limits.dailyLimit) * 100, 100)}%` }}></div>
            </div>
          </div>

          {/* Saving Plans */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1">
             <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-gray-800">Saving Plans</h3>
                  <p className="text-xs text-gray-400">Total Savings</p>
                  <p className="text-xl font-bold text-[#1A3626] mt-1">${limits.savingGoals.reduce((sum, g) => sum + g.current, 0).toLocaleString()}</p>
                </div>
                <button className="text-xs font-medium text-gray-500 hover:text-[#1A3626]">Add Plan +</button>
             </div>
             
             <div className="flex flex-col gap-4">
                {limits.savingGoals.length === 0 ? (
                   <p className="text-sm text-gray-400 italic">No active saving plans.</p>
                ) : (
                   limits.savingGoals.map((goal, idx) => (
                      <div key={idx} className="border border-gray-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                         <div className={`absolute top-0 left-0 w-1 h-full ${idx % 2 === 0 ? 'bg-[#1A3626]' : 'bg-[#bbf7d0]'}`}></div>
                         <div className="flex justify-between items-center mb-3">
                           <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                             <span className="p-1.5 bg-[#ecfdf5] text-[#1A3626] rounded-md"><FaWallet /></span>
                             {goal.title}
                           </div>
                           <button className="text-gray-400">⋮</button>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                           <div className={`h-1.5 rounded-full ${idx % 2 === 0 ? 'bg-[#1A3626]' : 'bg-[#bbf7d0]'}`} style={{ width: `${(goal.current / goal.target) * 100}%` }}></div>
                         </div>
                         <div className="flex justify-between text-xs">
                           <span className="font-medium text-gray-600">${goal.current.toLocaleString()} <span className="text-gray-400">{Math.round((goal.current / goal.target) * 100)}%</span></span>
                           <span className="text-gray-400">Target: ${goal.target.toLocaleString()}</span>
                         </div>
                      </div>
                   ))
                )}
             </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Stats, Cashflow, Recent Transactions */}
        <div className="flex flex-col gap-6 col-span-1 lg:col-span-2">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-[#ecfdf5] text-[#1A3626] rounded-full">
                   <FaArrowUp className="text-sm" />
                 </div>
                 <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">This Month</span>
               </div>
               <h3 className="text-2xl font-bold text-gray-800 mb-1">${income.toLocaleString()}</h3>
               <p className="text-xs text-gray-400 font-medium">Total Cash In</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-red-50 text-red-500 rounded-full">
                   <FaArrowDown className="text-sm" />
                 </div>
                 <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">This Month</span>
               </div>
               <h3 className="text-2xl font-bold text-gray-800 mb-1">${outcome.toLocaleString()}</h3>
               <p className="text-xs text-gray-400 font-medium">Total Cash Out</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-[#ecfdf5] text-[#1A3626] rounded-full">
                   <FaWallet className="text-sm" />
                 </div>
                 <span className="text-xs font-bold text-[#1A3626] bg-[#ecfdf5] px-2 py-1 rounded-full">{limits.savingGoals.length} Plans</span>
               </div>
               <h3 className="text-2xl font-bold text-gray-800 mb-1">${limits.savingGoals.reduce((sum, g) => sum + g.current, 0).toLocaleString()}</h3>
               <p className="text-xs text-gray-400 font-medium">Total Savings</p>
            </div>
          </div>

          {/* Cashflow Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="text-lg font-bold text-gray-800">Cashflow</h3>
                   <p className="text-xs text-gray-400 mt-1">Total Balance</p>
                   <p className="text-xl font-bold text-[#1A3626] mt-1">${(income + balance).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[#1A3626]"></span>
                     <span className="text-xs text-gray-500 font-medium">Income</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[#bbf7d0]"></span>
                     <span className="text-xs text-gray-500 font-medium">Expense</span>
                   </div>
                   <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-transparent outline-none">
                     <option>This Year</option>
                   </select>
                </div>
             </div>
             
             <div className="h-64 w-full mt-4">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={cashflowData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                   <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                   <Bar dataKey="income" stackId="a" fill="#1A3626" radius={[4, 4, 0, 0]} barSize={16} />
                   <Bar dataKey="expense" stackId="a" fill="#bbf7d0" radius={[0, 0, 4, 4]} barSize={16} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 min-w-0">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Recent Transaction</h3>
                <div className="flex items-center gap-2">
                   <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none shadow-sm text-gray-600 font-medium">
                     <option>This Month</option>
                     <option>Last Month</option>
                   </select>
                   <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 shadow-sm hover:bg-gray-50 transition-colors">
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                   </button>
                </div>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-gray-100">
                     <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction Name</th>
                     <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</th>
                     <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                     <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {history.length > 0 ? history.slice(0, 5).map((tx, idx) => (
                     <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                       <td className="py-4">
                         <p className="text-sm font-bold text-gray-800 lowercase">{tx.type || tx.category || "send-money"}</p>
                         <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[150px]">{tx.recipientEmail || tx.userEmail}</p>
                       </td>
                       <td className="py-4">
                         <p className="text-sm text-gray-600 font-medium">
                            {tx.time ? new Date(tx.time).toISOString().split('T')[0] : "2024-03-01"}
                         </p>
                         <p className="text-[11px] text-gray-400 mt-0.5">
                            {tx.time ? new Date(tx.time).toLocaleTimeString([], { hour12: false }) : "04:28:48"}
                         </p>
                       </td>
                       <td className="py-4">
                         <p className="text-sm font-bold text-gray-900">${Number(tx.amount || 0).toFixed(2)}</p>
                       </td>
                       <td className="py-4">
                         <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                           tx.status === 'reject' ? 'bg-red-50 text-red-500' :
                           tx.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                           'bg-[#ecfdf5] text-[#10b981]'
                         }`}>
                           {tx.status === 'reject' ? 'Failed' : tx.status === 'approve' || !tx.status ? 'Completed' : 'Pending'}
                         </span>
                       </td>
                     </tr>
                   )) : (
                     <tr><td colSpan="4" className="py-10 text-center text-gray-400 text-sm italic">No recent transactions found</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Statistic Donut, Recent Activity */}
        <div className="flex flex-col gap-6 col-span-1 xl:col-span-1">
          {/* Statistic Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800">Statistic</h3>
                <select className="text-xs text-gray-500 bg-transparent outline-none">
                  <option>This Month</option>
                </select>
             </div>
             
             <div className="flex justify-between items-center mb-4 text-xs font-medium">
                <span className="text-gray-400">Income <span className="text-gray-800">(${income.toLocaleString()})</span></span>
                <span className="text-[#1A3626] border-b border-[#bbf7d0] pb-1">Expense <span className="text-gray-800">(${outcome.toLocaleString()})</span></span>
             </div>

             <div className="h-48 w-full relative my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius="75%"
                      outerRadius="100%"
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <p className="text-xs text-gray-400">Total Expense</p>
                   <p className="text-2xl font-bold text-[#1A3626]">${outcome.toLocaleString()}</p>
                </div>
             </div>
             <div className="flex flex-col gap-3 mt-6">
                <div className="flex justify-between items-center text-xs">
                   <div className="flex items-center gap-2">
                     <span className="px-2 py-1 bg-[#1A3626] text-white rounded font-bold">60%</span>
                     <span className="font-medium text-gray-700">Send Money</span>
                   </div>
                   <span className="font-bold text-gray-900">${Math.floor(outcome * 0.6).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <div className="flex items-center gap-2">
                     <span className="px-2 py-1 bg-[#bbf7d0] text-[#1A3626] rounded font-bold">25%</span>
                     <span className="font-medium text-gray-700">Cash Out</span>
                   </div>
                   <span className="font-bold text-gray-900">${Math.floor(outcome * 0.25).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <div className="flex items-center gap-2">
                     <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded font-bold">15%</span>
                     <span className="font-medium text-gray-700">Payments</span>
                   </div>
                   <span className="font-bold text-gray-900">${Math.floor(outcome * 0.15).toLocaleString()}</span>
                </div>
             </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800">Recent Activity</h3>
                <button className="text-gray-400">⋮</button>
             </div>
             
             <div className="flex flex-col gap-6">
                {activities.length === 0 ? (
                   <p className="text-sm text-gray-400 italic">No recent activity found.</p>
                ) : (
                   activities.map((act, idx) => (
                      <div key={idx} className={`relative border-l-2 border-dashed ${idx % 2 === 0 ? 'border-gray-200' : 'border-[#bbf7d0]'} pl-4 ml-2`}>
                         <span className={`absolute -left-[11px] top-0 w-5 h-5 border-[4px] border-white rounded-full ${idx % 2 === 0 ? 'bg-[#bbf7d0]' : 'bg-[#1A3626]'}`}></span>
                         <p className="text-sm text-gray-800 font-medium">You <span className="font-normal text-gray-500">{act.desc}</span></p>
                         <p className="text-xs text-gray-400 mt-1">
                            {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </p>
                      </div>
                   ))
                )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashHome;
