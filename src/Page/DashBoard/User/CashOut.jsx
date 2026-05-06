import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useStatus from "../../../hooks/useStatus";

const CashOut = () => {
  const navigate = useNavigate();
  const [status, isLoading] = useStatus();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [category, setCategory] = useState("Cash Out");
  const [users, setUsers] = useState([]);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const userEmail = user?.email;
  const userName = user?.name;

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosSecure.get("/UsersData");
        // Filter out  user's email
        const filteredUsers = data.filter(
          (u) =>
            u.role === "agent" &&
            u.status === "approved" &&
            u.email !== user?.email
        );
        setUsers(filteredUsers.map((u) => u.email));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [axiosSecure, user.email]);

  const handleSendMoney = async () => {
    if (!amount || !pin) {
      toast.error("Please enter amount and PIN.");
      return;
    }

    try {
      const { data } = await axiosSecure.post("/cashOut", {
        recipientEmail,
        amount,
        pin,
      });

      toast.success(data.message);
      //   console.log(data.result.modifiedCount);
      if (data.result.modifiedCount > 0) {
        const totalAmount = data?.totalAmountToDeduct;
        const type = "cash-out";
        const history = {
          recipientEmail,
          amount,
          userEmail,
          userName,
          type,
          category,
          totalAmount,
        };
        // console.table(history);
        const res = await axiosSecure.post("/historyData", history);
        if (res.data?.historyResult?.insertedId) {
          navigate("/dashboard/userTransactions");
        }
      }

      // Reset form fields after successful transaction
      setRecipientEmail("");
      setAmount("");
      setPin("");
      setCategory("Cash Out");
    } catch (error) {
      toast.error(`Error: ${error.response.data.message}`);
    }
  };
  if (isLoading) return <div>Loading .....</div>;
  return (
    <>
      {status === "approved" ? (
        <div className="flex flex-col items-center pt-10 pb-20 px-4 min-h-screen font-sans bg-transparent">
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-md relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1A3626] to-[#bbf7d0]"></div>
             
             <div className="flex justify-center mb-4 mt-2">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" transform="rotate(180 12 12)" /></svg>
                </div>
             </div>
             
             <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
               Cash Out
             </h2>
             <p className="text-sm text-gray-500 mb-8 text-center leading-relaxed">
               Withdraw funds securely by selecting an authorized agent. A 1.5% fee applies.
             </p>
             
             <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Agent Email</label>
                  <select
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1A3626] focus:ring-1 focus:ring-[#1A3626] transition-colors text-sm text-gray-700 bg-gray-50 appearance-none"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  >
                    <option value="">Select an Agent...</option>
                    {users.map((email) => (
                      <option key={email} value={email}>
                        {email}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                  <select
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1A3626] focus:ring-1 focus:ring-[#1A3626] transition-colors text-sm text-gray-700 bg-gray-50 appearance-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Cash Out">Cash Out</option>
                    <option value="Payments">Payments</option>
                    <option value="Send Money">Send Money</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                    <input
                      className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1A3626] focus:ring-1 focus:ring-[#1A3626] transition-colors text-sm text-gray-700 bg-gray-50"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">PIN Code</label>
                  <input
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1A3626] focus:ring-1 focus:ring-[#1A3626] transition-colors text-sm text-gray-700 bg-gray-50 tracking-[0.3em] font-bold"
                    type="password"
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                  />
                </div>
                
                <button
                  className="w-full bg-[#1A3626] text-white font-bold py-4 rounded-xl hover:bg-[#12261b] transition-all duration-300 mt-4 shadow-md flex justify-center items-center gap-2 group"
                  onClick={handleSendMoney}
                >
                  Confirm Cash Out
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
           <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <h2 className="text-xl font-bold text-gray-800">Pending Approval</h2>
           <p className="text-gray-500 mt-2 text-sm">Please wait for Admin approval to perform transactions.</p>
        </div>
      )}
    </>
  );
};

export default CashOut;
