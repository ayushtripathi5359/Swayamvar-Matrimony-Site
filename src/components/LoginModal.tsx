import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface LoginModalProps {
  isVisible: boolean;
  onClose?: () => void;
}

type LoginRole = "self" | "parent" | "guardian";

const LoginModal = ({ isVisible, onClose }: LoginModalProps) => {
  const [role, setRole] = useState<LoginRole>("self");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ role, email, password, rememberMe });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* WRAPPER */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto"
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* CARD */}
            <div
              className="
                relative w-full max-w-md
                rounded-2xl md:rounded-3xl
                bg-white/95 backdrop-blur-xl
                border border-white/50
                shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                p-6 md:p-9
              "
            >
              {/* HEADER */}
              <div className="mb-2 justify-center">
                <h1 className="font-serif text-center text-2xl md:text-3xl font-bold text-slate-900">
                  Welcome to{" "}
                  <span className="text-amber-700">Swayamvar</span>
                </h1>

                <p className="mt-1.5 text-sm text-center text-slate-600 ">
                  A trusted matrimonial platform for families and serious alliances.
                </p>
              </div>

              {/* ROLE SELECTOR */}
              <div className="">
                <p className="mb-2 text-xs font-medium text-slate-600">
                  Logging in as
                </p>
                <div className="flex gap-2">
                  {[
                    { key: "self", label: "Self" },
                    { key: "parent", label: "Parent" },
                    { key: "guardian", label: "Guardian" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setRole(item.key as LoginRole)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition
                        ${
                          role === item.key
                            ? "border-amber-600 bg-amber-50 text-amber-700"
                            : "border-slate-300 text-slate-600 hover:border-slate-400"
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* DIVIDER */}
              <div className="mb-6 h-px w-full bg-slate-100" />

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="
                      mt-2 w-full h-11 rounded-lg
                      border border-slate-300
                      bg-white px-3.5
                      text-sm text-slate-900
                      placeholder:text-slate-400
                      focus:border-amber-600 focus:outline-none
                    "
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-600">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs text-amber-700 hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="
                        w-full h-11 rounded-lg
                        border border-slate-300
                        bg-white px-3.5 pr-11
                        text-sm text-slate-900
                        focus:border-amber-600 focus:outline-none
                      "
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* REMEMBER + OTP */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-amber-600"
                    />
                    Remember this device
                  </label>

                  <button
                    type="button"
                    className="text-amber-700 hover:underline"
                  >
                    Login via OTP
                  </button>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="
                    mt-2 h-11 w-full rounded-lg
                    bg-amber-700 text-white
                    text-sm font-medium
                    hover:bg-amber-800
                    transition
                  "
                >
                  Continue securely
                </button>
              </form>

              {/* FOOTER */}
              <div className="mt-6 border-t pt-4 text-sm text-slate-600">
                New to Myswayamvar?{" "}
                <button className="font-medium text-amber-700 hover:underline">
                  Create your profile
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
