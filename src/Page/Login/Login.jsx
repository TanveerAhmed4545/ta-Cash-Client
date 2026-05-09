import Lottie from "lottie-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import signInAnimation from "../../assets/cash.json";
import { useAuth } from "../../Provider/AuthProvider";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back! Login Successful");
      navigate(
        location.state?.from?.pathname
          ? location.state?.from?.pathname
          : "/dashboard"
      );
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9f4] p-6 font-sans relative overflow-hidden">
      {/* Background blobs for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#bbf7d0] rounded-full blur-[120px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1A3626] rounded-full blur-[120px] opacity-10"></div>
      
      <div className="max-w-6xl w-full backdrop-blur-md bg-white/70 rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row min-h-[700px] border border-white/50 relative z-10">
        
        {/* Left Side - Visual Content */}
        <div className="lg:w-1/2 bg-gradient-to-br from-[#1A3626] to-[#2d5a3f] p-12 flex flex-col justify-center items-center relative overflow-hidden hidden lg:flex">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="w-full max-w-md relative z-10 flex flex-col items-center">
             <div className="mb-12 flex items-center gap-4 group cursor-pointer">
                <div className="grid grid-cols-2 gap-1.5 w-12 h-12 transition-transform duration-500 group-hover:rotate-180">
                  <div className="bg-white rounded-tl-2xl rounded-br-2xl"></div>
                  <div className="bg-[#bbf7d0] rounded-tr-2xl rounded-bl-2xl"></div>
                  <div className="bg-[#bbf7d0] rounded-tr-2xl rounded-bl-2xl"></div>
                  <div className="bg-white rounded-tl-2xl rounded-br-2xl"></div>
                </div>
                <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Ta Cash</h2>
             </div>
             
             <div className="relative w-full">
                <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full"></div>
                <Lottie
                  className="w-full relative z-10 scale-110"
                  animationData={signInAnimation}
                  loop={true}
                />
             </div>
             
             <div className="text-center mt-12 space-y-4">
                <h3 className="text-3xl font-bold text-white tracking-tight">Financial Mastery</h3>
                <p className="text-white/70 text-lg leading-relaxed max-w-xs mx-auto">
                  Experience the next generation of secure and seamless mobile finance.
                </p>
             </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center">
          
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
               <div className="grid grid-cols-2 gap-1 w-8 h-8">
                 <div className="bg-[#1A3626] rounded-tl-lg rounded-br-lg"></div>
                 <div className="bg-[#1A3626] rounded-tr-lg rounded-bl-lg"></div>
                 <div className="bg-[#1A3626] rounded-tr-lg rounded-bl-lg"></div>
                 <div className="bg-[#1A3626] rounded-tl-lg rounded-br-lg"></div>
               </div>
               <h2 className="text-2xl font-black text-[#1A3626] uppercase">Ta Cash</h2>
          </div>

          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">Sign In</h1>
            <p className="text-gray-600 text-lg font-medium">Access your global wallet instantly.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2 px-1">
                <FaEnvelope className="text-[#1A3626]/60" /> Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-6 py-5 rounded-2xl border-2 border-gray-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-[#1A3626]/10 focus:border-[#1A3626] transition-all duration-300 outline-none text-gray-800 font-semibold placeholder:text-gray-400"
                  {...register("email", { required: true })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-wider px-1">Email is required</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2 px-1">
                <FaLock className="text-[#1A3626]/60" /> Security PIN
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••"
                  className="w-full px-6 py-5 rounded-2xl border-2 border-gray-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-[#1A3626]/10 focus:border-[#1A3626] transition-all duration-300 outline-none text-gray-800 font-semibold tracking-[0.5em] placeholder:tracking-normal placeholder:text-gray-400"
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-6 text-gray-300 hover:text-[#1A3626] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={22} /> : <IoMdEye size={22} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-wider px-1">Password is required</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
               <label className="flex items-center gap-3 cursor-pointer group">
                 <div className="relative w-5 h-5 flex items-center justify-center">
                    <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="w-5 h-5 border-2 border-gray-200 rounded-lg peer-checked:bg-[#1A3626] peer-checked:border-[#1A3626] transition-all"></div>
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                 </div>
                 <span className="text-sm text-gray-500 font-bold group-hover:text-gray-700 transition-colors">Keep me signed in</span>
               </label>
               <a href="#" className="text-sm font-bold text-[#1A3626] hover:text-[#2d5a3f] transition-colors">Forgot PIN?</a>
            </div>

            <button
              type="submit"
              className="w-full py-5 mt-10 bg-[#1A3626] text-white font-black text-lg uppercase tracking-widest rounded-2xl hover:bg-[#14281c] hover:shadow-[0_20px_40px_rgba(26,54,38,0.2)] hover:-translate-y-1 transition-all duration-300 active:translate-y-0"
            >
              Enter Vault
            </button>
          </form>

          <p className="text-center mt-12 text-gray-400 font-bold uppercase tracking-tighter text-sm">
            New to Ta Cash?{" "}
            <Link to="/register" className="text-[#1A3626] border-b-2 border-[#1A3626]/20 hover:border-[#1A3626] transition-all ml-1">
              Create secure account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
