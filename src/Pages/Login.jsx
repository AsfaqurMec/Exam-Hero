import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../Provider/AuthProvider";
import { useNavigate, Link } from "react-router";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import SocialLogin from "./SocialLogin/SocialLogin";
import UseAxiosSecure from "../Hooks/UseAxiosSecure";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signInUser, signInWithGoogle, signInWithFacebook, setUser } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    setError("");
    setIsLoading(true);
    
    signInUser(data.email, data.password)
      .then(() => {
        setIsLoading(false);
        navigate("/"); // redirect to home
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  };

  // const handleSocialLogin = (provider) => {
  //   setError("");
  //   setIsLoading(true);
    
  //   provider()
  //     .then(() => {
  //       setIsLoading(false);
  //       navigate("/");
  //     })
  //     .catch((err) => {
  //       setIsLoading(false);
  //       setError(err.message);
  //     });
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Decorative header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-4 px-6">
          <h2 className="text-2xl font-bold text-white text-center">Welcome Back</h2>
          <p className="text-center text-blue-100 mt-1">Sign in to continue your journey</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <div className="flex-1">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <button 
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
              <input
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-gray-700 mb-2 font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500" 
                />
                <span className="select-none">Remember me</span>
              </label>
              {/* <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
              >
                Forgot password?
              </Link> */}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-3 text-gray-400 text-sm">or continue with</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Social Login */}
          <div className="flex gap-4">
            <SocialLogin></SocialLogin>
          </div>

          <p className="text-center text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;