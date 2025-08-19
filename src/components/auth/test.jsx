import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  Box, 
  Avatar, 
  CircularProgress, 
  TextField, 
  Autocomplete,
  Button
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Camera, CameraIcon } from "lucide-react";
import { signUpAgent } from "../../services/agent_management_service";
import { 
  getCoutries, 
  getProvincesBaseOnCountry, 
  getDistrictsBaseOnProvince 
} from "../../services/public_service";
import { useQuery } from "@tanstack/react-query";

export default function SignUpForm() {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const fileRef = React.useRef(null);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    alternativeContact: "",
    country: "",
    province: "",
    district: "",
    address: "",
    messageLanguage: "",
    profile_picture: "",
    status: "active", 
    accountType: "merchant",
    registrationType: "direct", 
  });

  const { data: countries, isLoading: loadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: getCoutries,
  });

  const { data: provinces, isLoading: loadingProvinces } = useQuery({
    queryKey: ["provinces", formData.country],
    queryFn: () => getProvincesBaseOnCountry(formData.country),
    enabled: !!formData.country,
  });

  const { data: districts, isLoading: loadingDistricts } = useQuery({
    queryKey: ["districts", formData.province],
    queryFn: () => getDistrictsBaseOnProvince(formData.province),
    enabled: !!formData.province,
  });

  const mutation = useMutation({
    mutationFn: (formData) => signUpAgent(formData),
    onSuccess: () => {
      toast.success("Agent account created successfully!");
      navigate("/login");
    },
    onError: (error) => {
      console.error("Sign up error:", error);
      toast.error(error.response?.data?.error || "Failed to create agent account");
    },
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleChange("profile_picture", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobileNumber) newErrors.mobileNumber = "Phone number is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.province) newErrors.province = "Province is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.messageLanguage) newErrors.messageLanguage = "Language is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const username = `${formData.firstName} ${formData.lastName}`;
    
    const payload = {
      ...formData,
      username,
      permissions: [], 
      user_type: "agent",
    };
    
    mutation.mutate(payload);
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
   
                   <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="flex justify-center mb-8">
                              <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 group">
                                {formData.profile_picture ? (
                                  <img
                                    src={formData.profile_picture} 
                                    className="w-full h-full transition-transform group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                                    <Camera className="text-gray-500 group-hover:text-gray-700" size={24} />
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => fileRef.current.click()}
                                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                                >
                                  <CameraIcon size={20} />
                                  <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleImageUpload}
                                  />
                                </button>
                              </div>
                            </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         First Name
                       </label>
                       <div className="relative">
                         <input
                           type="text"
                           value={formData.firstName}
                           onChange={(e) => handleChange("firstName", e.target.value)}
                        
                           placeholder="Enter your first name"
                           className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#CD0202] focus:outline-none focus:border-transparent transition-all duration-300"
                           required
                         />
                        
                       </div>
                       {errors.firstName && (
                         <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                           {errors.firstName}
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
                           value={formData.lastName}
                           onChange={(e) => handleChange("lastName", e.target.value)}
                           placeholder="Enter your last name"
                           className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#CD0202] focus:outline-none focus:border-transparent transition-all duration-300"
                           required
                         />
                        
                       </div>
                       {errors.lastName && (
                         <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                           {errors.lastName}
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
                           value={formData.email}
                           onChange={(e) => handleChange("email", e.target.value)}
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
                           value={formData.mobileNumber}
                           onChange={(e) => handleChange("mobileNumber", e.target.value)}
                           placeholder="Enter your phone number"
                           className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#CD0202] focus:outline-none focus:border-transparent transition-all duration-300"
                           required
                         />
            
                       </div>
                       {errors.mobileNumber && (
                         <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                           {errors.mobileNumber}
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
