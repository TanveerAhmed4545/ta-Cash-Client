import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useStatus from "../../../hooks/useStatus";
import { useAuth } from "../../../Provider/AuthProvider";

const CashIn = () => {
 const navigate = useNavigate();
 const [agentEmail, setAgentEmail] = useState("");
 const [status, isLoading] = useStatus();
 const [amount, setAmount] = useState("");
 const [agents, setAgents] = useState([]);
 const axiosSecure = useAxiosSecure();
 const { user, role } = useAuth();
 const userEmail = user?.email;

 useEffect(() => {
 if (role === "agent") {
 navigate("/dashboard/requestCashIn");
 }
 }, [role, navigate]);
 useEffect(() => {
 const fetchAgents = async () => {
 try {
 const { data } = await axiosSecure.get("/UsersData");
 const filteredAgents = data.filter(
 (u) =>
 u.role === "agent" &&
 u.status === "approved" &&
 u.email !== user?.email
 );
 setAgents(filteredAgents.map((u) => u.email));
 } catch (error) {
 console.error("Error fetching agents:", error);
 }
 };

 fetchAgents();
 }, [axiosSecure, user.email]);

 const handleCashInRequest = async () => {
 if (!amount || !agentEmail) {
 toast.error("Please enter amount and select an agent.");
 return;
 }

 try {
 const { data } = await axiosSecure.post("/cashInRequest", {
 userEmail,
 agentEmail,
 amount,
 });

 toast.success(data.message);

 setAgentEmail("");
 setAmount("");
 } catch (error) {
 toast.error(`Error: ${error.response.data.message}`);
 }
 };
 if (isLoading) return <div>Loading .....</div>;
 return (
 <>
 {status === "approved" ? (
 <div className="flex flex-col items-center pt-4 pb-24 md:pt-10 md:pb-20 px-0 md:px-4 min-h-screen font-sans bg-transparent">
 <div className="bg-base-100 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-base-300 w-full max-w-md relative overflow-hidden">
 <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1A3626] to-[#bbf7d0]"></div>
 
 <div className="flex justify-center mb-4 mt-2">
 <div className="w-12 h-12 bg-base-200 rounded-full flex items-center justify-center text-primary">
 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
 </div>
 </div>
 
 <h2 className="text-xl md:text-2xl font-bold text-base-content mb-2 text-center">
 Cash In Request
 </h2>
 <p className="text-sm text-neutral-content mb-5 md:mb-8 text-center leading-relaxed">
 Select an authorized agent and enter the amount you want to add to your balance.
 </p>
 
 <div className="space-y-5">
 <div>
 <label className="block text-[11px] font-bold text-neutral-content uppercase tracking-wider mb-2">Agent Email</label>
 <select
 className="w-full px-4 py-3.5 rounded-xl border border-base-300 focus:outline-none focus:border-[#1A3626] focus:ring-1 focus:ring-[#1A3626] transition-colors text-sm text-base-content bg-base-200 appearance-none"
 value={agentEmail}
 onChange={(e) => setAgentEmail(e.target.value)}
 >
 <option value="">Select an Agent...</option>
 {agents.map((email) => (
 <option key={email} value={email}>
 {email}
 </option>
 ))}
 </select>
 </div>
 
 <div>
 <label className="block text-[11px] font-bold text-neutral-content uppercase tracking-wider mb-2">Amount</label>
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-content font-bold">$</span>
 <input
 className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-base-300 focus:outline-none focus:border-[#1A3626] focus:ring-1 focus:ring-[#1A3626] transition-colors text-sm text-base-content bg-base-200"
 type="number"
 placeholder="0.00"
 value={amount}
 onChange={(e) => setAmount(e.target.value)}
 />
 </div>
 </div>
 
 <button
 className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-[#12261b] transition-all duration-300 mt-4 shadow-md flex justify-center items-center gap-2 group"
 onClick={handleCashInRequest}
 >
 Send Cash-In Request
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

export default CashIn;
