import axios from "axios";
import Lottie from "lottie-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEyeSlash, FaUser, FaPhone, FaEnvelope, FaLock, FaCamera, FaSun, FaMoon } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import signUpAnimation from "../../assets/cash2.json";
import { uploadImage } from "../../utils/uploadImage";
import { useTheme } from "../../Provider/ThemeProvider";

const Register = () => {
 const { theme, toggleTheme } = useTheme();
 const [showPassword, setShowPassword] = useState(false);
 const [uploading, setUploading] = useState(false);
 const navigate = useNavigate();
 const {
 register,
 handleSubmit,
 reset,
 formState: { errors },
 } = useForm();

 const onSubmit = async (data) => {
 setUploading(true);
 try {
 let photoURL = "";
 if (data.photo && data.photo[0]) {
 photoURL = await uploadImage(data.photo[0]);
 }

 const userData = {
 ...data,
 photoURL: photoURL || `https://ui-avatars.com/api/?name=${data.name}&background=1A3626&color=fff`,
 };
 
 delete userData.photo;

 const response = await axios.post("https://ta-cash-server.vercel.app/register", userData);
 response.data && toast.success("Welcome! Registration Successful. Please Login.");
 reset();
 navigate("/");
 } catch (error) {
 toast.error("Registration failed. Data may be invalid.");
 console.error("Registration failed:", error);
 } finally {
 setUploading(false);
 }
 };

 return (
 <div className="min-h-screen flex items-center justify-center bg-base-200 p-4 md:p-6 font-sans relative overflow-hidden transition-colors duration-300">
 {/* Theme Toggle */}
 <button 
 onClick={toggleTheme}
 className="fixed top-4 right-4 md:top-8 md:right-8 p-3 md:p-4 bg-base-100 rounded-full shadow-lg border border-base-300 z-[100] hover:scale-110 active:scale-95 transition-transform text-base-content"
 >
 {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} className="text-yellow-400" />}
 </button>

 {/* Dynamic background elements */}
 <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary rounded-full blur-[140px] opacity-10"></div>
 <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-primary rounded-full blur-[140px] opacity-5"></div>
 
 <div className="max-w-6xl w-full backdrop-blur-md bg-base-100/70 rounded-2xl md:rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row-reverse min-h-0 md:min-h-[750px] border border-white/20 relative z-10">
 
 {/* Right Side - Visual Branding (Always Dark) */}
 <div className="lg:w-1/2 bg-gradient-to-br from-[#1A3626] to-[#2d5a3f] p-12 flex flex-col justify-center items-center relative overflow-hidden hidden lg:flex">
 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
 
 <div className="w-full max-w-md relative z-10 flex flex-col items-center text-white">
 <div className="mb-10 flex items-center gap-4 group cursor-pointer">
 <div className="grid grid-cols-2 gap-1.5 w-12 h-12 transition-transform duration-500 group-hover:scale-110">
 <div className="bg-white rounded-full"></div>
 <div className="bg-[#bbf7d0] rounded-full opacity-80"></div>
 <div className="bg-[#bbf7d0] rounded-full opacity-80"></div>
 <div className="bg-white rounded-full"></div>
 </div>
 <h2 className="text-4xl font-black tracking-tighter uppercase italic">Ta Cash</h2>
 </div>
 
 <div className="relative">
 <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full"></div>
 <Lottie className="w-full relative z-10 scale-105" animationData={signUpAnimation} loop={true} />
 </div>
 
 <div className="text-center mt-10 space-y-4">
 <h3 className="text-3xl font-bold tracking-tight">Financial Freedom</h3>
 <p className="text-white/80 text-lg leading-relaxed max-w-xs mx-auto">
 Secure your future today. Join thousands of users managing assets worldwide.
 </p>
 </div>
 </div>
 </div>

 {/* Left Side - Register Form */}
 <div className="lg:w-1/2 p-6 md:p-10 lg:p-20 flex flex-col justify-center bg-base-100">
 {/* Mobile Logo */}
 <div className="flex lg:hidden items-center justify-center gap-3 mb-4">
 <div className="grid grid-cols-2 gap-1 w-9 h-9">
 <div className="bg-primary rounded-full"></div>
 <div className="bg-primary rounded-full opacity-60"></div>
 <div className="bg-primary rounded-full opacity-60"></div>
 <div className="bg-primary rounded-full"></div>
 </div>
 <h2 className="text-xl font-black tracking-tighter uppercase italic text-primary">Ta Cash</h2>
 </div>
 <div className="mb-6 md:mb-10 text-center lg:text-left">
 <h1 className="text-3xl md:text-4xl font-black text-base-content mb-2 md:mb-3 tracking-tighter uppercase">Join Us</h1>
 <p className="text-neutral-content font-bold uppercase tracking-widest text-xs">Create your secure digital vault.</p>
 </div>

 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-neutral-content uppercase tracking-[0.2em] flex items-center gap-2 px-1">
 <FaUser className="text-primary" /> Full Name
 </label>
 <input
 type="text"
 placeholder="John Doe"
 className="w-full px-5 md:px-6 py-3.5 md:py-4 rounded-2xl border-2 border-base-300 bg-base-200 focus:bg-base-100 focus:border-primary transition-all outline-none text-base-content font-semibold"
 {...register("name", { required: true })}
 />
 {errors.name && <p className="text-red-500 text-[10px] mt-1 font-black uppercase tracking-wider px-1">Required</p>}
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-black text-neutral-content uppercase tracking-[0.2em] flex items-center gap-2 px-1">
 <FaPhone className="text-primary" /> Phone
 </label>
 <input
 type="text"
 placeholder="+123..."
 className="w-full px-6 py-4 rounded-2xl border-2 border-base-300 bg-base-200 focus:bg-base-100 focus:border-primary transition-all outline-none text-base-content font-semibold"
 {...register("phone", { required: true })}
 />
 {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-black uppercase tracking-wider px-1">Required</p>}
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-black text-neutral-content uppercase tracking-[0.2em] flex items-center gap-2 px-1">
 <FaCamera className="text-primary" /> Identity / Photo
 </label>
 <input
 type="file"
 accept="image/*"
 className="w-full px-6 py-4 rounded-2xl border-2 border-dashed border-base-300 bg-base-200 focus:bg-base-100 transition-all outline-none text-xs text-neutral-content file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-primary file:text-white"
 {...register("photo")}
 />
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-black text-neutral-content uppercase tracking-[0.2em] flex items-center gap-2 px-1">
 <FaEnvelope className="text-primary" /> Email
 </label>
 <input
 type="email"
 placeholder="example@mail.com"
 className="w-full px-5 md:px-6 py-3.5 md:py-4 rounded-2xl border-2 border-base-300 bg-base-200 focus:bg-base-100 focus:border-primary transition-all outline-none text-base-content font-semibold"
 {...register("email", { required: true })}
 />
 {errors.email && <p className="text-red-500 text-[10px] mt-1 font-black uppercase tracking-wider px-1">Email is required</p>}
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-black text-neutral-content uppercase tracking-[0.2em] flex items-center gap-2 px-1">
 <FaLock className="text-primary" /> Secure 5-Digit PIN
 </label>
 <div className="relative">
 <input
 type={showPassword ? "text" : "password"}
 placeholder="•••••"
 className="w-full px-5 md:px-6 py-3.5 md:py-4 rounded-2xl border-2 border-base-300 bg-base-200 focus:bg-base-100 focus:border-primary transition-all outline-none text-base-content font-semibold tracking-[1em] placeholder:tracking-normal"
 {...register("password", {
 required: "Required",
 pattern: { value: /^\d{5}$/, message: "Must be 5 digits" },
 })}
 />
 <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-content hover:text-primary transition-colors" onClick={() => setShowPassword(!showPassword)}>
 {showPassword ? <FaEyeSlash size={22} /> : <IoMdEye size={22} />}
 </button>
 </div>
 {errors.password && <p className="text-red-500 text-[10px] mt-1 font-black uppercase tracking-wider px-1">{errors.password.message}</p>}
 </div>

 <button
 type="submit"
 disabled={uploading}
 className="w-full py-4 md:py-5 mt-4 md:mt-8 bg-primary text-white font-black text-base md:text-lg uppercase tracking-widest rounded-2xl hover:brightness-110 shadow-lg hover:shadow-primary/20 transition-all duration-300 active:scale-[0.97] disabled:opacity-70 flex justify-center items-center"
 >
 {uploading ? (
 <div className="flex items-center gap-3">
 <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
 Initializing...
 </div>
 ) : "Establish Account"}
 </button>
 </form>

 <p className="text-center mt-6 md:mt-10 text-neutral-content font-bold uppercase tracking-tighter text-sm">
 Existing holder?{" "}
 <Link to="/" className="text-primary border-b-2 border-primary/20 hover:border-primary transition-all ml-1">
 Access Vault
 </Link>
 </p>
 </div>
 </div>
 </div>
 );
};

export default Register;
