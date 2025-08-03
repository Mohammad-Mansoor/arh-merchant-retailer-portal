// ActivateProductModal.tsx
import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";

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

export default function SuccessModal({ open, onClose, product, phone }) {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <div className=" w-full text-center">
        <div className="w-full flex items-center justify-center">
          <img src="/images/check.png" alt="" />
        </div>

        <div className="flex items-center justify-center mt-10">
          <h1 className="text-[24px]">Product Activated Successfully</h1>
        </div>
        <div className="flex items-center justify-center flex-col gap-1 py-1 mt-4 w-full rounded-md bg-[#F3F4F6]">
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
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            onClick={() => {
              onClose();
            }}
            className="w-full flex items-center justify-center text-white py-2 px-4 rounded-md mt-3 bg-[#CD0C02]"
          >
            Go Back
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}
