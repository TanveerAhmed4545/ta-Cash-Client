import Lottie from "lottie-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEyeSlash } from "react-icons/fa";
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
      toast.success("Login Successfully");
      navigate(
        location.state?.from?.pathname
          ? location.state?.from?.pathname
          : "/dashboard"
      );
    } catch (error) {
      toast.error("Login error");
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 font-sans text-gray-800">
      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] border border-gray-100">
        
        {/* Left Side - Animation & Branding */}
        <div className="lg:w-1/2 bg-[#ecfdf5] p-12 flex flex-col justify-center items-center relative overflow-hidden hidden lg:flex">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#bbf7d0]/40 rounded-full -ml-24 -mb-24"></div>
          
          <div className="w-full max-w-md relative z-10 flex flex-col items-center">
             <div className="mb-10 flex items-center gap-3">
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
               animationData={signInAnimation}
               loop={true}
             />
             <div className="text-center mt-10">
                <h3 className="text-2xl font-bold text-[#1A3626] mb-2">Manage Your Finances</h3>
                <p className="text-[#1A3626]/70">Gain full access to detailed analytics and secure transfers.</p>
             </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center bg-white relative">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
               <div className="grid grid-cols-2 gap-[2px] w-8 h-8">
                 <div className="bg-[#1A3626] rounded-tl-[10px] rounded-br-[10px]"></div>
                 <div className="bg-[#1A3626] rounded-tr-[10px] rounded-bl-[10px]"></div>
                 <div className="bg-[#1A3626] rounded-tr-[10px] rounded-bl-[10px]"></div>
                 <div className="bg-[#1A3626] rounded-tl-[10px] rounded-br-[10px]"></div>
               </div>
               <h2 className="text-2xl font-bold tracking-wider text-[#1A3626] uppercase">Ta Cash</h2>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back!</h1>
            <p className="text-gray-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A3626]/20 focus:border-[#1A3626] transition-all outline-none"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 font-medium">Email is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A3626]/20 focus:border-[#1A3626] transition-all outline-none"
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <IoMdEye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="checkbox" className="w-4 h-4 rounded text-[#1A3626] focus:ring-[#1A3626] accent-[#1A3626]" />
                 <span className="text-sm text-gray-600 font-medium">Remember me</span>
               </label>
               <a href="#" className="text-sm font-semibold text-[#1A3626] hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full py-4 mt-8 bg-[#1A3626] text-white font-bold rounded-xl hover:bg-[#14281c] hover:shadow-lg hover:-translate-y-0.5 transition-all active:translate-y-0"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-10 text-gray-500 font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#1A3626] font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
