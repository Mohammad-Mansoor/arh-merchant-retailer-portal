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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

// Custom styled Dialog with blur
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  "& .MuiPaper-root": {
    border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#d32f2f"}`,
    borderRadius: 12,
    padding: theme.spacing(2),
    backgroundColor:
      theme.palette.mode === "dark"
        ? "#111827"
        : theme.palette.background.paper,
  },
}));

const countries = [{ code: "AF", name: "AFG", dialCode: "+93", flag: "🇦🇫" }];

const logos = {
  automa: "/images/mnos/automa.png",
  etisalat: "/images/mnos/etisalat.jpeg",
  roshan: "/images/mnos/roshan.jpeg",
  salaam: "/images/mnos/salaam.jpeg",
  awcc: "/images/mnos/awcc.jpeg",
};

const prefixMap = {
  automa: ["79"], // example prefix
  etisalat: ["78", "73"],
  roshan: ["72", "77"],
  salaam: ["74"],
  awcc: ["71", "75"],
};

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
  const userInfo = useSelector((state) => state.auth.user);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  // const [phone, setPhone] = useState("");
  const [mnoCode, setMnoCode] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const detectedMno = getMnoCodeFromPhone(phone);
    setMnoCode(detectedMno || null);
  }, [phone]);

  function validatePhone(input) {
    const digitsOnly = input.replace(/\D/g, "");

    if (digitsOnly.length > 9) {
      setError("Phone number cannot exceed 9 digits.");
      return false;
    }

    if (digitsOnly.length > 0 && digitsOnly[0] === "0") {
      setError("First digit cannot be 0.");
      return false;
    }

    if (digitsOnly.length >= 2) {
      const prefix = digitsOnly.slice(0, 2);
      const isValidPrefix = Object.values(prefixMap).some((prefixes) =>
        prefixes.includes(prefix)
      );
      if (!isValidPrefix) {
        setError("Invalid mobile network prefix.");
        return false;
      }
    }

    setError(""); // clear error if all good
    return true;
  }

  function handlePhoneChange(e) {
    const input = e.target.value;

    if (validatePhone(input)) {
      setPhone(input);
    }
  }

  const openConfirmationModel = () => {
    if (validatePhone(phone) === false) {
      return;
    }
    openConfirmModal();
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Activate product</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {product?.productName}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Enter Phone Number
        </Typography>

        <TextField
          fullWidth
          placeholder="780-000-000"
          value={phone}
          onChange={handlePhoneChange}
          error={!!error}
          helperText={error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {mnoCode && (
                    <img
                      src={logos[mnoCode]}
                      alt={`${mnoCode} logo`}
                      style={{ width: 24, height: 24, display: "block" }}
                    />
                  )}
                  <Typography variant="body2" sx={{ minWidth: 50 }}>
                    {selectedCountry.dialCode}
                  </Typography>
                </Box>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img
                    src="/images/logo/logo-icon.svg"
                    alt="Logo"
                    style={{ width: 24, height: 24, display: "block" }}
                  />
                  <TextField
                    select
                    value={selectedCountry.code}
                    onChange={(e) =>
                      setSelectedCountry(
                        countries.find((c) => c.code === e.target.value)
                      )
                    }
                    sx={{ width: 90 }}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                    }}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-start", px: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Close
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#d32f2f", width: 300 }}
          onClick={openConfirmationModel}
        >
          Continue
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
