import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useStatus from "../../../hooks/useStatus";
import TransactionSuccess from "../../../components/Dashboard/User/TransactionSuccess";

const CashOut = () => {
 const navigate = useNavigate();
 const [status, isLoading] = useStatus();
 const [recipientEmail, setRecipientEmail] = useState("");
 const [amount, setAmount] = useState("");
 const [pin, setPin] = useState("");
 const [category, setCategory] = useState("Cash Out");
 const [users, setUsers] = useState([]);
 const [isSuccess, setIsSuccess] = useState(false);
 const axiosSecure = useAxiosSecure();
 const { user } = useAuth();
 const userEmail = user?.email;
 const userName = user?.name;

 useEffect(() => {
 const fetchUsers = async () => {
 try {
 const { data } = await axiosSecure.get("/UsersData");
 const filteredUsers = data.filter(
 (u) => u.role === "agent" && u.status === "approved" && u.email !== user?.email
 );
 setUsers(filteredUsers.map((u) => u.email));
 } catch (error) {
 console.error("Error fetching users:", error);
 }
 };
 fetchUsers();
 }, [axiosSecure, user?.email]);

 const handleCashOut = async () => {
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

 if (data.flagged) {
 toast.error(data.message, { duration: 5000, icon: '🚨' });
 setRecipientEmail("");
 setAmount("");
 setPin("");
 return;
 }

 if (data.result?.modifiedCount > 0 || data.message === "Transaction successful") {
 const totalAmount = data?.totalAmountToDeduct || amount;
 const history = {
 recipientEmail,
 amount,
 userEmail,
 userName,
 type: "cash-out",
 category,
 totalAmount,
 };
 await axiosSecure.post("/historyData", history);
 setIsSuccess(true);
 }
 } catch (error) {
 toast.error(`Error: ${error.response?.data?.message || 'Transaction failed'}`);
 }
 };

 if (isLoading) return <div className="flex items-center justify-center min-h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

 if (isSuccess) {
 return <TransactionSuccess amount={amount} recipient={recipientEmail} type="cash-out" />;
 }

 return (
 <>
 {status === "approved" ? (
 <div className="flex flex-col items-center pt-10 pb-20 px-4 min-h-screen font-sans bg-transparent">
 <div className="bg-base-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-base-300 w-full max-w-md relative overflow-hidden">
 <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-300"></div>
 <div className="flex justify-center mb-4 mt-2">
 <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" transform="rotate(180 12 12)" /></svg>
 </div>
 </div>
 <h2 className="text-2xl font-bold text-base-content mb-2 text-center">Cash Out</h2>
 <p className="text-sm text-neutral-content mb-8 text-center leading-relaxed">Withdraw funds securely via an authorized agent.</p>
 <div className="space-y-5">
 <div>
 <label className="block text-[11px] font-bold text-neutral-content uppercase tracking-wider mb-2">Agent Email</label>
 <select
 className="w-full px-4 py-3.5 rounded-xl border border-base-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-sm text-base-content bg-base-200 appearance-none"
 value={recipientEmail}
 onChange={(e) => setRecipientEmail(e.target.value)}
 >
 <option value="">Select an Agent...</option>
 {users.map((email) => <option key={email} value={email}>{email}</option>)}
 </select>
 </div>
 <div>
 <label className="block text-[11px] font-bold text-neutral-content uppercase tracking-wider mb-2">Amount</label>
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-content font-bold">$</span>
 <input
 className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-base-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-sm text-base-content bg-base-200"
 type="number"
 placeholder="0.00"
 value={amount}
 onChange={(e) => setAmount(e.target.value)}
 />
 </div>
 </div>
 <div>
 <label className="block text-[11px] font-bold text-neutral-content uppercase tracking-wider mb-2">PIN Code</label>
 <input
 className="w-full px-4 py-3.5 rounded-xl border border-base-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-sm text-base-content bg-base-200 tracking-[0.3em] font-bold"
 type="password"
 placeholder="••••"
 value={pin}
 onChange={(e) => setPin(e.target.value)}
 />
 </div>
 <button
 className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all duration-300 mt-4 shadow-md flex justify-center items-center gap-2 group"
 onClick={handleCashOut}
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
 <h2 className="text-xl font-bold text-base-content">Pending Approval</h2>
 <p className="text-neutral-content mt-2 text-sm">Please wait for Admin approval to perform transactions.</p>
 </div>
 )}
 </>
 );
};

export default CashOut;
