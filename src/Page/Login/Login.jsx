import Lottie from "lottie-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEyeSlash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";
import signInAnimation from "../../assets/cash.json";
import { useAuth } from "../../Provider/AuthProvider";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //   const onSubmit = async (data) => {
  //     try {
  //       const response = await axios.post("http://localhost:5000/login", data);

  //       const { token } = response.data;
  //       localStorage.setItem("token", token); // Store token in localStorage
  //     } catch (error) {
  //       console.error("Login error:", error.message);
  //       // Handle error, display error message to the user
  //     }
  //   };
  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error("Login error:", error.message);
      // Handle error, display error message to the user
    }
  };

  //   const handleLogout = () => {
  //     // Clear JWT token from localStorage (or sessionStorage)
  //     localStorage.removeItem("token"); // Replace 'token' with your actual token key
  // };
  return (
    <div className="hero min-h-screen ">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left ml-0 lg:ml-10">
          <h1 className="text-4xl font-bold mb-4">Login Now</h1>
          {/* <div>
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          </div> */}
          <div className=" max-w-[500px] md:max-w-md lg:max-w-[570px]  ">
            <Lottie
              className="w-full"
              animationData={signInAnimation}
              loop={true}
            />
          </div>
        </div>
        <div className="card  shrink-0 w-full max-w-md shadow-2xl bg-base-100">
          {/* <h1 className="text-4xl font-bold text-center mt-4">Login Now</h1> */}
          <form className="card-body pb-0" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email"
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
                <span className="label-text">Password</span>
              </label>
              <div className="w-full relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  name="password"
                  className="w-full input input-bordered"
                  {...register("password", { required: true })}
                />
                <span
                  className="absolute top-4 right-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash></FaEyeSlash>
                  ) : (
                    <IoMdEye></IoMdEye>
                  )}
                </span>
              </div>
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn bg-[#1f55cbb5] text-white">
                Login
              </button>
            </div>
          </form>
          <div className="text-center py-5">
            <p>
              Do not have an account ?{" "}
              <Link className="text-[#2563EB] font-bold" to="/register">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
