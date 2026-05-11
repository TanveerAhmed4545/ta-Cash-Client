import Lottie from "lottie-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEyeSlash, FaLock, FaEnvelope, FaSun, FaMoon } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import signInAnimation from "../../assets/cash.json";
import { useAuth } from "../../Provider/AuthProvider";
import { useTheme } from "../../Provider/ThemeProvider";

const Login = () => {
 const { theme, toggleTheme } = useTheme();
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
 <div className="min-h-screen flex items-center justify-center bg-base-200 p-6 font-sans relative overflow-hidden transition-colors duration-300">
 {/* Theme Toggle in Login */}
 <button 
 onClick={toggleTheme}
 className="fixed top-8 right-8 p-4 bg-base-100 rounded-full shadow-lg border border-base-300 z-[100] hover:scale-110 transition-transform text-base-content"
 >
 {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} className="text-yellow-400" />}
 </button>

 {/* Background blobs for depth */}
 <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px] opacity-10"></div>
 <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px] opacity-5"></div>
 
 <div className="max-w-6xl w-full backdrop-blur-md bg-base-100/70 rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row min-h-[700px] border border-white/20 relative z-10">
 
 {/* Left Side - Visual Content (Always Dark) */}
 <div className="lg:w-1/2 bg-gradient-to-br from-[#1A3626] to-[#2d5a3f] p-12 flex flex-col justify-center items-center relative overflow-hidden hidden lg:flex">
 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
 
 <div className="w-full max-w-md relative z-10 flex flex-col items-center">
 <div className="mb-12 flex items-center gap-4 group cursor-pointer">
 <div className="grid grid-cols-2 gap-1.5 w-12 h-12 transition-transform duration-500 group-hover:rotate-180">
 <div className="bg-white rounded-tl-2xl rounded-br-2xl"></div>
 <div className="bg-[#bbf7d0] rounded-tr-2xl rounded-bl-2xl opacity-80"></div>
 <div className="bg-[#bbf7d0] rounded-tr-2xl rounded-bl-2xl opacity-80"></div>
 <div className="bg-white rounded-tl-2xl rounded-br-2xl"></div>
 </div>
 <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Ta Cash</h2>
 </div>
 
 <div className="relative w-full">
 <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full"></div>
 <Lottie className="w-full relative z-10 scale-110" animationData={signInAnimation} loop={true} />
 </div>
 
 <div className="text-center mt-12 space-y-4">
 <h3 className="text-3xl font-bold text-white tracking-tight">Financial Mastery</h3>
 <p className="text-white/80 text-lg leading-relaxed max-w-xs mx-auto">
 Experience the next generation of secure and seamless mobile finance.
 </p>
 </div>
 </div>
 </div>

 {/* Right Side - Login Form */}
 <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center bg-base-100">
 <div className="mb-12 text-center lg:text-left">
 <h1 className="text-5xl font-black text-base-content mb-4 tracking-tighter">Sign In</h1>
 <p className="text-neutral-content text-neutral-content text-lg font-medium">Access your global wallet instantly.</p>
 </div>

 <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
 <div className="space-y-2">
 <label className="text-[11px] font-black text-neutral-content uppercase tracking-widest flex items-center gap-2 px-1">
 <FaEnvelope className="text-primary" /> Email Address
 </label>
 <input
 type="email"
 placeholder="name@example.com"
 className="w-full px-6 py-5 rounded-2xl border-2 border-base-300 bg-base-200 focus:bg-base-100 focus:border-primary transition-all duration-300 outline-none text-base-content font-semibold"
 {...register("email", { required: true })}
 />
 {errors.email && <p className="text-red-500 text-xs font-bold uppercase mt-1 px-1">Email is required</p>}
 </div>

 <div className="space-y-2">
 <label className="text-[11px] font-black text-neutral-content uppercase tracking-widest flex items-center gap-2 px-1">
 <FaLock className="text-primary" /> Security PIN
 </label>
 <div className="relative">
 <input
 type={showPassword ? "text" : "password"}
 placeholder="•••••"
 className="w-full px-6 py-5 rounded-2xl border-2 border-base-300 bg-base-200 focus:bg-base-100 focus:border-primary transition-all duration-300 outline-none text-base-content font-semibold tracking-[0.5em] placeholder:tracking-normal"
 {...register("password", { required: true })}
 />
 <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-content hover:text-primary transition-colors" onClick={() => setShowPassword(!showPassword)}>
 {showPassword ? <FaEyeSlash size={22} /> : <IoMdEye size={22} />}
 </button>
 </div>
 {errors.password && <p className="text-red-500 text-xs font-bold uppercase mt-1 px-1">Password is required</p>}
 </div>

 <div className="flex items-center justify-between pt-2">
 <label className="flex items-center gap-2 cursor-pointer group">
 <input type="checkbox" className="checkbox checkbox-primary checkbox-sm rounded-lg" />
 <span className="text-sm text-neutral-content font-bold group-hover:text-base-content transition-colors">Keep me signed in</span>
 </label>
 <a href="#" className="text-sm font-bold text-primary hover:underline transition-colors">Forgot PIN?</a>
 </div>

 <button type="submit" className="w-full py-5 mt-10 bg-primary text-white font-black text-lg uppercase tracking-widest rounded-2xl hover:brightness-110 shadow-lg hover:shadow-primary/20 transition-all duration-300 active:scale-[0.98]">
 Enter Vault
 </button>
 </form>

 <p className="text-center mt-12 text-neutral-content text-neutral-content font-bold uppercase tracking-tighter text-sm">
 New to Ta Cash?{" "}
 <Link to="/register" className="text-primary border-b-2 border-primary/20 hover:border-primary transition-all ml-1">
 Create secure account
 </Link>
 </p>
 </div>
 </div>
 </div>
 );
};

export default Login;
