import React, { useState, useRef } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Dialog,
  TextField,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useSelector } from "react-redux";
import {
  getCoutries,
  getDistrictsBaseOnProvince,
  getProvincesBaseOnCountry,
} from "../../../../services/public_service.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";
import { createDownlineAgent } from "../../../../services/agent_management_service.js";
import CreateAgentErrorModal from "./ErrorModal.jsx";
import CreateAgentSuccessModal from "./SuccessModal.jsx";
import redFocusStyles from "../../../../components/ui/formUI/RedFocusedStyleV2.jsx";


const languages = [
  { label: "English", value: "english", icon: "https://flagcdn.com/us.svg" },
  { label: "Dari", value: "dari", icon: "https://flagcdn.com/af.svg" },
  { label: "Pashto", value: "pashto", icon: "https://flagcdn.com/af.svg" },
];

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  "& .MuiPaper-root": {
    width: "90%",
    maxWidth: "100%",
    border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#d32f2f"}`,
    borderRadius: 12,
    padding: theme.spacing(2),
    backgroundColor:
      theme.palette.mode === "dark"
        ? "#111827"
        : theme.palette.background.paper,
    [theme.breakpoints.up("sm")]: { width: "90%" },
    [theme.breakpoints.up("md")]: { width: "600px" },
    [theme.breakpoints.up("lg")]: { width: "700px" },
  },
}));



export default function CreateAgent({ open, onClose }) {
  const userinfo = useSelector((state) => state.auth.user);
  const fileRef = useRef(null);
  const [amount, setAmount] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [isTransferSuccess, setIsTransferSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({
    parentAgentId: userinfo.id,
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
    status: false,
  });

  const resetForm = () => {
    setPayload({
      parentAgentId: userinfo.id,
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
      status: false,
    });
  };

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

  const { mutate, isPending: loading } = useMutation({
    mutationFn: (payload) => createDownlineAgent(payload),
    onSuccess: () => {
      toast.success("Transfer successful!");
      setIsTransferSuccess(true);
      resetForm();
    },
    onError: (error) => {
      console.log("create agent error:", error);
      const message =
        error?.response?.data?.error || "Transfer failed. Try again!";
      setIsError(true);
      toast.error(message);
      setErrorMessage(message);
    },
  });

  const statuses = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

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

  const onTransfer = async () => {
    if (!validate()) return;
    mutate(payload);
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
     <CreateAgentSuccessModal
        open={isTransferSuccess}
        onClose={() => {
          setIsTransferSuccess(false);
          onClose();
        }}
        payload={payload}
      />
        <CreateAgentErrorModal
        open={isError}
        onClose={() => setIsError(false)}
        error={errorMessage}
        onRetry={onTransfer}
        payload={payload}
     />
       
      <div className="px-5 py-3">
        <h3 className="my-3">Create Agent</h3>
        <div className="flex justify-center">
          <div className="relative w-[120px] h-[120px] rounded-full border border-red-500 mb-4">
            <img
              src={payload.profile_picture}
              // alt="profile"
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
              onChange={(e) => {
                handlePayloadChange("username", e.target.value);
              }}
              sx={redFocusStyles}
              variant="outlined"
              label="Agent Name"
              error={errors?.username}
              helperText={errors?.username && errors?.username}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <TextField
              onChange={(e) => {
                handlePayloadChange("email", e.target.value);
              }}
              sx={redFocusStyles}
              variant="outlined"
              label="Email"
              error={errors?.email}
              helperText={errors?.email && errors?.email}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <TextField
              onChange={(e) => {
                handlePayloadChange("mobileNumber", e.target.value);
              }}
              sx={redFocusStyles}
              variant="outlined"
              label="Phone Number"
              type="number"
              error={errors?.mobileNumber}
              helperText={errors?.mobileNumber && errors?.mobileNumber}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <TextField
              onChange={(e) => {
                handlePayloadChange("alternativeContact", e.target.value);
              }}
              sx={redFocusStyles}
              variant="outlined"
              label="Alternative Contact"
              error={errors?.alternativeContact}
              helperText={
                errors?.alternativeContact && errors?.alternativeContact
              }
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Autocomplete
              options={countries?.data || []}
              getOptionLabel={(u) => u?.countryName}
              onChange={(e, newValue) =>
                handlePayloadChange("country", newValue?.id)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country"
                  sx={redFocusStyles}
                  error={errors?.country}
                  helperText={errors?.country && errors?.country}
                  required
                />
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Autocomplete
              options={provinces?.data || []}
              getOptionLabel={(u) => u?.provinceName}
              onChange={(e, newValue) =>
                handlePayloadChange("province", newValue?.id)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Province"
                  sx={redFocusStyles}
                  error={errors?.province}
                  helperText={errors?.province && errors?.province}
                  required
                />
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Autocomplete
              options={districts?.data || []}
              getOptionLabel={(u) => u?.districtName}
              onChange={(e, newValue) =>
                handlePayloadChange("district", newValue?.id)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="District"
                  sx={redFocusStyles}
                  error={errors?.district}
                  helperText={errors?.district && errors?.district}
                  required
                />
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <TextField
              onChange={(e) => {
                handlePayloadChange("address", e.target.value);
              }}
              sx={redFocusStyles}
              variant="outlined"
              label="Full Address"
              error={errors?.address}
              helperText={errors?.address && errors?.address}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Autocomplete
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
              onChange={(e, newValue) =>
                handlePayloadChange("status", newValue?.value)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Status"
                  sx={redFocusStyles}
                  error={errors?.status}
                  helperText={errors?.status && errors?.status}
                  required
                />
              )}
            />
          </div>
        </div>

        <div className="w-full flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="py-2 px-6 border border-gray-400 rounded-md"
          >
            Close
          </button>
          <button
            onClick={onTransfer}
            className="text-white bg-[#CD0C02] py-2 px-6 rounded-md"
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}
