import React, { useState } from "react";
import { 
  Dialog, 
  TextField, 
  MenuItem,
  Typography,
  IconButton
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FileUploader } from "react-drag-drop-files";
import CloseIcon from '@mui/icons-material/Close';

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

export default function ReverseStockModal({ 
  open, 
  onClose, 
  onSubmit,
  isLoading,
  retailers
}) {
  const [formData, setFormData] = useState({
    reversedFrom: "",
    amount: "",
    comment: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

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
    
    if (!formData.reversedFrom) {
      newErrors.reversedFrom = "Retailer is required";
    }
    
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const data = new FormData();
    data.append("reversedFrom", formData.reversedFrom);
    data.append("amount", formData.amount);
    data.append("comment", formData.comment || "");
    if (file) data.append("attachment", file);
    
    onSubmit(data);
  };

  const resetForm = () => {
    setFormData({
      reversedFrom: "",
      amount: "",
      comment: "",
    });
    setFile(null);
    setErrors({});
  };

  return (
    <StyledDialog 
      open={open} 
      onClose={onClose}
      onExited={resetForm}
    >
      <div className="px-5 py-3">
        <div className="flex justify-between items-center">
          <Typography variant="h6" className="my-3 text-xl font-semibold">
            New Reverse Stock Request
          </Typography>
          <IconButton onClick={onClose} disabled={isLoading}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="w-full grid grid-cols-1 gap-5 mt-4">
          <div>
            <TextField
              select
              fullWidth
              label="Select Retailer"
              sx={redFocusStyles}
              name="reversedFrom"
              value={formData.reversedFrom}
              onChange={handleChange}
              error={!!errors.reversedFrom}
              helperText={errors.reversedFrom}
              variant="outlined"
            >
              {retailers.map(retailer => (
                <MenuItem key={retailer.
user_id} value={retailer.
user_id}>
                  {retailer?.user?.username} 
                </MenuItem>
              ))}
            </TextField>
          </div>
          
          <div>
            <TextField
              fullWidth
              type="number"
              label="Amount"
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
              sx={{
                width: "100%",
                borderRadius: "20px",
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#CD0C02 !important" },
                  "&:hover fieldset": { borderColor: "#ff6666" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#CD0C02 !important" },
              }}
              label="Comments (Optional)"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              variant="outlined"
            />
          </div>
          
          <div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Attachment (Optional)
              </label>
            </div>
            
            <FileUploader
              multiple={false}
              handleChange={handleFileChange}
              name="attachment"
              types={fileTypes}
              label="Drag & drop file here or click to browse"
              hoverTitle="Drop here"
              dropMessageStyle={{ border: '2px dashed #CD0C02', borderRadius: '8px' }}
            >
              <div className="border-2 border-dashed border-[#CD0C02] rounded-lg p-8 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                {file ? (
                  <div className="text-left">
                    <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                      <div className="flex gap-2">
                        <h4 className="font-medium mb-2">Selected File:</h4>
                        <span className="truncate max-w-xs">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-500">
                      Drag & drop file here or click to browse
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Supported formats: JPG, PNG, JPEG, PDF
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
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="text-white bg-[#CD0C02] w-[70%] py-2 px-6 rounded-md disabled:opacity-50 hover:bg-[#CD0C02]/90 transition"
          >
            {isLoading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}