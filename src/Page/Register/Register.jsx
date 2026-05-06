import axios from "axios";
import Lottie from "lottie-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEyeSlash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import signUpAnimation from "../../assets/cash2.json";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/register", data);
      response.data && toast.success("Registration Successfully and Please Login");
      reset();
      navigate("/");
    } catch (error) {
      toast.error("Registration failed");
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 font-sans text-gray-800">
      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col lg:flex-row-reverse min-h-[650px] border border-gray-100">
        
        {/* Right Side - Animation & Branding (Reversed for Register) */}
        <div className="lg:w-1/2 bg-[#ecfdf5] p-12 flex flex-col justify-center items-center relative overflow-hidden hidden lg:flex">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#bbf7d0]/40 rounded-full -ml-24 -mb-24"></div>
          
          <div className="w-full max-w-md relative z-10 flex flex-col items-center">
             <div className="mb-8 flex items-center gap-3">
               <div className="grid grid-cols-2 gap-1 w-10 h-10">
                 <div className="bg-[#1A3626] rounded-tl-xl rounded-br-xl"></div>
                 <div className="bg-[#1A3626] rounded-tr-xl rounded-bl-xl"></div>
                 <div className="bg-[#1A3626] rounded-tr-xl rounded-bl-xl"></div>
                 <div className="bg-[#1A3626] rounded-tl-xl rounded-br-xl"></div>
               </div>
               <h2 className="text-3xl font-bold tracking-wider text-[#1A3626] uppercase">Ta Cash</h2>
             </div>
             <Lottie
               className="w-full drop-shadow-xl"
               animationData={signUpAnimation}
               loop={true}
             />
             <div className="text-center mt-8">
                <h3 className="text-2xl font-bold text-[#1A3626] mb-2">Join Our Community</h3>
                <p className="text-[#1A3626]/70">Create an account to start managing your assets with ease.</p>
             </div>
          </div>
        </div>

        {/* Left Side - Register Form */}
        <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-white relative">
          
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
               <div className="grid grid-cols-2 gap-[2px] w-8 h-8">
                 <div className="bg-[#1A3626] rounded-tl-[10px] rounded-br-[10px]"></div>
                 <div className="bg-[#1A3626] rounded-tr-[10px] rounded-bl-[10px]"></div>
                 <div className="bg-[#1A3626] rounded-tr-[10px] rounded-bl-[10px]"></div>
                 <div className="bg-[#1A3626] rounded-tl-[10px] rounded-br-[10px]"></div>
               </div>
               <h2 className="text-2xl font-bold tracking-wider text-[#1A3626] uppercase">Ta Cash</h2>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Create Account</h1>
            <p className="text-gray-500">Sign up to get started with Ta Cash.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                 <input
                   type="text"
                   placeholder="John Doe"
                   className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A3626]/20 focus:border-[#1A3626] transition-all outline-none"
                   {...register("name", { required: true })}
                 />
                 {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">Name is required</p>}
               </div>

               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                 <input
                   type="text"
                   placeholder="+1 234 567 890"
                   className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A3626]/20 focus:border-[#1A3626] transition-all outline-none"
                   {...register("phone", { required: true })}
                 />
                 {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">Phone is required</p>}
               </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A3626]/20 focus:border-[#1A3626] transition-all outline-none"
                {...register("email", { required: true })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">Email is required</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">PIN / Password (5-digit)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a 5-digit PIN"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A3626]/20 focus:border-[#1A3626] transition-all outline-none"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^\d{5}$/,
                      message: "Must be a 5-digit number",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <IoMdEye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-4 mt-6 bg-[#1A3626] text-white font-bold rounded-xl hover:bg-[#14281c] hover:shadow-lg hover:-translate-y-0.5 transition-all active:translate-y-0"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 font-medium text-sm">
            Already have an account?{" "}
            <Link to="/" className="text-[#1A3626] font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
