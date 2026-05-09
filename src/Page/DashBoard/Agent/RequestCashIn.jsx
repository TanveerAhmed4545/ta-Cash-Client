import { useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useStatus from "../../../hooks/useStatus";

const RequestCashIn = () => {
  const [status, isLoading] = useStatus();
  const [amount, setAmount] = useState("");
  const axiosSecure = useAxiosSecure();

  const handleRequest = async () => {
    if (!amount) {
      toast.error("Please enter an amount.");
      return;
    }

    try {
      const { data } = await axiosSecure.post("/agentCashInRequest", {
        amount,
      });

      toast.success(data.message);
      setAmount("");
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {status === "approved" ? (
        <div className="flex flex-col items-center pt-10 pb-20 px-4 min-h-screen font-sans bg-transparent">
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-md relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1A3626] to-[#bbf7d0]"></div>
             
             <div className="flex justify-center mb-4 mt-2">
                <div className="w-12 h-12 bg-[#ecfdf5] rounded-full flex items-center justify-center text-[#1A3626]">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
             </div>
             
             <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
               Request Balance from Admin
             </h2>
             <p className="text-sm text-gray-500 mb-8 text-center leading-relaxed">
               Enter the amount you want to request from the admin. Once approved, it will be added to your balance.
             </p>
             
             <div className="space-y-5">
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
                
                <button
                  className="w-full bg-[#1A3626] text-white font-bold py-4 rounded-xl hover:bg-[#12261b] transition-all duration-300 mt-4 shadow-md flex justify-center items-center gap-2 group"
                  onClick={handleRequest}
                >
                  Send Request to Admin
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

export default RequestCashIn;
