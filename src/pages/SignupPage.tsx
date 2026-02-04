import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import bridegroom2 from "@/assets/bride-groom2.png";
import flower1 from "@/assets/flower1.png";
import swayamwar from "@/assets/swayamwar.png"
import flower2 from "@/assets/flower2.png";
import rectangleBg from "@/assets/Rectangle 1.png";
import { apiFetch } from "@/lib/apiClient";
import { setAccessToken } from "@/lib/auth";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import PasswordValidation, { isPasswordValid } from "@/components/PasswordValidation";

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    firstName: false,
    middleName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: string, value: string, currentForm = form) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        else if (value.length < 2) error = "First name must be at least 2 characters";
        else if (!/^[A-Za-z\s]+$/.test(value)) error = "First name can only contain letters";
        break;

      case "middleName":
        if (value && value.length < 2) error = "Middle name must be at least 2 characters";
        else if (value && !/^[A-Za-z\s]+$/.test(value)) error = "Middle name can only contain letters";
        break;

      case "lastName":
        if (!value.trim()) error = "Last name is required";
        else if (value.length < 2) error = "Last name must be at least 2 characters";
        else if (!/^[A-Za-z\s]+$/.test(value)) error = "Last name can only contain letters";
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email address";
        break;

      case "password":
        if (!value.trim()) error = "Password is required";
        else if (!isPasswordValid(value)) error = "Password does not meet requirements";
        break;

      case "confirmPassword":
        if (!value.trim()) {
          // Only show "Please confirm your password" if the main password field has content
          error = currentForm.password.trim() ? "Please confirm your password" : "";
        } else if (value !== currentForm.password) {
          error = "Passwords do not match";
        }
        break;
    }

    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);
    
    // Validate the field if it has been touched
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value, updatedForm);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
    
    // Special case: when password changes, re-validate confirm password if it's been touched
    if (name === 'password' && touched.confirmPassword) {
      const confirmPasswordError = validateField('confirmPassword', form.confirmPassword, updatedForm);
      setErrors(prev => ({ ...prev, confirmPassword: confirmPasswordError }));
    }
    
    setSubmitError("");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      firstName: validateField("firstName", form.firstName, form),
      middleName: validateField("middleName", form.middleName, form),
      lastName: validateField("lastName", form.lastName, form),
      email: validateField("email", form.email, form),
      password: validateField("password", form.password, form),
      confirmPassword: validateField("confirmPassword", form.confirmPassword, form),
    };

    setErrors(newErrors);
    setTouched({
      firstName: true,
      middleName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);
  setSubmitError("");

  try {
    const response = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        profile: {
          firstName: form.firstName,
          middleName: form.middleName,
          lastName: form.lastName,
        },
      }),
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      // response had no JSON body
    }

    if (!response.ok) {
      setSubmitError(data?.message || "Signup failed. Please try again.");
      return;
    }

    // ✅ Save access token
    setAccessToken(data.accessToken);

    // ✅ Go to next step
    navigate("/registration");
  } catch (error) {
    console.error("Signup error:", error);
    setSubmitError("Unable to reach the server. Please try again.");
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
      <div className="w-full bg-white overflow-hidden flex flex-col lg:flex-row relative">
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

        {/* ================= SIGN UP FORM ================= */}
        <div className="w-full lg:w-[40%] bg-white flex items-center justify-center px-4 py-6 lg:p-0">
          <div className="w-full max-w-[320px] lg:max-w-[400px] flex flex-col gap-5">
            <div>
              <h1 className="text-[24px] lg:text-[30px] font-bold">Create Your Account</h1>
              <p className="text-sm text-black/60">
                Already a member?{" "}
                <Link to="/login" className="text-green-600 font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Google OAuth Button */}
            <GoogleAuthButton mode="register" />

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* First Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 ml-2">First Name</label>
                <input 
                  name="firstName" 
                  placeholder="Enter first name" 
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`px-4 py-3 rounded-full border text-sm ${
                    errors.firstName && touched.firstName 
                      ? "border-red-500 focus:ring-red-200" 
                      : "border-black/10 focus:ring-blue-200"
                  } focus:outline-none focus:ring-2`}
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-xs text-red-500 ml-4">{errors.firstName}</p>
                )}
              </div>

              {/* Middle Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 ml-2">Middle Name </label>
                <input 
                  name="middleName" 
                  placeholder="Enter middle name" 
                  value={form.middleName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`px-4 py-3 rounded-full border text-sm ${
                    errors.middleName && touched.middleName 
                      ? "border-red-500 focus:ring-red-200" 
                      : "border-black/10 focus:ring-blue-200"
                  } focus:outline-none focus:ring-2`}
                />
                {errors.middleName && touched.middleName && (
                  <p className="text-xs text-red-500 ml-4">{errors.middleName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 ml-2">Last Name</label>
                <input 
                  name="lastName" 
                  placeholder="Enter last name" 
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`px-4 py-3 rounded-full border text-sm ${
                    errors.lastName && touched.lastName 
                      ? "border-red-500 focus:ring-red-200" 
                      : "border-black/10 focus:ring-blue-200"
                  } focus:outline-none focus:ring-2`}
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-xs text-red-500 ml-4">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 ml-2">Email Address</label>
              <input 
                name="email" 
                type="email" 
                placeholder="Enter your email address" 
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`px-4 py-3 rounded-full border text-sm ${
                  errors.email && touched.email 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-black/10 focus:ring-blue-200"
                } focus:outline-none focus:ring-2`}
              />
              {errors.email && touched.email && (
                <p className="text-xs text-red-500 ml-4">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 ml-2">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => setShowPasswordValidation(true)}
                  className={`w-full px-4 py-3 pr-12 rounded-full border text-sm ${
                    errors.password && touched.password 
                      ? "border-red-500 focus:ring-red-200" 
                      : "border-black/10 focus:ring-blue-200"
                  } focus:outline-none focus:ring-2`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="text-xs text-red-500 ml-4">{errors.password}</p>
              )}
              <PasswordValidation 
                password={form.password} 
                showValidation={showPasswordValidation && form.password.length > 0} 
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 ml-2">Confirm Password</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pr-12 rounded-full border text-sm ${
                    errors.confirmPassword && touched.confirmPassword 
                      ? "border-red-500 focus:ring-red-200" 
                      : "border-black/10 focus:ring-blue-200"
                  } focus:outline-none focus:ring-2`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-xs text-red-500 ml-4">{errors.confirmPassword}</p>
              )}
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                {submitError}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>

            {/* <p className="text-center text-xs text-black/50">
              Continue using other method
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}