const LoadingSpinner = () => {
 return (
 <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 animate-in fade-in duration-500">
 <div className="relative">
 <div className="w-14 h-14 md:w-16 md:h-16 border-4 border-[#1A3626]/20 border-t-[#1A3626] rounded-full animate-spin"></div>
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
 </div>
 </div>
 <p className="text-neutral-content font-black uppercase tracking-widest text-[10px]">Loading...</p>
 </div>
 );
};

export default LoadingSpinner;
