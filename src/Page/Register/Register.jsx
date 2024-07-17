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
      // console.log(response.data);
      response.data &&
        toast.success("Registration Successfully and Please Login");
      reset();
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed");
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left lg:ml-10">
          <h1 className=" text-2xl md:text-4xl font-bold">
            Register Now To Ta-Cash
          </h1>
          <div className="max-w-[600px] md:max-w-md lg:max-w-[600px]">
            <Lottie
              className="w-full"
              animationData={signUpAnimation}
              loop={true}
            />
          </div>
        </div>
        <div className="card shrink-0 w-full max-w-md shadow-2xl bg-base-100">
          <form className="card-body pb-0" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Name"
                className="input input-bordered"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-red-500 font-semibold pt-2">
                  This Name field is required
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-red-500 font-semibold pt-2">
                  This Email field is required
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input
                type="text"
                placeholder="Phone Number"
                className="input input-bordered"
                {...register("phone", { required: true })}
              />
              {errors.phone && (
                <span className="text-red-500 font-semibold pt-2">
                  This Phone Number field is required
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              {/* <div className="w-full relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full input input-bordered"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <span className="text-red-500 font-semibold pt-2">
                    This Password field is required
                  </span>
                )}
                <span
                  className="absolute top-4 right-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <IoMdEye />}
                </span>
              </div> */}
              <div className="w-full relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full input input-bordered"
                  {...register("password", {
                    required: true,
                    pattern: {
                      value: /^\d{5}$/,
                      message: "Password must be a 5-digit number",
                    },
                  })}
                />
                {errors.password && (
                  <span className="text-red-500 font-semibold pt-2">
                    {errors.password.message}
                  </span>
                )}
                <span
                  className="absolute top-4 right-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <IoMdEye />}
                </span>
              </div>
            </div>
            <div className="form-control mt-6">
              <button className="btn bg-[#85A1FF] text-white">Register</button>
            </div>
          </form>
          <div className="text-center py-5">
            <p>
              Already have an account?{" "}
              <Link className="text-[#2563EB] font-bold" to="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
