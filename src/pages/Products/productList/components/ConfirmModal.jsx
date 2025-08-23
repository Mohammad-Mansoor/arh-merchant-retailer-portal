// ActivateProductModal.tsx
import { useState } from "react";
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
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import FlagIcon from "@mui/icons-material/Flag";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useMutation } from "@tanstack/react-query";
import { activateProduct } from "../../../../services/product_management_service.js";
import SuccessModal from "./SuccessModal.jsx";
import ErrorModal from "./ErrorModal.jsx";
import { toast } from "react-toastify";

// Custom styled Dialog with blur
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(6px)",
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

const countries = [
  { code: "AF", name: "AFG", dialCode: "+93", flag: "🇦🇫" },
 
];

export default function ConfirmProductModal({ open, onClose, product, phone }) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isTransferSuccess, setIsTransferSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const closeSuccessModal = () => {
    setIsTransferSuccess(false);
    onClose();
  };
  const handleSuccessClose = () => {
    setIsTransferSuccess(false);
    onClose(); 
  };
  const { mutate, isPending: loading } = useMutation({
    mutationFn: (payload) => activateProduct(payload),
    onSuccess: () => {
      toast.success("Product Activated Successfuly!");
      setIsTransferSuccess(true);
    },
    onError: (error) => {
      console.log("create agent error:", error);
      const message =
        error?.response?.data?.error || "Failed to activate the product!";
      setIsError(true);
      toast.error(message);
      setErrorMessage(message);
    },
  });

  const productActivation = () => {
    const payload = {
      productId: product?.id,
      customerMobileNumber: phone,
    };
    mutate(payload);
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <SuccessModal
        open={isTransferSuccess}
        onClose={closeSuccessModal}
        onSuccessClose={handleSuccessClose} 
        product={product}
        phone={phone}
      />
      <ErrorModal
        open={isError}
        onClose={() => setIsError(false)}
        title="Failed To Activate Product"
        error={errorMessage}
        onRetry={() => {}}
      >
        <div className="w-full">
          <div className="flex justify-between">
            <h3>Product</h3>
            <h3>{product?.productName}</h3>
          </div>
          <div className="flex justify-between">
            <h3>Reciever</h3>
            <h3>{phone}</h3>
          </div>
          <div className="flex justify-between">
            <h3>Amount</h3>
            <h3>{product?.price}</h3>
          </div>
          <div className="flex justify-between">
            <h3>Date</h3>
            <h3>{new Date().toLocaleDateString()}</h3>
          </div>
        </div>
      </ErrorModal>
      <div className=" w-[450px] p-3">
        
          <Typography sx={{mb: 2, }} variant="h6">Activate product</Typography>

       
      
        <Box className="w-full flex items-center justify-start mb-3">
          <Typography variant="p">
            Are you sure you want to activate this bundle?
          </Typography>
        </Box>
        <div className="w-full p-4 border border-[#C40C0266] rounded-md">
          <div className="flex items-center justify-between space-y-3">
            <h3 className="text-[14px]">Receiver Mobile Number</h3>
            <h3 className="text-[14px]">{phone}</h3>
          </div>
          <div className="flex items-center justify-between space-y-3">
            <h3 className="text-[14px]">Total Data Bundle</h3>
            <h3 className="text-[14px]">{product?.productName}</h3>
          </div>
          <div className="flex items-center justify-between space-y-3">
            <h3 className="text-[14px]">Total Data Bundle Amount</h3>
            <h3 className="text-[14px]">{product?.price} AF</h3>
          </div>
        </div>

        <div className="flex items-center  justify-between mt-4">
          <Button onClick={onClose} variant="outlined" sx={{width: "20%",}} color="inherit">
            Close
          </Button>
          <Button
            disabled={loading}
            onClick={productActivation}
            variant="contained"
            sx={{ bgcolor: "#d32f2f", width: "77%" }}
          >
            {loading ? "Activating..." : "Continue"}
          </Button>
      </div>
      </div>
    </StyledDialog>
  );
}
