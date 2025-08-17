import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "@headlessui/react";
import { CheckIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { getUserInfo, signIn } from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, setUser } from "../../store/slicers/authSlicer";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [errors, setErrors] = useState({});
  const [authFlow, setAuthFlow] = useState("regular"); // 'regular', 'sso-email', 'sso-otp'
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!email) {
      validationErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = "Invalid email format";
    }

    if (!password) {
      validationErrors.password = "Password is required";
    } else if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = { identifier: email, password, rememberMe };
    try {
      const res = await signIn(payload);
      if (res.access_token) {
        dispatch(loginSuccess(res.access_token));
        const user = await getUserInfo();
        dispatch(setUser(user?.data));
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setErrors({ general: "Invalid credentials" });
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};
    
    if (!email) {
      validationErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = "Invalid email format";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Here you would typically send the OTP to the user's email
    setAuthFlow("sso-otp");
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    console.log("OTP submitted:", enteredOtp);
    // Add your OTP verification logic here
  };

  const handleKeyDown = (e) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      const index = inputRefs.current.indexOf(e.target);
      if (index > 0) {
        setOtp((prevOtp) => [
          ...prevOtp.slice(0, index - 1),
          "",
          ...prevOtp.slice(index),
        ]);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleInput = (e) => {
    const { target } = e;
    const index = inputRefs.current.indexOf(target);
    if (target.value) {
      setOtp((prevOtp) => [
        ...prevOtp.slice(0, index),
        target.value,
        ...prevOtp.slice(index + 1),
      ]);
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    setOtp(digits);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 p-4">
      <div className="w-full max-w-md">
        <div
          className={`transform transition-all duration-700 ${
            isAnimating
              ? "opacity-0 translate-y-10"
              : "opacity-100 translate-y-0"
          }`}
        >
          {/* Regular Login Form */}
          {authFlow === "regular" && (
            <div className="bg-white dark:bg-gray-850 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="h-2 bg-gradient-to-r from-[#FF8B4C] via-[#FFC857] to-[#FFE9A0]"></div>

              <div className="px-8 py-10">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-[#FF8B4C] to-[#FFC857] rounded-xl p-3 inline-block">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    Welcome
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Sign in to your ARH Portal account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#CD0202] focus:outline-none focus:border-transparent transition-all duration-300"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                      </div>
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </label>
                      <Link
                        to="/reset-password"
                        className="text-sm font-medium text-[#CD0202] hover:text-[#FF8B4C] dark:text-[#FF8B4C] dark:hover:text-indigo-300 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#CD0202] focus:outline-none focus:border-transparent transition-all duration-300 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <Checkbox
                      checked={rememberMe}
                      onChange={setRememberMe}
                      className="group size-5 rounded-md bg-[#cd0202] p-1 ring-1 cursor-pointer ring-[#cd0202] ring-inset focus:not-data-focus:outline-none data-checked:bg-white data-focus:outline data-focus:outline-offset-2 data-focus:outline-white"
                    >
                      <CheckIcon
                        className={`size-3 text-white fill-[#cd0202] group-data-checked:fill-[#fff] ${
                          rememberMe ? "text-white" : ""
                        }`}
                      />
                    </Checkbox>
                    <div className="ml-1.5 text-sm">
                      <label className="text-gray-700 dark:text-gray-300 cursor-pointer">
                        Remember me
                      </label>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#cd0202] to-[#ec68b5] hover:from-[#cd0202] hover:to-[#ec68b5] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Sign In
                    </button>
                  </div>

                  {errors.general && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">
                      {errors.general}
                    </p>
                  )}

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => setAuthFlow("sso-email")}
                      className="text-sm text-[#CD0202] hover:text-[#FF8B4C] dark:text-[#FF8B4C] dark:hover:text-indigo-300 transition-colors flex items-center justify-center gap-2"
                    >
                      Sign in with SSO (One-Time Password)
                    </button>
                  </div>
                  
                  <div className="flex gap-1 items-center w-full justify-between">
                    <div className="w-[80px] h-[0.5px] bg-[#717B8E]"></div>
                    <p className="text-[14px] text-[#717B8E]">
                      Start Your Business as a Reseller
                    </p>
                    <div className="w-[80px] h-[0.5px] bg-[#717B8E]"></div>
                  </div>

                  <div>
                    <Link
                      to="/signup"
                      className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 inline-block text-center"
                    >
                      Register now
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* SSO Email Form */}
          {authFlow === "sso-email" && (
            <div className="bg-white dark:bg-gray-850 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="h-2 bg-gradient-to-r from-[#FF8B4C] via-[#FFC857] to-[#FFE9A0]"></div>

              <div className="px-8 py-10">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-[#FF8B4C] to-[#FFC857] rounded-xl p-3 inline-block">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    SSO Login
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Enter your email to receive a one-time password
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#CD0202] focus:outline-none focus:border-transparent transition-all duration-300"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                      </div>
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#cd0202] to-[#ec68b5] hover:from-[#cd0202] hover:to-[#ec68b5] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Send OTP
                    </button>
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => setAuthFlow("regular")}
                      className="text-sm text-[#CD0202] hover:text-[#FF8B4C] dark:text-[#FF8B4C] dark:hover:text-indigo-300 transition-colors"
                    >
                      Back to Regular Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* OTP Verification Form */}
          {authFlow === "sso-otp" && (
            <div className="bg-white dark:bg-gray-850 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="h-2 bg-gradient-to-r from-[#FF8B4C] via-[#FFC857] to-[#FFE9A0]"></div>
              
              <div className="px-8 py-10">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-[#FF8B4C] to-[#FFC857] rounded-xl p-3 inline-block">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    OTP Verification
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    We've sent a 6-digit code to {email}
                  </p>
                </div>
                
                <form onSubmit={handleOTPSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter OTP
                    </label>
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={handleInput}
                          onKeyDown={handleKeyDown}
                          onFocus={handleFocus}
                          onPaste={handlePaste}
                          ref={(el) => (inputRefs.current[index] = el)}
                          className="w-12 h-12 text-center text-2xl font-medium border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#CD0202] focus:outline-none"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#cd0202] to-[#ec68b5] hover:from-[#cd0202] hover:to-[#ec68b5] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Verify OTP
                    </button>
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => setAuthFlow("sso-email")}
                      className="text-sm text-[#CD0202] hover:text-[#FF8B4C] dark:text-[#FF8B4C] dark:hover:text-indigo-300 transition-colors"
                    >
                      Back to Email Entry
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} AFRH Merchant Portal. All rights
            reserved.
          </div>
        </div>
      </div>
    </div>
  );
}