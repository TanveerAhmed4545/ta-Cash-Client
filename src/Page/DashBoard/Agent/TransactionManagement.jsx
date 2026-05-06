import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const TransactionManagement = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await axiosSecure.get("/transactions");
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  // Function  (approve/reject)
  const manageTransaction = async (transactionId, action) => {
    try {
      const { data } = await axiosSecure.post("/manageTransaction", {
        transactionId,
        action,
      });
      // Assuming a successful update means refetching the transactions list
      await fetchTransactions();
      toast.success("Transaction processed successfully");
      //   console.log(data);
      if (data.result.modifiedCount > 0) {
        const userEmail = data?.transaction.agentEmail;
        const amount = data?.transaction.amount;
        const totalAmount = data?.transaction.amount;
        const type = data?.transaction.type;
        const recipientEmail = data?.transaction.userEmail;

        const history = {
          recipientEmail,
          amount,
          userEmail,
          type,
          totalAmount,
        };
        // console.table(history);
        const res = await axiosSecure.post("/historyData", history);
        if (res.data?.historyResult?.insertedId) {
          navigate("/dashboard/agentTransactions");
        }
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  // Initial fetch of transactions
  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="text-center">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-center">Error fetching transactions</div>;
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[80vh]">
      <div className="flex justify-between items-center mb-8">
         <div>
           <h2 className="text-2xl font-bold text-gray-900">Manage Transactions</h2>
           <p className="text-sm text-gray-500 mt-1">Review and process cash-in/out requests</p>
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-xl">#</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Email</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Agent Email</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction, idx) => (
                <tr key={transaction._id} className="border-b border-gray-50 last:border-0 hover:bg-green-50/30 transition-colors">
                  <th className="py-4 px-4 font-medium text-gray-400">{idx + 1}</th>
                  <td className="py-4 px-4 text-sm text-gray-600">{transaction.userEmail}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{transaction.agentEmail}</td>
                  <td className="py-4 px-4 text-sm font-bold text-[#1A3626]">${transaction.amount}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-tight">{transaction.type}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      transaction.status === "pending" ? "bg-yellow-50 text-yellow-600" :
                      transaction.status === "approve" || transaction.status === "approved" ? "bg-green-50 text-green-600" :
                      "bg-red-50 text-red-600"
                    }`}>
                      {transaction.status === "approve" ? "Completed" : transaction.status === "reject" ? "Failed" : transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {transaction.status === "pending" ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="px-3 py-1.5 bg-[#1A3626] text-white rounded-lg text-xs font-bold hover:bg-[#12261b] transition-colors"
                          onClick={() => manageTransaction(transaction._id, "approve")}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                          onClick={() => manageTransaction(transaction._id, "reject")}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-xs text-gray-400 italic">Processed</div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-500">
                  No pending transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionManagement;
