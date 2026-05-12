import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FiCheck, FiX, FiClock, FiRefreshCw, FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";
import { format } from "date-fns";

const TransactionManagement = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await axiosSecure.get("/transactions");
      // Sort by newest first assuming _id contains timestamp or there's a date field
      // If no date field, we rely on natural order or _id
      setTransactions(data.reverse()); 
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  const manageTransaction = async (transactionId, action) => {
    try {
      const { data } = await axiosSecure.post("/manageTransaction", {
        transactionId,
        action,
      });
      await fetchTransactions();
      toast.success(`Transaction ${action}d successfully`);
      
      if (data.result.modifiedCount > 0 && action === "approve") {
        const userEmail = data?.transaction.agentEmail;
        const amount = data?.transaction.amount;
        const totalAmount = data?.transaction.amount;
        const type = data?.transaction.type;
        const recipientEmail = data?.transaction.userEmail;

        const history = { recipientEmail, amount, userEmail, type, totalAmount };
        await axiosSecure.post("/historyData", history);
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => {
    if (filter === "all") return true;
    if (filter === "pending") return t.status === "pending";
    if (filter === "completed") return t.status === "approve" || t.status === "approved";
    if (filter === "rejected") return t.status === "reject";
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-500">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-content font-bold uppercase tracking-widest text-xs">Syncing Ledger...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
          <FiX size={24} />
        </div>
        <h2 className="text-xl font-bold text-base-content">Connection Error</h2>
        <p className="text-neutral-content mt-2 text-sm">Failed to retrieve transaction data.</p>
        <button onClick={fetchTransactions} className="mt-6 px-6 py-2 bg-primary text-primary-content rounded-xl font-bold flex items-center gap-2 hover:opacity-90">
          <FiRefreshCw /> Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-base-content tracking-tight">Agent Desk</h2>
          <p className="text-neutral-content mt-1 font-medium italic">Process and oversee cash flow requests.</p>
        </div>
        
        <div className="flex bg-base-200 p-1.5 rounded-2xl border border-base-300">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                filter === f 
                  ? "bg-base-100 text-primary shadow-sm" 
                  : "text-neutral-content hover:text-base-content"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-base-300 overflow-hidden relative">
        {/* Subtle top gradient bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>
        
        {/* Mobile Card View */}
        <div className="md:hidden p-3 space-y-3 stagger-children">
          {filteredTransactions.length > 0 ? filteredTransactions.map((transaction) => {
            const isCashIn = transaction.type === "cash-in";
            const isPending = transaction.status === "pending";
            const isApproved = transaction.status === "approve" || transaction.status === "approved";
            return (
              <div key={transaction._id} className="p-4 bg-base-200/30 rounded-xl border border-base-300/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isCashIn ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {isCashIn ? <FiArrowDownLeft size={16} /> : <FiArrowUpRight size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-base-content capitalize">{transaction.type.replace('-', ' ')}</p>
                      <p className="text-[10px] text-neutral-content">{transaction.userEmail}</p>
                    </div>
                  </div>
                  <p className="text-base font-black text-base-content">${transaction.amount}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${isPending ? 'bg-warning/10 text-warning' : isApproved ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {isApproved ? 'Cleared' : transaction.status}
                  </span>
                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => manageTransaction(transaction._id, 'approve')} className="w-9 h-9 rounded-xl bg-success/10 text-success flex items-center justify-center active:scale-90 transition-transform"><FiCheck size={16} /></button>
                      <button onClick={() => manageTransaction(transaction._id, 'reject')} className="w-9 h-9 rounded-xl bg-error/10 text-error flex items-center justify-center active:scale-90 transition-transform"><FiX size={16} /></button>
                    </div>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="py-12 text-center"><FiCheck size={32} className="mx-auto mb-3 opacity-20" /><p className="text-sm font-bold text-base-content">All Caught Up</p></div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto p-2">
          <table className="w-full text-left border-collapse mt-2">
            <thead>
              <tr className="border-b border-base-300">
                <th className="py-5 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Transaction</th>
                <th className="py-5 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Client</th>
                <th className="py-5 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Amount</th>
                <th className="py-5 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Status</th>
                <th className="py-5 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => {
                  const isCashIn = transaction.type === "cash-in";
                  const isPending = transaction.status === "pending";
                  const isApproved = transaction.status === "approve" || transaction.status === "approved";
                  
                  return (
                    <tr key={transaction._id} className="border-b border-base-200 last:border-0 hover:bg-base-200/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${isCashIn ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                            {isCashIn ? <FiArrowDownLeft size={20} /> : <FiArrowUpRight size={20} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-base-content capitalize">{transaction.type.replace('-', ' ')}</p>
                            <p className="text-[10px] font-mono text-neutral-content mt-1">ID: {transaction._id.substring(0,8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-medium text-base-content">{transaction.userEmail.split('@')[0]}</p>
                        <p className="text-xs text-neutral-content">{transaction.userEmail}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-lg font-black text-base-content tracking-tight">${transaction.amount}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center w-max gap-1.5 ${
                          isPending ? "bg-warning/10 text-warning" :
                          isApproved ? "bg-success/10 text-success" :
                          "bg-error/10 text-error"
                        }`}>
                          {isPending && <FiClock />}
                          {isApproved && <FiCheck />}
                          {!isPending && !isApproved && <FiX />}
                          {isApproved ? "Cleared" : transaction.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => manageTransaction(transaction._id, "approve")}
                              className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center hover:bg-success hover:text-success-content transition-all shadow-sm"
                              title="Approve Transaction"
                            >
                              <FiCheck size={18} />
                            </button>
                            <button
                              onClick={() => manageTransaction(transaction._id, "reject")}
                              className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-error-content transition-all shadow-sm"
                              title="Reject Transaction"
                            >
                              <FiX size={18} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-content font-bold uppercase tracking-wider">Processed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-content">
                      <FiCheck size={40} className="mb-4 opacity-20" />
                      <p className="text-lg font-bold text-base-content">All Caught Up</p>
                      <p className="text-sm">No {filter !== 'all' ? filter : ''} transactions require your attention.</p>
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

export default TransactionManagement;
