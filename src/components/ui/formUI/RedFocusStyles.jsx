const redFocusStyles = {
  width: "100%",
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": { 
      borderColor: "#CD0C02 !important",
    //   boxShadow: "0 0 0 2px rgba(205, 12, 2, 0.2)",
    },
    "&:hover fieldset": { borderColor: "#ff6666" },
  },
  "& .MuiInputLabel-root.Mui-focused": { 
    color: "#CD0C02 !important",
    fontWeight: 600,
  },
  "& .MuiAutocomplete-popupIndicator.Mui-focused": { color: "#CD0C02" },
};


export default redFocusStyles;