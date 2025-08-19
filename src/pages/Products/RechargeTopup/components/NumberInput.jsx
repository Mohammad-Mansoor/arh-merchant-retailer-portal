import React, { useEffect, useState } from "react";
import {
  InputAdornment,
  TextField,
  MenuItem,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const operators = [
  {
    name: "Etisalat",
    prefix: ["78", "73"],
    logo: "/images/mnos/etisalat.jpeg",
  },
  {
    name: "AWCC",
    prefix: ["700", "71"],
    logo: "/images/mnos/awcc.jpeg",
  },
  {
    name: "roshan",
    prefix: ["79", "72"],
    logo: "/images/mnos/roshan.jpeg",
  },
  {
    name: "automa",
    prefix: ["77", "76"],
    logo: "/images/mnos/automa.png",
  },
  {
    name: "salaam",
    prefix: ["74"],
    logo: "/images/mnos/salaam.png",
  },
];

const prefixMap = {
  automa: ["77", "76"], 
  etisalat: ["78", "73"],
  roshan: ["72", "79"],
  salaam: ["74"],
  awcc: ["70", "71"],
};

const countries = [
  { code: "AFG", flag: "https://flagcdn.com/w40/af.png" },
  { code: "PAK", flag: "https://flagcdn.com/w40/pk.png" },
];

const RedTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    height: "46px",
    "& fieldset": {
      borderColor: "#D0D5DD",
    },
    "&:hover fieldset": {
      borderColor: "red",
    },
    "&.Mui-focused fieldset": {
      borderColor: "red",
    },
  },
});

const PhoneInput = ({ getInputValue }) => {
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(countries[0]);
  const [operator, setOperator] = useState(null);
  const [error, setError] = useState("");

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);

    // Match operator by prefix
    const matched = operators.find((op) =>
      op.prefix.some((prefix) =>
        value.replace(/[^0-9]/g, "").startsWith(prefix)
      )
    );
    setOperator(matched || null);
    console.log(matched);
  };
  function validatePhone(input) {
    const digitsOnly = input.replace(/\D/g, "");

    if (digitsOnly.length > 9) {
      setError("Phone number cannot exceed 9 digits.");
      return false;
    }
    if (digitsOnly.length > 0 && digitsOnly[0] !== '7') {
      return '';
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

  useEffect(() => {
    getInputValue(phone);
  }, [phone]);

  return (
    <Box sx={{ maxWidth: 500, width: "100%" }}>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 400, color: "#374151", mb: 1 }}
      >
        Enter Phone Number
      </Typography>

      <RedTextField
        fullWidth
        placeholder="(+93) 780-000-000"
        value={phone}
        onChange={(e) => {
          const validate = validatePhone(e.target.value);
          console.log(validate);
          if (validate) {
            handlePhoneChange(e);
          }
        }}
        error={Boolean(error)} // shows red border if there's an error
        helperText={error}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {operator && (
                <Avatar src={operator.logo} sx={{ width: 24, height: 24 }} />
              )}

              <h6 className="mx-1">+93</h6>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar src={country.flag} sx={{ width: 24, height: 24 }} />
                <TextField
                  select
                  value={country.code}
                  onChange={(e) => {
                    const selected = countries.find(
                      (c) => c.code === e.target.value
                    );

                    setCountry(selected);
                  }}
                  variant="standard"
                  sx={{ width: 60, "& .MuiInputBase-input": { fontSize: 12 } }}
                >
                  {countries.map((c) => (
                    <MenuItem
                      key={c.code}
                      value={c.code}
                      style={{ border: "none", outline: "none" }}
                    >
                      {c.code}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default PhoneInput;
