import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FiCheckCircle, FiXCircle, FiUser, FiActivity, FiArrowRight, FiDollarSign, FiClock } from "react-icons/fi";

const ManageTransactions = () => {
  const axiosSecure = useAxiosSecure();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await axiosSecure.get("/transactions");
      setTransactions(data.reverse()); // Show newest first
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error fetching requests");
    }
  };

  const handleAction = async (transactionId, action) => {
    const toastId = toast.loading(`${action === 'approve' ? 'Approving' : 'Rejecting'} request...`);
    try {
      const { data } = await axiosSecure.post("/manageTransaction", {
        transactionId,
        action,
      });

      if (data.result.modifiedCount > 0) {
        toast.success(`Request ${action}ed successfully`, { id: toastId });
        
        if (action === "approve") {
          const { transaction } = data;
          const history = {
            recipientEmail: transaction.agentEmail,
            amount: transaction.amount,
            userEmail: "system",
            type: transaction.type,
            totalAmount: transaction.amount,
            time: new Date()
          };
          await axiosSecure.post("/historyData", history);
        }
        
        fetchTransactions();
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`, { id: toastId });
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-500">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-content font-black uppercase tracking-widest text-xs">Monitoring Request Pipeline...</p>
      </div>
    );
  }

  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="w-full px-4 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-base-content tracking-tight">Request Pipeline</h2>
          <p className="text-neutral-content mt-1 font-medium italic">Authorize or decline high-volume cash flow requests.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-warning/10 rounded-2xl border border-warning/20 flex items-center gap-3">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
            <p className="text-xs font-black text-warning uppercase tracking-widest">
              Action Required: <span className="ml-1 text-base-content">{pendingCount}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-base-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-base-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-warning to-error"></div>
        
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse mt-2">
            <thead>
              <tr className="border-b border-base-300">
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Requester Path</th>
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Transaction Volume</th>
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Intent</th>
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em] text-right">Status / Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tr, idx) => {
                  const isPending = tr.status === "pending";
                  const isApproved = tr.status === "approved";
                  const isRejected = tr.status === "reject";
                  const isSystemInbound = tr.userEmail === 'admin';

                  return (
                    <tr key={tr._id} className="border-b border-base-200 last:border-0 hover:bg-base-200/50 transition-colors group">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-2xl bg-base-200 text-neutral-content group-hover:bg-primary group-hover:text-white transition-all">
                            <FiUser size={20} />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-base-content">{isSystemInbound ? tr.agentEmail : tr.userEmail}</span>
                              <FiArrowRight className="text-neutral-content" size={10} />
                              <span className="text-[10px] font-black text-neutral-content uppercase tracking-wider">{isSystemInbound ? 'Vault' : 'Agent'}</span>
                            </div>
                            <p className="text-[9px] font-mono text-neutral-content mt-1 uppercase tracking-tighter">REQ-ID: {tr._id.substring(0,12)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-base-content tracking-tight">${Number(tr.amount).toLocaleString()}</span>
                          <p className="text-[10px] text-neutral-content font-bold uppercase tracking-widest mt-0.5">USD Equiv</p>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="px-4 py-1.5 rounded-xl bg-base-200 text-base-content text-[10px] font-black uppercase tracking-widest flex items-center w-max gap-2">
                          <FiDollarSign className="text-primary" />
                          {tr.type}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {isPending ? (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <button 
                                onClick={() => handleAction(tr._id, "approve")}
                                className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center hover:bg-success hover:text-white transition-all shadow-sm"
                                title="Authorize Request"
                              >
                                <FiCheckCircle size={18} />
                              </button>
                              <button 
                                onClick={() => handleAction(tr._id, "reject")}
                                className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-white transition-all shadow-sm"
                                title="Decline Request"
                              >
                                <FiXCircle size={18} />
                              </button>
                            </div>
                          ) : (
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                              isApproved ? "bg-success/10 text-success" : "bg-error/10 text-error"
                            }`}>
                              {isApproved ? <FiCheckCircle /> : <FiXCircle />}
                              {tr.status}
                            </span>
                          )}
                          {isPending && (
                             <span className="px-3 py-1.5 rounded-full bg-warning/10 text-warning text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 group-hover:hidden transition-all">
                               <FiClock className="animate-pulse" />
                               Pending
                             </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-content">
                      <FiActivity size={48} className="mb-4 opacity-20" />
                      <p className="text-xl font-black text-base-content tracking-tight">Queue Clear</p>
                      <p className="text-sm font-medium mt-1">There are no pending requests to process.</p>
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

export default ManageTransactions;
