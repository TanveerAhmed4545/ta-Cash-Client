import axios from "axios";
import Lottie from "lottie-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEyeSlash, FaUser, FaPhone, FaEnvelope, FaLock, FaCamera } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import signUpAnimation from "../../assets/cash2.json";
import { uploadImage } from "../../utils/uploadImage";

const Register = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9f4] p-6 font-sans relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#1A3626] rounded-full blur-[140px] opacity-[0.07]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#bbf7d0] rounded-full blur-[140px] opacity-30"></div>
      
      <div className="max-w-6xl w-full backdrop-blur-md bg-white/70 rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row-reverse min-h-[750px] border border-white/50 relative z-10">
        
        {/* Right Side - Visual Branding */}
        <div className="lg:w-1/2 bg-gradient-to-br from-[#1A3626] to-[#2d5a3f] p-12 flex flex-col justify-center items-center relative overflow-hidden hidden lg:flex">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="w-full max-w-md relative z-10 flex flex-col items-center text-white">
             <div className="mb-10 flex items-center gap-4 group cursor-pointer">
                <div className="grid grid-cols-2 gap-1.5 w-12 h-12 transition-transform duration-500 group-hover:scale-110">
                  <div className="bg-white rounded-full"></div>
                  <div className="bg-[#bbf7d0] rounded-full"></div>
                  <div className="bg-[#bbf7d0] rounded-full"></div>
                  <div className="bg-white rounded-full"></div>
                </div>
                <h2 className="text-4xl font-black tracking-tighter uppercase italic">Ta Cash</h2>
             </div>
             
             <div className="relative">
                <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full"></div>
                <Lottie
                  className="w-full relative z-10 scale-105"
                  animationData={signUpAnimation}
                  loop={true}
                />
             </div>
             
             <div className="text-center mt-10 space-y-4">
                <h3 className="text-3xl font-bold tracking-tight">Financial Freedom</h3>
                <p className="text-white/70 text-lg leading-relaxed max-w-xs mx-auto">
                   Secure your future today. Join thousands of users managing assets worldwide.
                </p>
             </div>
          </div>
        </div>

        {/* Left Side - Register Form */}
        <div className="lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center">
          
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
               <div className="grid grid-cols-2 gap-1 w-8 h-8">
                 <div className="bg-[#1A3626] rounded-full"></div>
                 <div className="bg-[#1A3626] rounded-full"></div>
                 <div className="bg-[#1A3626] rounded-full"></div>
                 <div className="bg-[#1A3626] rounded-full"></div>
               </div>
               <h2 className="text-2xl font-black text-[#1A3626] uppercase">Ta Cash</h2>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter uppercase">Join Us</h1>
            <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">Create your secure digital vault.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                   <FaUser className="text-[#1A3626]/60" /> Full Name
                 </label>
                 <input
                   type="text"
                   placeholder="John Doe"
                   className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-[#1A3626]/10 focus:border-[#1A3626] transition-all outline-none text-gray-800 font-semibold placeholder:text-gray-400"
                   {...register("name", { required: true })}
                 />
                 {errors.name && <p className="text-red-500 text-[10px] mt-1 font-black uppercase tracking-wider px-1">Required</p>}
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                   <FaPhone className="text-[#1A3626]/60" /> Phone
                 </label>
                 <input
                   type="text"
                   placeholder="+123..."
                   className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-[#1A3626]/10 focus:border-[#1A3626] transition-all outline-none text-gray-800 font-semibold placeholder:text-gray-400"
                   {...register("phone", { required: true })}
                 />
                 {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-black uppercase tracking-wider px-1">Required</p>}
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                <FaCamera className="text-[#1A3626]/60" /> Identity / Photo
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-dashed border-gray-200 bg-white/30 focus:bg-white transition-all outline-none text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-[#1A3626] file:text-white hover:file:scale-105 file:transition-transform cursor-pointer"
                  {...register("photo")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                <FaEnvelope className="text-[#1A3626]/60" /> Email
              </label>
              <input
                type="email"
                placeholder="example@mail.com"
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-[#1A3626]/10 focus:border-[#1A3626] transition-all outline-none text-gray-800 font-semibold placeholder:text-gray-400"
                {...register("email", { required: true })}
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-1 font-black uppercase tracking-wider px-1">Email is required</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                <FaLock className="text-[#1A3626]/60" /> Secure 5-Digit PIN
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-[#1A3626]/10 focus:border-[#1A3626] transition-all outline-none text-gray-800 font-semibold tracking-[1em] placeholder:tracking-normal placeholder:text-gray-400"
                  {...register("password", {
                    required: "Required",
                    pattern: {
                      value: /^\d{5}$/,
                      message: "Must be 5 digits",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-6 text-gray-300 hover:text-[#1A3626] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={22} /> : <IoMdEye size={22} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] mt-1 font-black uppercase tracking-wider px-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-5 mt-8 bg-[#1A3626] text-white font-black text-lg uppercase tracking-widest rounded-2xl hover:bg-[#14281c] hover:shadow-[0_20px_40px_rgba(26,54,38,0.2)] hover:-translate-y-1 transition-all duration-300 active:translate-y-0 disabled:opacity-70 flex justify-center items-center"
            >
              {uploading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Initializing...
                </div>
              ) : "Establish Account"}
            </button>
          </form>

          <p className="text-center mt-10 text-gray-400 font-bold uppercase tracking-tighter text-sm">
            Existing holder?{" "}
            <Link to="/" className="text-[#1A3626] border-b-2 border-[#1A3626]/20 hover:border-[#1A3626] transition-all ml-1">
              Access Vault
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
