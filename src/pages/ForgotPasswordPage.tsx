import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import bridegroom2 from "@/assets/bride-groom2.png";
import flower1 from "@/assets/flower1.png";
import flower2 from "@/assets/flower2.png";
import swayamwar from "@/assets/swayamwar.png";
import rectangleBg from "@/assets/Rectangle 1.png";
import { apiFetch } from "@/lib/apiClient";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || "Failed to send reset email. Please try again.");
        return;
      }

      setMessage("Password reset link has been sent to your email address. Please check your inbox.");
    } catch (error) {
      setErrorMessage("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">

      {/* ================= MOBILE ILLUSTRATION ================= */}
      <div className="relative block lg:hidden bg-[#F6DCDD] h-[280px] md:h-[380px] overflow-hidden">
        

        <div className="absolute -top-44 left-7  sm:-top-40 md:-top-72  inset-0 flex items-center justify-center">
          <img src={swayamwar} alt="" className="w-[60%]  md:w-[50%] " />
        </div>
        <img src={flower1} className="absolute -top-6 -left-14 w-52" alt="" />
        <img src={flower2} className="absolute -bottom-2 -right-10 w-44 md:w-52" alt="" />

        <div className="absolute top-36 inset-0 flex items-center justify-center">
          <img src={bridegroom2} alt="" className="w-full md:w-[80%]" />
        </div>

        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 375 60" fill="white">
          <path d="M0,0 C90,60 285,60 375,0 L375,60 L0,60 Z" />
        </svg>
      </div>

      {/* ================= DESKTOP ILLUSTRATION ================= */}
       <div className="w-full bg-white overflow-hidden  flex flex-col lg:flex-row relative">

      {/* LEFT SECTION - ILLUSTRATION ZONE */}
     <div className="hidden lg:block relative w-full lg:w-[60%] h-[320px] sm:h-[380px] lg:h-auto overflow-hidden">
                <img className="absolute inset-0 w-full h-full" src={rectangleBg} alt="" />
      
                <div className="absolute inset-0 flex items-center justify-center">
      
                  <img
                    src={swayamwar}
                    alt=""
                    className="absolute top-16 xl:left-56 w-[50%] h-[180px] hidden lg:block"
                    style={{ aspectRatio: "509.90/422.26" }}
                  />
      
                  <img
                    src={flower1}
                    alt=""
                    className="absolute -top-24 -left-40 w-[510px] h-[422px] hidden lg:block"
                    style={{ aspectRatio: "509.90/422.26" }}
                  />
      
                  <img
                    src={flower2}
                    alt=""
                    className="absolute -bottom-24 -right-8 hidden lg:block"
                    style={{ aspectRatio: "138/137" }}
                  />
                  
      
                  <img
                    src={flower1}
                    alt=""
                    className="absolute -bottom-20 w-[60%] left-20 -rotate-[120deg] hidden lg:block"
                    style={{ aspectRatio: "372.18/308.21" }}
                  />
      
                  <img
                    src={bridegroom2}
                    alt="Bride and Groom"
                    className="relative z-10 lg:top-56 xl:top-44 -left-7 max-w-[600px] lg:max-w-[130%] h-full object-contain px-4 lg:px-0"
                  />
                </div>
              </div>
      {/* RIGHT SECTION - FORGOT PASSWORD FORM */}
      <div className="w-full lg:w-[40%] bg-white flex items-center justify-center px-4 py-6 lg:p-0">
  <div className="w-full max-w-[280px] lg:max-w-[328px] flex flex-col gap-4 lg:gap-10">

    {/* Header */}
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-col gap-1 lg:gap-2">
        <h1 className="text-[22px] lg:text-[30px] font-bold text-black font-jakarta">
          Forgot Password
        </h1>
        <p className="text-sm lg:text-base text-black/60 font-urbanist">
          Enter your email to reset your password
        </p>
      </div>
    </div>

    {/* Form */}
    <form className="flex flex-col gap-3 lg:gap-4" onSubmit={handleForgotPassword}>
      {/* Email Field */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600 ml-2">Email Address</label>
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full px-4 py-3 lg:px-5 lg:py-4 pr-12 rounded-[24px] lg:rounded-[32px] border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>

      {errorMessage && (
        <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
      )}

      {message && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-600 font-medium">{message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="py-2.5 lg:py-3 rounded-[20px] lg:rounded-[24px] bg-blue-600 text-white font-semibold text-sm disabled:opacity-70 hover:bg-blue-700 transition-colors"
      >
        {isSubmitting ? "Sending..." : "Send Reset Link"}
      </button>
      
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="py-2.5 lg:py-3 rounded-[20px] lg:rounded-[24px] border border-black/10 text-sm font-semibold hover:bg-gray-50 transition-colors"
      >
        Back to Sign In
      </button>
    </form>

    <p className="text-center text-xs lg:text-sm text-black/60">
      Remember your password?{" "}
      <Link to="/login" className="text-black font-medium">
        Sign in
      </Link>
    </p>

  </div>
</div>

    </div>

      
    </div>
  );
}