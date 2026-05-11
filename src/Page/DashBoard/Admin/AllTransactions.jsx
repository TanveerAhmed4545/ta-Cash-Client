import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FiArrowDownLeft, FiArrowUpRight, FiSearch, FiLayers, FiActivity } from "react-icons/fi";
import { useState } from "react";

const AllTransactions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  const { data: history = [], isLoading } = useQuery({
    queryKey: ["allHistory", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/allHistory`);
      return res.data.reverse();
    },
  });

  const filteredHistory = history.filter(item => 
    item.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
    item.recipientEmail?.toLowerCase().includes(search.toLowerCase()) ||
    item._id?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-500">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-content font-black uppercase tracking-widest text-xs">Fetching Master Logs...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-base-content tracking-tight">System Ledger</h2>
          <p className="text-neutral-content mt-1 font-medium italic">Complete audit of all transactions across the platform.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-content" />
            <input
              type="text"
              placeholder="Filter by email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-base-100 rounded-2xl border border-base-300 outline-none focus:border-primary transition-all text-sm font-medium shadow-sm"
            />
          </div>
          <div className="px-5 py-3 bg-base-200 rounded-2xl border border-base-300 text-xs font-black text-neutral-content uppercase tracking-widest hidden lg:block">
            Global Volume: <span className="text-base-content ml-1">{history.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-base-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-base-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>
        
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse mt-2">
            <thead>
              <tr className="border-b border-base-300">
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Transaction</th>
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Flow Path</th>
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Asset Volume</th>
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, idx) => {
                  const isCashIn = item.type === "cash-in" || item.type === "agent-cash-in";
                  return (
                    <tr key={item._id} className="border-b border-base-200 last:border-0 hover:bg-base-200/50 transition-colors group">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${isCashIn ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-500'}`}>
                            {isCashIn ? <FiArrowDownLeft size={20} /> : <FiArrowUpRight size={20} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-base-content capitalize">{item.type.replace('-', ' ')}</p>
                            <p className="text-[10px] font-mono text-neutral-content mt-1">ID: {item._id.substring(0,12).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-neutral-content uppercase tracking-wider w-12">From:</span>
                            <span className="text-xs font-medium text-base-content">{item.userEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-neutral-content uppercase tracking-wider w-12">To:</span>
                            <span className="text-xs font-medium text-base-content">{item.recipientEmail || "System"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-base-content tracking-tight">${item.amount}</span>
                          <p className="text-[10px] text-primary font-bold mt-0.5 opacity-60">Settled Asset</p>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          isCashIn ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-500'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-content">
                      <FiActivity size={48} className="mb-4 opacity-20" />
                      <p className="text-xl font-black text-base-content tracking-tight">No Flow Recorded</p>
                      <p className="text-sm font-medium mt-1">The system hasn't captured any transactions yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllTransactions;
