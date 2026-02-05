import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import bridegroom2 from "@/assets/bride-groom2.png";
import flower1 from "@/assets/flower1.png";
import flower2 from "@/assets/flower2.png";
import swayamwar from "@/assets/swayamwar.png";
import rectangleBg from "@/assets/Rectangle 1.png";
import { apiFetch } from "@/lib/apiClient";
import { setAccessToken } from "@/lib/auth";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle OAuth errors from navigation state
  useEffect(() => {
    if (location.state?.error) {
      setErrorMessage(location.state.error);
      // Clear the error from navigation state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || "Login failed. Please try again.");
        return;
      }

      setAccessToken(data.accessToken);
      navigate("/home");
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
      {/* RIGHT SECTION - SIGN IN FORM */}
      <div className="w-full lg:w-[40%] bg-white flex items-center justify-center px-4 py-6 lg:p-0">
  <div className="w-full max-w-[280px] lg:max-w-[328px] flex flex-col gap-4">

    {/* Header */}
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 lg:gap-2">
        <h1 className="text-[22px] lg:text-[30px] font-bold text-black font-jakarta">
          Sign In
        </h1>
        
      </div>

      {/* Social Buttons */}
      <div className="flex">
        <GoogleAuthButton mode="login" className="flex-1" />
      </div>

      {/* OR Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-black/10"></div>
        <span className="text-sm text-black/60 font-medium">OR</span>
        <div className="flex-1 h-px bg-black/10"></div>
      </div>
    </div>

    {/* Form */}
    <form className="flex flex-col gap-4" onSubmit={handleLogin}>
      {/* Email Field */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600 ml-2">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full px-4 py-3 lg:px-5 lg:py-4 pr-12 rounded-[24px] lg:rounded-[32px] border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>
      
      {/* Password Field */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-600 ml-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full px-4 py-3 lg:px-5 lg:py-4 pr-12 rounded-[24px] lg:rounded-[32px] border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="flex justify-end">
          <Link 
            to="/forgot-password" 
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      {errorMessage && (
        <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="py-2.5 lg:py-3 rounded-[20px] lg:rounded-[24px] bg-blue-600 text-white font-semibold text-sm disabled:opacity-70 hover:bg-blue-700 transition-colors"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>

    {/* Sign up link - uniform spacing */}
    <p className="text-center text-xs lg:text-sm text-black/60">
      Don't have an account?{" "}
      <Link to="/signup" className="text-black font-medium hover:text-blue-600 transition-colors">
        Sign up
      </Link>
    </p>

  </div>
</div>

    </div>

      
    </div>
  );
}
