import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useBalance from "../../../hooks/useBalance";
import { useAuth } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { FaPlus, FaExchangeAlt, FaMoneyBillWave, FaHistory, FaArrowUp, FaArrowDown, FaWallet, FaTrash, FaHandHoldingUsd, FaShieldAlt } from "react-icons/fa";
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
  const queryClient = useQueryClient();
  const [hasMounted, setHasMounted] = useState(false);

  const handleAddPlan = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Create Saving Plan',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Plan Title (e.g., Laptop)">' +
        '<input id="swal-input2" type="number" class="swal2-input" placeholder="Target Amount ($)">' +
        '<input id="swal-input3" type="number" class="swal2-input" placeholder="Initial Savings ($)">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Add Plan',
      confirmButtonColor: '#1A3626',
      preConfirm: () => {
        const title = document.getElementById('swal-input1').value;
        const target = document.getElementById('swal-input2').value;
        const current = document.getElementById('swal-input3').value || 0;
        if (!title || !target) {
          Swal.showValidationMessage('Please fill out title and target amount');
        }
        return { title, target, current };
      }
    });

    if (formValues) {
      try {
        await axiosSecure.post("/saving-goals", {
          email: user?.email,
          title: formValues.title,
          target: Number(formValues.target),
          current: Number(formValues.current)
        });
        queryClient.invalidateQueries({ queryKey: ["limits", user?.email] });
        Swal.fire({
          title: 'Success!',
          text: 'Saving plan added successfully.',
          icon: 'success',
          confirmButtonColor: '#1A3626'
        });
      } catch (error) {
        Swal.fire('Error', 'Could not add saving plan', 'error');
      }
    }
  };

  const handleDeletePlan = async (planId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#1A3626',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/saving-goals/${user?.email}/${planId}`);
          queryClient.invalidateQueries({ queryKey: ["limits", user?.email] });
          Swal.fire({
            title: 'Deleted!',
            text: 'Your plan has been deleted.',
            icon: 'success',
            confirmButtonColor: '#1A3626'
          });
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete the plan.', 'error');
        }
      }
    });
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

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

  const { income, outcome, cashflowData, recentTransactions, categoryData } = useMemo(() => {
    let inc = 0;
    let out = 0;
    let sendMoneyTotal = 0;
    let cashOutTotal = 0;
    let paymentsTotal = 0;
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
      const isIncome = t.recipientEmail === user?.email || t.type === 'cash-in';
      
      if (isIncome) {
        inc += amount;
      } else {
        out += amount;
        if (t.type === 'send-money') sendMoneyTotal += amount;
        else if (t.type === 'cash-out') cashOutTotal += amount;
        else paymentsTotal += amount;
      }

      let m = 'Jan';
      if (t.date) {
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
    const recent = history.slice(-5).reverse();

    return { 
      income: inc, 
      outcome: out, 
      cashflowData: cData, 
      recentTransactions: recent,
      categoryData: { sendMoneyTotal, cashOutTotal, paymentsTotal }
    };
  }, [history, user]);

  const handleRequestMoney = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Request Money',
      html:
        '<input id="req-email" type="email" class="swal2-input" placeholder="Payer Email">' +
        '<input id="req-amount" type="number" class="swal2-input" placeholder="Amount ($)">' +
        '<input id="req-notes" class="swal2-input" placeholder="What is it for?">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Send Request',
      confirmButtonColor: '#1A3626',
      preConfirm: () => {
        const email = document.getElementById('req-email').value;
        const amount = document.getElementById('req-amount').value;
        const notes = document.getElementById('req-notes').value;
        if (!email || !amount) Swal.showValidationMessage('Email and Amount are required');
        return { email, amount, notes };
      }
    });

    if (formValues) {
      try {
        await axiosSecure.post("/requests", {
          recipientEmail: formValues.email,
          amount: Number(formValues.amount),
          notes: formValues.notes
        });
        Swal.fire('Requested!', 'Your money request has been sent.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to send money request.', 'error');
      }
    }
  };

  const pieData = [
    { name: 'Expense', value: outcome > 0 ? outcome : 1 },
    { name: 'Income', value: income > 0 ? income : 1 }
  ];
  const COLORS = ['#bbf7d0', '#1A3626'];

  return (
    <div className="w-full text-base-content pb-10 font-sans animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        
        {/* LEFT COLUMN: Premium Balance Card & Actions */}
        <div className="flex flex-col gap-4 md:gap-8 col-span-1">
          
          {/* Enhanced Balance Card (Profile Style) */}
          <div className="relative w-full h-52 md:h-64 group cursor-pointer" style={{ perspective: '1200px' }}>
            <div className="absolute w-full h-full bg-gradient-to-br from-[#1A3626] to-[#2d5a3f] rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 text-white shadow-2xl overflow-hidden border border-white/10 transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1 md:mb-2">Available Balance</p>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                      {isLoading ? (
                        <div className="h-10 bg-white/10 animate-pulse rounded-xl w-32"></div>
                      ) : (
                        `$${Number(balance).toLocaleString()}`
                      )}
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-500/80 shadow-lg"></div>
                    <div className="w-6 h-6 rounded-full bg-yellow-400/80 -ml-3 shadow-lg"></div>
                  </div>
                </div>

                <div className="mt-auto">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 md:mb-4 flex items-center gap-2">
                    <FaShieldAlt className="text-green-400" /> Secure Wallet
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.1em] mb-1">Card Holder</p>
                      <p className="text-sm font-bold tracking-wide">{user?.name || "Premium User"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.1em] mb-1">Status</p>
                      <p className="text-xs font-black uppercase tracking-widest text-green-400 bg-green-400/10 px-3 py-1 rounded-full">Active</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl pointer-events-none"></div>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-5 gap-3 px-1">
            {[
              { to: "/dashboard/cashIn", icon: FaPlus, label: "Add" },
              { to: "/dashboard/send-Money", icon: FaExchangeAlt, label: "Send" },
              { to: "/dashboard/cashOut", icon: FaMoneyBillWave, label: "Out" },
              { onClick: handleRequestMoney, icon: FaHandHoldingUsd, label: "Req" },
              { to: "/dashboard/userTransactions", icon: FaHistory, label: "Logs" }
            ].map((action, idx) => (
              action.to ? (
                <Link key={idx} to={action.to} className="flex flex-col items-center gap-2 md:gap-3 group">
                  <div className="w-14 h-14 md:w-12 md:h-12 rounded-2xl border border-base-300 bg-base-100 flex items-center justify-center text-neutral-content group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-primary/20 active:scale-90">
                    <action.icon size={18} />
                  </div>
                  <span className="text-[10px] font-black text-neutral-content uppercase tracking-wider">{action.label}</span>
                </Link>
              ) : (
                <button key={idx} onClick={action.onClick} className="flex flex-col items-center gap-2 md:gap-3 group">
                  <div className="w-14 h-14 md:w-12 md:h-12 rounded-2xl border border-base-300 bg-base-100 flex items-center justify-center text-neutral-content group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-primary/20 active:scale-90">
                    <action.icon size={18} />
                  </div>
                  <span className="text-[10px] font-black text-neutral-content uppercase tracking-wider">{action.label}</span>
                </button>
              )
            ))}
          </div>

          {/* Daily Limit Card */}
          <div className="bg-base-100 rounded-2xl md:rounded-[2rem] p-5 md:p-8 shadow-sm border border-base-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
            <h3 className="text-xs font-black text-neutral-content uppercase tracking-[0.2em] mb-4 md:mb-6">Daily Capacity</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-2xl font-black text-base-content">${Number(limits.dailySpent).toLocaleString()}</p>
                <p className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-md">{((limits.dailySpent / limits.dailyLimit) * 100).toFixed(1)}%</p>
              </div>
              <div className="w-full bg-base-200 rounded-full h-3 p-1">
                <div className="bg-primary h-1 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(26,54,38,0.2)]" style={{ width: `${Math.min((limits.dailySpent / limits.dailyLimit) * 100, 100)}%` }}></div>
              </div>
              <p className="text-[10px] font-bold text-neutral-content uppercase tracking-wider">Quota: ${Number(limits.dailyLimit).toLocaleString()}</p>
            </div>
          </div>

          {/* Saving Plans */}
          <div className="bg-base-100 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 shadow-sm border border-base-300 flex-1 relative overflow-hidden">
            <div className="flex justify-between items-center mb-5 md:mb-8">
              <div>
                <h3 className="text-xs font-black text-neutral-content uppercase tracking-[0.2em] mb-1">Financial Goals</h3>
                <p className="text-2xl font-black text-primary">${limits.savingGoals.reduce((sum, g) => sum + g.current, 0).toLocaleString()}</p>
              </div>
              <button onClick={handleAddPlan} className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                <FaPlus size={14} />
              </button>
            </div>
            
            <div className="space-y-4">
              {limits.savingGoals.length === 0 ? (
                <div className="py-8 text-center bg-base-200/50 rounded-2xl border border-dashed border-base-300">
                  <p className="text-[10px] font-black text-neutral-content uppercase tracking-widest">No Active Plans</p>
                </div>
              ) : (
                limits.savingGoals.map((goal, idx) => (
                  <div key={idx} className="bg-base-200/50 rounded-2xl p-4 border border-base-300 hover:border-primary/20 transition-all group">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-base-100 rounded-lg flex items-center justify-center text-primary shadow-sm"><FaWallet size={12} /></div>
                        <p className="text-sm font-bold text-base-content">{goal.title}</p>
                      </div>
                      <button onClick={() => handleDeletePlan(goal.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all">
                        <FaTrash size={12} />
                      </button>
                    </div>
                    <div className="w-full bg-base-100 rounded-full h-1.5 mb-2">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(goal.current / goal.target) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-neutral-content">
                      <span>{Math.round((goal.current / goal.target) * 100)}% Saved</span>
                      <span className="text-base-content">${goal.target.toLocaleString()} Target</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Cashflow & Recent */}
        <div className="flex flex-col gap-4 md:gap-8 col-span-1 lg:col-span-2">
          
          {/* Quick Metrics (Profile Sub-Card Style) */}
          <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
            {[
              { label: "Cash Inflow", amount: income, icon: FaArrowUp, color: "success" },
              { label: "Cash Outflow", amount: outcome, icon: FaArrowDown, color: "error" },
              { label: "Asset Growth", amount: limits.savingGoals.reduce((sum, g) => sum + g.current, 0), icon: FaHistory, color: "primary" }
            ].map((stat, idx) => (
              <div key={idx} className="snap-center min-w-[180px] md:min-w-0 shrink-0 md:shrink bg-base-100 rounded-2xl md:rounded-[2rem] p-4 md:p-6 shadow-sm border border-base-300 relative overflow-hidden group hover:scale-[1.03] transition-all">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}/5 rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-700`}></div>
                <div className="flex justify-between items-start mb-3 md:mb-6">
                  <div className={`p-3 rounded-2xl bg-${stat.color}/10 text-${stat.color === 'primary' ? 'primary' : stat.color + '-600'}`}>
                    <stat.icon size={18} />
                  </div>
                  <span className="text-[10px] font-black text-neutral-content uppercase tracking-widest">This Month</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-base-content tracking-tight mb-1">${stat.amount.toLocaleString()}</h3>
                <p className="text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Cashflow Chart */}
          <div className="bg-base-100 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-base-300 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-accent opacity-30 rounded-b-full"></div>
            <div className="flex justify-between items-center mb-6 md:mb-10">
              <div>
                <h3 className="text-xs font-black text-neutral-content uppercase tracking-[0.2em] mb-1">Financial Pulse</h3>
                <p className="text-3xl font-black text-base-content tracking-tight">${(income + balance).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_rgba(26,54,38,0.4)]"></span>
                    <span className="text-[10px] text-neutral-content font-black uppercase tracking-wider">In</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#bbf7d0]"></span>
                    <span className="text-[10px] text-neutral-content font-black uppercase tracking-wider">Out</span>
                  </div>
                </div>
                <select className="text-[10px] font-black uppercase tracking-wider border border-base-300 rounded-xl px-3 py-2 bg-base-200 outline-none shadow-sm">
                  <option>Annual View</option>
                </select>
              </div>
            </div>
            
            <div className="h-48 md:h-72 w-full mt-4">
              {hasMounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={cashflowData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-5" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'currentColor', fontSize: 10, fontWeight: 900}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'currentColor', fontSize: 10, fontWeight: 900}} />
                    <Tooltip cursor={{fill: 'currentColor', opacity: 0.05}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 900}} />
                    <Bar dataKey="income" stackId="a" fill="#1A3626" radius={[6, 6, 0, 0]} barSize={20} />
                    <Bar dataKey="expense" stackId="a" fill="#bbf7d0" radius={[0, 0, 6, 6]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Transactions (Agent Desk Style) */}
          <div className="bg-base-100 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-base-300 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-accent opacity-30 rounded-b-full"></div>
            <div className="flex justify-between items-center mb-5 md:mb-8">
              <h3 className="text-xs font-black text-neutral-content uppercase tracking-[0.2em]">Transaction Ledger</h3>
              <Link to="/dashboard/userTransactions" className="text-[10px] font-black text-primary hover:underline uppercase tracking-wider bg-primary/5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl">View All</Link>
            </div>
            
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 stagger-children">
              {history.length > 0 ? history.slice(0, 5).map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-base-200/50 rounded-xl border border-base-300/50 active:scale-[0.98] transition-transform">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs ${
                      tx.type === 'cash-in' ? 'bg-blue-500/10 text-blue-500' :
                      tx.type === 'cash-out' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-green-500/10 text-green-500'
                    }`}>
                      {tx.type === 'cash-in' ? '↓' : tx.type === 'cash-out' ? '↑' : '→'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-base-content capitalize">{tx.type?.replace('-', ' ') || "Payment"}</p>
                      <p className="text-[10px] text-neutral-content">{tx.time ? new Date(tx.time).toISOString().split('T')[0] : "—"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-base-content">${Number(tx.amount || 0).toLocaleString()}</p>
                    <span className={`text-[9px] font-bold uppercase ${
                      tx.status === 'reject' ? 'text-error' :
                      tx.status === 'pending' ? 'text-warning' :
                      'text-success'
                    }`}>
                      {tx.status === 'reject' ? 'Failed' : tx.status === 'approve' || !tx.status ? 'Cleared' : 'Pending'}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center text-neutral-content font-bold uppercase tracking-widest text-[10px]">No recent volume</div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-base-300">
                    <th className="pb-4 text-[9px] font-black text-neutral-content uppercase tracking-[0.2em]">Purpose</th>
                    <th className="pb-4 text-[9px] font-black text-neutral-content uppercase tracking-[0.2em]">Timeline</th>
                    <th className="pb-4 text-[9px] font-black text-neutral-content uppercase tracking-[0.2em]">Volume</th>
                    <th className="pb-4 text-[9px] font-black text-neutral-content uppercase tracking-[0.2em] text-right">State</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length > 0 ? history.slice(0, 5).map((tx, idx) => (
                    <tr key={idx} className="border-b border-base-200 last:border-0 hover:bg-base-200/30 transition-colors group">
                      <td className="py-4">
                        <p className="text-sm font-bold text-base-content capitalize">{tx.type?.replace('-', ' ') || "Payment"}</p>
                        <p className="text-[10px] text-neutral-content font-medium mt-0.5 truncate max-w-[150px]">{tx.recipientEmail || tx.userEmail}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-xs font-black text-base-content tracking-tight">
                          {tx.time ? new Date(tx.time).toISOString().split('T')[0] : "2024-03-01"}
                        </p>
                        <p className="text-[10px] text-neutral-content font-bold mt-0.5">
                          {tx.time ? new Date(tx.time).toLocaleTimeString([], { hour12: false }) : "04:28"}
                        </p>
                      </td>
                      <td className="py-4 font-black text-base-content tracking-tight">
                        ${Number(tx.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          tx.status === 'reject' ? 'bg-error/10 text-error' :
                          tx.status === 'pending' ? 'bg-warning/10 text-warning' :
                          'bg-success/10 text-success'
                        }`}>
                          {tx.status === 'reject' ? 'Failed' : tx.status === 'approve' || !tx.status ? 'Cleared' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="py-12 text-center text-neutral-content font-black uppercase tracking-widest text-[10px]">No recent volume</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Statistics Donut & Activity */}
        <div className="flex flex-col gap-4 md:gap-8 col-span-1 xl:col-span-1">
          {/* Statistic Card */}
          <div className="bg-base-100 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 shadow-sm border border-base-300 relative overflow-hidden">
            <h3 className="text-xs font-black text-neutral-content uppercase tracking-[0.2em] mb-5 md:mb-8">Asset Analysis</h3>
            
            <div className="h-36 md:h-48 w-full relative mb-5 md:mb-8">
              {hasMounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius="80%"
                      outerRadius="100%"
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[10px] font-black text-neutral-content uppercase tracking-widest">Outflow</p>
                <p className="text-2xl font-black text-base-content tracking-tight">${outcome.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {[
                { label: "Transfers", amount: categoryData.sendMoneyTotal, color: "primary", percentage: Math.round((categoryData.sendMoneyTotal / (outcome || 1)) * 100) },
                { label: "Cash Outs", amount: categoryData.cashOutTotal, color: "[#bbf7d0]", percentage: Math.round((categoryData.cashOutTotal / (outcome || 1)) * 100) },
                { label: "Utilities", amount: categoryData.paymentsTotal, color: "base-200", percentage: Math.round((categoryData.paymentsTotal / (outcome || 1)) * 100) }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-base-200/50 p-3 rounded-2xl border border-base-300/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-${item.color === 'primary' ? 'primary' : 'base-100'} border border-base-300 flex items-center justify-center text-[10px] font-black ${item.color === 'primary' ? 'text-white' : 'text-neutral-content'}`}>
                      {item.percentage}%
                    </div>
                    <span className="text-xs font-bold text-base-content">{item.label}</span>
                  </div>
                  <span className="text-xs font-black text-base-content tracking-tight">${item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-base-100 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 shadow-sm border border-base-300 flex-1 relative overflow-hidden">
            <h3 className="text-xs font-black text-neutral-content uppercase tracking-[0.2em] mb-6 md:mb-10">Live Stream</h3>
            
            <div className="space-y-5 md:space-y-8 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-base-300 border-dashed"></div>
              {activities.length === 0 ? (
                <p className="text-[10px] font-black text-neutral-content uppercase tracking-widest text-center py-10">Silent Stream</p>
              ) : (
                activities.slice(0, 5).map((act, idx) => (
                  <div key={idx} className="relative pl-10 group">
                    <div className={`absolute left-0 top-0 w-6 h-6 rounded-full border-4 border-base-100 shadow-sm transition-transform group-hover:scale-125 duration-500 ${idx % 2 === 0 ? 'bg-primary' : 'bg-accent'}`}></div>
                    <p className="text-xs font-bold text-base-content leading-relaxed">You <span className="text-neutral-content font-medium">{act.desc}</span></p>
                    <p className="text-[9px] font-black text-neutral-content uppercase tracking-widest mt-1.5 opacity-60">
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
