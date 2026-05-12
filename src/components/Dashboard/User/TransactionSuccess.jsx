import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const TransactionSuccess = ({ amount, recipient, type }) => {
 const [animationData, setAnimationData] = useState(null);

 useEffect(() => {
 fetch("https://lottie.host/855909a3-5c79-43c7-95f0-6a953e5e6e33/Ym0xR6Jm9z.json")
 .then(res => res.json())
 .then(data => setAnimationData(data));
 }, []);

 return (
 <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-in fade-in zoom-in duration-500">
 <div className="w-48 h-48 md:w-64 md:h-64">
 {animationData && (
 <Lottie 
 animationData={animationData} 
 loop={false}
 />
 )}
 </div>
 
 <h2 className="text-2xl md:text-3xl font-bold text-base-content mt-4 text-center">Transaction Successful!</h2>
 <p className="text-neutral-content mt-2 text-center max-w-md text-sm md:text-base">
 You have successfully {type === 'send-money' ? 'sent' : type === 'cash-in' ? 'added' : 'withdrawn'} 
 <span className="font-bold text-base-content"> ${amount}</span> 
 {recipient && <> to <span className="font-bold text-base-content">{recipient}</span></>}.
 </p>
 
 <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-xs sm:max-w-none sm:w-auto">
 <Link 
 to="/dashboard/userTransactions" 
 className="px-6 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-[#12261b] transition-all shadow-lg text-center active:scale-95"
 >
 View History
 </Link>
 <Link 
 to="/dashboard" 
 className="px-6 py-3.5 bg-base-200 text-base-content rounded-xl font-bold hover:bg-base-300 transition-all border border-base-300 text-center active:scale-95"
 >
 Back to Home
 </Link>
 </div>
 </div>
 );
};

export default TransactionSuccess;
