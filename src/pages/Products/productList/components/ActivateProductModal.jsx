import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  Typography,
  InputAdornment,
  TextField,
  IconButton,
  MenuItem,
  Box,
  Avatar,
  FormControl,
  FormHelperText,
  Fade,
  Grow,
  Slide,
  useTheme,
  Autocomplete,
  Chip,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import redFocusStyles from "../../../../components/ui/formUI/RedFocusedStyleV2";


const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  "& .MuiPaper-root": {
    border: `1px solid ${theme.palette.mode === "dark" ? "#555" : "#d32f2f"}`,
    borderRadius: 16,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    width: "500px",
    maxWidth: "90vw",
    boxShadow: theme.shadows[10],
    backgroundImage:
      theme.palette.mode === "dark"
        ? "linear-gradient(rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.9))"
        : "linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95))",
  },
}));



const logos = {
  automa: "/images/mnos/automa.png",
  etisalat: "/images/mnos/etisalat.jpeg",
  roshan: "/images/mnos/roshan.jpeg",
  salaam: "/images/mnos/salaam.png",
  awcc: "/images/mnos/awcc.jpeg",
};

const prefixMap = {
  automa: ["77", "76"],
  etisalat: ["78", "73"],
  roshan: ["72", "79"],
  salaam: ["74"],
  awcc: ["70", "71"],
};

const countries = [
  { code: "AF", name: "Afghanistan", dialCode: "+93", flag: "🇦🇫" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "UK", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
];

function getMnoCodeFromPhone(phone) {
  const cleaned = phone.replace(/\D/g, "");
  const prefix = cleaned.slice(0, 2);
  return Object.keys(prefixMap).find((mno) => prefixMap[mno].includes(prefix));
}

export default function ActivateProductModal({
  open,
  onClose,
  closeConfirmModal,
  openConfirmModal,
  product,
  setPhone,
  phone,
}) {
  const theme = useTheme();
  const userInfo = useSelector((state) => state.auth.user);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [mnoCode, setMnoCode] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [step, setStep] = useState("country");
  const [animateIn, setAnimateIn] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (open) {
      setStep("country");
      setSelectedCountry(countries[0]);
      setPhone("");
      setPhoneError("");
      setAnimateIn(true);
      setSearchText("");
    }
  }, [open]);

  useEffect(() => {
    const detectedMno = getMnoCodeFromPhone(phone);
    setMnoCode(detectedMno || null);
  }, [phone]);
const formatPhone = (input) => {
    const digits = input.replace(/\D/g, '').substring(0, 9);
    
    
    if (digits.length > 0 && digits[0] !== '7') {
      return '';
    }

    let formatted = digits;
    if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}`;
    }
    if (digits.length > 6) {
      formatted += `-${digits.slice(6, 9)}`;
    }
    return formatted;
  };
  function validatePhone(input) {
    const digitsOnly = input.replace(/\D/g, "");

    if (!digitsOnly) {
      setPhoneError("Phone number is required");
      return false;
    }

    if (digitsOnly.length > 9) {
      setPhoneError("Phone number cannot exceed 9 digits");
      return false;
    }

    if (digitsOnly.length > 0 && digitsOnly[0] === "0") {
      setPhoneError("First digit cannot be 0");
      return false;
    }

    if (digitsOnly.length >= 2) {
      const prefix = digitsOnly.slice(0, 2);
      const isValidPrefix = Object.values(prefixMap).some((prefixes) =>
        prefixes.includes(prefix)
      );
      if (!isValidPrefix) {
        setPhoneError("Invalid mobile network prefix");
        return false;
      }
    }

    setPhoneError("");
    return true;
  }

  function handlePhoneChange(e) {
    const input = e.target.value;
    setPhone(input);
    validatePhone(input);
  }

  const openConfirmationModel = () => {
    if (!validatePhone(phone)) {
      return;
    }
    openConfirmModal();
  };

  const handleCountryChange = (event, newValue) => {
    if (newValue) {
      setAnimateIn(false);
      setTimeout(() => {
        setSelectedCountry(newValue);
        setAnimateIn(true);
      }, 150);
    }
  };

  const handleStepChange = (newStep) => {
    setAnimateIn(false);
    setTimeout(() => {
      setStep(newStep);
      setAnimateIn(true);
    }, 150);
  };

  const getMnoLogo = () => {
    if (!mnoCode) return null;
    return (
      <div className="w-[20px]  h-[20px]">
      <img
        src={logos[mnoCode]}
        alt={`${mnoCode} logo`}
        className="w-full h-full  object-cover"
      />
      </div>
    );
  };
  function handlePhoneChange(e) {
    const input = e.target.value;
    const formatted = formatPhone(input);
    setPhone(formatted);
    validatePhone(formatted);
  }

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      TransitionComponent={Slide}
      transitionDuration={300}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
          position: "relative",
        }}
      >
    
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: "#1D2939", fontSize: "20px" }}
        >
          Activate product
        </Typography>
     
      </DialogTitle>

   

      <DialogContent sx={{ py: 1 }}>
        {step === "country" ? (
          <Fade in={animateIn} timeout={300}>
            <Box>
              <Typography
                variant="h6"
                fontWeight="medium"
                sx={{ color: "#1D2939", fontSize: "18px", mb: 1 }}
              >
                {product?.productName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: "#344054", fontSize: "14px" }}
              >
                Select your country to begin activation
              </Typography>

              <Autocomplete
                options={countries}
                getOptionLabel={(option) => option.name}
                value={selectedCountry}
                onChange={handleCountryChange}
                onInputChange={(event, newInputValue) => {
                  setSearchText(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    variant="outlined"
                    sx={redFocusStyles}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                             
                            }}
                          >
                        
                          </Box>
                          {params.InputProps.startAdornment}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <MenuItem
                    {...props}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      py: 1.5,
                   
                        
                      borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                    }}
                  >
                  
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 400 }}>
                        {option.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={option.dialCode}
                      size="small"
                      
                    />
                  </MenuItem>
                )}
                sx={{ mb: 3 }}
              />

           
            </Box>
          </Fade>
        ) : (
          <Grow in={animateIn} timeout={300}>
            <Box>
              <Typography
                variant="h6"
                fontWeight="400"
                sx={{
                  mb: 1,
                  color: "#1D2939",
                }}
              >
                {product?.productName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  fontSize: "14px",
                  color: "#344054",
                }}
              >
                Enter your phone number to activate
              </Typography>

          

              <FormControl fullWidth>
             

                <TextField
        fullWidth
        placeholder="780-000-000"
        value={phone}
        onChange={handlePhoneChange}
        error={!!phoneError}
        helperText={phoneError}
        sx={redFocusStyles}
        autoFocus
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {getMnoLogo()}
                <Typography variant="body1" fontWeight="400" sx={{ color: "#1d1d1d", }}>
                  <span>(</span>
                  {selectedCountry.dialCode}<span>)</span>
                </Typography>
              </Box>
            </InputAdornment>
          ),
        }}
      />
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    display: "block",
                    color:
                      theme.palette.mode === "dark" ? "#94a3b8" : "#757575",
                  }}
                >
                  Enter your 9-digit phone number without the country code
                </Typography>
              </FormControl>
            </Box>
          </Grow>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: step === "country" ? "space-between" : "space-between",
          px: 3,
          pt: 0,
        
        }}
      >
        {step === "country" && (
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            sx={{
              color: "#344054",
              fontWeight: "normal",
              borderRadius: "8px",
              fontSize: "14px",
              width: "20%",
              borderColor:
                theme.palette.mode === "dark" ? "#475569" : "#e0e0e0",
              "&:hover": {
                borderColor:
                  theme.palette.mode === "dark" ? "#64748b" : "#bdbdbd",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
              },
            }}
          >
            Close
          </Button>
        )}

        {step === "phone" && (
          <Button
            onClick={() => handleStepChange("country")}
            variant="outlined"
            color="inherit"
            sx={{
              color: "#344054",
              fontWeight: "normal",
              borderRadius: "8px",
              fontSize: "14px",
              width: "20%",
              borderColor:
                theme.palette.mode === "dark" ? "#475569" : "#e0e0e0",
              "&:hover": {
                borderColor:
                  theme.palette.mode === "dark" ? "#64748b" : "#bdbdbd",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
              },
            }}
          >
            Back
          </Button>
        )}

        <Button
          variant="contained"
          sx={{
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(45deg, #ef5350, #d32f2f)"
                : "linear-gradient(45deg, #d32f2f, #b71c1c)",
            color: "#fff",
            width: "80%",
            fontWeight: "normal",
            borderRadius: "8px",
            fontSize: "14px",
            "&:hover": {
              boxShadow: theme.shadows[4],
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(45deg, #f44336, #c62828)"
                  : "linear-gradient(45deg, #c62828, #9e1c1c)",
            },
            "&:disabled": {
              background:
                theme.palette.mode === "dark"
                  ? "rgba(239, 83, 80, 0.5)"
                  : "rgba(211, 47, 47, 0.5)",
            },
          }}
          onClick={
            step === "country"
              ? () => handleStepChange("phone")
              : openConfirmationModel
          }
          disabled={step === "phone" && (!phone || !!phoneError)}
        >
          {step === "country" ? "Continue" : "Activate Now"}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}