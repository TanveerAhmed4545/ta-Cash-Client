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
    <div className="flex flex-col min-h-screen">
      <h2 className="text-lg md:text-3xl font-semibold text-center my-6">
        Manage Transactions
      </h2>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="bg-[#e5ebee]">
              <th>#</th>
              <th>User</th>
              <th>Agent</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th>Approve</th>
              <th>Reject</th>
            </tr>
          </thead>
          <tbody>
            {/* row */}
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction, idx) => (
                <tr key={transaction._id} className="hover">
                  <th>{idx + 1}</th>
                  <td>{transaction.userEmail}</td>
                  <td>{transaction.agentEmail}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.status}</td>
                  {transaction.status === "pending" && (
                    <>
                      <td>
                        <button
                          className="btn btn-sm bg-green-500 text-white"
                          onClick={() =>
                            manageTransaction(transaction._id, "approve")
                          }
                        >
                          Approve
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm bg-red-500 text-white"
                          onClick={() =>
                            manageTransaction(transaction._id, "reject")
                          }
                        >
                          Reject
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No transactions found
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
