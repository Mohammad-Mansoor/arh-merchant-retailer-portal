import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ArrowRight } from "lucide-react";
export default function SignUpForm() {
  const [isAnimating, setIsAnimating] = useState(false);
const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showMerchantLogin, setShowMerchantLogin] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [OTP, setOTP] = useState("");
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();


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
             
    <div className="bg-white dark:bg-gray-850 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                 <div className="h-2 bg-gradient-to-r from-[#FF8B4C] via-[#FFC857] to-[#FFE9A0]"></div>
                 
                 <div className="px-8 pt-3 pb-2">
                   <div className="text-center mb-8">
                     <div className="flex justify-center mb-4">
                    
                     </div>
                     <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                       Register
                     </h1>
                     <p className="text-gray-500 dark:text-gray-400">
                       Register as a reseller
                     </p>
                   </div>
   
                   <form onSubmit={handleEmailSubmit} className="space-y-5">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         First Name
                       </label>
                       <div className="relative">
                         <input
                           type="text"
                           value={email}
          
                           placeholder="Enter your first name"
                           className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#CD0202] focus:outline-none focus:border-transparent transition-all duration-300"
                           required
                         />
                        
                       </div>
                       {errors.email && (
                         <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                           {errors.email}
                         </p>
                       )}
              
                     </div>
                              <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         Last Name
                       </label>
                       <div className="relative">
                         <input
                           type="text"
                           value={email}
          
                           placeholder="Enter your last name"
                           className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#CD0202] focus:outline-none focus:border-transparent transition-all duration-300"
                           required
                         />
                        
                       </div>
                       {errors.email && (
                         <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                           {errors.email}
                         </p>
                       )}
              
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         Email
                       </label>
                       <div className="relative">
                         <input
                           type="email"
                           value={email}
          
                           placeholder="your.email@example.com"
                           className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#CD0202] focus:outline-none focus:border-transparent transition-all duration-300"
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
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         Phone Number
                       </label>
                       <div className="relative">
                         <input
                           type="text"
                           value={email}
          
                           placeholder="Enter your phone number"
                           className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#CD0202] focus:outline-none focus:border-transparent transition-all duration-300"
                           required
                         />
                        
                       </div>
                       {errors.email && (
                         <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                           {errors.email}
                         </p>
                       )}
              
                     </div>
                               <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         Address
                       </label>
                       <div className="relative">
                         <input
                           type="text"
                           value={email}
          
                           placeholder="Enter your address"
                           className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#CD0202] focus:outline-none focus:border-transparent transition-all duration-300"
                           required
                         />
                        
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
                         className="w-full py-3 px-4 bg-gradient-to-r from-[#cd0202] to-[#ec68b5] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                       >
                         Register
                       </button>
                         
                     </div>
   

   
                     <div>
            
                     </div>
                   </form>
                 </div>
               </div>
           
        
        
   
           
             <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
               © {new Date().getFullYear()} AFRH Merchant Portal. All rights
               reserved.
             </div>
           </div>
         </div>
       </div>
  );
}
