// src/pages/agent-signup/SignUpForm.jsx
import React, { useState } from "react";
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
import { Camera } from "lucide-react";
import { signUpAgent } from "../../services/agent_management_service";
import { 
  getCoutries, 
  getProvincesBaseOnCountry, 
  getDistrictsBaseOnProvince 
} from "../../services/public_service";
import { useQuery } from "@tanstack/react-query";
import StyledForm from "../ui/formUI/StyledForm";
import FormSection from "../ui/formUI/FormSection";
import SectionTitle from "../ui/formUI/SectionTitle";
import redFocusStyles from "../ui/formUI/redFocusStyles";

const languages = [
  { label: "English", value: "english", icon: "https://flagcdn.com/us.svg" },
  { label: "Dari", value: "dari", icon: "https://flagcdn.com/af.svg" },
  { label: "Pashto", value: "pashto", icon: "https://flagcdn.com/af.svg" },
];



export default function SignUpForm() {
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
      toast.success("Sign up successfull!");
      navigate("/signin");
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
      <StyledForm onSubmit={handleSubmit}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Create Agent Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Register as an agent to start managing your business
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 group">
            {formData.profile_picture ? (
              <img 
                src={formData.profile_picture} 
                className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-105"
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
              <Camera size={20} />
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

        <FormSection>
          <SectionTitle>Personal Information</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
              sx={redFocusStyles}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
              sx={redFocusStyles}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              sx={redFocusStyles}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={formData.mobileNumber}
              onChange={(e) => handleChange("mobileNumber", e.target.value)}
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber}
              sx={redFocusStyles}
            />
            <TextField
              label="Alternative Contact (Optional)"
              variant="outlined"
              fullWidth
              value={formData.alternativeContact}
              onChange={(e) => handleChange("alternativeContact", e.target.value)}
              sx={redFocusStyles}
            />
          </div>
        </FormSection>

        <FormSection>
          <SectionTitle>Location Information</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Autocomplete
              options={countries?.data || []}
              getOptionLabel={(option) => option.countryName}
              loading={loadingCountries}
              onChange={(_, newValue) => handleChange("country", newValue?.id || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country"
                  error={!!errors.country}
                  helperText={errors.country}
                  sx={redFocusStyles}
                />
              )}
            />
            
            <Autocomplete
              options={provinces?.data || []}
              getOptionLabel={(option) => option.provinceName}
              loading={loadingProvinces}
              disabled={!formData.country}
              onChange={(_, newValue) => handleChange("province", newValue?.id || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Province"
                  error={!!errors.province}
                  helperText={errors.province}
                  sx={redFocusStyles}
                />
              )}
            />
            
            <Autocomplete
              options={districts?.data || []}
              getOptionLabel={(option) => option.districtName}
              loading={loadingDistricts}
              disabled={!formData.province}
              onChange={(_, newValue) => handleChange("district", newValue?.id || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="District"
                  error={!!errors.district}
                  helperText={errors.district}
                  sx={redFocusStyles}
                />
              )}
            />
            
            <div className="md:col-span-3">
              <TextField
                label="Full Address"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
                sx={redFocusStyles}
              />
            </div>
          </div>
        </FormSection>

        <FormSection>
          <SectionTitle>Preferences</SectionTitle>
          <div className="grid grid-cols-1 gap-4">
            <Autocomplete
              options={languages}
              getOptionLabel={(option) => option.label}
              onChange={(_, newValue) => handleChange("messageLanguage", newValue?.value || "")}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Avatar 
                    src={option.icon} 
                    sx={{ width: 24, height: 24, mr: 1 }} 
                  />
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Preferred Language"
                  error={!!errors.messageLanguage}
                  helperText={errors.messageLanguage}
                  sx={redFocusStyles}
                />
              )}
            />
          </div>
        </FormSection>

        <div className="mt-6 flex justify-center">
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={mutation.isLoading}
            sx={{
              minWidth: 200,
              padding: "12px 24px",
              fontSize: "1rem",
              fontWeight: 600,
              background: 'linear-gradient(45deg, #CD0C02 30%, #EC68B5 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #B10202 30%, #D95CA0 90%)',
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            {mutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Account"
            )}
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Button 
            onClick={() => navigate("/signin")} 
            color="secondary"
            sx={{
              color: "#CD0C02",
              fontWeight: 500,
              '&:hover': {
                textDecoration: "underline",
                backgroundColor: "transparent",
              }
            }}
          >
            Already have an account? Sign in
          </Button>
        </div>
      </StyledForm>
    </div>
  );
}