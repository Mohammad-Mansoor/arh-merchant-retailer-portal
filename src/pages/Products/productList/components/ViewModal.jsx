import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  Typography,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@tanstack/react-query";
import { getSingleProducts } from "../../../../services/product_management_service";

// Custom styled Dialog with blur
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  "& .MuiPaper-root": {
    width: "100%",
    border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#d32f2f"}`,
    borderRadius: 12,
    padding: theme.spacing(2),
    backgroundColor:
      theme.palette.mode === "dark"
        ? "#111827"
        : theme.palette.background.paper,
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

export default function ViewProductModal({ open, onClose, productId }) {
  // const [product, setProduct] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["singleProduct", productId],
    queryFn: () => getSingleProducts(productId),
    enabled: !!productId,
  });

  const product = data;
  if (isLoading) return <div>Loading product...</div>;
  if (isError) return <div>Error loading product.</div>;
  console.log("this is single product: ", product);
  return (
    <StyledDialog open={open} onClose={onClose}>
      {!isLoading && product && (
        <div className="w-full">
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: 0,
            }}
          >
            <Typography variant="h6">View Product</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <div className="w-full grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <TextField
                value={product?.providerDetails?.name}
                sx={redFocusStyles}
                variant="outlined"
                label="Operator"
                InputLabelProps={{ shrink: true }}
                fullWidth
                // disabled
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <TextField
                value={product?.productTypeDetails?.productType?.en || ""}
                sx={redFocusStyles}
                variant="outlined"
                label="Data Type"
                InputLabelProps={{ shrink: true }}
                fullWidth
                // disabled
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <TextField
                value={product?.productName || ""}
                sx={redFocusStyles}
                variant="outlined"
                label="Product Name"
                InputLabelProps={{ shrink: true }}
                fullWidth
                // disabled
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <TextField
                value={`${product?.price} ${"AF"}` || ""}
                sx={redFocusStyles}
                variant="outlined"
                label="Price"
                InputLabelProps={{ shrink: true }}
                fullWidth
                // disabled
              />
            </div>
          </div>

          <DialogActions
            sx={{ justifyContent: "flex-start", px: 3, mt: "10px" }}
          >
            <Button
              onClick={onClose}
              variant="contained"
              sx={{ bgcolor: "#d32f2f", width: "100%" }}
            >
              Close
            </Button>
          </DialogActions>
        </div>
      )}
    </StyledDialog>
  );
}
