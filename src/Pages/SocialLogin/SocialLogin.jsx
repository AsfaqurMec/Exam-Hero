import React, { useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const SocialLogin = () => {
  const { signInWithGoogle } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      // Google লগইন
      const result = await signInWithGoogle();
      const user = result.user;

      const newUser = {
        name: user.displayName,
        email: user.email,
        role: "user",
        createdAt: new Date(),
      };

      // DB তে user POST (Conflict handle)
      try {
        await axiosSecure.post("/users", newUser);
        console.log("✅ New user created:", newUser);
      } catch (err) {
        if (err.response?.status === 409) {
          console.log("⚠️ User already exists, skipping creation.");
        } else {
          throw err; // অন্য কোনো error হলে catch করবে
        }
      }

      console.log("✅ Google login success & user handled in DB:", newUser);
      navigate("/"); // হোমে নেভিগেট

    } catch (error) {
      console.error("❌ Google login failed:", error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="btn w-full bg-white text-black border-[#e5e5e5] flex items-center justify-center gap-2"
      aria-label="Login with Google"
    >
      <svg
        aria-label="Google logo"
        width="20"
        height="20"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path d="m0 0H512V512H0" fill="#fff" />
          <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
          <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
          <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
          <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
        </g>
      </svg>
      Login with Google
    </button>
  );
};

export default SocialLogin;
