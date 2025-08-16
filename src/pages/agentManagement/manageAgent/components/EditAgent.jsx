import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Avatar,
  Box,
  CircularProgress,
  TextField,
  Button,
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
    mobileNumber: "",
    username: "",
    email: "",
    country: "",
    province: "",
    district: "",
    address: "",
    messageLanguage: "",
    profile_picture: "",
    status: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        const agent = await getAgentById(id);
        console.log("this is agent data", agent)
        setPayload({
          ...agent,
          country: agent.countryDetails?.id,
          province: agent.provinceDetails?.id,
          district: agent.districtDetails?.id,
          status: agent.user?.status,
          profile_picture: agent.user?.profile_picture,
        });
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
    if (!payload.username) newErrors.username = "Agent name is required.";
    if (!payload.email) newErrors.email = "Email is required.";
    if (!payload.mobileNumber)
      newErrors.mobileNumber = "Phone number is required.";
    if (!payload.country) newErrors.country = "Country is required.";
    if (!payload.province) newErrors.province = "Province is required.";
    if (!payload.district) newErrors.district = "District is required.";
    if (!payload.address) newErrors.address = "Address is required.";
    if (!payload.messageLanguage)
      newErrors.messageLanguage = "Language is required.";
    if (!payload.status) newErrors.status = "Status is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayloadChange = (field, value) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        handlePayloadChange("profile_picture", reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      setUpdating(true);
      await updateAgentDetails(id, payload);
      toast.success("Agent updated successfully");
      navigate("/manage-agents");
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
const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL;
  return (
    <StyledContainer>
      <h2 className="text-2xl font-bold mb-6">Edit Agent</h2>
      <div className="flex justify-center">
        <div className="relative w-[120px] h-[120px] rounded-full border border-red-500 mb-4">
          <img
             src={`${IMG_BASE_URL}${payload?.user?.profile_picture}`}
            alt="profile"
            className="w-full h-full rounded-full object-cover"
          />
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
            value={payload.user?.username}
            onChange={(e) => handlePayloadChange("username", e.target.value)}
            sx={redFocusStyles}
            variant="outlined"
            label="Agent Name"
            error={!!errors.username}
            helperText={errors.username}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <TextField
            value={payload.user?.email}
            onChange={(e) => handlePayloadChange("email", e.target.value)}
            sx={redFocusStyles}
            variant="outlined"
            label="Email"
            error={!!errors.email}
            helperText={errors.email}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <TextField
            value={payload.user?.mobileNumber}
            onChange={(e) => handlePayloadChange("mobileNumber", e.target.value)}
            sx={redFocusStyles}
            variant="outlined"
            label="Phone Number"
            type="number"
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
                <Avatar
                  src={option?.icon}
                  alt={option?.label}
                  sx={{ width: 20, height: 20 }}
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
          <Autocomplete
            options={statuses || []}
            getOptionLabel={(u) => u?.label}
            value={statuses.find(s => s.value === payload.status) || null}
            onChange={(e, newValue) =>
              handlePayloadChange("status", newValue?.value)
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