import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "../../icons";
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
  const [showMerchantLogin, setShowMerchantLogin] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [OTP, setOTP] = useState("");
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill("")); // Array with 6 empty strings
  const inputRefs = useRef([]); 

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      console.log("Validation Errors:", errors);
      return;
    }
    console.log("Signing in with:", { email, password, rememberMe });
    const payload = { identifier: email, password, rememberMe };
    try {
      const res = await signIn(payload);
      console.log("this is response: ", res);
      if (res.access_token) {
        dispatch(loginSuccess(res.access_token));

        const user = await getUserInfo();
        console.log("User Info:", user);
        dispatch(setUser(user?.data));
      } else {
        console.error("Sign-in failed:", res.message);
    
      }
    } catch (error) {
      console.error("Sign-in error:", error);
     
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
    

    setShowOTP(true);
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
 const handleOTPSubmit = (e) => {
    e.preventDefault();
    console.log("OTP submitted:", OTP);
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
          {!showOTP && !showMerchantLogin ? (
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
                        <div className="flex mt-5 items-center">
                  <Checkbox
                    checked={rememberMe}
                    onChange={setRememberMe}
                    className="group size-5 rounded-md bg-[#cd0202] p-1 ring-1 cursor-pointer ring-[#cd0202] ring-inset focus:not-data-focus:outline-none data-checked:bg-white data-focus:outline data-focus:outline-offset-2 data-focus:outline-white"
                  >
                    <CheckIcon
                      className={`size-3 fill-[#cd0202] text-white group-data-checked:fill-[#fff] ${
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
                  </div>
                   
 <div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#cd0202] to-[#ec68b5] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Continue
                    </button>
                      <button
                      type="button"
                      onClick={() => setShowMerchantLogin(true)}
                      className="w-full mt-4 flex items-center gap-1 text-left text-[#E48D08]  font-medium rounded-lg   transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                     <span className="uppercase text-[14px]">
                       I have a merchant account 
                      </span>
                      <ArrowRight size={18}/>
                    </button>
                  </div>

                   <div className="flex gap-1 items-center w-full justify-between">
                    <div className="w-[80px] h-[0.5px] bg-[#717B8E]">
                    </div>
                    <p className="text-[14px] text-[#717B8E]">
                      Start Your Business as a Reseller
                    </p>
                    <div className="w-[80px] h-[0.5px] bg-[#717B8E]">

                    </div>
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
            ) :showOTP ? (
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
                
                <form onSubmit={handleOTPSubmit} className="space-y-6">
                  <div>
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                      We've sent a 6-digit code to {email}
                    </p>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter OTP
                    </label>
                    <div className="flex gap-2">
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
              className="shadow-xs flex w-[57px] items-center justify-center rounded-lg border border-stroke bg-white p-2 text-center text-2xl font-medium text-gray-5 outline-none sm:text-2xl dark:border-dark-3 dark:bg-white/5"
            />
          ))}</div>

                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#cd0202] to-[#ec68b5] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Verify OTP
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) :
        showMerchantLogin && (
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
              </form>
            </div>
            {/* <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-850 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-gray-700 transition-all bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 hover:shadow-sm hover:border-[#cd0202] dark:hover:bg-gray-700">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                        fill="#EB4335"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button className="flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-gray-700 transition-all bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 hover:shadow-sm hover:border-[#cd0202] dark:hover:bg-gray-700">
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22 12.072C22 6.486 17.514 2 12 2S2 6.486 2 12.072c0 5.012 3.657 9.162 8.438 9.877v-6.988H7.898v-2.89h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.233 22 17.083 22 12.072z" />
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>
              </div> */}
            {/* <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[#CD0202] hover:text-[#cd0202] dark:text-[#CD0202] dark:hover:text-[#CD0202] transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div> */}
          </div>)}
       

          {/* <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-[#CD0202] hover:text-[#CD0202] dark:text-[#CD0202] dark:hover:text-indigo-300 transition-colors group"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to homepage
            </Link>
          </div> */}

          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} AFRH Merchant Portal. All rights
            reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
