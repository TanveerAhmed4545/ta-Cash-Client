import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageTransactions = () => {
  const axiosSecure = useAxiosSecure();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await axiosSecure.get("/transactions");
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error fetching transactions");
    }
  };

  const handleAction = async (transactionId, action) => {
    try {
      const { data } = await axiosSecure.post("/manageTransaction", {
        transactionId,
        action,
      });

      if (data.result.modifiedCount > 0) {
        toast.success(`Transaction ${action}ed successfully`);
        
        // Log to history if approved
        if (action === "approve") {
            const { transaction } = data;
            const history = {
                recipientEmail: transaction.agentEmail,
                amount: transaction.amount,
                userEmail: "system", // Admin action
                type: transaction.type,
                totalAmount: transaction.amount,
                time: new Date()
            };
            await axiosSecure.post("/historyData", history);
        }
        
        fetchTransactions();
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[80vh]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Requests</h2>
          <p className="text-sm text-gray-500 mt-1">Review and process pending requests</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Requester</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Target</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tr, idx) => (
                <tr key={tr._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm text-gray-500">{idx + 1}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-700">{tr.userEmail === 'admin' ? tr.agentEmail : tr.userEmail}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{tr.userEmail === 'admin' ? 'Admin' : tr.agentEmail}</td>
                  <td className="py-4 px-4 text-sm font-bold text-[#1A3626]">${tr.amount}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase">{tr.type}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      tr.status === "pending" ? "bg-yellow-50 text-yellow-600" :
                      tr.status === "approved" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}>
                      {tr.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {tr.status === "pending" ? (
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleAction(tr._id, "approve")}
                          className="px-3 py-1 bg-[#1A3626] text-white rounded text-xs hover:bg-[#12261b]"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleAction(tr._id, "reject")}
                          className="px-3 py-1 bg-red-50 text-red-500 rounded text-xs hover:bg-red-100"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Processed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-400">No requests found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTransactions;
