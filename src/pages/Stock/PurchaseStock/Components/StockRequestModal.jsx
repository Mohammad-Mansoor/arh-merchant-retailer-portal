import React, { useState } from "react";
import { Dialog, TextField, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FileUploader } from "react-drag-drop-files";
import PurchaseSuccessModal from "./SuccessModal";
import PurchaseErrorModal from "./ErrorModal";
import { useTranslation } from "react-i18next";


const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(6px)",
  },
  "& .MuiPaper-root": {
    width: "90%", 
    maxWidth: "100%",
    border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#d32f2f"}`,
    borderRadius: 12,
    padding: theme.spacing(2),


    [theme.breakpoints.up("sm")]: {
      width: "90%",
    },
    [theme.breakpoints.up("md")]: {
      width: "500px",
    },
    [theme.breakpoints.up("lg")]: {
      width: "600px",
    },
  },
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
const fileTypes = ["JPG", "PNG", "JPEG", "PDF"];

export default function PurchaseRequestModal({ 
  open, 
  onClose, 
  onSubmit,
  isLoading
}) {
  const [formData, setFormData] = useState({
    payment_method: "",
    amount: "",
    note: "",
  });
  console.log("isLoading:", isLoading);
  const [file, setFile] = useState(null);
  const {t} = useTranslation();
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (newFile) => {
    setFile(newFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.payment_method) {
      newErrors.payment_method = "Payment method is required";
    }
    
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSuccess(false);
  setIsError(false);
  setErrorMessage("");

  if (!validateForm()) {
    return; 
  }

  try {
    await onSubmit(formData, file);
    
    setIsSuccess(true);
    resetForm();
  } catch (error) {
    console.error("Submission error:", error);
    setErrorMessage(error?.response?.data?.message || error.message || "Request failed. Please try again.");
    setIsError(true);
  }
};


const resetForm = () => {
    setFormData({
      payment_method: "",
      amount: "",
      note: "",
    });
    setFile(null);
    setErrors({});
  };

  return (
    <>
    <StyledDialog open={open} onClose={onClose}>
      
      <div className="px-5 py-3">
        <h3 className="my-3 text-xl font-semibold">{t("createP")}</h3>

        <div className="w-full grid grid-cols-1 gap-5 mt-4">
          <div>
            <TextField
              select
              fullWidth
              label={t("paymentM")}
              sx={redFocusStyles}
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              error={!!errors.payment_method}
              helperText={errors.payment_method}
              variant="outlined"
            >
              <MenuItem value="Cash">{t("cash")}</MenuItem>
              <MenuItem value="Bank">{t("bank")}</MenuItem>
              <MenuItem value="Bank">{t("online")}</MenuItem>
              <MenuItem value="Online">{t("lease")}</MenuItem>
            </TextField>
          </div>
          
          <div>
            <TextField
              fullWidth
              type="number"
              label={t("amount")}
              name="amount"
              sx={redFocusStyles}
              value={formData.amount}
              onChange={handleChange}
              error={!!errors.amount}
              helperText={errors.amount}
              variant="outlined"
              inputProps={{ min: 0, step: "0.01" }}
            />
          </div>
          
          <div>
            <TextField
              fullWidth
              multiline
              rows={3}
              sx={{width: "100%",
  borderRadius: "20px",
  "& .MuiOutlinedInput-root": {

    "& .MuiAutocomplete-input": { padding: "0 !important" },
    "&.Mui-focused fieldset": { borderColor: "#CD0C02 !important" },
    "&:hover fieldset": { borderColor: "#ff6666" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#CD0C02 !important" },
  "& .MuiAutocomplete-popupIndicator.Mui-focused": { color: "#CD0C02" },
  }}
              label={t("noteO")}
              name="note"
              value={formData.note}
              onChange={handleChange}
              variant="outlined"
            />
          </div>
          
          <div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                {t("attachment")}
              </label>
            </div>
            
        <FileUploader
  multiple={false}
  handleChange={handleFileChange}
  name="attachment"
  types={fileTypes}
  label={t("drag1")}
  hoverTitle="Drop here"
  dropMessageStyle={{ border: '2px dashed #CD0C02', borderRadius: '8px' }}
>
  <div className="border-2 border-dashed border-[#CD0C02] rounded-lg p-8 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
    {file ? (
      <div className="text-left">
      
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
          <div className="flex gap-2">
  <h4 className="font-medium mb-2">{t("select")}</h4>
          <span className="truncate max-w-xs">{file.name}</span></div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-700"
          >
            {t("remove")}
          </button>
        </div>
      </div>
    ) : (
      <>
        <p className="text-gray-500">
          {t("drag2")}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {t("support1")}
        </p>
      </>
    )}
  </div>
</FileUploader>
          </div>
        </div>

        <div className="w-full flex items-center justify-center mt-7 gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="py-2 px-6 border border-gray-400 rounded-md w-[30%] disabled:opacity-50"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            // disabled={isLoading}
            className="text-white bg-[#CD0C02] w-[70%] py-2 px-6 rounded-md disabled:opacity-50 hover:bg-[#CD0C02]/90 transition"
          >
            {isLoading ? t("submitting...") : t("submit")}
          </button>
        </div>
      </div>
    </StyledDialog>
     <PurchaseSuccessModal
        open={isSuccess}
        onClose={() => {
          setIsSuccess(false);
          onClose();
        }}
        payload={formData}
      />

      <PurchaseErrorModal
        open={isError}
        onClose={() => setIsError(false)}
        title={t("purchaseFailed")}
        error={errorMessage}
        onRetry={handleSubmit}
        payload={formData}
      />
    </>
  );
}