import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";
import { updateAgentDetails } from "../../../../services/agent_management_service.js";
import {
  getCoutries,
  getDistrictsBaseOnProvince,
  getProvincesBaseOnCountry,
} from "../../../../services/public_service.js";
import { useQuery } from "@tanstack/react-query";
import { getAgentById } from "../../../../services/agent_management_service.js";

const StyledContainer = styled("div")(({ theme }) => ({
  maxWidth: "800px",
  margin: "0 auto",
  padding: theme.spacing(3),
}));

const redFocusStyles = {
  width: "100%",
  borderRadius: "20px",
  "& .MuiOutlinedInput-root": {
    paddingY: "0 !important",
    height: "46px",
    "& .MuiAutocomplete-input": { padding: "0 !important" },
    "&.Mui-focused fieldset": { borderColor: "#CD0C02 !important" },
    "&:hover fieldset": { borderColor: "#ff6666" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#CD0C02 !important" },
  "& .MuiAutocomplete-popupIndicator.Mui-focused": { color: "#CD0C02" },
  "& .MuiAutocomplete-inputRoot": {
    paddingTop: "0 !important",
    paddingBottom: "0 !important",
  },
};

const languages = [
  { label: "English", value: "english", icon: "https://flagcdn.com/us.svg" },
  { label: "Dari", value: "dari", icon: "https://flagcdn.com/af.svg" },
  { label: "Pashto", value: "pashto", icon: "https://flagcdn.com/af.svg" },
];

const statuses = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function EditAgent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [payload, setPayload] = useState({
    parentAgentId: "",
    user_type: "agent",
    registrationType: "indirect",
    accountType: "retailer",
    alternativeContact: "",
    country: "",
    province: "",
    district: "",
    address: "",
    messageLanguage: "",
    commission_rate: 0,
    user: {
      username: "",
      email: "",
      mobileNumber: "",
      status: "",
      profile_picture: "",
    }
  });
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        const agent = await getAgentById(id);
        const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL;
        const profileUrl = agent.user?.profile_picture
          ? `${IMG_BASE_URL}${agent.user.profile_picture}`
          : "";
          
        setPayload({
          ...agent,
          country: agent.countryDetails?.id,
          province: agent.provinceDetails?.id,
          district: agent.districtDetails?.id,
          commission_rate: agent.commission_rate || 0,
          user: {
            username: agent.user?.username || "",
            email: agent.user?.email || "",
            mobileNumber: agent.user?.mobileNumber || "",
            status: agent.user?.status || "",
            profile_picture: profileUrl,
          }
        });
        setPreviewUrl(profileUrl);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agent:", error);
        toast.error("Failed to load agent data");
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  const { data: countries, isLoading: loadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: getCoutries,
  });

  const { data: provinces, isLoading: loadingProvinces } = useQuery({
    queryKey: ["provinces", payload?.country],
    queryFn: () => getProvincesBaseOnCountry(payload?.country),
    enabled: !!payload?.country,
  });

  const { data: districts, isLoading: loadingDistricts } = useQuery({
    queryKey: ["districts", payload?.province],
    queryFn: () => getDistrictsBaseOnProvince(payload?.province),
    enabled: !!payload?.province,
  });

  const validate = () => {
    const newErrors = {};
    if (!payload.user.username) newErrors.username = "Agent name is required.";
    if (!payload.user.email) newErrors.email = "Email is required.";
    if (!payload.user.mobileNumber)
      newErrors.mobileNumber = "Phone number is required.";
    if (!payload.country) newErrors.country = "Country is required.";
    if (!payload.province) newErrors.province = "Province is required.";
    if (!payload.district) newErrors.district = "District is required.";
    if (!payload.address) newErrors.address = "Address is required.";
    if (!payload.messageLanguage)
      newErrors.messageLanguage = "Language is required.";
    if (!payload.user.status) newErrors.status = "Status is required.";
    
    // Commission rate validation
    if (payload.commission_rate === null || payload.commission_rate === undefined) {
      newErrors.commission_rate = "Commission rate is required.";
    } else if (isNaN(payload.commission_rate)) {
      newErrors.commission_rate = "Must be a number";
    } else if (payload.commission_rate < 0) {
      newErrors.commission_rate = "Cannot be negative";
    } else if (payload.commission_rate > 100) {
      newErrors.commission_rate = "Cannot exceed 100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayloadChange = (field, value) => {
    // Handle nested user fields
    if (field.startsWith('user.')) {
      const userField = field.split('.')[1];
      setPayload(prev => ({
        ...prev,
        user: {
          ...prev.user,
          [userField]: value
        }
      }));
    } else {
      setPayload(prev => ({ ...prev, [field]: value }));
    }
    setErrors(prev => ({ ...prev, [field.split('.')[1] || field]: null }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        handlePayloadChange("user.profile_picture", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      setUpdating(true);
      
      // Prepare payload with proper structure
      const updatePayload = {
        ...payload,
        commission_rate: payload.commission_rate
      };
      
      await updateAgentDetails(id, updatePayload);
      toast.success("Agent updated successfully");
      navigate("/manage-agent");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.error || "Failed to update agent");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <StyledContainer>
      <h2 className="text-2xl font-bold mb-6">Edit Agent</h2>
      <div className="flex justify-center">
        <div className="relative w-[120px] h-[120px] rounded-full border border-red-500 mb-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="profile"
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
              <Camera size={24} className="text-gray-500" />
            </div>
          )}
          <div
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow"
          >
            <Camera size={20} />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-6">
          <TextField
            value={payload.user.username}
            onChange={(e) => handlePayloadChange("user.username", e.target.value)}
            sx={redFocusStyles}
            variant="outlined"
            label="Agent Name"
            error={!!errors.username}
            helperText={errors.username}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <TextField
            value={payload.user.email}
            onChange={(e) => handlePayloadChange("user.email", e.target.value)}
            sx={redFocusStyles}
            variant="outlined"
            label="Email"
            error={!!errors.email}
            helperText={errors.email}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <TextField
            value={payload.user.mobileNumber}
            onChange={(e) => handlePayloadChange("user.mobileNumber", e.target.value)}
            sx={redFocusStyles}
            variant="outlined"
            label="Phone Number"
            type="tel"
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <TextField
            value={payload.alternativeContact}
            onChange={(e) => handlePayloadChange("alternativeContact", e.target.value)}
            sx={redFocusStyles}
            variant="outlined"
            label="Alternative Contact"
            error={!!errors.alternativeContact}
            helperText={errors.alternativeContact}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <Autocomplete
            options={countries?.data || []}
            getOptionLabel={(u) => u?.countryName}
            value={countries?.data?.find(c => c.id === payload.country) || null}
            onChange={(e, newValue) =>
              handlePayloadChange("country", newValue?.id)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Country"
                sx={redFocusStyles}
                error={!!errors.country}
                helperText={errors.country}
                required
              />
            )}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <Autocomplete
            options={provinces?.data || []}
            getOptionLabel={(u) => u?.provinceName}
            value={provinces?.data?.find(p => p.id === payload.province) || null}
            onChange={(e, newValue) =>
              handlePayloadChange("province", newValue?.id)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Province"
                sx={redFocusStyles}
                error={!!errors.province}
                helperText={errors.province}
                required
              />
            )}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <Autocomplete
            options={districts?.data || []}
            getOptionLabel={(u) => u?.districtName}
            value={districts?.data?.find(d => d.id === payload.district) || null}
            onChange={(e, newValue) =>
              handlePayloadChange("district", newValue?.id)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="District"
                sx={redFocusStyles}
                error={!!errors.district}
                helperText={errors.district}
                required
              />
            )}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <TextField
            value={payload.address}
            onChange={(e) => handlePayloadChange("address", e.target.value)}
            sx={redFocusStyles}
            variant="outlined"
            label="Full Address"
            error={!!errors.address}
            helperText={errors.address}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <Autocomplete
            value={languages.find(l => l.value === payload.messageLanguage) || null}
            onChange={(e, newValue) => {
              if (newValue == null) {
                handlePayloadChange("messageLanguage", "");
              } else {
                handlePayloadChange("messageLanguage", newValue?.value);
              }
            }}
            options={languages}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                {...props}
              >
                <img
                  src={option?.icon}
                  alt={option?.label}
                  className="w-5 h-5 rounded-full"
                />
                {option?.label}
              </Box>
            )}
            sx={redFocusStyles}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Language"
                placeholder="Select Language"
                error={!!errors.messageLanguage}
                helperText={errors.messageLanguage}
              />
            )}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <TextField
            value={payload.commission_rate}
            onChange={(e) => handlePayloadChange("commission_rate", Number(e.target.value)) }
            sx={redFocusStyles}
            variant="outlined"
            label="Commission Rate (%)"
            type="number"
            inputProps={{ min: 0, max: 100, step: 0.1 }}
            error={!!errors.commission_rate}
            helperText={errors.commission_rate}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <Autocomplete
            options={statuses || []}
            getOptionLabel={(u) => u?.label}
            value={statuses.find(s => s.value === payload.user.status) || null}
            onChange={(e, newValue) =>
              handlePayloadChange("user.status", newValue?.value)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Status"
                sx={redFocusStyles}
                error={!!errors.status}
                helperText={errors.status}
                required
              />
            )}
          />
        </div>
      </div>

      <div className="w-full flex justify-end mt-6 gap-3">
        <button
          onClick={() => navigate("/manage-agents")}
          className="py-2 px-6 border border-gray-400 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          className="text-white bg-[#CD0C02] py-2 px-6 rounded-md"
          disabled={updating}
        >
          {updating ? <CircularProgress size={20} color="inherit" /> : "Update Agent"}
        </button>
      </div>
    </StyledContainer>
  );
}